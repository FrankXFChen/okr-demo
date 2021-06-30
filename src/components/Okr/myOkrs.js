import React, { useState, useReducer, useEffect, Fragment } from 'react';
import { PlusCircleOutlined} from '@ant-design/icons';
import { Empty, Spin } from 'antd'
import * as style from './index.module.scss';
import OkrItem from './okrItem';

//kr status, 1 normal, 2 in Risk, 3 delay
const mockOkr = [{
  id:'000001',
  name:'第一个OKR的O',
  createdTime:'2021-05-21',
  ownerId: 'user1',
  krs:[
    {id:'kr_1', content:'写第一个KR',  weight:30, progress:60, status:2},
    {id:'kr_2', content:'写第二个KR',  weight:30, progress:50, status:1},
    {id:'kr_3', content:'写第三个KR',  weight:40, progress:20, status:1}
  ],
  alignings:[{name:'张三', userId:'user001',oName:'张三第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试', oId:'0000011', progress:20, status:2}]
}]
const mockOkr2 = {
  'user004': [{
    id: '0000041',
    name: '李飞第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
    createdTime: '2021-05-21',
    ownerId: 'user004',
    krs:[
      {id:'kr_11', content:'写第一个KR',  weight:50, progress:20, status:1},
      {id:'kr_12', content:'写第二个KR',  weight:50, progress:20, status:1},
    ],
    alignings:[]
  }],
  'user001': [{
    id: '0000011',
    name: '张三第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
    createdTime: '2021-05-21',
    ownerId: 'user001',
    krs:[
      {id:'kr_11', content:'写第一个KR',  weight:50, progress:60, status:2},
      {id:'kr_12', content:'写第二个KR',  weight:20, progress:50, status:1},
      {id:'kr_13', content:'写第三个KR',  weight:30, progress:20, status:1}
    ],
    alignings:[{name:'李飞', userId:'user004',oName:'李飞第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试', oId:'0000041', progress:20, status:1}]
  }, {
    id: '0000012',
    name: '张三第二个OKR',
    createdTime: '2021-05-22',
    ownerId: 'user001',
    krs:[
      {id:'kr_21', content:'写第一个KR',  weight:50, progress:60, status:1},
      {id:'kr_22', content:'写第二个KR',  weight:50, progress:50, status:1},
    ],
    alignings:[]
  }, {
    id: '0000013',
    name: '张三第三个OKR',
    createdTime: '2021-05-24',
    ownerId: 'user001',
    krs:[
      {id:'kr_31', content:'写第一个KR',  weight:30, progress:60, status:1},
      {id:'kr_32', content:'写第二个KR',  weight:30, progress:50, status:1},
      {id:'kr_33', content:'写第三个KR',  weight:40, progress:20, status:1}
    ],
    alignings:[]
  }],
  'user002': [{
    id: '0000021',
    name: '李四第一个OKR',
    createdTime: '2021-05-21',
    ownerId: 'user002',
    krs:[
      {id:'kr_11', content:'写第一个KR',  weight:30, progress:80, status:2},
      {id:'kr_12', content:'写第二个KR',  weight:30, progress:50, status:1},
      {id:'kr_13', content:'写第三个KR',  weight:40, progress:20, status:1}
    ],
    alignings:[]
  }],
  'user003': [{
    id: '0000031',
    name: '张无忌第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
    createdTime: '2021-05-21',
    ownerId: 'user003',
    krs:[
      {id:'kr_11', content:'写第一个KR',  weight:20, progress:100, status:1},
      {id:'kr_12', content:'写第二个KR',  weight:30, progress:50, status:1},
      {id:'kr_13', content:'写第三个KR',  weight:50, progress:20, status:1}
    ],
    alignings:[]
  }]
}
const orkTemp = {
  id:'',
  name:'',
  krs:[],
  alignings:[],
  inEdit: true
}
const reducer = (state, action)=>{
  switch (action.type){
    case 'init':{
      let temp = action.payload.map(obj=>{return {...obj, inEdit:false}})
      return [...temp];
    }
    case 'add':{
      let temp = {...orkTemp, id:`o_${new Date().getTime()}`, newOne:true}
      return [...state, temp]
    }
    case 'remove':{
      let index = action.payload.index;
      state.splice(index, 1);
      return [...state]
    }
    case 'quit':{
      let index = action.payload.index;
      let temp = [...state];
      temp[index].inEdit = false;
      return [...temp]
    }
    case 'publish':{
      let {index, name, krs }= action.payload;
      let temp = [...state];
      temp[index].inEdit = false;
      temp[index].newOne = false;
      temp[index].name = name;
      temp[index].krs = krs;
      return temp;
    }
    case 'goEdit':{
      let index = action.payload.index;
      let temp = [...state];
      temp[index].inEdit = true;
      return temp;
    }
    case 'logProgress':{
      let {indexKr, status, progress } = action.payload.krPayload;
      let index = action.payload.index;
      let temp = [...state];
      let krs = [...temp[index].krs]
      krs[indexKr].status= status;
      krs[indexKr].progress = progress;
      temp[index].krs= krs;
      return temp;
    }
    case 'addAlign' :{
      let temp = [...state];
      let {index, content} = action.payload;
      temp[index].alignings.unshift(content);
      return temp;
    }
    case 'removeAlign':{
      let temp = [...state];
      let {index, oId} = action.payload;
      let aIndex = temp[index].alignings.findIndex(obj=>obj.oId==oId);
      temp[index].alignings.splice(aIndex,1);
      return temp;
    }
    default: return state;
  }
}

export default React.memo(({ownerId, isOwner, isUnder})=>{
  const [myOkrs, dispatch] = useReducer(reducer, []);
  const [inEdit, setInEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    console.log('myOkrs   ', myOkrs)
  },[myOkrs])

  useEffect(()=>{
    if(!!ownerId){
      setLoading(true);
      setTimeout(()=>{
        setLoading(false);
        if(ownerId=='user1'){
          dispatch({type:'init', payload:mockOkr})
        }else{
          dispatch({type:'init', payload:mockOkr2[ownerId]||[]})
        }
      },700)
    }
  },[ownerId])

  return(
    <div className={style.myOkrs}>
      {loading?
        <div style={{width:'fit-content', position:'relative', margin:'auto', top:'15vh'}}>
          <Spin size='large'/>
        </div>:
        <Fragment>
          {myOkrs.length > 0 ?
            myOkrs.map((obj, index) => {
              return <OkrItem dispatch={dispatch} quitEdit={() => setInEdit(false)} goEdit={() => setInEdit(true)}
                index={index} data={obj} inEdit={obj.inEdit} inEditHigh={inEdit} isOwner={isOwner} isUnder={isUnder}/>
            }) :
            <Empty style={{ marginTop: '10vh' }} image={Empty.PRESENTED_IMAGE_DEFAULT} description='暂无OKR' />
          }
          {
            isOwner &&
            <Fragment>
              {
                !inEdit ?
                  <div className={style.addO} onClick={() => { dispatch({ type: 'add' }); setInEdit(true) }}>
                    <span ><PlusCircleOutlined /></span>
                    <span className={style.addO_text}>添加Objective</span>
                  </div> :
                  <div className={style.addODis}>
                    <span ><PlusCircleOutlined /></span>
                    <span className={style.addODis_text}>添加Objective</span>
                  </div>
              }
            </Fragment>
          }
        </Fragment>
      }
    </div>
  )
})