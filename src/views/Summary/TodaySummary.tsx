import { useState, useEffect } from "react";
import dateFormat from "dateformat";
import style from "./summary.module.scss";
import axios from "axios";
import { message, Flex, Statistic } from "antd";

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
    const res = await axios.get(`/record/unit/${currentUnitId}`);
    if (res.status == 200) {
      setUnsolvedRecords(res.data.data);
    } else {
      message.error("获取留存问题数失败");
    }
  };
  const fetchSolvedRecords = async (currentUnitId: number) => {
    const res = await axios.get(`/record/unit/${currentUnitId}/solved`);
    if (res.status == 200) {
      setSolvedRecords(res.data.data);
    } else {
      message.error("获取解决问题数失败");
    }
  };

  const fetchPeopleByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/people/${unit_id}`
      );
      setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
      setPeopleSolved(res.data.data.peopleSolved);
      console.log(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  return (
    <div className={style.flexcard} style={{ height: "30%" }}>
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
    </div>
  );
};

export default TodaySummary;
