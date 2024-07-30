import React from "react";
import { Card, Col, Table, Row, Modal, Button, FormInstance } from "antd";
import ReactECharts from "echarts-for-react"; // Import ECharts
import style from "./summary.module.scss";

const Summary: React.FC = () => {
  const lineChart = () => ({
    title: {
      text: "重点关注人员增长率",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  });
  const stackedLineChart = () => ({
    title: {
      text: "各类问题增长趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        type: "line",
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        stack: "Total",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        stack: "Total",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  });

  const labelOption = {
    show: true,
    position: "left",
    distance: 15,
    align: "left",
    verticalAlign: "middle",
    rotate: 90,
    formatter: "{c}  {name|{a}}",
    fontSize: 16,
    rich: {
      name: {},
    },
  };
  const barLabelRotation = () => ({
    title: {
      text: "各单位重点人员类型分布",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    toolbox: {
      show: true,
      orient: "vertical",
      left: "right",
      top: "center",
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar", "stack"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        data: ["2012", "2013", "2014", "2015", "2016"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Forest",
        type: "bar",
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [320, 332, 301, 334, 390],
      },
      {
        name: "Steppe",
        type: "bar",
        label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290],
      },
      {
        name: "Desert",
        type: "bar",
        label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [150, 232, 201, 154, 190],
      },
      {
        name: "Wetland",
        type: "bar",
        label: labelOption,
        emphasis: {
          focus: "series",
        },
        data: [98, 77, 101, 99, 40],
      },
    ],
  });
  const getOption = () => ({
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

  return (
    <>
      <Row>
        <Col span={8}>
          <Card>
            <ReactECharts option={getOption()}></ReactECharts>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={pie()}></ReactECharts>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={barLabelRotation()}></ReactECharts>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Card>
            <ReactECharts option={stackedLineChart()}></ReactECharts>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={lineChart()}></ReactECharts>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={getOption()}></ReactECharts>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Summary;
