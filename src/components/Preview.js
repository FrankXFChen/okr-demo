import React, { useRef, useState, useMemo, Fragment, useCallback } from 'react';
import {
    Form,
    Input,
    Radio,
    Checkbox,
    DatePicker,
    Select,
    Switch,
    Button
} from 'antd'
const { Option } = Select;

const form_config = `{
	"layout": "horizontal",
	"labelAlign": "right",
	"size": "default"
}`

const form_content = `[
	{
		"id": "content-2ec8---7",
		"label": "我的标题",
		"type": "title",
		"options": {
			"fontSize": "16px",
			"color": "#79c5fa",
			"textAlign": "left",
			"fontWeight": "bold"
		},
		"code": "code_94254f8d"
	},
	{
		"id": "content-47d8---0",
		"label": "我的单行文本",
		"type": "input",
		"options": {
			"width": "100%",
			"defaultValue": "",
			"required": true,
			"disabled": false,
			"dataType": "text",
			"placeholder": "请输入"
		},
		"code": "code_e5a4604c"
	},
	{
		"id": "content-9e5c---1",
		"label": "我的多行文本",
		"type": "textarea",
		"options": {
			"width": "100%",
			"defaultValue": "",
			"required": false,
			"disabled": false,
			"placeholder": "请输入"
		},
		"code": "code_3405f1d4"
	},
	{
		"id": "content-7d76---2",
		"label": "单选框组",
		"type": "radio",
		"options": {
			"defaultValue": "",
			"required": false,
			"disabled": false,
			"options": [
				{
					"label": "标题1",
					"value": "v1"
				},
				{
					"label": "标题2",
					"value": "v2"
				},
				{
					"label": "标题3",
					"value": "v3"
				}
			]
		},
		"code": "code_47250114"
	},
	{
		"id": "content-85bf---3",
		"label": "多选框组",
		"type": "checkbox",
		"options": {
			"defaultValue": "",
			"required": false,
			"disabled": false,
			"options": [
				{
					"label": "标题1",
					"value": "t1"
				},
				{
					"label": "标题2",
					"value": "t2"
				},
				{
					"label": "标题3",
					"value": "t3"
				}
			]
		},
		"code": "code_743d1873"
	},
	{
		"id": "content-0e8a---4",
		"label": "下拉选择框",
		"type": "select",
		"options": {
			"width": "100%",
			"defaultValue": "",
			"required": false,
			"disabled": false,
			"options": [
				{
					"label": "标题1",
					"value": "s1"
				},
				{
					"label": "标题2",
					"value": "s2"
				},
				{
					"label": "标题3",
					"value": "s3"
				}
			]
		},
		"code": "code_1435b43e"
	},
	{
		"id": "content-9b46---5",
		"label": "日期选择器",
		"type": "date",
		"options": {
			"width": "100%",
			"format": "YYYY-MM-DD",
			"required": true,
			"disabled": false,
			"options": [
				{
					"label": "YYYY-MM-DD",
					"value": "YYYY-MM-DD"
				},
				{
					"label": "YYYY-MM-DD HH:mm",
					"value": "YYYY-MM-DD HH:mm"
				}
			]
		},
		"code": "code_177034de"
	},
	{
		"id": "content-eb41---6",
		"label": "开关",
		"type": "switch",
		"options": {
			"defaultValue": "",
			"required": false,
			"disabled": false
		},
		"code": "code_3b315e4f"
	}
]`
export default React.memo(()=>{
  const [config, setConfig] = useState(JSON.parse(form_config)) ;
  const [content, setContent] = useState(JSON.parse(form_content));
  const [form] = Form.useForm();
  const formRefModal = useRef(null);

  const formItemLayout = useMemo(()=>{
    return config.layout === 'horizontal'
    ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    }
    : null;
  },[config])

  // const handleSubmit=useCallback(()=>{
  //   form.validateFields()
  //   .then((values) => {
  //     console.log('values  ', values)
  //   })
  //   .catch((info) => {
  //     console.log('Validate Failed:', info);
  //   });
  // },[form])  
  
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Fragment>
    <Form form={form} ref={formRefModal} onFinish={onFinish} onFinishFailed={onFinishFailed}
      style={{ backgroundColor: '#FFF', padding:'10px' }} layout={config.layout} labelAlign={config.labelAlign} >
      {
        content.map((el, i) =>
          el.type === 'title' ?
            <p style={{ fontSize: el.options.fontSize, color: el.options.color, textAlign: el.options.textAlign, fontWeight: el.options.fontWeight }}>{el.label}</p>
            : <MyFormItem el={el} i={i} config={config} formItemLayout={formItemLayout}/>
        )
      }<Form.Item
      wrapperCol={{
        offset: 20,
        span: 4,
      }}
    >
      <Button type="primary" htmlType="submit">提交</Button>
    </Form.Item>
    </Form>
    {/* <Button type="primary" onClick={handleSubmit}>提交2</Button> */}
    </Fragment>
  )
})

const MyFormItem = React.memo(({el, i, config, formItemLayout})=>{
  const { defaultValue, placeholder } = el.options
  switch (el.type) {
    case 'input':
      return <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
        rules={[{ required: el.options.required, message: '不能为空' }]} >
        <Input style={{ width: el.options.width }} size={config.size} placeholder={placeholder}  />
      </Form.Item>
    case 'textarea':
      return <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
        rules={[{ required: el.options.required, message: '不能为空' }]} >
        <Input.TextArea style={{ width: el.options.width }} rows={4} size={config.size} placeholder={placeholder}  />
      </Form.Item>
    case 'radio':
      return (
        <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
          rules={[{ required: el.options.required, message: '不能为空' }]} >
          <Radio.Group >
            {
              el.options.options.map((el2, j) =>
                <Radio value={el2.value} key={j} size={config.size} >{el2.label}</Radio>
              )
            }
          </Radio.Group>
        </Form.Item>
      )
    case 'checkbox':
      return <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
        rules={[{ required: el.options.required, message: '不能为空' }]} >
        <Checkbox.Group options={el.options.options} size={config.size}  />
      </Form.Item>
    case 'select':
      return (
        <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
          rules={[{ required: el.options.required, message: '不能为空' }]} >
          <Select style={{ width: el.options.width, minWidth: '180px' }} size={config.size} placeholder={placeholder} >
            {
              el.options.options.map((el2, j) =>
                <Select.Option value={el2.value} key={j}>{el2.label}</Select.Option>
              )
            }

          </Select>
        </Form.Item>
      )
    case 'date':
      return <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
        rules={[{ required: el.options.required, message: '不能为空' }]} >
        <DatePicker style={{ width: el.options.width }} size={config.size} showTime={el.options.format === 'YYYY-MM-DD HH:mm'} format={el.options.format} />
      </Form.Item>
    case 'switch':
      return <Form.Item label={el.label}  {...formItemLayout} labelAlign={config.labelAlign} name={`el_${i}`}
        rules={[{ required: el.options.required, message: '不能为空' }]} >
        <Switch defaultChecked={true} size={config.size} />
      </Form.Item>
    default:
      break;
  }
})
