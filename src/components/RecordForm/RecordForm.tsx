import React, { FC, useEffect, useState, forwardRef, LegacyRef } from "react";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import { Button, Form, Input, Select, Space, Radio, FormInstance } from "antd";
import { App as globalAntd } from "antd";
import { useParams } from "react-router-dom";
import { recordApi } from "../../api";
import styles from './recordform.module.scss';

interface RecordFormProps {
  fetchPersonInfo?: (personid: number) => void;
  setIsAdding: (isAdding: boolean) => void;
}

const RecordForm = forwardRef<any, RecordFormProps>(
  ({ fetchPersonInfo, setIsAdding }, ref) => {
    const { person_id: string_person_id } = useParams();
    const person_id = string_person_id ? Number(string_person_id) : 0;
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

        person_id: person_id ? person_id : 0,
      };

      try {
        const res = await recordApi.addRecord(uploadData);
        if (res.status === 200) {
          message.success("添加成功!");
          fetchPersonInfo && fetchPersonInfo(person_id);
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
        className={styles.form}
        // initialValues={editRecord ? editRecord : undefined}
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
