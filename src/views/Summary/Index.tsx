import React, { useState, useEffect, useRef } from "react";
import { message, notification, Flex } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import style from "./summary.module.scss";
import Radar from "../../components/Charts/Radar";
import Line from "../../components/Charts/Line";
import VerticalBar from "../../components/Charts/VerticalBar";
import TodaySummary from "./TodaySummary";
import DetailModal from "./DetailModal";
import ResponsibleList from "./ResponsibleList";
import NumbersOfCards from "./NumbersOfCards";
import DutyCorner from "./DutyCorner";
import LawAndRules from "./LawAndRules";
import { personApi } from "../../api";
import TableModal from "./TableModal";

interface detailModalRefInteface {
  setPersonId: (personId: number) => void;
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void;
}

interface tableModalRefInterface {
  setIsTableModalOpen: (isOpen: boolean) => void;
}

const Summary: React.FC = () => {
  const detailModalRef = useRef<detailModalRefInteface>(null);
  const tableModalRef = useRef<tableModalRefInterface>(null);
  const [api, contextHolder] = notification.useNotification({
    stack: true
      ? {
          threshold: 3,
        }
      : false,
  });

  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentUnitId, setCurrentUnitId] = useState<number>(
    userJWT.unit_id !== undefined ? userJWT.unit_id as number : 0
  );
  const [peopleWtihUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const userJWT = await fetchUserJWT();
      // 修复：admin用户的unit_id为0时也应该获取数据
      if (userJWT && (userJWT.unit_id !== undefined && userJWT.unit_id !== null)) {
        await fetchPeopleByUnitId(userJWT.unit_id);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userJWT.role !== "admin") return;
    const updates = toJS(store.updates);
    if (updates.length > 0) {
      updates.forEach(handleOpenNotification);
    }
  }, [store.updates, userJWT.role]);

  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT as UserInfoInter);
    setCurrentUnitId((userJWT as UserInfoInter).unit_id as number);
    return userJWT;
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await personApi.getPeopleByUnitId(unit_id);
      if (res.status === 200) {
        setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const handleOpenNotification = (record: RecordInter) => {
    if (
      !record ||
      !record.record_Developments ||
      record.record_Developments.length === 0
    )
      return;
    api.open({
      message: (
        <p>
          {record.record_Developments && record.record_Developments?.length > 1
            ? `变化情况`
            : `新增情况`}
        </p>
      ),
      description: NotificationDescription(record),
      duration: null,
      onClose: () => {
        store.deleteUpdatedRecord(record.id as number);
      },
    });
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

  const NotificationDescription = (record: RecordInter) => {
    const RecordDetail = () => {
      if (
        record.record_Developments &&
        record.record_Developments?.length === 1
      ) {
        const cur_level = record.record_Developments[0]?.risk_level;
        return (
          <div>
            <div
              style={{
                width: "50px",
                height: "20px",
                borderRadius: "1vh",
                backgroundColor:
                  cur_level === 0
                    ? "green"
                    : cur_level === 1
                    ? "#E0A60F"
                    : "#c23531",
              }}
            />
            <p>详情: {record.record_Developments[0]?.detail}</p>
            <p>措施: {record.record_Developments[0]?.measure}</p>
          </div>
        );
      } else if (
        record.record_Developments &&
        record.record_Developments?.length > 1
      ) {
        console.log(record.record_Developments);
        const cur =
          record.record_Developments[record.record_Developments.length - 1];
        const pre =
          record.record_Developments[record.record_Developments.length - 2];
        return (
          <Flex vertical={false} justify="space-between">
            <div style={{ width: "35%" }}>
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  borderRadius: "1vh",
                  backgroundColor:
                    pre.risk_level === 0
                      ? "green"
                      : pre.risk_level === 1
                      ? "#E0A60F"
                      : "#c23531",
                }}
              />
              <p>
                详情:{" "}
                {pre.detail && pre.detail.length > 30
                  ? `${pre.detail.slice(0, 30)}...`
                  : pre.detail}
              </p>
              <p>
                措施:{" "}
                {pre.measure && pre.measure.length > 30
                  ? `${pre.measure.slice(0, 30)}...`
                  : pre.measure}
              </p>
            </div>
            <ArrowRightOutlined style={{ fontSize: "3vh" }} />
            <div style={{ width: "35%" }}>
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  borderRadius: "1vh",
                  backgroundColor:
                    cur.risk_level === 0
                      ? "green"
                      : cur.risk_level === 1
                      ? "#E0A60F"
                      : "#c23531",
                }}
              />
              <p>
                详情:{" "}
                {cur.detail && cur.detail.length > 30
                  ? `${cur.detail.slice(0, 30)}...`
                  : cur.detail}
              </p>
              <p>
                措施:{" "}
                {cur.measure && cur.measure.length > 30
                  ? `${cur.measure.slice(0, 30)}...`
                  : cur.measure}
              </p>
            </div>
          </Flex>
        );
      }
    };

    return (
      <>
        <p>
          {record.record_Developments && record.record_Developments?.length > 1
            ? `${record.person?.name} 关于 ${record.problem?.name} 问题的情况变化`
            : `${record.person?.name} 新增了关于 ${record.problem?.name} 问题的情况`}
        </p>
        <p></p>
        {RecordDetail()}
      </>
    );
  };

  const openTableModal = () => {
    tableModalRef.current?.setIsTableModalOpen(true);
  };

  return (
    <>
      {contextHolder}
      <Flex gap="middle" vertical={false}>
        <Flex gap="middle" vertical flex={1} style={{ height: "90vh" }}>
          <div
            className={style.flexcard}
            style={{ height: "30vh", overflow: "auto" }}
          >
            <TodaySummary currentUnitId={currentUnitId} />
          </div>
          <div
            className={style.flexcard}
            style={{ height: "100%", overflow: "auto" }}
          >
            {userJWT.role === "admin" ? (
              <VerticalBar />
            ) : (
              <ResponsibleList currentUnitId={currentUnitId} />
            )}
          </div>
        </Flex>
        <Flex gap="middle" vertical flex={2} style={{ height: "90vh" }}>
          <div
            className={style.flexcard}
            style={{ height: "30vh", overflow: "auto" }}
          >
            <NumbersOfCards
              peopleWtihUnsolvedRecords={peopleWtihUnsolvedRecords}
              userJWT={userJWT}
              currentUnitId={currentUnitId}
              handleChangeCurrentUnitId={handleChangeCurrentUnitId}
              openTableModal={openTableModal}
            />
          </div>
          <div
            className={style.flexcard}
            style={{ height: "35%", overflow: "auto" }}
          >
            <p style={{ fontSize: "2vh", fontWeight: "500", margin: 0 }}>
              值班园地
            </p>
            <DutyCorner></DutyCorner>
          </div>
          <div
            className={style.flexcard}
            style={{ height: "35%", overflow: "auto" }}
          >
            <p style={{ fontSize: "2vh", fontWeight: "500", margin: 0 }}>
              法律法规
            </p>
            <LawAndRules></LawAndRules>
          </div>
        </Flex>
        <Flex gap="middle" vertical flex={1} style={{ height: "90vh" }}>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Line unitId={currentUnitId}></Line>
          </div>
          <div className={style.flexcard} style={{ height: "50%" }}>
            <Radar unitId={currentUnitId}></Radar>
          </div>
        </Flex>
      </Flex>
      <DetailModal ref={detailModalRef} />
      <TableModal
        ref={tableModalRef}
        peopleWtihUnsolvedRecords={peopleWtihUnsolvedRecords}
        onDetailClick={onDetailClick}
      />
    </>
  );
};
export default Summary;
