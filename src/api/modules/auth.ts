import request from "../request";

export const authApi = {
  // 登录
  login: (params: LoginInter) =>
    request.post<ApiResponse<string>>("/users/login", params),

  // 获取用户JWT信息
  decodeUserJWT: () =>
    request.get<ApiResponse<UserInfoInter>>("/users/verify1"),

  // 获取用户上次登录时间
  getLastLogin: (userId: number) =>
    request.get<ApiResponse<Date>>(`/users/last-login/${userId}`),

  // 更新用户最后登录时间
  updateLastLogin: (userId: number) =>
    request.put<ApiResponse<any>>(`/users/last-login/${userId}`),
};
