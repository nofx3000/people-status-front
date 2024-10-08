import React, { useState } from "react";
import { Layout, Button, Flex } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Layout>
      <Header className={style.header}>
        <Flex vertical={false}>
          <img
            className={style.headerBadge}
            src={`http://localhost:3000/api/upload/avatar/01.png`}
          ></img>
          <div style={{ lineHeight: "8vh" }}>"红黄绿牌"防范预警管理系统</div>
          <div className={style.headerImgBox}>
            <img
              className={style.headerImg}
              src={`http://localhost:3000/api/upload/avatar/03.png`}
            ></img>
          </div>
        </Flex>
      </Header>
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
