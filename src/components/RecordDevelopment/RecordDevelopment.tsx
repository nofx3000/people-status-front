import React, { useState } from "react";
import { Card, message, Form, Input, Popconfirm } from "antd";
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

  const DevelopmentForm = () => {
    const [detail, setDetail] = useState<string>("");
    const [measure, setMeasure] = useState<string>("");
    const [risk_level, setRisk_level] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

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

    return (
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
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
              提交
            </Button>
            <Button htmlType="button" onClick={onCancel}>
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
            <span>已于{dateFormat(record.updatedAt, "yyyy-mm-dd")}完结</span>
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
              <Popconfirm
                title="确认"
                description="是否确认完结?"
                onConfirm={onProblemClose}
              >
                <Button className={styles.actionButton}>完结</Button>
              </Popconfirm>
            </>
          )}
        </div>

        {isAdding && (
          <DevelopmentForm
          />
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
                <Popconfirm
                  title="确认"
                  description="是否确认删除?"
                  onConfirm={() => onDelete(development.id as number)}
                >
                  <Button className={`${styles.actionButton} ${styles.danger}`}>
                    删除
                  </Button>
                </Popconfirm>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Card>
    </Watermark>
  );
};

export default RecordDevelopment;
