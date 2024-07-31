import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios from "axios";
import { message } from "antd";

interface BarProps {
  unitId: number;
}

const Bar: FC<BarProps> = ({ unitId }) => {
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const [emergency, setEmergency] = useState<number[]>([]);
  const [important, setImportant] = useState<number[]>([]);
  const [normal, setNormal] = useState<number[]>([]);

  useEffect(() => {
    fetchPeopleRecordsByUnitId(unitId);
  }, [unitId]);

  useEffect(() => {
    const emergency = [0, 0, 0];
    const important = [0, 0, 0];
    const normal = [0, 0, 0];
    peopleRecords.forEach((person) => {
      const level = getLevel(person);
      if (getLevel(person) === 2) {
        emergency[person.catagory as number]++;
      } else if (level === 1) {
        important[person.catagory as number]++;
      } else {
        normal[person.catagory as number]++;
      }
    });
    setEmergency(emergency);
    setImportant(important);
    setNormal(normal);
  }, [peopleRecords]);

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

  const getLevel = (person: PersonInfoInter) => {
    let max = -Infinity;
    person.records?.forEach((record) => {
      if ((record.risk_level as number) > max) {
        max = record.risk_level as number;
      }
    });
    return max;
  };

  const bar = () => ({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["急迫", "重要", "一般"],
    },

    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        data: ["干部", "战士", "文职"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "急迫",
        type: "bar",
        barGap: 0,
        emphasis: {
          focus: "series",
        },
        data: emergency,
        itemStyle: {
          color: "#c23531",
        },
      },
      {
        name: "重要",
        type: "bar",
        emphasis: {
          focus: "series",
        },
        data: important,
        itemStyle: {
          color: "#E0A60F",
        },
      },
      {
        name: "一般",
        type: "bar",
        emphasis: {
          focus: "series",
        },
        data: normal,
        itemStyle: {
          color: "#039B0F",
        },
      },
    ],
  });
  return (
    <>
      <p
        style={{
          fontSize: "1.2vw",
          textAlign: "center",
          fontWeight: 800,
          lineHeight: "1vw",
          transform: "translate(50%)",
          position: "absolute",
        }}
      >
        各类人员问题数量图
      </p>
      <ReactECharts
        option={bar()}
        style={{ transform: "translateY(15%)" }}
      ></ReactECharts>
    </>
  );
};

export default Bar;
