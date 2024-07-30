import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios from "axios";

interface RadarProps {
  unitId: number;
}

const Radar: FC<RadarProps> = ({ unitId }) => {
  const [problemList, setProblemList] = useState<ProblemInter[]>([]);
  const [value, setValue] = useState<number[]>([]);
  const [indicator, setIndicator] = useState<any[]>([]);

  useEffect(() => {
    fetchProblemList();
  }, [unitId]);

  useEffect(() => {
    const value: number[] = [];
    const indicator: any[] = [];
    problemList.forEach((problem) => {
      const ind = {
        name: problem.name,
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
    title: {
      text: "Basic Radar Chart",
    },
    legend: {
      data: ["Allocated Budget", "Actual Spending"],
    },
    radar: {
      // shape: 'circle',
      indicator: indicator,
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: value,
            name: "Allocated Budget",
          },
        ],
      },
    ],
  });
  return <ReactECharts option={radar()}></ReactECharts>;
};

export default Radar;
