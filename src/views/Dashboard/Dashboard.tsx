import { useRef, useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import styles from "./Dashboard.module.scss";
import Radar from "../../components/Charts/Radar";
import Line from "../../components/Charts/Line";
import VerticalBar from "../../components/Charts/VerticalBar";
import NumbersOfCards from "./NumbersOfCards";
import DutyCorner from "./DutyCorner";
import InfoCenter from "./InfoCenter";
import ResponsibleList from "./ResponsibleList";
import TableModal from "./TableModal";
import { personApi } from "../../api/modules/person";

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

  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentUnitId, setCurrentUnitId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [peopleWtihUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);

  const fetchUserJWT = async (): Promise<any> => {
    try {
      await store.getUserJWT();
      const userJWT = toJS(store.userInfo) as UserInfoInter;
      setUserJWT(userJWT);
      // 修复：admin用户的unit_id为0时也应该设置currentUnitId
      if (userJWT.unit_id !== undefined && userJWT.unit_id !== null) {
        setCurrentUnitId(userJWT.unit_id);
      }
      return userJWT;
    } catch (err) {
      message.error("获取用户信息失败");
      return null;
    }
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userJWT = await fetchUserJWT();
        // 修复：admin用户的unit_id为0时也应该获取数据
        if (userJWT && (userJWT.unit_id !== undefined && userJWT.unit_id !== null)) {
          await fetchPeopleByUnitId(userJWT.unit_id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangeCurrentUnitId = (unit_id: number) => {
    setCurrentUnitId(unit_id);
  };

  const onDetailClick = async (personId: number) => {
    if (detailModalRef.current) {
      detailModalRef.current.setPersonId(personId);
      detailModalRef.current.setIsDetailModalOpen(true);
    }
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
                    {currentUnitId !== undefined ? (
                      <NumbersOfCards
                        peopleWtihUnsolvedRecords={peopleWtihUnsolvedRecords}
                        userJWT={userJWT}
                        currentUnitId={currentUnitId}
                        handleChangeCurrentUnitId={handleChangeCurrentUnitId}
                        openTableModal={openTableModal}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
                    )}
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
                  {userJWT.role === "admin" ? (
                    "各单位问题人员数量图"
                  ) : (
                    "骨干队伍"
                  )}
                    
                  </span>
                </div>
                <div className={styles.chartContainer}>
                  {userJWT.role === "admin" ? (
                    <VerticalBar />
                  ) : (
                    <div style={{marginLeft: "2vw", height: "100%", overflow: "auto"}}>
                      {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
                      ) : currentUnitId !== undefined ? (
                        <ResponsibleList currentUnitId={currentUnitId}/>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>暂无数据</div>
                      )}
                    </div>
                  )}
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
                {currentUnitId !== undefined ? (
                  <Line unitId={currentUnitId}></Line>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
                )}
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
                {currentUnitId !== undefined ? (
                  <Radar unitId={currentUnitId}></Radar>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <TableModal
        ref={tableModalRef}
        peopleWtihUnsolvedRecords={peopleWtihUnsolvedRecords}
        onDetailClick={onDetailClick}
      />
    </div>
  );
}
