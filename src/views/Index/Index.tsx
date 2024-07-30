import React, { useEffect, useState } from "react";
import { Layout, Button } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import store from "../../mobx_store/store";
import { toJS } from "mobx";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <Header className={style.header}>Header</Header>
      <Layout>
        <Sider
          className={style.sider}
          breakpoint="lg"
          collapsedWidth="4vw"
          trigger={
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: "white",
                fontSize: "16px",
                width: 30,
                height: 30,
              }}
            />
          }
          collapsible
          collapsed={collapsed}
        >
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
