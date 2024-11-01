import request from "../request";

export const authApi = {
  // 登录
  login: (params: LoginInter) =>
    request.post<ApiResponse<string>>("/users/login", params),

  // 获取用户JWT信息
  decodeUserJWT: () =>
    request.get<ApiResponse<UserInfoInter>>("/users/verify1"),
};
