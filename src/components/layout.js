import React from 'react';
import { Layout, Menu} from 'antd';

const { Header } = Layout;

export default React.memo(({children, tabId})=>{
  return(
    <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[tabId]}>
        <Menu.Item key="okr">OKR</Menu.Item>
        <Menu.Item key="view">对齐视图</Menu.Item>
        <Menu.Item key="board">数据看板</Menu.Item>
      </Menu>
    </Header>
    {children}
    </Layout>
  )
})