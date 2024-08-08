import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Flex } from "antd";
import RecordForm from "../../components/RecordForm/RecordForm";
import RecordDevelopment from "../../components/RecordDevelopment/RecordDevelopment";
import { useParams } from "react-router-dom";
import getLevel from "../../utils/GetPersonRiskLevel";

export default function RecordDetail() {
  const { person_id: string_person_id } = useParams();
  const person_id = string_person_id ? Number(string_person_id) : 0;
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [personInfo, setPersonInfo] = useState<PersonInfoInter | null>(null);

  useEffect(() => {
    person_id && fetchPersonInfo(person_id);
  }, []);

  const fetchPersonInfo = async (id: number) => {
    const res = await axios.get(`/people/person/${id}`);
    console.log(res);
    if (res.status === 200) {
      setPersonInfo(res.data.data);
    }
  };

  const onAddButtonClick = () => {
    setIsAdding(true);
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

  // const getLevel = (records: RecordInter[]) => {
  //   let max = 0;
  //   for (const record of records) {
  //     if (
  //       !record.record_Developments ||
  //       record.record_Developments.length === 0
  //     ) {
  //       continue;
  //     }
  //     const development =
  //       record.record_Developments as RecordDevelopmentInter[];
  //     if ((development[0].risk_level as number) > max) {
  //       max = development[0].risk_level as number;
  //     }
  //   }
  //   return max;
  // };

  const BasicInfo = () => {
    if (!personInfo) return <p>loading...</p>;

    const level = getLevel(personInfo.records as RecordInter[]);
    return (
      <div style={{ marginRight: "30vw" }}>
        <p>基本情况</p>
        <Flex gap={30}>
          <img
            src={`http://localhost:3000/api/upload/avatar${personInfo.avatar}`}
            style={{ height: "20vh", width: "18vh" }}
          ></img>
          <div>
            <p>姓名：{personInfo.name}</p>
            <p>类别：{formatCatagory(personInfo.catagory as number)}</p>
            <p>婚姻状况：{personInfo.married ? "是" : "否"}</p>
            <div
              style={{
                height: "3vh",
                width: "2vw",
                backgroundColor:
                  level === 1 ? "#E0A60F" : level === 2 ? "red" : "green",
              }}
            ></div>
          </div>
        </Flex>
      </div>
    );
  };

  const Responsible = () => {
    if (!personInfo) return <p>loading...</p>;
    return (
      <>
        {personInfo.responsible ? (
          <div>
            <p>负责人</p>
            <Flex gap={30}>
              <img
                src={`http://localhost:3000/api/upload/avatar${personInfo.responsible?.avatar}`}
                style={{ height: "20vh", width: "18vh" }}
              ></img>
              <div>
                <p>姓名：{personInfo.responsible?.name}</p>
                <p>特点：{personInfo.responsible?.description}</p>
              </div>
            </Flex>
          </div>
        ) : (
          <p>尚未分配负责人，请尽快分配</p>
        )}
      </>
    );
  };

  const AddRecord = () => (
    <>
      {isAdding ? null : (
        <Button
          type="primary"
          onClick={onAddButtonClick}
          style={{ marginTop: "2vh" }}
        >
          添加问题
        </Button>
      )}
      {isAdding ? (
        <Card style={{ width: "70vw", marginTop: "2vh" }}>
          <RecordForm
            fetchPersonInfo={fetchPersonInfo}
            setIsAdding={setIsAdding}
          />
        </Card>
      ) : null}
    </>
  );

  return (
    <>
      <Flex vertical>
        <Flex>
          <BasicInfo />
          <Responsible />
        </Flex>
        <AddRecord />
        <div>
          {personInfo &&
            personInfo.records?.map((record) => (
              <RecordDevelopment
                fetchPersonInfo={fetchPersonInfo}
                record={record}
                key={record.id}
              ></RecordDevelopment>
            ))}
        </div>
      </Flex>
    </>
  );
}
