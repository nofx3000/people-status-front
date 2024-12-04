import React from "react";
import styles from "./InfoCenter.module.scss";

const InfoCenter = () => {
  const indicators = [
    { label: "运动比率", value: "3.9%" },
    { label: "非流动比率", value: "1.1%" },
    { label: "资产负债率", value: "1.2%" },
    { label: "流动比率", value: "8.1%" },
    { label: "净利润", value: "20.1%" },
    { label: "运动比率", value: "3.9%" },
    { label: "非流动比率", value: "1.1%" },
    { label: "资产负债率", value: "1.2%" },
    { label: "流动比率", value: "8.1%" },
    { label: "净利润", value: "20.1%" },
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
