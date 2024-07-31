import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  message,
  DatePicker,
  Select,
  Table,
  Modal,
  Button,
  Flex,
} from "antd";
import dateformat from "dateformat";
import ReactECharts from "echarts-for-react"; // Import ECharts
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, CaretRightOutlined } from "@ant-design/icons";
import type { MenuProps, DatePickerProps } from "antd";
import style from "./summary.module.scss";
import dayjs from "dayjs";
import axios from "axios";
import Bar from "../../components/Charts/Bar";
import Line from "../../components/Charts/Line";
import Pie from "../../components/Charts/Pie";
import Radar from "../../components/Charts/Radar";

const Summary: React.FC = () => {
  const [unitList, setUnitList] = useState<UnitInter[]>([]);
  const [currentUnitId, setCurrentUnitId] = useState<number>(1);
  const [personDetail, setPersonDetail] = useState<PersonInfoInter>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);

  useEffect(() => {
    fetchUnitList();
  }, []);

  const fetchUnitList = async () => {
    const unitList = await axios.get("/unit");
    setUnitList(unitList.data.data);
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

  const handleSelectChange = (unid_id: number) => {
    setCurrentUnitId(unid_id);
    fetchPeopleRecordsByUnitId(unid_id);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
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

  const getLevel = (person: PersonInfoInter) => {
    let max = -Infinity;
    person.records?.forEach((record) => {
      if ((record.risk_level as number) > max) {
        max = record.risk_level as number;
      }
    });
    return max;
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
      render: (_, person) => {
        const level = getLevel(person);
        return (
          <div
            style={{
              width: "5vw",
              height: "5vh",
              borderRadius: "1vh",
              backgroundColor:
                level === 1 ? "#E0A60F" : level === 2 ? "red" : "green",
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

  return (
    <>
      <Flex gap="middle" vertical={false}>
        <Flex
          gap="middle"
          vertical
          flex={1}
          justify="space-between"
          align="space-between"
          style={{ height: "88vh" }}
        >
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Bar unitId={currentUnitId}></Bar>
          </div>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Pie unitId={currentUnitId}></Pie>
          </div>
        </Flex>
        <Flex gap="middle" vertical flex={2}>
          <div className={style.flexcard} style={{ height: "30%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginBottom: "10px",
              }}
            >
              <Select
                // defaultValue="lucy"
                placeholder="请选择单位"
                style={{ width: 120 }}
                onChange={handleSelectChange}
                options={unitList}
                fieldNames={{ label: "name", value: "id" }}
              />
              {/* <DatePicker
                onChange={onDateChange}
                picker="month"
                placeholder="请选择月份"
                defaultValue={dayjs(new Date())}
              /> */}
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
                <div className={style.numberofpeople}>3</div>
              </div>
              <div
                className={style.numbercard}
                style={{
                  background: "linear-gradient(to right, #E0A60F, #FFC50F)",
                }}
              >
                黄牌人数
                <div className={style.numberofpeople}>3</div>
              </div>
              <div
                className={style.numbercard}
                style={{
                  background: "linear-gradient(to right, #039B0F, #2ED30F)",
                }}
              >
                绿牌人数
                <div className={style.numberofpeople}>3</div>
              </div>
            </div>
          </div>
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
      <Modal
        title="Basic Modal"
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
                style={{ width: "15vw", height: "25vh", marginRight: "5vw" }}
              ></img>
            </div>
            <Flex vertical justify="space-around">
              <p>姓名: {personDetail.name}</p>
              <p>婚姻状况: {personDetail.married === true ? "已婚" : "单身"}</p>
              <p>单位: {personDetail.unit?.name}</p>
            </Flex>
          </Flex>
          <Flex flex={1} vertical>
            {removeDuplicateRecords(personDetail).records?.map(
              (record, index) => {
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
                      记录时间:
                      {dateformat(record.createdAt, "yyyy-mm-dd HH:MM:ss")}
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
                    <p
                      style={{ marginRight: 5, marginTop: 0, marginBottom: 0 }}
                    >
                      帮带措施:{record.measure}
                    </p>
                    <span style={{ marginRight: 5 }}>
                      责任人:{record.responsible?.name}
                    </span>
                    <span style={{ marginRight: 5 }}>
                      备注:{record.comment}
                    </span>
                  </div>
                );
              }
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default Summary;
