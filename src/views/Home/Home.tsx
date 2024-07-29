import React, { useEffect, useState } from "react";
import { Card, Col, Table, Row, Progress } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import store from "../../mobx_store/store";
import { toJS } from "mobx";
import style from "./home.module.scss";
import dateformat from "dateformat";
import axios from "axios";
import { CaretRightOutlined } from "@ant-design/icons";

const columns: ColumnsType<PersonInfoInter> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 65,
  },
  {
    title: "人员类型",
    dataIndex: "catagory",
    key: "catagory",
    width: 65,
  },
  {
    title: "婚姻状况",
    dataIndex: "married",
    key: "married",
    width: 65,
    render: (_, person) => (
      <span>{person.married == true ? "已婚" : "单身"}</span>
    ),
  },
  {
    title: "涉及情况",
    dataIndex: "records",
    key: "records",
    render: (_, { records }) => (
      <>
        {(records as RecordInter[]).map((record, index) => {
          return (
            <div>
              <span style={{ marginRight: 5 }}>
                <CaretRightOutlined
                  style={{
                    color:
                      record.risk_level === 0
                        ? "green"
                        : record.risk_level === 1
                        ? "#E0A60F"
                        : "red",
                  }}
                />
              </span>
              <span
                style={{
                  marginRight: 5,
                  color:
                    record.risk_level === 0
                      ? "green"
                      : record.risk_level === 1
                      ? "#E0A60F"
                      : "red",
                }}
              >
                情况{index + 1}:{record.problem?.name} 程度:
                {record.risk_level === 0
                  ? "一般"
                  : record.risk_level === 1
                  ? "重要"
                  : "急迫"}
              </span>
              <span style={{ marginRight: 5 }}>
                记录时间:{dateformat(record.createdAt, "yyyy-mm-dd HH:MM:ss")}
              </span>
              <p
                style={{
                  marginRight: 5,
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                具体情形:{record.detail}
              </p>
              <p style={{ marginRight: 5, marginTop: 0, marginBottom: 0 }}>
                帮带措施:{record.measure}
              </p>
              <span style={{ marginRight: 5 }}>
                责任人:{record.responsible?.name}
              </span>
              <span style={{ marginRight: 5 }}>备注:{record.comment}</span>
            </div>
          );
        })}
      </>
    ),
  },
];

const App: React.FC = () => {
  const [userJWT, setUserJWT] = useState<any>([]);
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  // store异步获取userJWT
  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    return userJWT;
  };

  const fetchPeopleRecordsByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/record/unit/${unit_id}`
      );
      console.log(res.data.data);
      setPersonRecords(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userJWTData = await fetchUserJWT();
      if (userJWTData !== null) {
        fetchPeopleRecordsByUnitId(userJWTData["unit_id"]);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        用户名:{userJWT.username} 单位ID:{userJWT.unit_id} 权限角色:{" "}
        {userJWT.role}
      </div>
      <Row>
        <Col span={24}>
          <Card className={style.card}>
            <span className={style.title}>重点关注人员情况一览表</span>
            <Table
              columns={columns}
              dataSource={peopleRecords}
              className={style.table}
            />
          </Card>
        </Col>
        {/* <Col span={6} className={style["dashboard-area"]}>
          <Card className={style.dashboard}>
            <p>干部休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={60} />
          </Card>
          <Card className={style.dashboard}>
            <p>战士休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={60} />
          </Card>
          <Card className={style.dashboard}>
            <p>文职休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={60} />
          </Card>
        </Col> */}
      </Row>
    </>
  );
};

export default App;
