import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Input, Form, Select, Radio, Popconfirm } from "antd";
import style from "./basicinfo-card.module.scss";
import store from "../../mobx_store/store";
import { toJS } from "mobx";
import { App as globalAntd } from "antd";
import { useNavigate } from "react-router-dom";
import AvatarUpload from "../AvatarUpload/AvatarUpload";
import formatCatagory from "../../utils/FormatCatagory";
import defaultAvatar from "../../images/avatar.jpeg";
import { personApi, responsibleApi } from "../../api";

interface CardProps {
  unit_id: number;
  initialStatus?: CardStatus;
  personinfo?: PersonInfoInter;
  fetchPeopleData: (unit_id: number) => void;
}

type CardStatus = "data" | "edit" | "add" | "+";

const App: React.FC<CardProps> = (props: CardProps) => {
  const { fetchPeopleData, unit_id } = props;
  const navigate = useNavigate();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const [status, setStatus] = useState<CardStatus>(
    props.initialStatus as CardStatus
  );
  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );
  const [avatarURL, setAvatarURL] = useState<string>("");

  useEffect(() => {
    fetchResponsibleByUnitId(unit_id);
  }, [unit_id]);

  const fetchResponsibleByUnitId = async (unit_id: number) => {
    try {
      const res = await responsibleApi.getResponsibleByUnit(unit_id);
      if (res.status === 200) {
        setResponsibleList(res.data.data);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const formRef = useRef(null);

  let { personinfo: tmp } = props;
  const personinfo = tmp as PersonInfoInter;

  const onAddFinish = async (values: PersonInfoInter) => {
    values.avatar = avatarURL;
    values.unit_id = props.unit_id;
    try {
      const res = await personApi.addPerson(values);
      if (res.status === 200) {
        fetchPeopleData(unit_id);
        (formRef as any).current.resetFields();
        setStatus("+");
        message.success("添加成功");
        if (res.data.data.id) {
          navigate(`/record-detail/${res.data.data.id}`);
        }
      }
    } catch (error) {
      message.error("添加失败");
    }
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
    values.unit_id = props.unit_id;
    try {
      const res = await personApi.editPerson(values.id as number, values);
      if (res.status === 200) {
        fetchPeopleData(unit_id);
        (formRef as any).current.resetFields();
        setStatus("data");
        message.success("修改成功");
      }
    } catch (error) {
      message.error("修改失败");
    }
  };

  const onEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDel = async (id: number) => {
    try {
      const res = await personApi.deletePerson(id);
      if (res.status === 200) {
        message.success("删除成功");
        fetchPeopleData(unit_id);
      }
    } catch (error) {
      message.error("删除失败");
    }
  };

  const onRecordDetailClicked = () => {
    console.log("onRecordDetailClicked");
    navigate(`/record-detail/${personinfo.id}`);
  };

  const renderByStatus = (status: CardStatus) => {
    if (status === "data") {
      return (
        <div className={style["data-card"]}>
          <img
            src={
              personinfo.avatar
                ? `http://localhost:3000/api/upload/avatar${personinfo.avatar}`
                : defaultAvatar
            }
            alt="Avatar"
            style={{ width: "100%", height: "25vh" }}
          ></img>
          <p>类别：{formatCatagory(personinfo.catagory as number)}</p>
          <p>婚姻状况：{personinfo.married ? "是" : "否"}</p>
          <p>负责人：{personinfo.responsible?.name}</p>
          <div className={style["button-area"]}>
            <Button type="primary" onClick={onRecordDetailClicked}>
              详情
            </Button>
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
            initialValues={status === "edit" ? personinfo : {}}
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
              label="负责人"
              name="responsible_id"
              rules={[{ required: true, message: "请选择负责人" }]}
              className={style["form-item"]}
            >
              <Select>
                {responsibleList
                  ? responsibleList.map((responsible) => (
                      <Select.Option
                        value={responsible.id}
                        key={responsible.id}
                      >
                        {responsible.name}
                      </Select.Option>
                    ))
                  : []}
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
          status === "add" || status === "+" ? "添加人员" : personinfo.name
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
