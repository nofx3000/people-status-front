import React, { useRef, useState } from "react";
import { Card, Button, Input, Form, Select, Radio, Popconfirm } from "antd";
import style from "./basicinfo-card.module.scss";
import axios from "axios";
import { App as globalAntd } from "antd";
import AvatarUpload from "../AvatarUpload/AvatarUpload";

interface CardProps {
  unit_id: number;
  initialStatus?: CardStatus;
  personinfo?: PersonInfoInter;
  fetchPeopleData: (unit_id: number) => void;
}

type CardStatus = "data" | "edit" | "add" | "+";

const App: React.FC<CardProps> = (props: CardProps) => {
  const { fetchPeopleData, unit_id } = props;
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const [status, setStatus] = useState<CardStatus>(
    props.initialStatus as CardStatus
  );
  const [avatarURL, setAvatarURL] = useState<string>("");

  const formRef = useRef(null);

  let { personinfo: tmp } = props;
  const personinfo = tmp as PersonInfoInter;

  const onAddFinish = async (values: PersonInfoInter) => {
    values.avatar = avatarURL;
    values.unit_id = props.unit_id; // specify division
    const res = await axios.post("people/add", values);
    if (res.data.errno) {
      message.error(res.data.message);
      return;
    }
    fetchPeopleData(unit_id);
    (formRef as any).current.resetFields();
    setStatus("+");
    message.success("添加成功");
  };

  const closeAdding = (): void => {
    (formRef as any).current.resetFields();
    setStatus("+");
  };
  const closeEditng = (): void => {
    (formRef as any).current.resetFields();
    setStatus("data");
  };
  const onAddFailed = (values: any) => {
    console.log("Success:", values);
  };
  const onEidtFinish = async (values: PersonInfoInter) => {
    values.avatar = avatarURL ? avatarURL : values.avatar;
    values.id = (props.personinfo as PersonInfoInter).id;
    values.unit_id = props.unit_id; // specify division
    const res = await axios.put("people/edit", values);
    if (res.data.errno) {
      message.error(res.data.message);
      return;
    }
    fetchPeopleData(unit_id);
    (formRef as any).current.resetFields();
    setStatus("data");
    message.success("修改成功");
  };

  const onEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDel = async (id: number) => {
    const { data } = await axios.delete(`/people/del/${id}`);
    if (data.message) {
      message.error(data.message);
      return;
    }
    message.success("删除成功");
    fetchPeopleData(unit_id);
  };

  const formatCatagory = (catagory: number) => {
    switch (catagory) {
      case 0:
        return "干部";
      case 1:
        return "军士";
      case 2:
        return "文职";
      default:
        break;
    }
  };

  const renderByStatus = (status: CardStatus) => {
    if (status === "data") {
      return (
        <div className={style["data-card"]}>
          <img
            src={`http://localhost:3000/api/upload/avatar${personinfo.avatar}`}
            alt="Avatar"
            style={{ width: "100%", height: "25vh" }}
          ></img>
          <p>类别：{formatCatagory(personinfo.catagory as number)}</p>
          <p>婚姻状况：{personinfo.married ? "是" : "否"}</p>
          <div className={style["button-area"]}>
            <Button
              type="primary"
              onClick={() => {
                setStatus("edit");
              }}
            >
              编辑
            </Button>
            <Popconfirm
              placement="top"
              title="是否删除休假人信息？"
              description="删除后将无法恢复！"
              onConfirm={() => {
                handleDel(personinfo.id as number);
              }}
              okText="是"
              cancelText="否"
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </div>
        </div>
      );
    } else if (status === "+") {
      return (
        <div
          onClick={() => {
            setStatus("add");
          }}
        >
          <span className={style.add}>+添加休假人信息</span>
        </div>
      );
    } else {
      return (
        <div>
          <AvatarUpload setAvatarURL={setAvatarURL}></AvatarUpload>
          <Form
            ref={formRef}
            className={style.form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={
              status === "edit"
                ? personinfo
                : {
                    total_holiday: 20,
                    spent_holiday: 0,
                  }
            }
            onFinish={status === "add" ? onAddFinish : onEidtFinish}
            onFinishFailed={status === "add" ? onAddFailed : onEditFailed}
            autoComplete="off"
          >
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: "请输入姓名" }]}
              className={style["form-item"]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="类别"
              name="catagory"
              rules={[{ required: true, message: "请选择人员类别" }]}
              className={style["form-item"]}
            >
              <Select>
                <Select.Option value={0}>干部</Select.Option>
                <Select.Option value={1}>军士</Select.Option>
                <Select.Option value={2}>文职</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="是否已婚"
              name="married"
              rules={[{ required: true, message: "是否已婚" }]}
              className={style["form-item"]}
            >
              <Radio.Group>
                <Radio value={true}> 是 </Radio>
                <Radio value={false}> 否 </Radio>
              </Radio.Group>
            </Form.Item>
            {status === "add" ? (
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                className={style["form-item"]}
              >
                <Button type="primary" htmlType="submit">
                  添加
                </Button>
                <Popconfirm
                  placement="top"
                  title="是否放弃添加休假人信息？"
                  description="放弃后已填信息将被清空！"
                  onConfirm={closeAdding}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="primary" danger>
                    放弃
                  </Button>
                </Popconfirm>
              </Form.Item>
            ) : (
              <Form.Item
                wrapperCol={{ offset: 4, span: 20 }}
                className={style["form-item"]}
              >
                <Button type="primary" htmlType="submit">
                  修改
                </Button>
                <Popconfirm
                  placement="top"
                  title="是否放弃修改？"
                  onConfirm={closeEditng}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="primary" danger>
                    放弃
                  </Button>
                </Popconfirm>
              </Form.Item>
            )}
          </Form>
        </div>
      );
    }
  };
  return (
    <div className={`site-card-border-less-wrapper ${style["card-wraper"]}`}>
      <Card
        title={
          status === "add" || status === "+" ? "添加休假人" : personinfo.name
        }
        bordered={false}
        className={style.card}
      >
        {renderByStatus(status)}
      </Card>
    </div>
  );
};

App.defaultProps = {
  initialStatus: "data",
};

export default App;