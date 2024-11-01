import request from "../request";

export interface UnitInter {
  id?: number;
  name?: string;
  people?: any[];
}

export const unitApi = {
  // 获取所有单位信息
  getAllUnits: () => request.get<ApiResponse<UnitInter[]>>("/unit"),
};
