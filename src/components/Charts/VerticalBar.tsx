import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import { message } from "antd";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import style from "./charts.module.scss";
import { unitApi } from "../../api";

interface BarProps {}

const Bar: FC<BarProps> = () => {
  const [UnitInfo, setUnitInfo] = useState<UnitInter[]>([]);
  const [cardNumber, setCardNumber] = useState<number[][]>([]);
  const [catagoryNumber, setCatagoryNumber] = useState<number[][]>([]);
  useEffect(() => {
    fetchAllUnit();
  }, []);

  useEffect(() => {
    countCardNumber();
    countCatagoryNumber();
  }, [UnitInfo]);

  const fetchAllUnit = async () => {
    try {
      const res = await unitApi.getAllUnits();
      if (res.status === 200) {
        setUnitInfo(res.data.data as any);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const countCardNumber = () => {
    if (UnitInfo.length === 0)
      return new Array(UnitInfo.length).fill([0, 0, 0]);
    const data = new Array(UnitInfo.length);
    UnitInfo.forEach((unit) => {
      const unitId = unit.id as number;
      // 干部0，文职1，战士2
      const unitCount = [0, 0, 0];
      unit.people?.forEach((person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        if (level === 0) {
          unitCount[0] += 1;
        } else if (level === 1) {
          unitCount[1] += 1;
        } else if (level === 2) {
          unitCount[2] += 1;
        }
        data[unitId - 1] = unitCount;
      });
    });
    setCardNumber(data);
  };

  const countCatagoryNumber = () => {
    if (UnitInfo.length === 0)
      return new Array(UnitInfo.length).fill([0, 0, 0]);
    const data = new Array(UnitInfo.length);
    UnitInfo.forEach((unit) => {
      const unitId = unit.id as number;
      const unitCount = [0, 0, 0];
      unit.people?.forEach((person) => {
        if (person.catagory === 0) {
          unitCount[0] += 1;
        } else if (person.catagory === 1) {
          unitCount[1] += 1;
        } else if (person.catagory === 2) {
          unitCount[2] += 1;
        }
        data[unitId - 1] = unitCount;
      });
    });
    setCatagoryNumber(data);
  };

  const countTotal = () => {
    let sum = 0;
    cardNumber.forEach((item) => {
      sum += item[0] + item[1] + item[2];
    });
    return sum;
  };

  const countCardNumberArray = (array: Array<Array<number>>) => {
    let newarray = [0, 0, 0];
    array.forEach((item) => {
      newarray[0] += item[0];
      newarray[1] += item[1];
      newarray[2] += item[2];
    });
    return newarray;
  };

  const bar = () => ({
    title: {
      text: "各单位问题人员数量图",
      textAlign: "left",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "6%",
      bottom: "10%",
    },
    legend: {
      data: ["绿牌人数", "黄牌人数", "红牌人数"],
      bottom: "0",
    },
    yAxis: [
      {
        type: "category",
        axisTick: { show: true },
        data: UnitInfo.length > 0 ? UnitInfo.map((unit) => unit.name) : [],
      },
    ],
    xAxis: [
      {
        type: "value",
        // data: [100, 200, 300, 400, 500],
        position: "bottom",
      },
    ],
    series: [
      {
        name: "绿牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: cardNumber.length > 0 ? cardNumber.map((unit) => unit[0]) : [],
        color: "#039B0F",
      },
      {
        name: "黄牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: cardNumber.length > 0 ? cardNumber.map((unit) => unit[1]) : [],
        color: "#E0A60F",
      },
      {
        name: "红牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: cardNumber.length > 0 ? cardNumber.map((unit) => unit[2]) : [],
        color: "#c23531",
      },
    ],
  });

  return (
    <>
      {/* <p className={style.summayText}>目前大队共有重点人{countTotal()}</p>
      <p className={style.summayText}>
        其中红牌{countCardNumberArray(cardNumber)[2]}、黄牌
        {countCardNumberArray(cardNumber)[1]}
        、绿牌{countCardNumberArray(cardNumber)[0]}
      </p>
      <p className={style.summayText}>
        干部{countCardNumberArray(catagoryNumber)[0]}、文职
        {countCardNumberArray(catagoryNumber)[1]}、战士
        {countCardNumberArray(catagoryNumber)[2]}
      </p> */}
      <ReactECharts
        option={bar()}
        style={{
          height: "100%",
          // marginTop: "2vh",
          // height: "72vh",
          // transform: "translateY(5%)",
        }}
      ></ReactECharts>
    </>
  );
};

export default Bar;
