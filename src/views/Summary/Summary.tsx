import React, { useState, useEffect } from "react";
import { message, Select, Table, Modal, Button, Flex } from "antd";
import { toJS } from "mobx";
import dateformat from "dateformat";
import store from "../../mobx_store/store";
import type { ColumnsType } from "antd/es/table";
import { CaretRightOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd";
import style from "./summary.module.scss";
import dateFormat from "dateformat";
import axios from "axios";
import Bar from "../../components/Charts/Bar";
import Line from "../../components/Charts/Line";
import Pie from "../../components/Charts/Pie";
import Radar from "../../components/Charts/Radar";
import VerticalBar from "../../components/Charts/VerticalBar";
import defaultAvatar from "../../images/avatar.jpeg";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import getRecordLevel from "../../utils/GetRecordLevel";

const Summary: React.FC = () => {
  const [unitList, setUnitList] = useState<UnitInter[]>([]);
  const [currentUnitId, setCurrentUnitId] = useState<number>(1);
  const [personDetail, setPersonDetail] = useState<PersonInfoInter>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const [numberInCard, setNumberInCard] = useState<any[]>([0, 0, 0]);
  const [userJWT, setUserJWT] = useState<UserInfoInter>({});

  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    return userJWT;
  };

  useEffect(() => {
    fetchUserJWT();
    fetchUnitList();
    fetchPeopleByUnitId(currentUnitId);
  }, []);

  useEffect(() => {
    const data: any[] = [
      { name: "急迫", value: 0 },
      { name: "重要", value: 0 },
      { name: "一般", value: 0 },
    ];
    peopleRecords.forEach((person) => {
      const level = getPersonLevel(person.records ? person.records : []);
      if (level === 2) {
        data[0].value++;
      } else if (level === 1) {
        data[1].value++;
      } else {
        data[2].value++;
      }
    });
    setNumberInCard(data);
  }, [peopleRecords]);

  const fetchUnitList = async () => {
    const unitList = await axios.get("/unit");
    setUnitList(unitList.data.data);
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/people/${unit_id}`
      );
      console.log(res.data.data);
      setPersonRecords(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const handleSelectChange = (unid_id: number) => {
    setCurrentUnitId(unid_id);
    fetchPeopleByUnitId(unid_id);
  };

  const onDetailClick = async (personId: number) => {
    setIsModalOpen(true);
    const personRecord = await axios.get("/people/person/" + personId);
    console.log("personRecordpersonRecordpersonRecord", personRecord.data.data);
    setPersonDetail(personRecord.data.data);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeDuplicateRecords = (person: PersonInfoInter) => {
    const uniqueRecords: PersonInfoInter[] = [];
    const uniqueProblems: Set<string> = new Set();
    // records数组已经是时间降序
    person.records?.forEach((record: RecordInter) => {
      if (!uniqueProblems.has((record as any).problem_id)) {
        uniqueRecords.push(record);
        uniqueProblems.add((record as any).problem_id);
      }
    });
    person.records = uniqueRecords;
    return person;
  };

  const columns: ColumnsType<PersonInfoInter> = [
    {
      title: "重要程度",
      dataIndex: "level",
      key: "level",
      width: 30,
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        getPersonLevel(a.records as RecordInter[]) -
        getPersonLevel(b.records as RecordInter[]),
      render: (_, person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        return (
          <div
            style={{
              width: "6vw",
              height: "5vh",
              borderRadius: "1vh",
              backgroundColor:
                level === 0 ? "green" : level === 1 ? "#E0A60F" : "red",
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
      title: "人员类型",
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
      title: "操作",
      dataIndex: "option",
      key: "option",
      render: (_, person) => (
        <Button
          onClick={() => {
            onDetailClick(person.id as number);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const NumbersOfCards = () => (
    <div className={style.flexcard} style={{ height: "30%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "10px",
        }}
      >
        <Select
          defaultValue={currentUnitId}
          placeholder="请选择单位"
          style={{ width: 120 }}
          onChange={handleSelectChange}
          options={unitList}
          fieldNames={{ label: "name", value: "id" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #bc0823, #f04646)",
          }}
        >
          红牌人数
          <div className={style.numberofpeople}>{numberInCard[0].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #E0A60F, #FFC50F)",
          }}
        >
          黄牌人数
          <div className={style.numberofpeople}>{numberInCard[1].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #039B0F, #2ED30F)",
          }}
        >
          绿牌人数
          <div className={style.numberofpeople}>{numberInCard[2].value}</div>
        </div>
      </div>
    </div>
  );

  const AdminSection = () => (
    <Flex gap="middle" vertical flex={1} style={{ height: "88vh" }}>
      <div
        className={style.flexcard}
        style={{ height: "100%", maxHeight: "88vh", paddingTop: "0.5vh" }}
      >
        <p className={style.summayText}>
          {dateFormat(new Date(), "yyyy-mm-dd", true)}
        </p>
        <p className={style.summayText}>目前大队共有重点人XX</p>
        <p className={style.summayText}>其中红牌XX、黄牌XX、绿牌XX</p>
        <p className={style.summayText}>干部XX、文职XX、战士XX</p>
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
      <div className={style.flexcard} style={{ height: "30%" }}>
        {/* <Bar unitId={currentUnitId}></Bar> */}
        <p className={style.summayText}>
          {dateFormat(new Date(), "yyyy-mm-dd", true)}
        </p>
        <p className={style.summayText}>XX单位编制人数XX</p>
        <p className={style.summayText}>在位人数XX</p>
        <p className={style.summayText}>重点人总数XX</p>
        <p className={style.summayText}>红牌人数XX，黄牌人数XX，绿牌人数XX</p>
        <p className={style.summayText}>干部人数XX，文职人数XX，战士人数XX</p>
      </div>
      <div
        className={style.flexcard}
        style={{ height: "70%", overflow: "auto" }}
      >
        {/* <Pie unitId={currentUnitId}></Pie> */}
        <p
          style={{
            fontSize: "1.2vw",
            textAlign: "center",
            fontWeight: 800,
            lineHeight: "1vw",
          }}
        >
          思想骨干队伍
        </p>
        <Flex vertical justify="space-between" gap="middle">
          <Flex vertical={false} flex={1} gap="middle">
            <img src={defaultAvatar} className={style.backboneAvatar}></img>
            <div>
              <p>姓名：XXX</p>
              <p>特点：有耐心，乐于助人</p>
            </div>
          </Flex>
          <Flex vertical={false} flex={1} gap="middle">
            <img src={defaultAvatar} className={style.backboneAvatar}></img>
            <div>
              <p>姓名：XXX</p>
              <p>特点：有耐心，乐于助人</p>
            </div>
          </Flex>
          <Flex vertical={false} flex={1} gap="middle">
            <img src={defaultAvatar} className={style.backboneAvatar}></img>
            <div>
              <p>姓名：XXX</p>
              <p>特点：有耐心，乐于助人</p>
            </div>
          </Flex>
          <Flex vertical={false} flex={1} gap="middle">
            <img src={defaultAvatar} className={style.backboneAvatar}></img>
            <div>
              <p>姓名：XXX</p>
              <p>特点：有耐心，乐于助人</p>
            </div>
          </Flex>
          <Flex vertical={false} flex={1} gap="middle">
            <img src={defaultAvatar} className={style.backboneAvatar}></img>
            <div>
              <p>姓名：XXX</p>
              <p>特点：有耐心，乐于助人</p>
            </div>
          </Flex>
        </Flex>
      </div>
    </Flex>
  );

  const DetailModal = () => (
    <Modal
      title="详情"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Flex vertical>
        <Flex flex={1} vertical={false}>
          <div>
            <img
              src={`http://localhost:3000/api/upload/avatar${personDetail.avatar}`}
              alt="Avatar"
              style={{ width: "15vw", height: "25vh", marginRight: "2vw" }}
            ></img>
          </div>
          <Flex vertical justify="space-around">
            <p>姓名: {personDetail.name}</p>
            <p>婚姻状况: {personDetail.married === true ? "已婚" : "单身"}</p>
            <p>单位: {personDetail.unit?.name}</p>
            <p>负责人: {personDetail.responsible?.name}</p>
          </Flex>
        </Flex>
        <Flex flex={1} vertical>
          {removeDuplicateRecords(personDetail).records?.map(
            (record, index) => {
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
                    记录时间:
                    {dateformat(record.createdAt, "yyyy-mm-dd HH:MM:ss")}
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
            }
          )}
        </Flex>
      </Flex>
    </Modal>
  );
  return (
    <>
      <Flex gap="middle" vertical={false}>
        {userJWT.role === "admin" ? <AdminSection /> : <UserSection />}
        <Flex gap="middle" vertical flex={2}>
          <NumbersOfCards />
          <div
            className={style.flexcard}
            style={{ height: "70%", overflow: "auto" }}
          >
            <Table
              columns={columns}
              dataSource={peopleRecords}
              className={style.table}
            />
          </div>
        </Flex>
        <Flex gap="middle" vertical flex={1}>
          <div className={style.flexcard} style={{ height: "50%" }}>
            {/* <Line unitId={currentUnitId}></Line> */}
          </div>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Radar unitId={currentUnitId}></Radar>
          </div>
        </Flex>
      </Flex>
      <DetailModal />
    </>
  );
};
export default Summary;
