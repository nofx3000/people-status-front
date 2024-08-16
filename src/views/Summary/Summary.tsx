import React, { useState, useEffect } from "react";
import { message, Select, Table, Modal, Button, Flex, Statistic } from "antd";
import { toJS } from "mobx";
import dateformat from "dateformat";
import store from "../../mobx_store/store";
import type { ColumnsType } from "antd/es/table";
import { CaretRightOutlined } from "@ant-design/icons";
import style from "./summary.module.scss";
import dateFormat from "dateformat";
import axios from "axios";
import Radar from "../../components/Charts/Radar";
import Line from "../../components/Charts/Line";
import VerticalBar from "../../components/Charts/VerticalBar";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import getRecordLevel from "../../utils/GetRecordLevel";
import formatCatagory from "../../utils/FormatCatagory";
import defaultAvatar from "../../images/avatar.jpeg";

const Summary: React.FC = () => {
  const [unitList, setUnitList] = useState<UnitInter[]>([]);
  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );
  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentUnitId, setCurrentUnitId] = useState<number>(
    userJWT.unit_id as number
  );
  const [personDetail, setPersonDetail] = useState<PersonInfoInter>({});
  const [responsibleDetail, setResponsibleDetail] = useState<ResponsibleInter>(
    {}
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const [numberInCard, setNumberInCard] = useState<any[]>([0, 0, 0]);
  const [catagoryInCard, setCatagoryInCard] = useState<any[]>([0, 0, 0]);

  useEffect(() => {
    fetchUserJWT();
    fetchUnitList();
  }, []);

  useEffect(() => {
    fetchPeopleByUnitId(currentUnitId);
    fetchResponsibleByUnitId(currentUnitId);
  }, [currentUnitId]);

  useEffect(() => {
    countNumberInCard(peopleRecords);
    countCatagoryInCard(peopleRecords);
  }, [peopleRecords]);

  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    setCurrentUnitId((userJWT as UserInfoInter).unit_id as number);
    return userJWT;
  };

  const fetchUnitList = async () => {
    const unitList = await axios.get("/unit");
    const _unitList = [{ id: 0, name: "大队总览" }, ...unitList.data.data];
    setUnitList(_unitList);
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/people/${unit_id}`
      );
      setPersonRecords(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const fetchResponsibleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/responsible/unit/${unit_id}`
      );
      setResponsibleList(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const handleSelectChange = (unid_id: number) => {
    setCurrentUnitId(unid_id);
    fetchPeopleByUnitId(unid_id);
  };

  const onDetailClick = async (personId: number) => {
    setIsDetailModalOpen(true);
    const personRecord = await axios.get("/people/person/" + personId);
    setPersonDetail(personRecord.data.data);
  };

  const openResponsibleModal = (responsible: ResponsibleInter) => {
    setIsResponsibleModalOpen(true);
    setResponsibleDetail(responsible);
  };

  const removeDuplicateRecords = (person: PersonInfoInter) => {
    const uniqueRecords: PersonInfoInter[] = [];
    const uniqueProblems: Set<string> = new Set();
    // records数组已经是时间降序
    person.records &&
      person.records.forEach((record: RecordInter) => {
        if (!uniqueProblems.has((record as any).problem_id)) {
          uniqueRecords.push(record);
          uniqueProblems.add((record as any).problem_id);
        }
      });
    person.records = uniqueRecords;
    return person;
  };

  const countNumberInCard = (peopleRecords: PersonInfoInter[]) => {
    const data: any[] = [
      { name: "急迫", value: 0 },
      { name: "重要", value: 0 },
      { name: "一般", value: 0 },
    ];
    peopleRecords &&
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
  };

  const countCatagoryInCard = (peopleRecords: PersonInfoInter[]) => {
    const data: any[] = [
      { name: "干部", value: 0 },
      { name: "文职", value: 0 },
      { name: "战士", value: 0 },
    ];
    peopleRecords &&
      peopleRecords.forEach((person) => {
        if (person.catagory === 2) {
          data[2].value++;
        } else if (person.catagory === 1) {
          data[1].value++;
        } else {
          data[0].value++;
        }
      });
    setCatagoryInCard(data);
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
              <p style={{ lineHeight: "2vh", marginBottom: 1, marginTop: 1 }}>
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
          disabled={userJWT.role !== "admin"}
          defaultValue={currentUnitId}
          placeholder="请选择单位"
          style={{ width: 120 }}
          onChange={handleSelectChange}
          options={unitList}
          fieldNames={{ label: "name", value: "id" }}
        ></Select>
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
        // style={{ height: "100%", maxHeight: "88vh", paddingTop: "0.5vh" }}
        style={{ height: "30%" }}
      >
        <p className={style.summayText}>
          {dateFormat(new Date(), "yyyy-mm-dd", true)}
        </p>
        <Flex vertical={false} justify="space-around">
          <Flex vertical flex={1} align="center">
            <Statistic
              title="重点人总数"
              value={9}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
            <Statistic
              title="问题总数"
              value={17}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
          </Flex>
          <div style={{ borderRight: "2px solid #f0f0f0" }}></div>
          <Flex vertical flex={1} align="center">
            <Statistic
              title="挂牌人数"
              value={9}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
            <Statistic
              title="摘牌人数"
              value={0}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
          </Flex>
        </Flex>
      </div>
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
      <div className={style.flexcard} style={{ height: "30%" }}>
        {/* <Bar unitId={currentUnitId}></Bar> */}
        <p className={style.summayText}>
          {dateFormat(new Date(), "yyyy-mm-dd", true)}
        </p>
        <Flex vertical={false} justify="space-around">
          <Flex vertical flex={1} align="center">
            <Statistic
              title="重点人总数"
              value={9}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
            <Statistic
              title="摘牌人数"
              value={2}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
          </Flex>
          <div style={{ borderRight: "2px solid #f0f0f0" }}></div>
          <Flex vertical flex={1} align="center">
            <Statistic
              title="留存问题数"
              value={17}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
            <Statistic
              title="解决问题数"
              value={0}
              valueStyle={{
                color: "#007DFA",
                fontSize: "2.5vw",
                fontWeight: "600",
                lineHeight: "3vw",
                textAlign: "center",
              }}
            />
          </Flex>
        </Flex>
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
          骨干队伍
        </p>
        <Flex vertical justify="space-between" gap="middle">
          {responsibleList.map((responsible) => {
            return (
              <Flex vertical={false} flex={1} gap="middle" key={responsible.id}>
                <img
                  src={
                    responsible.avatar
                      ? `http://localhost:3000/api/upload/avatar${responsible.avatar}`
                      : defaultAvatar
                  }
                  className={style.backboneAvatar}
                ></img>
                <div>
                  <p>姓名：{responsible.name}</p>
                  <p>特点：{responsible.description}</p>
                  <Button
                    onClick={() => {
                      openResponsibleModal(responsible);
                    }}
                  >
                    查看帮带对象
                  </Button>
                </div>
              </Flex>
            );
          })}
        </Flex>
      </div>
    </Flex>
  );

  const ResponsibleModal = () => (
    <Modal
      title="帮带对象"
      open={isResponsibleModalOpen}
      onOk={() => {
        setIsResponsibleModalOpen(false);
      }}
      onCancel={() => {
        setIsResponsibleModalOpen(false);
      }}
    >
      <Flex vertical>
        {responsibleDetail.people?.map((person) => (
          <Flex key={person.id}>
            <div style={{ marginRight: "2vw" }}>
              <img
                src={
                  person.avatar
                    ? `http://localhost:3000/api/upload/avatar${person.avatar}`
                    : defaultAvatar
                }
                alt="Avatar"
                style={{ width: "8vw", height: "15vh" }}
              ></img>
            </div>
            <div>
              <p>姓名:{person.name}</p>
              <p>类别:{formatCatagory(person.catagory as number)}</p>
              <p>婚姻状况：{person.married ? "是" : "否"}</p>
            </div>
          </Flex>
        ))}
      </Flex>
    </Modal>
  );

  const DetailModal = () => (
    <Modal
      title="详情"
      open={isDetailModalOpen}
      onOk={() => {
        setIsDetailModalOpen(false);
      }}
      onCancel={() => {
        setIsDetailModalOpen(false);
      }}
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
            <Line unitId={currentUnitId}></Line>
          </div>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Radar unitId={currentUnitId}></Radar>
          </div>
        </Flex>
      </Flex>
      <DetailModal />
      <ResponsibleModal />
    </>
  );
};
export default Summary;
