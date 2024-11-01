import request from "../request";

export const personApi = {
  // 获取单位下的所有人员
  getPeopleByUnitId: (unitId: number) =>
    request.get<ApiResponse<SeparatePeopleRecordsInter>>(`/people/${unitId}`),

  // 获取单个人员详情
  getPersonInfo: (personId: number) =>
    request.get<ApiResponse<PersonInfoInter>>(`/people/person/${personId}`),

  // 添加人员
  addPerson: (data: PersonInfoInter) =>
    request.post<ApiResponse<PersonInfoInter>>("/people/add", data),

  // 编辑人员
  editPerson: (personId: number, data: PersonInfoInter) =>
    request.put<ApiResponse<any>>(`/people/edit/${personId}`, data),

  // 删除人员
  deletePerson: (personId: number) =>
    request.delete<ApiResponse<any>>(`/people/del/${personId}`),
};
