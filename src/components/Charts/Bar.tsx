import React, { FC } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts

const Bar: FC = () => {
  const bar = () => ({
    title: {
      text: "各单位重点关注人员总数",
    },
    tooltip: {},
    xAxis: {
      data: ["shirt", "cardigan", "chiffon", "pants", "heels", "socks"],
    },
    yAxis: {},
    series: [
      {
        name: "sales",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });
  return <ReactECharts option={bar()}></ReactECharts>;
};

export default Bar;
