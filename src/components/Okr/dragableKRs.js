import React, { Component, useCallback, useState } from "react";
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
                      <Row style={{lineHeight:'30px',position:'relative'}}>
                        <Col span={1}><span style={{padding:'10px',color:'#1890ff',fontWeight:'bold'}}>{`KR${index+1}`}</span></Col>
                        <Col span={20}>
                          <Input style={{color:'black'}} disabled={!inEdit} bordered={false} placeholder="请输入" value={item.content}
                          onChange={(e)=>dispatchKr({type:'editContent', payload:{index:index, content:e.target.value}})}/>
                        </Col>
                        <Col className={style.krItem_weightCtn}>
                          {
                            !!inEdit ? <InputNumber disabled={!inEdit} className={style.krItem_weightCtn_input}
                            defaultValue={item.weight} min={0} max={item.maxWeight} 
                            formatter={value => `${value}%`} parser={value => value.replace('%', '')} 
                            onChange={(val)=>dispatchKr({type:'editWeight', payload:{index:index, weight:val}})}/>:
                            <Input className={style.krItem_weightCtn_inputDis} disabled value={`${item.weight}%`}/>
                          }
                        </Col>
                        {!inEdit && 
                        <Col span={1} className={style.krItem_weightCtn}>
                          <Progress type="circle" trailColor='#dadada8c'
                          percent={item.progress} width={30} strokeWidth={10}/>
                        </Col>
                        }
                        {!!inEdit && <div className={style.krItem_remove} onClick={()=>dispatchKr({type:'remove', payload:{index}})}>
                          <CloseOutlined className={style.krItem_remove_icon}/>
                        </div>}
                      </Row>
                      {/* {item.content} */}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </center>
    </DragDropContext>
  );

})
 
