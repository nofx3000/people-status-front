import React from "react";
import { Avatar, Typography, Tag, Card, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import style from "./specialist.module.scss";

const { Title, Paragraph, Text } = Typography;

type Expert = {
  id: number;
  name: string;
  image: string;
  title: string;
  education: string;
  description: string;
  services: string[];
};

const experts: Expert[] = [
  {
    id: 1,
    name: "张三",
    image: `${process.env.PUBLIC_URL}/psychologist1.jpg`,
    title: "临床心理学专家",
    education: "北京大学心理学博士",
    description: "10年心理咨询经验，专注于抑郁症和焦虑障碍治疗",
    services: ["个人心理咨询", "抑郁症治疗", "焦虑障碍治疗"],
  },
  {
    id: 2,
    name: "李四",
    image: `${process.env.PUBLIC_URL}/psychologist.jpg`,
    title: "婚姻家庭治疗师",
    education: "中国科学院心理研究所硕士",
    description: "15年婚姻咨询经验，擅长处理家庭关系问题",
    services: ["婚姻咨询", "家庭治疗", "亲子关系辅导"],
  },
];

const Psychologist: React.FC = () => {
  return (
    <>
      <Title level={3} style={{ margin: "0", marginBottom: "8px" }}>
        特约心理咨询专家
      </Title>
      <div style={{ marginTop: "16px" }}>
        {experts.map((expert) => (
          <Card key={expert.id} size="small" style={{ marginBottom: "8px" }}>
            <div className={style.lawyerCard}>
              <Avatar
                src={expert.image}
                size={60}
                icon={<UserOutlined />}
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
                      {expert.name}
                    </Title>
                    <Tag
                      color="blue"
                      style={{ fontSize: "12px", padding: "0 4px" }}
                    >
                      {expert.title}
                    </Tag>
                  </div>
                  <Button type="primary" danger size="small">
                    在线咨询
                  </Button>
                </div>
                <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                  <strong>教育背景：</strong>
                  {expert.education}
                </Paragraph>
                <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                  <strong>工作经历：</strong>
                  {expert.description}
                </Paragraph>
                <Paragraph style={{ marginBottom: "4px", fontSize: "13px" }}>
                  <strong>服务项目：</strong>
                  {expert.services.join(" | ")}
                </Paragraph>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Psychologist;
