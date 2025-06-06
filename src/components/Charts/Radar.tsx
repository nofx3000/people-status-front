import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import { recordApi } from "../../api";

interface RadarProps {
  unitId: number;
}

interface indicatorInter {
  name: string;
  // max: number;
}

const Radar: FC<RadarProps> = ({ unitId }) => {
  const [thisMonthProblemList, setThisMonthProblemList] = useState<
    ProblemInter[]
  >([]);
  const [lastMonthProblemList, setLastMonthProblemList] = useState<
    ProblemInter[]
  >([]);
  const [thisMonthValue, setThisMonthValue] = useState<number[]>([
    4200, 3000, 20000, 35000, 50000, 18000,
  ]);
  const [lastMonthValue, setLastMonthValue] = useState<number[]>([
    4200, 3000, 20000, 35000, 50000, 18000,
  ]);
  const [indicator, setIndicator] = useState<indicatorInter[]>([]);

  useEffect(() => {
    console.log('unitedID in Radar useEffect', unitId);
    fetchProblemList();
  }, [unitId]);

  useEffect(() => {
    const thisMonthValue: number[] = [];
    const lastMonthValue: number[] = [];
    const indicator: indicatorInter[] = [];
    thisMonthProblemList.forEach((problem) => {
      const ind: indicatorInter = {
        name: problem.name as string,
        // max: 20,
      };
      indicator.push(ind);
      thisMonthValue.push(problem.record?.length || 0);
    });
    lastMonthProblemList.forEach((problem) => {
      lastMonthValue.push(problem.record?.length || 0);
    });
    setThisMonthValue(thisMonthValue);
    setLastMonthValue(lastMonthValue);
    setIndicator(indicator);
  }, [thisMonthProblemList]);

  const fetchProblemList = async () => {
    try {
      const res = await recordApi.getRadarData(unitId);
      console.log('unitId in fetchProblemList', unitId);
      console.log('res in fetchProblemList', res);
      if (res.status === 200) {
        console.log('res.data in fetchProblemList', res.data.data);

        setThisMonthProblemList(res.data.data.thisMonth);
        setLastMonthProblemList(res.data.data.lastMonth);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const radar = () => ({
    legend: {
      data: ["本月人数", "上月人数"],
      bottom: "0",
      textStyle: {
        color: '#fff'
      }
    },
    radar: {
      radius: "70%",
      center: ["50%", "45%"],
      axisName: {
        width: 100,
        height: 100,
        overflow: "break",
        color: '#fff'
      },
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
        // areaStyle: {
        //   color: "red",
        // },
        data: [
          {
            value: thisMonthValue,
            // value: [400, 3, 2, 3, 3, 5, 4, 3, 2, 3, 2, 5, 2],
            name: "本月人数",
            areaStyle: { color: "rgba(247, 14, 6, 0.6)" },
            lineStyle: {
              color: "rgba(247, 14, 6, 0.6)",
            },
            itemStyle: {
              color: "rgba(247, 14, 6, 0.6)",
            },
          },
          {
            value: lastMonthValue,
            // value: [3, 4, 2, 4, 2, 4, 2, 3, 2, 2, 3, 1, 2],
            name: "上月人数",
            areaStyle: { color: "rgba(13, 151, 255, 0.6)" },
            lineStyle: {
              color: "rgba(13, 151, 255, 0.6)",
              type: "dashed",
            },
            itemStyle: {
              color: "rgba(13, 151, 255, 0.6)",
            },
          },
        ],
      },
    ],
  });
  return (
    <>
      {/* <p
        style={{
          fontSize: "1.2vw",
          textAlign: "center",
          fontWeight: 800,
          lineHeight: "1vw",
          transform: "translate(50%)",
          position: "absolute",
        }}
      >
        各类问题人数环比图
      </p> */}
      <ReactECharts option={radar()} style={{ height: "100%" }}></ReactECharts>
    </>
  );
};

export default Radar;
