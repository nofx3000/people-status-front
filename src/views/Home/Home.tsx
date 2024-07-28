import React, { useEffect } from "react";
import { Card, Col, Table, Row, Progress } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import style from "./home.module.scss";
import { TodayPhaseInter } from "../../interface/PhaseInterface";
import MyProgress from "../../components/Progress/Progress";
import dateformat from "dateformat";

const columns: ColumnsType<TodayPhaseInter> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (_, { record: { people } }) => <span>{people.name}</span>,
  },
  {
    title: "休假地点",
    dataIndex: "destination",
    key: "destination",
    render: (_, phase) => (
      <span>
        {phase.destination}——{phase.address}
      </span>
    ),
  },
  {
    title: "休假进度",
    dataIndex: "progress",
    key: "progress",
    render: (_, phase) => (
      <MyProgress percent={60}>
        <span style={{ marginRight: "1vw" }}>
          {dateformat(phase.start_at, "yyyy-mm-dd")}——
          {dateformat(phase.end_at, "yyyy-mm-dd")}
        </span>
        <span>{""}</span>
      </MyProgress>
    ),
  },
  {
    title: "电话",
    dataIndex: "tel",
    key: "tel",
    render: (_, phase) => <span>{phase.tel}</span>,
  },
  {
    title: "紧急联系人",
    dataIndex: "emergency_tel",
    key: "emergency_tel",
    render: (_, phase) => <span>{phase.emergency_tel}</span>,
  },
  {
    title: "备注",
    dataIndex: "comment",
    key: "comment",
    render: (_, phase) => <span>{phase.comment ? phase.comment : "无"}</span>,
  },
];

const App: React.FC = () => {
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  useEffect(() => {}, []);

  return (
    <>
      <Row>
        <Col span={18}>
          <Card className={style.card}>
            <span className={style.title}>当前休假信息一览表</span>
            <Table columns={columns} dataSource={[]} className={style.table} />
          </Card>
        </Col>
        <Col span={6} className={style["dashboard-area"]}>
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
        </Col>
      </Row>
    </>
  );
};

export default App;
