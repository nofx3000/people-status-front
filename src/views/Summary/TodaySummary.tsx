import { useState, useEffect } from "react";
import dateFormat from "dateformat";
import style from "./summary.module.scss";
import { message, Flex, Statistic } from "antd";
import { personApi, recordApi } from "../../api";

interface TodaySummaryInterface {
  currentUnitId: number;
}

const TodaySummary: React.FC<TodaySummaryInterface> = ({ currentUnitId }) => {
  const [peopleWtihUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);
  const [peopleSolved, setPeopleSolved] = useState<PersonInfoInter[]>([]);
  const [unsolvedRecords, setUnsolvedRecords] = useState<RecordInter[]>([]);
  const [solvedRecords, setSolvedRecords] = useState<RecordInter[]>([]);

  useEffect(() => {
    fetchPeopleByUnitId(currentUnitId);
    fetchUnsolvedRecordsByUnitId(currentUnitId);
    fetchSolvedRecords(currentUnitId);
  }, [currentUnitId]);

  const fetchUnsolvedRecordsByUnitId = async (currentUnitId: number) => {
    try {
      const res = await recordApi.getUnsolvedRecords(currentUnitId);
      if (res.status === 200) {
        setUnsolvedRecords(res.data.data);
      } else {
        message.error("获取留存问题数失败");
      }
    } catch (error) {
      message.error("获取留存问题数失败");
    }
  };

  const fetchSolvedRecords = async (currentUnitId: number) => {
    try {
      const res = await recordApi.getSolvedRecords(currentUnitId);
      if (res.status === 200) {
        setSolvedRecords(res.data.data);
      } else {
        message.error("获取解决问题数失败");
      }
    } catch (error) {
      message.error("获取解决问题数失败");
    }
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await personApi.getPeopleByUnitId(unit_id);
      if (res.status === 200) {
        setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
        setPeopleSolved(res.data.data.peopleSolved);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  return (
    <>
      <p className={style.summayText}>
        {dateFormat(new Date(), "yyyy-mm-dd", true)}
      </p>
      <Flex vertical={false} justify="space-around">
        <Flex vertical flex={1} align="center">
          <Statistic
            title="现有重点人数"
            value={
              peopleWtihUnsolvedRecords ? peopleWtihUnsolvedRecords.length : 0
            }
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
            value={peopleSolved ? peopleSolved.length : 0}
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
            value={unsolvedRecords.length}
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
            value={solvedRecords.length}
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
    </>
  );
};

export default TodaySummary;
