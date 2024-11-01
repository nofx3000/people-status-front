import React, { ReactNode, useEffect, useState } from "react";
import style from "./menu.module.scss";
import {
  AppstoreOutlined,
  TeamOutlined,
  EditOutlined,
  OrderedListOutlined,
  AreaChartOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selectMenuList, getMenuListAsync } from "../../store/slices/menuSlice";

interface StringToIconInter {
  [IconName: string]: ReactNode;
}

const stringToIconMap: StringToIconInter = {
  AppstoreOutlined: <AppstoreOutlined></AppstoreOutlined>,
  TeamOutlined: <TeamOutlined></TeamOutlined>,
  EditOutlined: <EditOutlined></EditOutlined>,
  OrderedListOutlined: <OrderedListOutlined></OrderedListOutlined>,
  AreaChartOutlined: <AreaChartOutlined></AreaChartOutlined>,
  UserOutlined: <UserOutlined></UserOutlined>,
  HeartOutlined: <HeartOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  FullscreenOutlined: <FullscreenOutlined />,
  WarningOutlined: <WarningOutlined />,
};

const App: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const menuList: MenuItemInter[] = useSelector(selectMenuList);
  useEffect(() => {
    dispatch(getMenuListAsync());
  }, [dispatch]);
  function formatMenuList(menuList: MenuItemInter[]): MenuItemInter[] {
    return menuList.map((item) => {
      if (item.children && item.children.length <= 0) {
        item = { ...item, children: undefined };
      } else if (item.children && item.children.length > 0) {
        const newChildren = formatMenuList(item.children as MenuItemInter[]);
        item = { ...item, children: newChildren };
      }
      return Object.assign({}, item, {
        key: item.path,
        icon: stringToIconMap[item.icon as string],
      });
    });
  }

  return (
    <>
      <Menu
        className={style.menu}
        defaultSelectedKeys={["/summary"]}
        mode="inline"
        theme="dark"
        items={formatMenuList(menuList) as any}
        onClick={(item) => {
          if (item.key === "/fullscreen") {
            const isFullScreen = !!document.fullscreenElement;
            if (!isFullScreen) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
            return;
          }
          navigate(item.key);
        }}
      ></Menu>
    </>
  );
};

export default App;
