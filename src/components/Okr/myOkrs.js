import React, { useState, useReducer, useEffect } from 'react';
import { PlusCircleOutlined} from '@ant-design/icons';
import * as style from './index.module.scss';
import OkrItem from './okrItem';


//kr status, 1 normal, 2 in Risk, 3 delay
const mockOkr = [{
  id:'000001',
  name:'第一个OKR的O',
  createdTime:'2021-05-21',
  krs:[
    {id:'kr_1', content:'写第一个KR',  weight:30, progress:60, status:2},
    {id:'kr_2', content:'写第二个KR',  weight:30, progress:50, status:1},
    {id:'kr_3', content:'写第三个KR',  weight:40, progress:20, status:1}
  ],
  alignings:[{name:'王小二', userId:'user007',oName:'王小二的第一个O', oId:'0000071', progress:60, status:1},
  {name:'张三', userId:'user001',oName:'张三第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试', oId:'0000011', progress:20, status:2}]
}]
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
    default: return state;
  }
}

export default React.memo(()=>{
  const [myOkrs, dispatch] = useReducer(reducer, []);
  const [inEdit, setInEdit] = useState(false);

  useEffect(()=>{
    dispatch({type:'init', payload:mockOkr})
  },[])
  useEffect(()=>{
    console.log('myOkrs   ', myOkrs)
  },[myOkrs])

  return(
    <div className={style.myOkrs}>
      {myOkrs.length>0 &&
        myOkrs.map((obj, index)=>{
          return <OkrItem dispatch={dispatch} quitEdit={()=>setInEdit(false)} goEdit={()=>setInEdit(true)}
          index={index} data={obj} inEdit={obj.inEdit} inEditHigh={inEdit}/>
        })
      }
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
    </div>
  )
})