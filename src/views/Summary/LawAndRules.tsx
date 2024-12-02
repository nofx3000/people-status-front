import React from "react";
import { Card, Flex, Typography } from "antd";

const { Title, Text } = Typography;

const LawAndRules = () => {
  const starsData = [
    {
      avatar: `${process.env.PUBLIC_URL}/laws.jpg`,
      title: "山东法时律师事务所",
      location: "山东",
    },
    {
      avatar: `${process.env.PUBLIC_URL}/laws.jpg`,
      title: "山东轩鼎律师事务所",
      location: "山东",
    },
    {
      avatar: `${process.env.PUBLIC_URL}/laws.jpg`,
      title: "湖南省天网电子数据司法鉴定中心",
      location: "湖南",
    },
    {
      avatar: `${process.env.PUBLIC_URL}/laws.jpg`,
      title: "四川百坚律师事务所",
      location: "四川",
    },
  ];

  return (
    <>
      <Flex vertical={false}>
        {starsData.map((star) => (
          <Flex flex={1} justify="space-evenly" key={star.title}>
            <Card
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
              <img
                src={star.avatar}
                alt={star.title}
                style={{
                  width: "100px",
                  height: "120px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
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

export default LawAndRules;
