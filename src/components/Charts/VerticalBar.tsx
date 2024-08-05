import React, { FC, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // Import ECharts

interface BarProps {}

const Bar: FC<BarProps> = () => {
  const posList = [
    "left",
    "right",
    "top",
    "bottom",
    "inside",
    "insideTop",
    "insideLeft",
    "insideRight",
    "insideBottom",
    "insideTopLeft",
    "insideTopRight",
    "insideBottomLeft",
    "insideBottomRight",
  ];
  //   configParameters = {
  //     rotate: {
  //       min: -90,
  //       max: 90
  //     },
  //     align: {
  //       options: {
  //         left: 'left',
  //         center: 'center',
  //         right: 'right'
  //       }
  //     },
  //     verticalAlign: {
  //       options: {
  //         top: 'top',
  //         middle: 'middle',
  //         bottom: 'bottom'
  //       }
  //     },
  //     position: {
  //       options: posList.reduce(function (map, pos) {
  //         map[pos] = pos;
  //         return map;
  //       }, {})
  //     },
  //     distance: {
  //       min: 0,
  //       max: 100
  //     }
  //   };
  //   const config = {
  //     rotate: 90,
  //     align: 'left',
  //     verticalAlign: 'middle',
  //     position: 'insideBottom',
  //     distance: 15,
  //     onChange: function () {
  //       const labelOption = {
  //         rotate: config.rotate,
  //         align: config.align,
  //         verticalAlign: config.verticalAlign,
  //         position: config.position,
  //         distance: config.distance
  //       };
  //       myChart.setOption({
  //         series: [
  //           {
  //             label: labelOption
  //           },
  //           {
  //             label: labelOption
  //           },
  //           {
  //             label: labelOption
  //           },
  //           {
  //             label: labelOption
  //           }
  //         ]
  //       });
  //     }
  //   };
  //   const labelOption = {
  //     show: true,
  //     position: config.position,
  //     distance: config.distance,
  //     align: config.align,
  //     verticalAlign: config.verticalAlign,
  //     rotate: config.rotate,
  //     formatter: '{c}  {name|{a}}',
  //     fontSize: 16,
  //     rich: {
  //       name: {}
  //     }
  //   };

  const bar = () => ({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["绿牌人数", "黄牌人数", "红牌人数"],
    },
    yAxis: [
      {
        type: "category",
        axisTick: { show: true },
        data: ["1y", "2y", "3y", "4y", "5y", "6y", "7y"],
      },
    ],
    xAxis: [
      {
        type: "value",
        data: [100, 200, 300, 400, 500],
        position: "bottom",
      },
    ],
    series: [
      // {
      //   name: "总问题人数",
      //   type: "bar",
      //   barGap: 0,
      //   // label: labelOption,
      //   emphasis: {
      //     focus: "series",
      //   },
      //   data: [320, 332, 301, 334, 390, 320, 332, 301],
      // },
      {
        name: "绿牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290, 220, 182, 191],
        color: "#039B0F",
      },
      {
        name: "黄牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [150, 232, 201, 154, 190, 150, 232, 201],
        color: "#E0A60F",
      },
      {
        name: "红牌人数",
        type: "bar",
        // label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [98, 77, 101, 99, 40, 98, 77, 101],
        color: "#c23531",
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
        各单位问题人员数量图
      </p>
      <ReactECharts
        option={bar()}
        style={{
          marginTop: "2vh",
          height: "72vh",
          transform: "translateY(5%)",
        }}
      ></ReactECharts>
    </>
  );
};

export default Bar;
