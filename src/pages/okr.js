import React, { useState } from 'react';
import 'antd/dist/antd.css';
import MyLayout from '../components/layout';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined} from '@ant-design/icons';
import * as style from './index.module.scss';
import MyOkrs from '../components/Okr/myOkrs';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default React.memo(({})=>{
  // const [allOkrs, setAllOkrs] = useState([])
  return(
    <MyLayout tabId='okr'>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['myOkr']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="myOkr" icon={<UserOutlined />} title="我的OKR">
              <Menu.Item key="1">陈旭峰</Menu.Item>
            </SubMenu>
            <SubMenu key="sameLevel" icon={<TeamOutlined />} title="我的同级">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content>
          <MyOkrs />
        </Content>
      </Layout>
    </MyLayout>
  )
})