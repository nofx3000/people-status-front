import React, { useRef, useState } from "react";
import { Card, Button, Input, Form, Select, Radio, Popconfirm } from "antd";
import style from "./responsible-card.module.scss";
import axios from "axios";
import { App as globalAntd } from "antd";
import AvatarUpload from "../AvatarUpload/AvatarUpload";

interface CardProps {
  unit_id: number;
  initialStatus?: CardStatus;
  responsibleinfo?: ResponsibleInter;
  fetchResponsibleData: (unit_id: number) => void;
}

type CardStatus = "data" | "edit" | "add" | "+";

const App: React.FC<CardProps> = (props: CardProps) => {
  const { fetchResponsibleData, unit_id } = props;
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const [status, setStatus] = useState<CardStatus>(
    props.initialStatus as CardStatus
  );
  const [avatarURL, setAvatarURL] = useState<string>("");

  const formRef = useRef(null);

  let { responsibleinfo: tmp } = props;
  const responsibleinfo = tmp as ResponsibleInter;

  const onAddFinish = async (values: ResponsibleInter) => {
    values.avatar = avatarURL;
    values.unit_id = props.unit_id; // specify division
    const res = await axios.post("responsible/add", values);
    if (res.data.errno) {
      message.error(res.data.message);
      return;
    }
    fetchResponsibleData(unit_id);
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
  const onEidtFinish = async (values: ResponsibleInter) => {
    values.avatar = avatarURL ? avatarURL : values.avatar;
    values.id = (props.responsibleinfo as ResponsibleInter).id;
    values.unit_id = props.unit_id; // specify division
    const res = await axios.put(
      `responsible/edit/${(props.responsibleinfo as ResponsibleInter).id}`,
      values
    );
    if (res.data.errno) {
      message.error(res.data.message);
      return;
    }
    fetchResponsibleData(unit_id);
    (formRef as any).current.resetFields();
    setStatus("data");
    message.success("修改成功");
  };

  const onEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDel = async (id: number) => {
    const { data } = await axios.delete(`/responsible/del/${id}`);
    if (data.message) {
      message.error(data.message);
      return;
    }
    message.success("删除成功");
    fetchResponsibleData(unit_id);
  };

  const renderByStatus = (status: CardStatus) => {
    if (status === "data") {
      return (
        <div className={style["data-card"]}>
          <img
            src={`http://localhost:3000/api/upload/avatar${responsibleinfo.avatar}`}
            alt="Avatar"
            style={{ width: "100%", height: "25vh" }}
          ></img>
          <p>姓名：{responsibleinfo.name}</p>
          <p>特点：{responsibleinfo.description}</p>
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
              title="是否删除信息？"
              description="删除后将无法恢复！"
              onConfirm={() => {
                handleDel(responsibleinfo.id as number);
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
          <span className={style.add}>+添加</span>
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
                ? responsibleinfo
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
              label="特点"
              name="description"
              rules={[{ required: true, message: "请输入特点" }]}
              className={style["form-item"]}
            >
              <Input />
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
                  title="是否放弃？"
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
          status === "add" || status === "+" ? "添加人员" : responsibleinfo.name
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
