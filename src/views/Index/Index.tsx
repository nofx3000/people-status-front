import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Index.module.scss';
import NaviBar from '../../components/NaviBar/NaviBar';

export default function Index() {
  return (
    <div className={styles.dashboardContainer}>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="/matrix_numbs.mp4" type="video/mp4" />
      </video>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.layout}>
        <NaviBar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
