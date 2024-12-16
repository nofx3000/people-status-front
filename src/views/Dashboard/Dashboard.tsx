import React, { useRef, useEffect, useState } from "react";
import { Card, Row, Col, message, notification, Flex } from "antd";
import { toJS } from "mobx";
import { ArrowRightOutlined } from "@ant-design/icons";
import store from "../../mobx_store/store";
import styles from "./Dashboard.module.scss";
import Radar from "../../components/Charts/Radar";
import Line from "../../components/Charts/Line";
import VerticalBar from "../../components/Charts/VerticalBar";
import NumbersOfCards from "./NumbersOfCards";
import DutyCorner from "./DutyCorner";
import InfoCenter from "./InfoCenter";

interface detailModalRefInteface {
  setPersonId: (personId: number) => void;
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void;
}

interface tableModalRefInterface {
  setIsTableModalOpen: (isOpen: boolean) => void;
}

export default function Dashboard() {
  const detailModalRef = useRef<detailModalRefInteface>(null);
  const tableModalRef = useRef<tableModalRefInterface>(null);
  // const [api, contextHolder] = notification.useNotification({
  //   stack: true
  //     ? {
  //         threshold: 3,
  //       }
  //     : false,
  // });

  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentUnitId, setCurrentUnitId] = useState<number>(
    userJWT.unit_id as number
  );




  // useEffect(() => {
  //   if (userJWT.role !== "admin") return;
  //   const updates = toJS(store.updates);
  //   if (updates.length > 0) {
  //     updates.forEach(handleOpenNotification);
  //   }
  // }, [store.updates, userJWT.role]);

  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT as UserInfoInter);
    setCurrentUnitId((userJWT as UserInfoInter).unit_id as number);
    return userJWT;
  };

  useEffect(() => {
    fetchUserJWT();
  }, []);




  // const handleOpenNotification = (record: RecordInter) => {
  //   if (
  //     !record ||
  //     !record.record_Developments ||
  //     record.record_Developments.length === 0
  //   )
  //     return;
  //   api.open({
  //     message: (
  //       <p>
  //         {record.record_Developments && record.record_Developments?.length > 1
  //           ? `变化情况`
  //           : `新增情况`}
  //       </p>
  //     ),
  //     description: NotificationDescription(record),
  //     duration: null,
  //     onClose: () => {
  //       store.deleteUpdatedRecord(record.id as number);
  //     },
  //   });
  // };

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
    <div className={styles.dashboard}>
      <Row gutter={[24, 24]} className={styles.contentRow}>
        <Col span={7} className={styles.sideColumn}>
          <Row className={styles.sideRow}>
            <Col span={24} style={{ height: "30vh", paddingBottom: 12 }}>
              <div className={`${styles.moduleWrapper}`}>
                <div className={styles.moduleTitleWrapper}>
                  <img
                    src="/GIF动效 (22).png"
                    alt="title-effect"
                    className={styles.moduleTitleImage}
                  />
                  <span className={styles.moduleTitleText}>总览</span>
                </div>
                <div className={styles.moduleContent}>
                  <div className={styles.moduleHalf}>
                    <NumbersOfCards
                      userJWT={userJWT}
                      currentUnitId={currentUnitId}
                      handleChangeCurrentUnitId={handleChangeCurrentUnitId}
                      openTableModal={openTableModal}
                    />
                  </div>
                  {/* <div className={styles.moduleHalf}>
                                        <TodaySummary currentUnitId={1} />
                                    </div> */}
                </div>
              </div>
            </Col>
            <Col span={24} style={{ height: "60vh", paddingTop: 12 }}>
              <div className={`${styles.moduleWrapper}`}>
                <div className={styles.moduleTitleWrapper}>
                  <img
                    src="/GIF动效 (22).png"
                    alt="title-effect"
                    className={styles.moduleTitleImage}
                  />
                  <span className={styles.moduleTitleText}>
                    各单位问题人员数量图
                  </span>
                </div>
                <div className={styles.chartContainer}>
                  <VerticalBar />
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={10}>
          <Row className={styles.centerRow}>
            <Col span={24} style={{ height: "60vh", paddingBottom: 12 }}>
              <InfoCenter />
            </Col>
            <Col span={24} style={{ height: "30vh", paddingTop: 12 }}>
              <div className={`${styles.moduleWrapper}`}>
                <div className={styles.moduleTitleWrapper}>
                  <img
                    src="/GIF动效 (22).png"
                    alt="title-effect"
                    className={styles.moduleTitleImage}
                  />
                  <span className={styles.moduleTitleText}>
                    法律及心理辅导专家
                  </span>
                </div>
                {/* 中间下部模块内容 */}
                <DutyCorner />
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={7} className={styles.sideColumn}>
          <Row className={styles.sideRow}>
            <Col span={24} style={{ height: "45vh", paddingBottom: 12 }}>
              <div className={`${styles.moduleWrapper}`}>
                <div className={styles.moduleTitleWrapper}>
                  <img
                    src="/GIF动效 (22).png"
                    alt="title-effect"
                    className={styles.moduleTitleImage}
                  />
                  <span className={styles.moduleTitleText}>
                    问题数量变化趋势图
                  </span>
                </div>
                <Line unitId={currentUnitId}></Line>
              </div>
            </Col>
            <Col span={24} style={{ height: "45vh", paddingTop: 12 }}>
              <div className={`${styles.moduleWrapper}`}>
                <div className={styles.moduleTitleWrapper}>
                  <img
                    src="/GIF动效 (22).png"
                    alt="title-effect"
                    className={styles.moduleTitleImage}
                  />
                  <span className={styles.moduleTitleText}>
                    各类问题人数环比图
                  </span>
                </div>
                {currentUnitId !== undefined && <Radar unitId={currentUnitId}></Radar>}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
