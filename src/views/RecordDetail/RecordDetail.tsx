import { useEffect, useState } from "react";
import { Card, Button, Flex, message } from "antd";
import RecordForm from "../../components/RecordForm/RecordForm";
import RecordDevelopment from "../../components/RecordDevelopment/RecordDevelopment";
import { useParams } from "react-router-dom";
import getLevel from "../../utils/GetPersonRiskLevel";
import formatCatagory from "../../utils/FormatCatagory";
import { useNavigate } from "react-router-dom";
import { personApi } from "../../api";
import styles from "./recorddetail.module.scss";
import { BASR_API_URL } from "../../constant";

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
      <div className={styles.moduleWrapper}>
        <div className={styles.moduleTitleWrapper}>
          <img
            src="/GIF动效 (22).png"
            alt="title-effect"
            className={styles.moduleTitleImage}
          />
          <span className={styles.moduleTitleText}>基本情况</span>
        </div>
        <div className={styles.moduleContent}>
          <Flex gap={30}>
            <img
              src={`${BASR_API_URL}/upload/avatar${personInfo.avatar}`}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <p>姓名：{personInfo.name}</p>
              <p>类别：{formatCatagory(personInfo.catagory as number)}</p>
              <p>婚姻状况：{personInfo.married ? "是" : "否"}</p>
              <div
                className={styles.riskLevel}
                style={{
                  backgroundColor:
                    level === 1 ? "#E0A60F" : level === 2 ? "red" : "green",
                }}
              />
            </div>
          </Flex>
        </div>
      </div>
    );
  };

  const Responsible = () => {
    if (!personInfo) return <p>loading...</p>;
    return (
      <div className={styles.moduleWrapper}>
        <div className={styles.moduleTitleWrapper}>
          <img
            src="/GIF动效 (22).png"
            alt="title-effect"
            className={styles.moduleTitleImage}
          />
          <span className={styles.moduleTitleText}>负责人</span>
        </div>
        <div className={styles.moduleContent}>
          {personInfo.responsible ? (
            <Flex gap={30}>
              <img
                src={`${BASR_API_URL}/upload/avatar${personInfo.responsible?.avatar}`}
                className={styles.avatar}
              />
              <div className={styles.info}>
                <p>姓名：{personInfo.responsible?.name}</p>
                <p>特点：{personInfo.responsible?.description}</p>
              </div>
            </Flex>
          ) : (
            <p>尚未分配负责人，请尽快分配</p>
          )}
        </div>
      </div>
    );
  };

  const AddRecord = () => (
    <>
      {isAdding ? null : (
        <Button
          type="primary"
          onClick={onAddButtonClick}
          className={styles.addButton}
        >
          添加问题
        </Button>
      )}
      {isAdding ? (
        <Card className={styles.formCard}>
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
      <div className={styles.moduleWrapper}>
        <div className={styles.moduleTitleWrapper}>
          <img
            src="/GIF动效 (22).png"
            alt="title-effect"
            className={styles.moduleTitleImage}
          />
          <span className={styles.moduleTitleText}>问题记录</span>
        </div>
        <div className={styles.moduleContent}>
          <div>
            {personInfo.records.map((record, index) => (
              <RecordDevelopment
                fetchPersonInfo={fetchPersonInfo}
                record={record}
                key={index}
              ></RecordDevelopment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Flex vertical>
      <Button className={styles.backButton} onClick={handlerGoBack}>
        🔙返回上一页
      </Button>

      <Flex gap={24} justify="space-between">
        <div style={{ width: '20vw' }}>
          <BasicInfo />
        </div>

        <div style={{ width: '20vw' }}>
          <Responsible />
        </div>
      </Flex>

      <AddRecord />

      <RecordList />
    </Flex>
  );
}
