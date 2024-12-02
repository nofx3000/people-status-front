import React from "react";
import { Card, Button, Checkbox, Form, Input } from "antd";
import style from "./login.module.scss";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../store/slices/userinfoSlice";
import { useDispatch } from "react-redux";
import { App as globalAntd } from "antd";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import { authApi } from "../../api";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  const onFinish = async (values: LoginInter) => {
    try {
      const res = await authApi.login(values);
      if (res.status === 200) {
        const token = `Bearer ${res.data.data}`;
        window.localStorage.setItem("token", token);
        dispatch(setToken(token));
        message.success("登陆成功!");
        await store.getUserJWT();
        const userJWT = toJS(store.userInfo);
        await store.checkAdminUpdates(userJWT);
        navigate("/");
      } else {
        message.error("登录失败!");
      }
    } catch (error) {
      message.error("用户名或密码错误!");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("用户名或密码格式错误!");
  };

  return (
    <div className={style.bg}>
      <Card className={style.card}>
        <p className={style.title}>"红黄绿牌"防范预警管理系统</p>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入账号!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登陆
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default App;
