import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios from "axios";

interface RadarProps {
  unitId: number;
}

interface indicatorInter {
  name: string;
  max: number;
}

const Radar: FC<RadarProps> = ({ unitId }) => {
  const [problemList, setProblemList] = useState<ProblemInter[]>([]);
  const [value, setValue] = useState<number[]>([
    4200, 3000, 20000, 35000, 50000, 18000,
  ]);
  const [indicator, setIndicator] = useState<indicatorInter[]>([]);

  useEffect(() => {
    fetchProblemList();
  }, [unitId]);

  useEffect(() => {
    const value: number[] = [];
    const indicator: indicatorInter[] = [];
    problemList.forEach((problem) => {
      const ind: indicatorInter = {
        name: problem.name as string,
        max: 5,
      };
      indicator.push(ind);
      value.push(problem.record?.length || 0);
    });
    setValue(value);
    setIndicator(indicator);
  }, [problemList]);

  const fetchProblemList = async () => {
    try {
      const res = await axios.get(`/summary/radar/${unitId}`);
      setProblemList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const radar = () => ({
    radar: {
      // indicator和value不能为空数组，否则会报错“Cannot read properties of undefined (reading 'push')”
      indicator:
        indicator.length > 0
          ? indicator
          : [
              { name: "Sales", max: 6500 },
              { name: "Administration", max: 16000 },
              { name: "Information Technology", max: 30000 },
              { name: "Customer Support", max: 38000 },
              { name: "Development", max: 52000 },
              { name: "Marketing", max: 25000 },
            ],
    },

    series: [
      {
        name: "Proportion",
        type: "radar",
        data: [
          {
            value: value,
            name: "人数",
          },
        ],
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
        各类问题人数占比图
      </p>
      <ReactECharts
        option={radar()}
        style={{ transform: "translateY(10%)" }}
      ></ReactECharts>
    </>
  );
};

export default Radar;
