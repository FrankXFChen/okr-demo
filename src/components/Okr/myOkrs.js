import React, { useState, useReducer, useEffect } from 'react';
import { PlusCircleOutlined} from '@ant-design/icons';
import * as style from './index.module.scss';
import OkrItem from './okrItem';

const mockOkr = [{
  id:'000001',
  name:'第一个OKR的O',
  createdTime:'2021-05-21',
  krs:[
    {id:'kr_1', content:'写第一个KR',  weight:60, progress:100},
    {id:'kr_2', content:'写第二个KR',  weight:40, progress:10}
  ]
}]
const orkTemp = {
  id:'',
  name:'',
  krs:[],
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