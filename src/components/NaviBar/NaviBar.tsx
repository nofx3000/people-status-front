import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NaviBar.module.scss';

export default function NaviBar() {
  const location = useLocation();
  
  const leftLinks = [
    { path: '/', label: '首页' },
    { path: '/list', label: '人员列表' },
    { path: '/basicinfo', label: '基础信息' },
  ];

  const rightLinks = [
    { path: '/responsible', label: '责任人管理' },
    { path: '/specialist', label: '专家管理' },
    { path: '/login', label: '退出系统' },
  ];

  return (
    <div className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          {leftLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${styles.navLink} ${location.pathname === path ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>"红黄绿牌"防范预警管理系统</h1>
        </div>
        <div className={styles.navLinks}>
          {rightLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${styles.navLink} ${location.pathname === path ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
