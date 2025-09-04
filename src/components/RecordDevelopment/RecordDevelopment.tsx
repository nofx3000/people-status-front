import React, { useState, useEffect } from "react";
import { Card, message, Form, Input, Popconfirm, DatePicker } from "antd";
import dateFormat from "dateformat";
import {
  Timeline,
  Button,
  Watermark,
  Select,
  Space,
  Radio,
} from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import { recordApi, llmApi } from "../../api";
import dayjs from "dayjs";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import styles from './recorddevelopment.module.scss';

interface RecordDevelopmentProps {
  record: RecordInter;
  fetchPersonInfo: (id: number) => void;
  key: number;
}
const { TextArea } = Input;

const TimelineItem = Timeline.Item;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const RecordDevelopment: React.FC<RecordDevelopmentProps> = ({
  record,
  fetchPersonInfo,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingDevelopmentId, setEditingDevelopmentId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const onDelete = async (development_id: number) => {
    try {
      const res = await recordApi.deleteRecordDevelopment(development_id);
      if (res.status === 200) {
        message.success("删除成功");
        record.person_id && fetchPersonInfo(record.person_id);
      } else {
        message.warning("删除失败");
      }
    } catch (err) {
      console.error(err);
      message.warning("删除失败");
    }
  };

  const onFinish = async (values: RecordDevelopmentInter) => {
    const uploadData = {
      ...values,
      record_id: record.id,
      updatedAt: values.updatedAt ? dayjs(values.updatedAt as any).toDate() : new Date(),
    };
    console.log(uploadData);

    try {
      const res = await recordApi.addRecordDevelopment(uploadData);
      if (res.status === 200) {
        message.success("添加成功!");
        fetchPersonInfo && fetchPersonInfo(record.person_id as number);
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

  const onEditClick = () => {
    setIsEditing(true);
    setIsAdding(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  const onEditDevelopment = (developmentId: number) => {
    setEditingDevelopmentId(developmentId);
    setIsAdding(false);
  };

  const onCancelEditDevelopment = () => {
    setEditingDevelopmentId(null);
  };

  const onEditDevelopmentFinish = async (values: RecordDevelopmentInter) => {
    if (!editingDevelopmentId) return;
    
    const uploadData = {
      ...values,
      updatedAt: values.updatedAt ? dayjs(values.updatedAt as any).toDate() : new Date(),
    };
    
    console.log(uploadData);

    try {
      const res = await recordApi.updateRecordDevelopment(editingDevelopmentId, uploadData);
      if (res.status === 200) {
        message.success("更新成功!");
        fetchPersonInfo && fetchPersonInfo(record.person_id as number);
        setEditingDevelopmentId(null);
      }
    } catch (err) {
      const errorText = (err as any).response?.data?.message || err;
      message.error(errorText);
    }
  };

  const onEditFinish = async (values: RecordInter) => {
    const uploadData: RecordInter = {
      ...values,
      updatedAt: values.updatedAt ? dayjs(values.updatedAt as any).toDate() : new Date(),
      person_id: record.person_id,
    };
    
    uploadData.id = record.id;
    
    console.log(uploadData);

    try {
      const res = await recordApi.updateRecord(record.id as number, uploadData);
      if (res.status === 200) {
        message.success("更新成功!");
        fetchPersonInfo && fetchPersonInfo(record.person_id as number);
        form.resetFields();
        setIsEditing(false);
      }
    } catch (err) {
      const errorText = (err as any).response?.data?.message || err;
      message.error(errorText);
    }
  };

  const onProblemClose = async () => {
    try {
      const res = await recordApi.closeRecord(record.id as number);
      if (res.status === 200) {
        message.success("操作成功");
        fetchPersonInfo && fetchPersonInfo(record.person_id as number);
      } else {
        message.error("操作失败");
      }
    } catch (error) {
      console.error(error);
      message.error("操作失败");
    }
  };

  const onRecordDelete = async () => {
    try {
      const res = await recordApi.deleteRecord(record.id as number);
      if (res.status === 200) {
        message.success("删除成功");
        fetchPersonInfo && fetchPersonInfo(record.person_id as number);
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };

  const EditForm = () => {
    const [editForm] = Form.useForm();
    const [problemsList, setProblemsList] = useState<ProblemInter[]>([]);

    const fetchProblemsData = async () => {
      await store.getProblems();
      const problemsData = toJS(store.problems);
      setProblemsList(problemsData);
    };

    useEffect(() => {
      fetchProblemsData();
    }, []);

    React.useEffect(() => {
      if (isEditing && record) {
        editForm.setFieldsValue({
          problem_id: record.problem_id,
          updatedAt: record.updatedAt ? dayjs(record.updatedAt) : undefined,
        });
      }
    }, [isEditing, record, editForm]);

    return (
      <Form
        {...layout}
        form={editForm}
        name="edit-record-form"
        onFinish={onEditFinish}
        style={{ maxWidth: "40vw" }}
        className={styles.developmentForm}
      >
        <Form.Item name="problem_id" label="问题类型" rules={[{ required: true }]}>
          <Select
            placeholder="选择问题类型"
            options={problemsList
              .filter(problem => problem.name && problem.id)
              .map(problem => ({
                label: problem.name!,
                value: problem.id!
              }))}
          />
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
              更新
            </Button>
            <Button htmlType="button" onClick={onCancelEdit}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  const DevelopmentForm = ({ isEdit = false, developmentId = null }: { isEdit?: boolean; developmentId?: number | null }) => {
    const [form] = Form.useForm();
    const [detail, setDetail] = useState<string>("");
    const [measure, setMeasure] = useState<string>("");
    const [risk_level, setRisk_level] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentDevelopment = isEdit && developmentId 
      ? record.record_Developments?.find(dev => dev.id === developmentId)
      : null;

    React.useEffect(() => {
      if (isEdit && currentDevelopment) {
        form.setFieldsValue({
          detail: currentDevelopment.detail,
          measure: currentDevelopment.measure,
          comment: currentDevelopment.comment,
          risk_level: currentDevelopment.risk_level,
          updatedAt: currentDevelopment.updatedAt ? dayjs(currentDevelopment.updatedAt) : undefined,
        });
        setDetail(currentDevelopment.detail || "");
        setMeasure(currentDevelopment.measure || "");
        setRisk_level(currentDevelopment.risk_level);
      }
    }, [isEdit, currentDevelopment, form]);

    const handleGetAiAdivce = async () => {
      try {
        setIsLoading(true);
        setMeasure("");
        await llmApi.getAIMeasure(detail, (token) => {
          setMeasure((prev) => {
            const newMeasure = prev + token;
            form.setFieldValue("measure", newMeasure);
            return newMeasure;
          });
        });
        const res = await llmApi.getAIRiskLevel(detail);
        const ai_risk_level = res.data.kwargs.content;
        console.log("res:", res, "level:", ai_risk_level);
        const riskLevelNum =
          ai_risk_level === "0" ||
            ai_risk_level === "1" ||
            ai_risk_level === "2"
            ? parseInt(ai_risk_level)
            : undefined;

        setRisk_level(riskLevelNum);
        form.setFieldValue("risk_level", riskLevelNum);
      } catch (error) {
        console.error("Error getting AI advice:", error);
        message.error("获取AI建议失败");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSubmit = async (values: RecordDevelopmentInter) => {
      if (isEdit) {
        await onEditDevelopmentFinish(values);
      } else {
        await onFinish(values);
      }
    };

    const handleCancel = () => {
      if (isEdit) {
        onCancelEditDevelopment();
      } else {
        onCancel();
      }
    };

    return (
      <Form
        {...layout}
        form={form}
        name={isEdit ? "edit-development-form" : "add-development-form"}
        onFinish={handleSubmit}
        style={{ maxWidth: "40vw" }}
        className={styles.developmentForm}
      >
        <Form.Item name="detail" label="具体描述" rules={[{ required: true }]}>
          <TextArea
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              form.setFieldValue("detail", e.target.value);
            }}
            autoSize={{ minRows: 2, maxRows: 20 }}
          />
          <Button
            onClick={handleGetAiAdivce}
            loading={isLoading}
            disabled={!detail || detail.trim() === "" || isLoading}
          >
            获取智能建议
          </Button>
        </Form.Item>
        <Form.Item name="measure" label="应对措施" rules={[{ required: true }]}>
          <TextArea
            value={measure}
            onChange={(e) => {
              setMeasure(e.target.value);
              form.setFieldValue("measure", e.target.value);
            }}
            autoSize={{ minRows: 2, maxRows: 20 }}
          />
        </Form.Item>
        <Form.Item name="comment" label="备注" rules={[{ required: false }]}>
          <TextArea autoSize={{ minRows: 2, maxRows: 20 }} />
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
        <Form.Item
          name="risk_level"
          label="问题程度"
          rules={[{ required: true }]}
        >
          <Radio.Group
            value={risk_level}
            onChange={(value) => setRisk_level(value)}
          >
            <Radio value={0} className={styles['green-radio']}>
              一般
            </Radio>
            <Radio value={1} className={styles['yellow-radio']}>
              重要
            </Radio>
            <Radio value={2} className={styles['red-radio']}>
              急迫
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              {isEdit ? "更新" : "提交"}
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  const TimeLineComponent = () => (
    <Timeline direction="horizontal" mode="top" labelPosition="relative">
      {record.record_Developments?.map((development) => (
        <TimelineItem
          label={dateFormat(development.updatedAt, "yyyy-mm-dd")}
          key={development.id}
        >
          <div
            style={{
              height: "2vh",
              width: "2vh",
              backgroundColor:
                development.risk_level === 0
                  ? "green"
                  : development.risk_level === 1
                    ? "#E0A60F"
                    : "red",
            }}
          ></div>
          <p>详情：{development.detail}</p>
          <p>措施：{development.measure}</p>
          <p>备注：{development.comment}</p>
          <Popconfirm
            title="确认"
            description="是否确认删除?"
            onConfirm={() => {
              onDelete(development.id as number);
            }}
          >
            <Button status="danger" type="outline">
              删除
            </Button>
          </Popconfirm>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <Watermark 
      content={record.is_closed ? "已完结" : undefined}
      fontStyle={{
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        fontWeight: 'bold'
      }}
    >
      <Card className={styles.moduleWrapper}>
        <div className={styles.header}>
          <span className={styles.problemType}>
            问题类型：{record.problem?.name}
          </span>

          {record.is_closed ? (
            <>
              <span>已于{dateFormat(record.updatedAt, "yyyy-mm-dd")}完结</span>
              <Popconfirm
                title="确认删除"
                description="删除后将无法恢复，是否确认删除此记录?"
                onConfirm={onRecordDelete}
                okText="确认删除"
                cancelText="取消"
              >
                <Button 
                  className={`${styles.actionButton} ${styles.danger}`}
                  status="danger"
                >
                  删除记录
                </Button>
              </Popconfirm>
            </>
          ) : (
            <>
              <span className={styles.recordTime}>
                记录时间:{dateFormat(record.updatedAt, "yyyy-mm-dd")}
              </span>
              <Button
                type="primary"
                onClick={() => setIsAdding(true)}
                className={styles.actionButton}
              >
                添加问题详情记录
              </Button>
              <Button
                onClick={onEditClick}
                className={styles.actionButton}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认"
                description="是否确认完结?"
                onConfirm={onProblemClose}
              >
                <Button className={styles.actionButton}>完结</Button>
              </Popconfirm>
              <Popconfirm
                title="确认删除"
                description="删除后将无法恢复，是否确认删除此记录?"
                onConfirm={onRecordDelete}
                okText="确认删除"
                cancelText="取消"
              >
                <Button 
                  className={`${styles.actionButton} ${styles.danger}`}
                  status="danger"
                >
                  删除记录
                </Button>
              </Popconfirm>
            </>
          )}
        </div>

        {isAdding && (
          <DevelopmentForm isEdit={false} />
        )}

        {isEditing && (
          <EditForm />
        )}

        {editingDevelopmentId && (
          <DevelopmentForm isEdit={true} developmentId={editingDevelopmentId} />
        )}

        {record.record_Developments?.length === 0 ? (
          <p>目前尚没有问题详情记录，请点击"添加问题详情记录"按钮添加！</p>
        ) : (
          <Timeline direction="horizontal" mode="top" labelPosition="relative" className={styles.timeline}>
            {record.record_Developments?.map((development) => (
              <TimelineItem
                label={dateFormat(development.updatedAt, "yyyy-mm-dd")}
                key={development.id}
              >
                <div
                  className={styles.riskLevel}
                  style={{
                    backgroundColor:
                      development.risk_level === 0
                        ? "green"
                        : development.risk_level === 1
                          ? "#E0A60F"
                          : "red",
                  }}
                />
                <p>详情：{development.detail}</p>
                <p>措施：{development.measure}</p>
                <p>备注：{development.comment}</p>
                <Space>
                  <Button 
                    className={styles.actionButton}
                    onClick={() => onEditDevelopment(development.id as number)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认"
                    description="是否确认删除?"
                    onConfirm={() => onDelete(development.id as number)}
                  >
                    <Button className={`${styles.actionButton} ${styles.danger}`}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Card>
    </Watermark>
  );
};

export default RecordDevelopment;
