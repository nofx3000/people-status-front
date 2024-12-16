import React from 'react';
import { Input } from 'antd';
import styles from './policy.module.scss';

const { Search } = Input;

export default function Policy() {
  const keywords = ['心理辅导', '法律援助', '矛盾化解', '帮扶政策'];

  const onSearch = (value: string) => {
    console.log('search:', value);
    // TODO: 实现搜索功能
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>政策制度查询</h1>
      <div className={styles.searchWrapper}>
        <Search
          placeholder="请输入关键词搜索"
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={onSearch}
        />
        <div className={styles.keywords}>
          <span className={styles.keyword}>大家常搜:</span>
          {keywords.map((keyword, index) => (
            <span key={index} className={styles.keyword}>
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
