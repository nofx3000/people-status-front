import React from "react";
import { Layout, Row, Col, Card } from "antd";
import Psychologist from "./Psychologist";
import FAQ from "./FAQ";
import Lawyer from "./Lawyer";
import style from "./specialist.module.scss";

const { Content } = Layout;

export default function Component() {
  return (
    <Layout>
      <Content className={style.container}>
        <Row gutter={32}>
          <Col xs={24} lg={8} className={style.expertList}>
            <Psychologist />
          </Col>
          <Col xs={24} lg={8}>
            <Lawyer />
          </Col>
          <Col xs={24} lg={8} className={style.faqContainer}>
            <FAQ />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
