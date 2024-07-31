import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts
import axios from "axios";
import { message } from "antd";

interface PieProps {
  unitId: number;
}

interface dataInter {
  name: string;
  value: number;
}

const Pie: FC<PieProps> = ({ unitId }) => {
  const [peopleRecords, setPersonRecords] = useState<PersonInfoInter[]>([]);
  const [data, setData] = useState<dataInter[]>([]);

  useEffect(() => {
    fetchPeopleRecordsByUnitId(unitId);
  }, [unitId]);

  useEffect(() => {
    const data: dataInter[] = [
      { name: "急迫", value: 0 },
      { name: "重要", value: 0 },
      { name: "一般", value: 0 },
    ];
    peopleRecords.forEach((person) => {
      const level = getLevel(person);
      if (level === 2) {
        data[0].value++;
      } else if (level === 1) {
        data[1].value++;
      } else {
        data[2].value++;
      }
    });
    setData(data);
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

  const pie = () => ({
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "60%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          color: (params: any) => {
            const colorList = ["#c23531", "#E0A60F", "#039B0F"];
            return colorList[params.dataIndex];
          },
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
          transform: "translate(80%)",
          position: "absolute",
        }}
      >
        重点人员分布图
      </p>
      <ReactECharts
        option={pie()}
        style={{ transform: "translateY(5%)" }}
      ></ReactECharts>
    </>
  );
};

export default Pie;
