import React, { useState, useReducer, useEffect } from 'react';
import { Row, Col, Input, Button, Progress } from 'antd';
import * as style from './index.module.scss';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import DragableKRs from './dragableKRs';
import { Fragment } from 'react';

const testDuiqi = [
  {
    name: '张三',
    dept: '研发部',
    userId: 'user001',
    okrs: [{
      id: '0000011',
      name: '张三第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
      createdTime: '2021-05-21',
    },{
      id: '0000012',
      name: '张三第二个OKR',
      createdTime: '2021-05-22',
    },{
      id: '0000013',
      name: '张三第三个OKR',
      createdTime: '2021-05-24',
    }]
  },
  {
    name: '李四',
    dept: '研发部',
    userId: 'user002',
    okrs: [{
      id: '0000021',
      name: '李四第一个OKR',
      createdTime: '2021-05-21',
    },{
      id: '0000022',
      name: '李四第二个OKR',
      createdTime: '2021-05-22',
    },{
      id: '0000023',
      name: '李四第三个OKR',
      createdTime: '2021-05-24',
    }]
  }
]

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
    // case 'logProgress':{
    //   let { status, progress, index} = action.payload;
    //   let temp = [...state];
    //   temp[index].status = status;
    //   temp[index].progress = progress;
    //   return temp;
    // }
  }
}

export default React.memo(({index, data, dispatch, quitEdit, goEdit, inEdit, inEditHigh})=>{
  const [oname, setOname] = useState(data.name);
  const [krs, dispatchKr] = useReducer(reducer, data.krs);
  const [overallStatus, setOverallStatus] = useState({status:1, progress:0});
  const [showMateOkrModal, setShowMateOkrModal] = useState(false)
  
  useEffect(()=>{
    if(!!data.krs && data.krs.length>0){
      let status=1;
      let progress=0
      for(let obj of data.krs){
        if(obj.status>status){
          status = obj.status
        }
        progress = progress + (obj.weight/100)*obj.progress;
      }
      setOverallStatus({status:status, progress: Number(progress.toFixed(1))})
    }
  },[data.krs])

  return(
    <div className={!!inEdit?style.okrItem_containerEdit:style.okrItem_container}>
      <Row className={style.okrItem_addAlign}>
        <Col span={1}></Col>
        <Col span={2} style={{position:'relative'}}>
          <div className={!!showMateOkrModal?style.okrItem_addAlign_btnAct:style.okrItem_addAlign_btn} 
          onClick={()=>setShowMateOkrModal(true)}>
            <span><PlusOutlined /></span>
            <span>添加对齐</span>
          </div>
          {!!showMateOkrModal &&
          <MateOkrModal onClose={()=>setShowMateOkrModal(false)}/>}
        </Col>
      </Row>
      <div className={style.okrItem_keyCtn}>
        <Row className={style.okrItem_keyCtn_keyRow}>
          <Col span={8}>{!inEdit?'进度':''}</Col>
          <Col span={8}>{!inEdit?'分数':''}</Col>
          <Col span={8}>权重</Col>
        </Row>
        <Row className={style.okrItem_keyCtn_valueRow}>
          <Col span={8}>
            {!inEdit?
              <Progress type="circle" trailColor='#dadada8c' format={(val)=>val}
              percent={overallStatus.progress} 
              strokeColor={overallStatus.status==3?'red':overallStatus.status==2?'orange':''} 
              width={30} strokeWidth={20}/>:''
            }
          </Col>
          <Col span={8}>
            {!inEdit?
              0.0:''
            }
          </Col>
          <Col span={8}>100%</Col>
        </Row>
      </div>
      <Row style={{position:'relative'}}>
        <Col span={1} className={style.okrItem_oIndex}>{`O${index+1}`}</Col>
        <Col span={23} className={style.okrItem_oNameContainer}>
          <Input style={{color:'black'}} readOnly={!inEdit} className={style.okrItem_oNameContainer_input} bordered={false} 
          placeholder="请输入"  value={oname} onChange={e=>setOname(e.target.value)}/>
        </Col>
        {/* <div className={style.okrItem_remove} onClick={()=>{dispatch({type:'remove', payload:{index}});quitEdit()}}>
          <CloseOutlined className={style.okrItem_remove_icon}/>
        </div> */}
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={23}>
          <DragableKRs dispatch={obj=>dispatch({type:'logProgress',payload:{index:index,...obj}})} 
          inEdit={inEdit} data={krs} dispatchKr={(obj)=>dispatchKr(obj)}/>
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

const MateOkrModal = React.memo(({onClose})=>{
  const [searchVal, setSearchVal] = useState('');
  return(
    <div className={style.okrItem_addAlign_modal}>
      <Input bordered={false} placeholder='输入姓名搜索' className={style.okrItem_addAlign_modal_input}
        value={searchVal} onChange={e=>setSearchVal(e.target.value)}/>
      {testDuiqi.map((obj)=>{
        return(
          <Fragment key={obj.userId}>
            <MateOkrItem data={obj}/>
          </Fragment>
        )
      })}
    </div>
  )
})

const MateOkrItem = React.memo(({data})=>{
  return(
    <Fragment>
      <Row className={style.okrItem_addAlign_modal_nameRow}>
        <Col span={2}></Col>
        <Col span={4}>{data.name}</Col>
        <Col span={5}>{data.dept}</Col>
      </Row>
      {data.okrs.map((obj, index)=>{
        return(
          <Row className={style.okrItem_addAlign_modal_okrRow}>
            <Col span={2}></Col>
            <Col span={2} className={style.okrItem_addAlign_modal_oIndex}>{`O${index+1}`}</Col>
            <Col span={18} className={style.okrItem_addAlign_modal_content}>{obj.name}</Col>
          </Row>
        )
      })}
    </Fragment>
  )
})