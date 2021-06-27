import React, { Fragment, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import MyLayout from '../components/layout';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, UsergroupDeleteOutlined, UserAddOutlined} from '@ant-design/icons';
import * as style from './index.module.scss';
import MyOkrs from '../components/Okr/myOkrs';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const workmateMock = {
  leader:[{name:'李飞',userId:'user004'}],
  sameLevel:[{name:'张三',userId:'user001'},{name:'李四',userId:'user002'},{name:'王大牛', userId:'user006'}],
  underLevel:[{name:'张无忌',userId:'user003'},{name:'周小帅',userId:'user0012'}]
}


export default React.memo(({})=>{
  // const [allOkrs, setAllOkrs] = useState([])
  const [workMateData, setworkMateData] = useState({leader:[],sameLevel:[],underLevel:[]});
  const [currentUser, setCurrentUser] = useState(null);
  const [selectUserId, setSelectedUserId] = useState(null);

  useEffect(()=>{
    let temp = JSON.parse(window.localStorage.getItem('userInfo'));
    setCurrentUser(temp);
    setworkMateData(workmateMock);
  },[])

  useEffect(()=>{
    if(!!currentUser){
      setSelectedUserId(currentUser.userId)
    }
  },[currentUser])

  return(
    <MyLayout tabId='okr'>
      <Layout>
        {!!currentUser && <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentUser.userId]}
            defaultOpenKeys={['myOkr']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="myOkr" icon={<UserOutlined />} title="我的OKR">
              <Menu.Item key={currentUser.userId} onClick={({key})=>setSelectedUserId(key)}>{currentUser.name}</Menu.Item>
            </SubMenu>
            {workMateData.leader.length>0 &&
            <SubMenu key="leaders" icon={<UserAddOutlined />} title="我的直属上级">
              {workMateData.leader.map(obj=>{
                return(
                  <Fragment key={obj.userId}> 
                    <Menu.Item key={obj.userId} onClick={({key})=>setSelectedUserId(key)}>{obj.name}</Menu.Item>
                  </Fragment>
                )
              })}
            </SubMenu>}
            {workMateData.sameLevel.length>0 &&
            <SubMenu key="sameLevel" icon={<TeamOutlined />} title="我的同级">
              {workMateData.sameLevel.map(obj=>{
                return(
                  <Fragment key={obj.userId}> 
                    <Menu.Item key={obj.userId} onClick={({key})=>setSelectedUserId(key)}>{obj.name}</Menu.Item>
                  </Fragment>
                )
              })}
            </SubMenu>}
            {workMateData.underLevel.length>0 &&
            <SubMenu key="underLevel" icon={<UsergroupDeleteOutlined />} title="我的直属下级">
              {workMateData.underLevel.map(obj=>{
                return(
                  <Fragment key={obj.userId}> 
                    <Menu.Item key={obj.userId} onClick={({key})=>setSelectedUserId(key)}>{obj.name}</Menu.Item>
                  </Fragment>
                )
              })}
            </SubMenu>}
          </Menu>
        </Sider>}
        <Content>
          {selectUserId && <MyOkrs ownerId={selectUserId} isOwner={selectUserId===currentUser.userId}/>}
        </Content>
      </Layout>
    </MyLayout>
  )
})