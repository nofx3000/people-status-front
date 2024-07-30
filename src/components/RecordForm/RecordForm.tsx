import React, { FC, useEffect, useState, forwardRef, LegacyRef } from "react";
import { toJS } from "mobx";
import axios from "axios";
import store from "../../mobx_store/store";
import { Button, Form, Input, Select, Space, Radio, FormInstance } from "antd";
import { App as globalAntd } from "antd";
const { TextArea } = Input;

interface RecordFormProps {
  fetchPersonRecord?: (currentPersonId: number) => void;
  fetchCurrentUnitRecords?: () => void;
  setIsAdding: (isAdding: boolean) => void;
  currentPersonId?: number;
  editRecord?: RecordInter;
}

const RecordForm = forwardRef<any, RecordFormProps>(
  (
    {
      fetchPersonRecord,
      setIsAdding,
      currentPersonId,
      fetchCurrentUnitRecords,
      editRecord,
    },
    ref
  ) => {
    console.log("editRecordeditRecordeditRecord", editRecord);

    const [problemsList, setProblemsList] = useState<ProblemInter[]>([]);
    const [form] = Form.useForm();

    const staticFunction = globalAntd.useApp();
    const message = staticFunction.message;
    // store异步获取problems数据
    const fetchProblemsData = async () => {
      await store.getProblems();
      const problemsData = toJS(store.problems);
      setProblemsList(problemsData);
    };
    useEffect(() => {
      fetchProblemsData();
    }, []);

    const onFinish = async (values: RecordInter) => {
      const uploadData: RecordInter = {
        ...values,
        // unit_id: (toJS(store.userInfo) as any)["unit_id"],
        person_id: currentPersonId ? currentPersonId : editRecord?.person_id,
      };
      try {
        const res = await axios.post("/record/add", uploadData);
        if (res.status === 200) {
          message.success("添加成功!");
          fetchPersonRecord &&
            fetchPersonRecord(
              currentPersonId !== undefined ? currentPersonId : 0
            );
          fetchCurrentUnitRecords && fetchCurrentUnitRecords();
          form.resetFields();
          setIsAdding(false);
        }
      } catch (err) {
        // 将err转换成文本
        const errorText = (err as any).response?.data?.message || err;
        message.error(errorText);
      }
    };

    const onCancel = () => {
      form.resetFields();
      setIsAdding(false);
    };

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    return (
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        initialValues={editRecord ? editRecord : undefined}
      >
        <Form.Item
          name="problem_id"
          label="问题类型"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="选择问题类型"
            options={problemsList}
            fieldNames={{ label: "name", value: "id" }}
          ></Select>
        </Form.Item>
        <Form.Item
          name="risk_level"
          label="问题程度"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={0} style={{ color: "green" }}>
              一般
            </Radio>
            <Radio value={1} style={{ color: "#E0A60F" }}>
              重要
            </Radio>
            <Radio value={2} style={{ color: "red" }}>
              急迫
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="detail" label="具体描述" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item name="measure" label="应对措施" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item
          name="responsible_id"
          label="负责人"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="负责人"
            options={store.people}
            fieldNames={{ label: "name", value: "id" }}
          ></Select>
        </Form.Item>
        <Form.Item name="comment" label="备注" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onCancel}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  }
);

export default RecordForm;
