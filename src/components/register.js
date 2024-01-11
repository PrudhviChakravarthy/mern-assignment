import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Select,message } from 'antd';

const { Option } = Select;

const RegistrationForm = () => {
    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values) => {
      try {
        setLoading(true);
  
        const response = await axios.post('http://localhost:3001/register', values);
  
        console.log('Server response:', response.data);
  
        // Check the response and show appropriate feedback using Ant Design message
        if (response.status === 200) {
          message.success(response.data.message);
          // You can also redirect to another page or perform other actions on success
        } else {
          message.error(response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        message.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <Form
      name="registrationForm"
      onFinish={onFinish}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

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
        label="Phone No"
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
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
        label="Confirm Password"
        name="confirmPassword"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
