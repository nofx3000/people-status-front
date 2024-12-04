import React from "react";
import { Flex, Avatar, Typography } from "antd";
import styles from "./DutyCorner.module.scss";

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
    <div className={styles.container}>
      <Flex vertical={false} className={styles.cardWrapper}>
        {starsData.map((star) => (
          <Flex flex={1} justify="space-evenly" key={star.name}>
            <div className={styles.expertCard}>
              <Avatar
                src={star.avatar}
                size={80}
                shape="square"
                className={styles.avatar}
              />
              <div className={styles.info}>
                <span className={styles.name}>{star.name}</span>
                <span className={styles.title}>{star.title}</span>
              </div>
            </div>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default DutyCorner;
