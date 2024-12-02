import request from "../request";

export const summaryApi = {
  // 获取上次登录后的更新
  getUpdates: (lastLogin: string) =>
    request.get<ApiResponse<RecordInter[]>>(
      `/summary/updates/${lastLogin}`,
      {}
    ),
};
