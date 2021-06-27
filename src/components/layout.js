import React from 'react';
import { Layout, Menu} from 'antd';
import { navigate } from 'gatsby';

const { Header } = Layout;

export default React.memo(({children, tabId})=>{
  const tabClick = (tabId)=>{
    navigate(`/${tabId}`)
  }

  return(
    <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[tabId]}>
        <Menu.Item key="okr" onClick={({key})=>tabClick(key)}>OKR</Menu.Item>
        <Menu.Item key="alignView" onClick={({key})=>tabClick(key)}>对齐视图</Menu.Item>
        <Menu.Item key="board" onClick={({key})=>tabClick(key)}>数据看板</Menu.Item>
      </Menu>
    </Header>
    {children}
    </Layout>
  )
})