import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Row, Col, Input, Button, Progress, Empty } from 'antd';
import * as style from './index.module.scss';
import { CloseOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DragableKRs from './dragableKRs';
import { Fragment } from 'react';

const testDuiqi = [
  {
    name: '李飞',
    dept: '研发部',
    userId: 'user004',
    okrs: [{
      id: '0000041',
      name: '李飞第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
      createdTime: '2021-05-21',
    },{
      id: '0000042',
      name: '李飞第二个OKR',
      createdTime: '2021-05-21',
    }]
  },
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
  },
  {
    name: '张无忌',
    dept: '研发部',
    userId: 'user003',
    okrs: [{
      id: '0000031',
      name: '张无忌第一个OKR，长字符串测试，长字符串测试，长字符串测试，长字符串测试',
      createdTime: '2021-05-21',
    },{
      id: '0000032',
      name: '张无忌第二个OKR',
      createdTime: '2021-05-22',
    },{
      id: '0000033',
      name: '张无忌第三个OKR',
      createdTime: '2021-05-24',
    }]
  },
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

export default React.memo(({index, data, dispatch, quitEdit, goEdit, inEdit, inEditHigh, isOwner})=>{
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
        {data.alignings && data.alignings.length>0 &&
          <Col>
          {data.alignings.map(obj=>{
            return(
              <Fragment key={obj.oId}>
                <AlignItem data={obj} isOwner={isOwner}/>
              </Fragment>
            )
          })}
          </Col>
        }
        {!!isOwner &&<Col span={2} style={{position:'relative'}}>
          <div className={!!showMateOkrModal?style.okrItem_addAlign_btnAct:style.okrItem_addAlign_btn} 
          onClick={()=>setShowMateOkrModal(true)}>
            <span><PlusOutlined /></span>
            <span>添加对齐</span>
          </div>
          {!!showMateOkrModal &&
          <MateOkrModal index={index} dispatch={dispatch} alignings={data.alignings.map(obj=>obj.oId)} onClose={()=>setShowMateOkrModal(false)}/>}
        </Col>}
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
          <DragableKRs isOwner={isOwner} dispatch={obj=>dispatch({type:'logProgress',payload:{index:index,...obj}})} 
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
      <Fragment>{!!isOwner &&<Row className={style.okrItem_opsCtn}>
        <Col span={2}>
          <Button disabled={inEditHigh} type="primary" onClick={()=>{dispatch({type:'goEdit',payload:{index}});goEdit()}}>编辑</Button>
        </Col>
      </Row>}
      </Fragment>
      }
    </div>
  )
})

const throttle = (fn, wait)=>{
  let prev = new Date();
  let first = true;
  return function(){
    let now = new Date();
    let context = this;
    let args = arguments;
    if(now-prev>wait){
      if(first){
        first = false;
        prev = now;
        return;
      }
      fn.apply(context, args);
      prev = now;
    }
  }
}

const AlignItem = React.memo(({data, isOwner})=>{
  const [showMore, setShowMore] = useState(false)
  return(
    <div className={style.okrItem_addAlign_alignItem} onMouseLeave={()=>setShowMore(false)}
    onMouseEnter={()=>setShowMore(true)}>
      <span>{data.name}</span>
      {!!isOwner && <span className={style.okrItem_addAlign_alignItem_remove}><CloseOutlined/></span>}
      {showMore &&
      <Row className={style.okrItem_addAlign_alignItem_more} justify='space-between'>
        <Col><div className={style.okrItem_addAlign_alignItem_more_O}>O</div></Col>
        <Col span={17}>{data.oName}</Col>
        <Col span={5} style={{color:data.status==3?'red':(data.status==2?'orange':'#1890ff')}}>
          {`${data.status==3?'已延期':(data.status==2?'有风险':'正常')} ${data.progress}%`}
        </Col>
      </Row>
      }
    </div>
  )
})

const MateOkrModal = React.memo(({index, dispatch, alignings, onClose})=>{
  const [searchVal, setSearchVal] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = (name)=>{
    let result = !!name?testDuiqi.filter(obj=>obj.name.indexOf(name)>-1):[];
    setSearchResult(result)
  }
  const memorizedSearch = useCallback(throttle((name)=>handleSearch(name), 300),[])

  return(
    <div className={style.okrItem_addAlign_modal}>
      <div className={style.okrItem_addAlign_modal_close} onClick={()=>onClose()}>
        <CloseOutlined />
      </div>
      <Input bordered={false} placeholder='输入姓名搜索' className={style.okrItem_addAlign_modal_input}
        value={searchVal} 
        onChange={e=>{memorizedSearch(e.target.value);setSearchVal(e.target.value)}}/>
      <div className={style.okrItem_addAlign_modal_maincontent}>
        {searchResult.length > 0 ? searchResult.map((obj) => {
          return (
            <Fragment key={obj.userId}>
              <MateOkrItem mainIndex={index} dispatch={dispatch} data={obj} selectedIds={alignings}/>
            </Fragment>
          )
        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
      </div>
    </div>
  )
})

const MateOkrItem = React.memo(({mainIndex, dispatch, data, selectedIds})=>{
  const [showConfirm, setShowConfirm] = useState(null);

  const handleSelect = (obj)=>{
    if(selectedIds.indexOf(obj.id)>-1){
      return;
    }else{
      setShowConfirm(obj);
    }
  }

  const selectConfirm = useCallback(()=>{
    dispatch({type:'addAlign', payload:{index:mainIndex,content:{name:data.name, userId:data.userId, 
      oName:showConfirm.name, oId:showConfirm.id, progress:10}}})
    setShowConfirm('')
  },[showConfirm])
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
            <Col span={2} className={style.okrItem_addAlign_modal_okrRow_selected}>
              {selectedIds.indexOf(obj.id)>-1 && <CheckCircleOutlined />}
            </Col>
            <Col span={2} className={style.okrItem_addAlign_modal_oIndex}>{`O${index+1}`}</Col>
            <Col span={18} className={style.okrItem_addAlign_modal_content}>
              <div style={{cursor:'pointer'}} onClick={()=>handleSelect({id:obj.id, name:obj.name})}>{obj.name}</div>
            </Col>
            {showConfirm&&showConfirm.id==obj.id&&<div className={style.okrItem_addAlign_modal_confirm}>
              <Row>
                <Col span={8}>
                  <Button size='small' type='primary' onClick={()=>selectConfirm()}>添加</Button>
                </Col>
                <Col span={8}>
                  <Button size='small' onClick={()=>setShowConfirm(null)}>取消</Button>
                </Col>
              </Row>
            </div>}
          </Row>
        )
      })}
    </Fragment>
  )
})