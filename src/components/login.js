import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LoginForm = ({ history }) => {
  const [loading, setLoading] = useState(false);
  console.log(history)

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3001/login', values);

      console.log('Server response:', response.data);

      // Check the response and handle authentication
      if (response.status === 200) {
        message.success('Login successful');
        // Save user information to local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', values.type);

        history.push('/');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="loginForm"
      onFinish={onFinish}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
          {
            type: 'email',
            message: 'Please enter a valid email address!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[
          {
            required: true,
            message: 'Please select user type!',
          },
        ]}
      >
        <Select>
          <Option value="Admin">Admin</Option>
          <Option value="User">User</Option>
        </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
