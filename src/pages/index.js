import React, {useEffect, useState} from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { navigate } from "gatsby";
import Auth from '../utils/auth';

const IndexPage = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
    window.localStorage.setItem('userInfo',JSON.stringify({name:'陈旭峰', userId:'user1'}))
    navigate('/okr')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  
  // useEffect(()=>{
  //   Auth()
  //     .then(data => console.log(data))
  //     .catch(e => console.log(e));
  // },[])

  return <div>page xxxx</div>

  // return (
  //   <div style={{position:'relative',width:'100%',height:'100vh'}}>
  //   <Form style={{position:'absolute',width:'40%',height:'50%',margin:'auto',left:0,right:0,top:'20%'}}
  //     name="basic"
  //     labelCol={{
  //       span: 8,
  //     }}
  //     wrapperCol={{
  //       span: 16,
  //     }}
  //     initialValues={{
  //       remember: true,
  //     }}
  //     onFinish={onFinish}
  //     onFinishFailed={onFinishFailed}
  //   >
  //     <Form.Item
  //       label="用户名"
  //       name="username"
  //       rules={[
  //         {
  //           required: true,
  //           message: '请输入用户名',
  //         },
  //       ]}
  //     >
  //       <Input />
  //     </Form.Item>

  //     <Form.Item
  //       label="Password"
  //       name="password"
  //       rules={[
  //         {
  //           required: true,
  //           message: '请输入密码',
  //         },
  //       ]}
  //     >
  //       <Input.Password />
  //     </Form.Item>

  //     {/* <Form.Item
  //       name="remember"
  //       valuePropName="checked"
  //       wrapperCol={{
  //         offset: 8,
  //         span: 16,
  //       }}
  //     >
  //       <Checkbox>Remember me</Checkbox>
  //     </Form.Item> */}

  //     <Form.Item
  //       wrapperCol={{
  //         offset: 8,
  //         span: 16,
  //       }}
  //     >
  //       <Button type="primary" htmlType="submit">
  //         登录
  //       </Button>
  //     </Form.Item>
  //   </Form>
  //   </div>
  //   )
}

export default IndexPage
