import React from 'react';
import MyLayout from '../components/layout';
import Preview from '../components/Preview'

export default React.memo(()=>{
  return(
    <MyLayout tabId='alignView'>
      {/* <div>对齐视图</div> */}
      <div style={{width:'50%',margin:'auto'}}><Preview/></div>
    </MyLayout>
  )
})