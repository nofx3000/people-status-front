import React from "react";
import { Card, Button, Tag, Avatar, Typography, Grid } from "antd";
import style from "./specialist.module.scss";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const lawyers = [
  {
    name: "程秀敏",
    title: "高级合伙人主任",
    background: "从业15年",
    education: "硕士 中国政法大学",
    services: ["婚姻家事", "合同纠纷", "公司法律事务"],
    description:
      "多年来潜心钻研合同风险防范、合同纠纷处理，婚姻法，劳动法，掌握了多方面的专业知识",
    image: `${process.env.PUBLIC_URL}/lawyer1.jpg`,
  },
  {
    name: "李富才",
    title: "律师",
    background: "从业10年",
    education: "硕士 中国政法大学",
    services: ["刑事辩护", "刑事合规", "合同纠纷"],
    description:
      "十余年法律行业工作经验，专注于刑事诉讼、合同纠纷案件，担任事业单位和企业法律顾问",
    image: `${process.env.PUBLIC_URL}/lawyer2.jpg`,
  },
  {
    name: "刘士栋",
    title: "律师",
    background: "从业13年",
    education: "硕士 山东大学",
    services: ["刑事辩护", "行政诉讼", "合同纠纷"],
    description: "专注于刑事辩护、行政诉讼等领域",
    image: `${process.env.PUBLIC_URL}/lawyer3.jpg`,
  },
];

const Lawyer: React.FC = () => {
  const screens = useBreakpoint();

  return (
    <div className={style.lawyerContainer}>
      <div>
        <Title level={3} style={{ margin: "0", marginBottom: "8px" }}>
          法律咨询专家
        </Title>
        <div style={{ marginTop: "16px" }}>
          {lawyers.map((lawyer, index) => (
            <Card key={index} size="small" style={{ marginBottom: "8px" }}>
              <div className={style.lawyerCard}>
                <Avatar
                  src={lawyer.image}
                  size={60}
                  style={{ marginRight: "12px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <Title
                        level={5}
                        style={{ marginBottom: "4px", fontSize: "16px" }}
                      >
                        {lawyer.name}
                      </Title>
                      <div style={{ marginBottom: "4px" }}>
                        <Tag
                          color="blue"
                          style={{ fontSize: "12px", padding: "0 4px" }}
                        >
                          {lawyer.title}
                        </Tag>
                        <Tag
                          color="blue"
                          style={{ fontSize: "12px", padding: "0 4px" }}
                        >
                          {lawyer.background}
                        </Tag>
                      </div>
                    </div>
                    <Button type="primary" danger size="small">
                      在线咨询
                    </Button>
                  </div>
                  <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                    <strong>教育背景：</strong>
                    {lawyer.education}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                    <strong>工作经历：</strong>
                    {lawyer.description}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                    <strong>服务项目：</strong>
                    {lawyer.services.join(" | ")}
                  </Paragraph>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lawyer;
