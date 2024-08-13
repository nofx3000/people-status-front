import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios, { AxiosResponse } from "axios";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import { message } from "antd";

interface LineProps {
  unitId: number;
}

const Line: FC<LineProps> = ({ unitId }) => {
  // const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [monthData, setMonthData] = useState<number[][]>(
    new Array<number[]>(3).fill(
      new Array<number>(new Date().getMonth() + 1).fill(0)
    )
  );
  const [option, setOption] = useState({});
  // useEffect(() => {
  //   fetchUserJWT();
  // }, []);
  useEffect(() => {
    fetchEachMonthRecords().then((res) => {
      setMonthData(res as any);
    });
  }, [unitId]);

  const fetchEachMonthRecords = async () => {
    // 下面这样写有bug，无法正确地给数组元素赋值
    // const _monthData = new Array<number[]>(3).fill(
    //   new Array<number>(new Date().getMonth() + 1).fill(0)
    // );
    const _monthData = [
      new Array<number>(new Date().getMonth() + 1).fill(0),
      new Array<number>(new Date().getMonth() + 1).fill(0),
      new Array<number>(new Date().getMonth() + 1).fill(0),
    ];
    for (const index in _monthData[0]) {
      const i = Number(index);
      const res = await fetchMonthlyRecords(i + 1);
      if (res.length === 0) continue;
      _monthData[0][i] = countMonthlyNumberInCard(res)[0];
      _monthData[1][i] = countMonthlyNumberInCard(res)[1];
      _monthData[2][i] = countMonthlyNumberInCard(res)[2];
    }

    return _monthData;
  };

  // const fetchUserJWT = async (): Promise<any> => {
  //   await store.getUserJWT();
  //   const userJWT = toJS(store.userInfo);
  //   setUserJWT(userJWT);
  //   return userJWT;
  // };

  const fetchMonthlyRecords = async (month: number) => {
    // if (!userJWT.unit_id) return;
    const res = await axios.get(`/summary/line/${unitId}/${month}`);
    return res.data.data as RecordInter[];
  };

  const countMonthlyNumberInCard = (monthlyData: RecordInter[]) => {
    const monthlyNumberInCard = [0, 0, 0];
    for (const record of monthlyData) {
      if (record.record_Developments?.length === 0) continue;
      if (
        (record.record_Developments as RecordDevelopmentInter[])[0]
          .risk_level === 0
      ) {
        monthlyNumberInCard[0] += 1;
      } else if (
        (record.record_Developments as RecordDevelopmentInter[])[0]
          .risk_level === 1
      ) {
        monthlyNumberInCard[1] += 1;
      } else if (
        (record.record_Developments as RecordDevelopmentInter[])[0]
          .risk_level === 2
      ) {
        monthlyNumberInCard[2] += 1;
      }
    }

    return monthlyNumberInCard;
  };

  useEffect(() => {
    setOption({
      title: {
        text: "重点人数变化趋势图",
        textAlign: "left",
        x: "center",
        y: "0",
      },
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
        data: monthData
          ? monthData[0].map((item, index) => `${index + 1}月`)
          : [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "急迫",
          type: "line",
          // stack: "Total",
          data: monthData ? monthData[2] : [],
          itemStyle: {
            color: "#c23531",
          },
        },
        {
          name: "重要",
          type: "line",
          // stack: "Total",
          data: monthData ? monthData[1] : [],
          itemStyle: {
            color: "#E0A60F",
          },
        },
        {
          name: "一般",
          type: "line",
          // stack: "Total",
          data: monthData ? monthData[0] : [],
          itemStyle: {
            color: "#039B0F",
          },
        },
      ],
    });
  }, [monthData, unitId]);

  return (
    <>
      <ReactECharts option={option}></ReactECharts>
    </>
  );
};

export default Line;
