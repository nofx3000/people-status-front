import React from "react";
import styles from "./InfoCenter.module.scss";

const InfoCenter = () => {
  const indicators = [
    { label: "刘某某", value: "现实需求强烈" },
    { label: "孙某某", value: "涉及职级调整" },
    { label: "邓某", value: "家庭发生重大变故" },
    { label: "雷某", value: "涉及大额借款" },
    { label: "王某某", value: "拟晋升高级士官" },
    { label: "刘某", value: "转业待移交" },
    { label: "胡某某", value: "长期公出" },
    { label: "何某某", value: "专业与新岗位不符" },
  ];

  // 计算每个卡片的角度
  const angleStep = 360 / indicators.length;

  return (
    <div className={styles.centerModule}>
      <div className={styles.centerImageContainer}>
        <img
          src="/GIF动效 (13).png"
          alt="gif-effect"
          className={styles.centerImage}
        />
        <img src="/kv-shield.png" alt="shield" className={styles.centerImage} />
        <div className={styles.indicators3D}>
          {indicators.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={styles.indicator}
              style={{
                transform: `rotateY(${index * angleStep}deg) translateZ(200px)`,
              }}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}</span>
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
