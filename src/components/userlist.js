import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message,Card,Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3001/users', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.delete(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 200) {
        message.success('User deleted successfully');
        // Refresh the user list after deletion
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          disabled={record.type !== 'User'} // Disable delete for non-admin users
        >
          <Button style={{color:'red',borderRadius:'1px solid'}}  type="danger" disabled={record.type !== 'User'}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
    <Space style={{ marginBottom: '1rem' }}>
        <Button onClick={handleLogout}>Logout</Button>
      </Space>
      <h2>User List</h2>
      {Array.isArray(users) && users.length > 0 ? (
        <Table columns={columns} dataSource={users} loading={loading} rowKey="_id" />
      ) : (
        users && (
          <Card title="User Details">
            <p><strong>First Name:</strong> {users.firstName}</p>
            <p><strong>Last Name:</strong> {users.lastName}</p>
            <p><strong>Email:</strong> {users.email}</p>
            <p><strong>Type:</strong> {users.type}</p>
          </Card>
        )
      )}
    </div>
  );
};

export default UserListPage;
