import React, { useState, useReducer } from 'react';
import { Row, Col, Input, Button } from 'antd';
import * as style from './index.module.scss';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import DragableKRs from './dragableKRs';

const reducer = (state, action)=>{
  switch(action.type){
    case 'reorder':{
      return action.payload
    }
    case 'add':{
      let weightArranged = state.reduce((sum, obj)=>sum+obj.weight,0);
      let weightRemain = 100-weightArranged;
      let temp = state.map(obj=>{return {...obj, maxWeight:obj.maxWeight-weightRemain}})
      return [...temp, {id:new Date().getTime().toString(), content:'',  weight:weightRemain, maxWeight:weightRemain, progress:0}]
    }
    case 'remove':{
      let index = action.payload.index;
      let weightBack = state[index].weight;
      state.splice(index, 1);
      let temp = state.map(obj=>{return{
        ...obj, maxWeight: obj.maxWeight+weightBack
      }})
      return temp;
    }
    case 'editContent':{
      let temp = [...state];
      let {index,content} = action.payload;
      temp[index].content = content;
      return temp;
    }
    case 'editWeight':{
      let newWeight = action.payload.weight;
      let index = action.payload.index;
      let oldWeight = state[index].weight;
      let gap = oldWeight-newWeight;
      let temp = state.map((obj,i)=>{
        if(i==index){
          return {...obj, weight:newWeight}
        }else{
          return {...obj, maxWeight:obj.maxWeight+gap}
        }
      })
      return temp
    }
  }
}
export default React.memo(({index, data, dispatch, quitEdit, goEdit, inEdit, inEditHigh})=>{
  const [oname, setOname] = useState(data.name);
  const [krs, dispatchKr] = useReducer(reducer, data.krs);

  return(
    <div className={!!inEdit?style.okrItem_containerEdit:style.okrItem_container}>
      <div className={style.okrItem_st1}>权重</div>
      {!inEdit && <div className={style.okrItem_st2}>进度</div>}
      <Row style={{position:'relative'}}>
        <Col span={1} className={style.okrItem_oIndex}>{`O${index+1}`}</Col>
        <Col span={23} className={style.okrItem_oNameContainer}>
          <Input style={{color:'black'}} disabled={!inEdit} className={style.okrItem_oNameContainer_input} bordered={false} 
          placeholder="请输入"  value={oname} onChange={e=>setOname(e.target.value)}/>
        </Col>
        {/* <div className={style.okrItem_remove} onClick={()=>{dispatch({type:'remove', payload:{index}});quitEdit()}}>
          <CloseOutlined className={style.okrItem_remove_icon}/>
        </div> */}
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={23}>
          <DragableKRs inEdit={inEdit} data={krs} dispatchKr={(obj)=>dispatchKr(obj)}/>
        </Col>
      </Row>
      {!!inEdit && <Row className={style.okrItem_addKrCtn}> 
        <Col span={1}></Col>
        <Col className={style.okrItem_addKr}>
          <div onClick={()=>dispatchKr({type:'add'})}>
            <span className={style.okrItem_addKr_btn}><PlusOutlined /></span>
            <span className={style.okrItem_addKr_btn}>添加 Key Result</span>
          </div>
        </Col>
      </Row>}
      {!!inEdit?<Row className={style.okrItem_opsCtn}>
        <Col span={2}>
          <Button type="primary" onClick={()=>{
            dispatch({type:'publish',payload:{index:index,name:oname, krs:krs}});
            quitEdit()}
            }>{!!data.newOne?'发布':'确定'}</Button>
        </Col>
        <Col span={2}>
          {!!data.newOne? <Button onClick={()=>{
            dispatch({type:'remove', payload:{index}});
            quitEdit();
          }}>
            取消
          </Button> :
          <Button onClick={()=>{
            dispatch({type:'quit', payload:{index}});
            quitEdit();
          }}>
            退出
          </Button>
          }
        </Col>
        <Col span={24}></Col>
      </Row>:
      <Row className={style.okrItem_opsCtn}>
        <Col span={2}>
          <Button disabled={inEditHigh} type="primary" onClick={()=>{dispatch({type:'goEdit',payload:{index}});goEdit()}}>编辑</Button>
        </Col>
      </Row>
      }
    </div>
  )
})