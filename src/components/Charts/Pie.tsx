import React, { FC } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts

const Pie: FC = () => {
  const pie = () => ({
    title: {
      text: "重点人员类型分布",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
  return <ReactECharts option={pie()}></ReactECharts>;
};

export default Pie;
