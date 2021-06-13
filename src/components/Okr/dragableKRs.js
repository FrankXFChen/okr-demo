import React, { Component, useCallback, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {Input, Row, Col, InputNumber, Progress} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import * as style from './index.module.scss';
 
// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
 
  const [removed] = result.splice(startIndex, 1);
 
  result.splice(endIndex, 0, removed);
  return result;
};
 
const grid = 8;
 
// 设置样式
const getItemStyle = (isDragging, draggableStyle, length, index, inEdit) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  paddingTop: grid,
  //margin: `0 0 ${grid}px 0`,
 
  // 拖拽的时候背景变化
  background: "#ffffff",
  opacity: isDragging ? `0.5`:`1`,
  border: isDragging ? `1px dashed #bfbfbf `:`none`,
  borderBottom: isDragging ? '1px dashed #bfbfbf':((length==index+1 && !inEdit) ?'':'1.5px solid #bfbfbf'),
 
  // styles we need to apply on draggables
  ...draggableStyle
});
 
const getListStyle = () => ({
  background: 'transparent',
  //padding: grid,
  width: '100%'
});
 
export default React.memo(({data, inEdit, dispatchKr})=>{
  //const [innerKrs, setInnerKrs] = useState(data);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }
 
    const items = reorder(
      data,
      result.source.index,
      result.destination.index
    );
 
    dispatchKr({type:'reorder',payload:items})
  },[data])

  return (
    <Fragment>
      {!!inEdit ?
        <DragDropContext onDragEnd={onDragEnd}>
          <center>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  //provided.droppableProps应用的相同元素.
                  {...provided.droppableProps}
                  // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                  ref={provided.innerRef}
                  style={getListStyle(snapshot)}
                >
                  {data.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            data.length, index, inEdit
                          )}
                        >
                          <Row style={{ lineHeight: '30px', position: 'relative' }}>
                            <Col span={1}><span style={{ padding: '10px', color: '#1890ff', fontWeight: 'bold' }}>{`KR${index + 1}`}</span></Col>
                            <Col span={19}>
                              <Input style={{ color: 'black' }} bordered={false} placeholder="请输入" value={item.content}
                                onChange={(e) => dispatchKr({ type: 'editContent', payload: { index: index, content: e.target.value } })} />
                            </Col>
                            <div className={style.krItem_valueCtn}>
                              <Row className={style.krItem_valueCtn_Row}>
                                <Col span={8}></Col>
                                <Col span={8}></Col>
                                <Col span={8}>
                                  <InputNumber readOnly={!inEdit} className={style.krItem_weightCtn_input}
                                      defaultValue={item.weight} min={0} max={item.maxWeight}
                                      formatter={value => `${value}%`} parser={value => value.replace('%', '')}
                                      onChange={(val) => dispatchKr({ type: 'editWeight', payload: { index: index, weight: val } })} />   
                                </Col>
                              </Row>
                            </div>
                            <div className={style.krItem_remove} onClick={() => dispatchKr({ type: 'remove', payload: { index } })}>
                              <CloseOutlined className={style.krItem_remove_icon} />
                            </div>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </center>
        </DragDropContext> :
        <Fragment>
          {data.map((item, index) => (
            <div className={style.krItem_normalCtn} style={index+1==data.length?{border:'none'}:null}>
              <Row style={{ lineHeight: '30px', position: 'relative' }}>
                <Col span={1}><span style={{ padding: '10px', color: '#1890ff', fontWeight: 'bold' }}>{`KR${index + 1}`}</span></Col>
                <Col span={19}>
                  <Input style={{ color: 'black' }} readOnly={true} bordered={false} placeholder="请输入" value={item.content}
                    onChange={(e) => dispatchKr({ type: 'editContent', payload: { index: index, content: e.target.value } })} />
                </Col>
                <div className={style.krItem_valueCtn}>
                  <Row className={style.krItem_valueCtn_Row}>
                    <Col span={8}>
                      {/* <Progress type="circle" trailColor='#dadada8c' status={item.status==3?"exception":'normal'} format={() => }
                        percent={item.progress} width={30} strokeWidth={10} /> */}
                        <MyProgress status={item.status} value={item.progress}/>
                    </Col>
                    <Col span={8}>10.0</Col>
                    <Col span={8}>
                      <Input bordered={false} className={style.krItem_weightCtn_inputDis}
                        readOnly value={`${item.weight}%`} />
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>)
            )
          }
        </Fragment>
      }
    </Fragment>
  );

})

const MyProgress = React.memo(({status, value})=>{
  let myFormat = (val)=>val+`%`;
  let myColor = '';
  if(value===100){
    if(status===3){
      myColor='red'
    }else {
      myFormat = '';
    }
  }else{
    if(status===3){
      myColor='red'
    }else if(status===2){
      myColor='orange'
    }
  }
  
  return(
    <Progress type="circle" trailColor='#dadada8c'   strokeColor={myColor} format={myFormat}
      percent={value} width={30} strokeWidth={10} />
  )
})
 
