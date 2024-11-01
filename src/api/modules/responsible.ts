import request from "../request";

export const responsibleApi = {
  // 获取单位下的所有负责人
  getResponsibleByUnit: (unitId: number) =>
    request.get<ApiResponse<ResponsibleInter[]>>(`/responsible/unit/${unitId}`),

  // 添加负责人
  addResponsible: (data: ResponsibleInter) =>
    request.post<ApiResponse<any>>("/responsible/add", data),

  // 编辑负责人
  editResponsible: (responsibleId: number, data: ResponsibleInter) =>
    request.put<ApiResponse<any>>(`/responsible/edit/${responsibleId}`, data),

  // 删除负责人
  deleteResponsible: (responsibleId: number) =>
    request.delete<ApiResponse<any>>(`/responsible/del/${responsibleId}`),
};
