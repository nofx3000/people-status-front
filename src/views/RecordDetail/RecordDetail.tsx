import { useEffect, useState } from "react";
import { Card, Button, Flex, message } from "antd";
import RecordForm from "../../components/RecordForm/RecordForm";
import RecordDevelopment from "../../components/RecordDevelopment/RecordDevelopment";
import { useParams } from "react-router-dom";
import getLevel from "../../utils/GetPersonRiskLevel";
import formatCatagory from "../../utils/FormatCatagory";
import { useNavigate } from "react-router-dom";
import { personApi } from "../../api";

export default function RecordDetail() {
  const { person_id: string_person_id } = useParams();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [personInfo, setPersonInfo] = useState<PersonInfoInter | null>(null);
  const person_id = string_person_id ? Number(string_person_id) : 0;

  useEffect(() => {
    person_id && fetchPersonInfo(person_id);
  }, [person_id]);

  const fetchPersonInfo = async (id: number) => {
    try {
      const res = await personApi.getPersonInfo(id);
      if (res.status === 200) {
        setPersonInfo(res.data.data);
      }
    } catch (error) {
      message.error("获取人员信息失败");
    }
  };

  const handlerGoBack = () => {
    navigate(-1);
  };

  const onAddButtonClick = () => {
    setIsAdding(true);
  };

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

  const RecordList = () => {
    if (!personInfo) return <p>加载中...</p>;
    if (!personInfo.records)
      return <p>尚未添加问题，请点击上方按钮尽快添加！</p>;
    if (personInfo.records.length === 0)
      return <p>尚未添加问题，请点击上方按钮尽快添加！</p>;
    return (
      <div>
        {personInfo.records.map((record, index) => (
          <RecordDevelopment
            fetchPersonInfo={fetchPersonInfo}
            record={record}
            key={index}
          ></RecordDevelopment>
        ))}
      </div>
    );
  };

  return (
    <>
      <Flex vertical>
        <Button style={{ width: "10vw" }} onClick={handlerGoBack}>
          🔙返回上一页
        </Button>
        <Flex>
          <BasicInfo />
          <Responsible />
        </Flex>
        <AddRecord />
        <div>
          <RecordList />
        </div>
      </Flex>
    </>
  );
}
