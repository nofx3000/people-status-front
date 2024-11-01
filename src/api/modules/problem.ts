import request from "../request";

export interface ProblemInter {
  // 添加问题相关的类型定义
  id?: number;
  name?: string;
}

export const problemApi = {
  // 获取所有问题
  getProblems: () => request.get<ApiResponse<ProblemInter[]>>("/problem"),
};
