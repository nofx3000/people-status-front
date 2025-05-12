import React, { useState, useEffect } from "react";
import {recordDevelopmentApi} from '../../api/index'
import styles from "./InfoCenter.module.scss";

const InfoCenter = () => {
  const [topSixProblemDevelopments, setTopSixProblemDevelopments] = useState<
    RecordDevelopmentInter[]
  >([]);

  const [angleStep, setAngleStep] = useState<number>(0);

  useEffect(() => {
    recordDevelopmentApi.getTopSixRecordDevelopments().then((res) => {
      if (res.status === 200) {
        setTopSixProblemDevelopments(res.data.data);
      } else {
        console.log('获取轮播信息错误');
      }
    });
  }, []);

  useEffect(() => {
  // 计算每个卡片的角度
    setAngleStep(360 / topSixProblemDevelopments.length);
  }, [topSixProblemDevelopments]);
  // const topSixProblemDevelopments = [
  //   { label: "刘某某", value: "现实需求强烈" },
  //   { label: "孙某某", value: "涉及职级调整" },
  //   { label: "邓某", value: "家庭发生重大变故" },
  //   { label: "雷某", value: "涉及大额借款" },
  //   { label: "王某某", value: "拟晋升高级士官" },
  //   { label: "刘某", value: "转业待移交" },
  //   { label: "胡某某", value: "长期公出" },
  //   { label: "何某某", value: "专业与新岗位不符" },
  // ];

  return (
    <div className={styles.centerModule}>
      <div className={styles.centerImageContainer}>
        <img
          src="/GIF动效 (13).png"
          alt="gif-effect"
          className={styles.centerImage}
        />
        <img src="/kv-shield.png" alt="shield" className={styles.centerImage} />
        <div className={styles.topSixProblemDevelopments3D}>
          {topSixProblemDevelopments.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={styles.indicator}
              style={{
                transform: `rotateY(${index * angleStep}deg) translateZ(200px)`,
              }}
            >
              <span className={styles.label}>{item.record?.person?.name}</span>
              <span className={styles.value}>{item.detail}</span>
            </div>
          ))}
        </div>
        <img
          src="/GIF动效 (41).png"
          alt="gif-effect-bottom"
          className={`${styles.centerImage} ${styles.bottomImage}`}
        />
        <img
          src="/GIF动效 (103).gif"
          alt="gif-effect-overlap"
          className={`${styles.centerImage} ${styles.bottomImage}`}
        />
      </div>
    </div>
  );
};

export default InfoCenter;
