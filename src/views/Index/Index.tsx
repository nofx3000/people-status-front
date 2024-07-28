import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import store from "../../mobx_store/store";
import { toJS } from "mobx";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      {/* <Header className={style.header}>Header</Header> */}
      <Layout>
        <Sider className={style.sider} breakpoint="lg">
          <Menu className="s" />
        </Sider>
        <Content className={style.content}>
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
