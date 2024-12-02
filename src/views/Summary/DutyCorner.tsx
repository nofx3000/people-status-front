import React from "react";
import { Card, Flex, Col, Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const DutyCorner = () => {
  const starsData = [
    {
      name: "孙士美",
      avatar: `${process.env.PUBLIC_URL}/lawyer1.jpg`,
      title: "北京法时律师事务所",
    },
    {
      name: "杨娅楠",
      avatar: `${process.env.PUBLIC_URL}/lawyer2.jpg`,
      title: "北京轩鼎律师事务所",
    },
    {
      name: "陈权威",
      avatar: `${process.env.PUBLIC_URL}/lawyer3.jpg`,
      title: "北京天网电子数据司法鉴定中心",
    },
    {
      name: "何永碧",
      avatar: `${process.env.PUBLIC_URL}/psychologist1.jpg`,
      title: "北京大学心理学博士",
    },
    {
      name: "雷佳",
      avatar: `${process.env.PUBLIC_URL}/psychologist.jpg`,
      title: "中国科学院心理研究所硕士",
    },
  ];

  return (
    <>
      <Flex vertical={false}>
        {starsData.map((star) => (
          <Flex flex={1} justify="space-evenly">
            <Card
              key={star.name}
              hoverable
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                height: "100%",
                width: "120px",
              }}
              bodyStyle={{
                padding: "2px",
                textAlign: "center",
              }}
            >
              <Avatar
                src={star.avatar}
                size={100}
                shape="square"
                style={{ marginBottom: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <Title level={5} style={{ margin: 0 }}>
                  {star.name}
                </Title>
                <Text
                  strong
                  style={{
                    fontSize: "12px",
                    lineHeight: "15px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "32px",
                  }}
                >
                  {star.title}
                </Text>
              </div>
            </Card>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default DutyCorner;
