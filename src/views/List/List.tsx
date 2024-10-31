import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import store from "../../mobx_store/store";
import { toJS } from "mobx";
import style from "./list.module.scss";
import dateformat from "dateformat";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaretRightOutlined } from "@ant-design/icons";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import getRecordLevel from "../../utils/GetRecordLevel";

const App: React.FC = () => {
  const [userJWT, setUserJWT] = useState<any>([]);
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const navigate = useNavigate();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  useEffect(() => {
    const fetchData = async () => {
      const userJWTData = await fetchUserJWT();
      if (userJWTData !== null) {
        fetchPeopleByUnitId(userJWTData["unit_id"]);
      }
    };
    fetchData();
  }, []);

  // store异步获取userJWT
  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    return userJWT;
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/people/${unit_id}`
      );
      console.log(res.data.data);
      setPersonRecords(res.data.data.peopleWithUnsolvedRecords);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const goToDetail = (person_id: number) => {
    navigate(`/record-detail/${person_id}`);
  };

  const columns: ColumnsType<PersonInfoInter> = [
    {
      title: "重点程度",
      dataIndex: "level",
      key: "level",
      width: 120,
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        getPersonLevel(a.records as RecordInter[]) -
        getPersonLevel(b.records as RecordInter[]),
      render: (_, person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        return (
          <div
            style={{
              width: "100%",
              height: "10vh",
              borderRadius: "1vh",
              backgroundColor:
                level === 0 ? "green" : level === 1 ? "#E0A60F" : "red",
            }}
          />
        );
      },
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 65,
      render: (_, person) => (
        <img
          src={`http://localhost:3000/api/upload/avatar${person.avatar}`}
          style={{ width: "8vw", height: "16vh" }}
        ></img>
      ),
    },
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
      render: (_, person) => (
        <span>
          {person.catagory === 0
            ? "干部"
            : person.catagory === 1
            ? "战士"
            : "文职"}
        </span>
      ),
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
              <div key={index}>
                <span style={{ marginRight: 5 }}>
                  <CaretRightOutlined
                    style={{
                      color:
                        getRecordLevel(record) === 1
                          ? "#E0A60F"
                          : getRecordLevel(record) === 2
                          ? "red"
                          : "green",
                    }}
                  />
                </span>
                <span
                  style={{
                    marginRight: 5,
                    color:
                      getRecordLevel(record) === 1
                        ? "#E0A60F"
                        : getRecordLevel(record) === 2
                        ? "red"
                        : "green",
                  }}
                >
                  情况{index + 1}:{record.problem?.name} 程度:
                  {getRecordLevel(record) === 0
                    ? "一般"
                    : getRecordLevel(record) === 1
                    ? "重要"
                    : "急迫"}
                </span>
                <p
                  style={{
                    marginRight: 5,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  记录时间:{dateformat(record.createdAt, "yyyy-mm-dd HH:MM:ss")}
                </p>
                <p
                  style={{
                    marginRight: 5,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  当前情况:
                  {record.record_Developments?.length === 0
                    ? "无"
                    : (
                        record.record_Developments as RecordDevelopmentInter[]
                      )[0].detail}
                </p>
                <p style={{ marginRight: 5, marginTop: 0, marginBottom: 0 }}>
                  帮带措施:
                  {record.record_Developments?.length === 0
                    ? "无"
                    : (
                        record.record_Developments as RecordDevelopmentInter[]
                      )[0].measure}
                </p>
                <span style={{ marginRight: 5 }}>
                  备注:
                  {record.record_Developments?.length === 0
                    ? "无"
                    : (
                        record.record_Developments as RecordDevelopmentInter[]
                      )[0].comment}
                </span>
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: "负责人",
      dataIndex: "responsible",
      key: "responsible",
      width: 65,
      render: (_, person) =>
        person.responsible?.avatar ? (
          <img
            src={`http://localhost:3000/api/upload/avatar${person.responsible?.avatar}`}
            style={{ width: "8vw", height: "16vh" }}
          ></img>
        ) : (
          <span>无</span>
        ),
    },
    {
      title: "操作",
      key: "options",
      width: 65,
      render: (_, person) => (
        <Button
          size="small"
          onClick={() => {
            goToDetail(person.id as number);
          }}
        >
          查看详情及历史
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={peopleRecords}
        className={style.table}
      />
    </>
  );
};

export default App;
