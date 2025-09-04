import React, { FC, useEffect, useState, forwardRef, LegacyRef } from "react";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import { Button, Form, Input, Select, Space, Radio, FormInstance, DatePicker } from "antd";
import { App as globalAntd } from "antd";
import { useParams } from "react-router-dom";
import { recordApi } from "../../api";
import dayjs from "dayjs";
import styles from './recordform.module.scss';

interface RecordFormProps {
  fetchPersonInfo?: (personid: number) => void;
  setIsAdding: (isAdding: boolean) => void;
  editRecord?: RecordInter | null;
  isEditMode?: boolean;
}

const RecordForm = forwardRef<any, RecordFormProps>(
  ({ fetchPersonInfo, setIsAdding, editRecord, isEditMode = false }, ref) => {
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

    useEffect(() => {
      if (isEditMode && editRecord) {
        form.setFieldsValue({
          problem_id: editRecord.problem_id,
          updatedAt: editRecord.updatedAt ? dayjs(editRecord.updatedAt) : undefined,
        });
      }
    }, [isEditMode, editRecord, form]);

    const onFinish = async (values: RecordInter) => {
      const uploadData: RecordInter = {
        ...values,
        updatedAt: values.updatedAt ? dayjs(values.updatedAt as any).toDate() : new Date(),
        // unit_id: (toJS(store.userInfo) as any)["unit_id"],
        person_id: person_id ? person_id : 0,
      };
      
      if (isEditMode && editRecord?.id) {
        uploadData.id = editRecord.id;
      }
      
      console.log(uploadData);

      try {
        let res;
        if (isEditMode && editRecord?.id) {
          res = await recordApi.updateRecord(editRecord.id, uploadData);
        } else {
          res = await recordApi.addRecord(uploadData);
        }
        
        if (res.status === 200) {
          message.success(isEditMode ? "更新成功!" : "添加成功!");
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
        
        <Form.Item
          name="updatedAt"
          label="记录日期"
          rules={[{ required: true, message: "请选择记录日期" }]}
        >
          <DatePicker 
            placeholder="选择记录日期"
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "更新" : "提交"}
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
