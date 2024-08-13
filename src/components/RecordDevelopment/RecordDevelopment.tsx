import React, { useState } from "react";
import { Card, message, Form, Input, Popconfirm } from "antd";
import dateFormat from "dateformat";
import { Timeline, Button, Select, Space, Radio } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import axios from "axios";

interface RecordDevelopmentProps {
  record: RecordInter;
  fetchPersonInfo: (id: number) => void;
  key: number;
}
const { TextArea } = Input;

const TimelineItem = Timeline.Item;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const RecordDevelopment: React.FC<RecordDevelopmentProps> = ({
  record,
  fetchPersonInfo,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onDelete = async (development_id: number) => {
    try {
      const res = await axios.delete(`/record-development/${development_id}`);
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

  const onFinish = async (values: RecordInter) => {
    const uploadData: RecordDevelopmentInter = {
      ...values,
      // unit_id: (toJS(store.userInfo) as any)["unit_id"],
      record_id: record.id,
    };
    try {
      const res = await axios.post("/record-development/", uploadData);
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
      const res = await axios.put(`/record/${record.id}`, {
        is_closed: true,
      });
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

  const DevelopmentForm = () => (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      //   initialValues={editRecord ? editRecord : undefined}
    >
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
    <Card style={{ marginTop: "2vh" }}>
      <div>
        <span style={{ marginRight: "2vw" }}>
          问题类型：{record.problem?.name}
        </span>

        {record.is_closed ? (
          <span>已于{dateFormat(record.updatedAt, "yyyy-mm-dd")}完结</span>
        ) : (
          <>
            <span style={{ marginRight: "2vw" }}>
              记录时间:{dateFormat(record.updatedAt, "yyyy-mm-dd")}
            </span>
            <Button
              type="primary"
              onClick={() => {
                setIsAdding(true);
              }}
            >
              添加问题详情记录
            </Button>
            <Popconfirm
              title="确认"
              description="是否确认完结?"
              onConfirm={() => {
                onProblemClose();
              }}
            >
              <Button style={{ marginLeft: "2vw" }}>完结</Button>
            </Popconfirm>
          </>
        )}
      </div>
      {isAdding && <DevelopmentForm />}
      {record.record_Developments?.length === 0 ? (
        <p>目前尚没有问题详情记录，请点击“添加问题详情记录”按钮添加！</p>
      ) : (
        <TimeLineComponent />
      )}
    </Card>
  );
};

export default RecordDevelopment;
