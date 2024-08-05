import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios from "axios";
import { message } from "antd";

interface LineProps {
  unitId: number;
}

const Line: FC<LineProps> = ({ unitId }) => {
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const [data, setData] = useState<number[][]>([]);

  useEffect(() => {
    fetchPeopleRecordsByUnitId(unitId);
  }, [unitId]);

  useEffect(() => {
    const data = [
      new Array(months.length).fill(0),
      new Array(months.length).fill(0),
      new Array(months.length).fill(0),
    ];

    peopleRecords.forEach((person) => {
      person.records?.forEach((record) => {
        // 获取record的updatedAt所在月份和risk_level, 在data[risk_level][updatedAt所在月份-1]自增1
        const updatedAtMonth = new Date(record.updatedAt as string).getMonth();
        const riskLevel = record.risk_level as number;
        data[riskLevel][updatedAtMonth]++;
      });
    });
    setData(data);
    console.log("datadatadata", data);
  }, [peopleRecords]);

  const fetchPeopleRecordsByUnitId = async (unit_id: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/record/unit/nofix/${unit_id}`
      );
      console.log(res.data.data);
      setPersonRecords(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  //获取系统当前月份，并向months数组中push当前月份数量的元素，例如，如果现在是三月，则months数组为["一月","二月",""三月]
  const months: string[] = [];
  const currentMonth = new Date().getMonth() + 1;
  for (let i = 1; i <= currentMonth; i++) {
    months.push(`${i}月`);
  }

  const line = () => ({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: "15%",
      data: ["急迫", "重要", "一般"],
    },
    grid: {
      top: "30%",
      left: "3%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: months,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "急迫",
        type: "line",
        // stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: "#c23531",
        },
      },
      {
        name: "重要",
        type: "line",
        // stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: {
          color: "#E0A60F",
        },
      },
      {
        name: "一般",
        type: "line",
        // stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
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
        各类问题变化趋势图
      </p>
      <ReactECharts option={line()}></ReactECharts>
    </>
  );
};

export default Line;
