import React, { useState, useEffect, useRef } from "react";
import { message, Table, Button, Flex } from "antd";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import type { ColumnsType } from "antd/es/table";
import style from "./summary.module.scss";
import axios from "axios";
import Radar from "../../components/Charts/Radar";
import Line from "../../components/Charts/Line";
import VerticalBar from "../../components/Charts/VerticalBar";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import TodaySummary from "./TodaySummary";
import DetailModal from "./DetailModal";
import ResponsibleList from "./ResponsibleList";
import NumbersOfCards from "./NumbersOfCards";

interface detailModalRefInteface {
  setPersonId: (personId: number) => void;
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void;
}

const Summary: React.FC = () => {
  const detailModalRef = useRef<detailModalRefInteface>(null);
  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentUnitId, setCurrentUnitId] = useState<number>(
    userJWT.unit_id as number
  );
  const [peopleWtihUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const userJWT = await fetchUserJWT();
      fetchPeopleByUnitId(userJWT.unit_id);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   fetchPeopleByUnitId(currentUnitId);
  // }, [currentUnitId]);

  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    setCurrentUnitId((userJWT as UserInfoInter).unit_id as number);
    return userJWT;
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/people/${unit_id}`
      );
      setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const handleChangeCurrentUnitId = (unid_id: number) => {
    setCurrentUnitId(unid_id);
  };

  const onDetailClick = async (personId: number) => {
    if (detailModalRef.current) {
      detailModalRef.current.setPersonId(personId);
      detailModalRef.current.setIsDetailModalOpen(true);
    }
  };

  const columns: ColumnsType<PersonInfoInter> = [
    {
      title: "程度",
      dataIndex: "level",
      key: "level",
      // width: 30,
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        getPersonLevel(a.records as RecordInter[]) -
        getPersonLevel(b.records as RecordInter[]),
      render: (_, person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        return (
          <div
            style={{
              width: "4vw",
              height: "4vh",
              borderRadius: "1vh",
              backgroundColor:
                level === 0 ? "green" : level === 1 ? "#E0A60F" : "#c23531",
            }}
          />
        );
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      render: (_, person) => <span>{person.unit?.name}</span>,
    },
    {
      title: "类型",
      dataIndex: "catagory",
      key: "catagory",
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
      title: "涉及问题",
      dataIndex: "problem",
      key: "problem",
      render: (_, person) => {
        if (!person.records) return <p>无</p>;
        return (
          <div>
            {person.records.map((record, index) => (
              <p
                style={{ lineHeight: "2vh", marginBottom: 1, marginTop: 1 }}
                key={index}
              >
                •{record.problem?.name}
              </p>
            ))}
          </div>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "option",
      key: "option",
      render: (_, person) => (
        <Button
          onClick={() => {
            onDetailClick(person.id as number);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  const AdminSection = () => (
    <Flex gap="middle" vertical flex={1} style={{ height: "88vh" }}>
      <TodaySummary currentUnitId={currentUnitId} />
      <div
        className={style.flexcard}
        style={{ height: "70%", overflow: "auto" }}
      >
        <VerticalBar></VerticalBar>
      </div>
    </Flex>
  );

  const UserSection = () => (
    <Flex
      gap="middle"
      vertical
      flex={1}
      justify="space-between"
      align="space-between"
      style={{ height: "88vh" }}
    >
      <TodaySummary currentUnitId={currentUnitId} />
      <ResponsibleList currentUnitId={currentUnitId} />
    </Flex>
  );

  return (
    <>
      <Flex gap="middle" vertical={false}>
        {userJWT.role === "admin" ? <AdminSection /> : <UserSection />}
        <Flex gap="middle" vertical flex={2}>
          <NumbersOfCards
            peopleWtihUnsolvedRecords={peopleWtihUnsolvedRecords}
            userJWT={userJWT}
            currentUnitId={currentUnitId}
            handleChangeCurrentUnitId={handleChangeCurrentUnitId}
          />
          <div
            className={style.flexcard}
            style={{ height: "70%", overflow: "auto" }}
          >
            <Table
              columns={columns}
              dataSource={peopleWtihUnsolvedRecords}
              className={style.table}
              rowKey={(row) => row.id as any}
            />
          </div>
        </Flex>
        <Flex gap="middle" vertical flex={1}>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Line unitId={currentUnitId}></Line>
          </div>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Radar unitId={currentUnitId}></Radar>
          </div>
        </Flex>
      </Flex>
      <DetailModal ref={detailModalRef} />
    </>
  );
};
export default Summary;
