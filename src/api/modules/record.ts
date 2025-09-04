import request from "../request";

export const recordApi = {
  // 添加记录
  addRecord: (data: RecordInter) =>
    request.post<ApiResponse<any>>("/record/add", data),

  // 获取单位的月度记录
  getMonthlyRecords: (unitId: number, month: number) =>
    request.get<ApiResponse<RecordInter[]>>(`/summary/line/${unitId}/${month}`),

  // 添加记录发展
  addRecordDevelopment: (data: RecordDevelopmentInter) =>
    request.post<ApiResponse<any>>("/record-development/", data),

  // 删除记录发展
  deleteRecordDevelopment: (developmentId: number) =>
    request.delete<ApiResponse<any>>(`/record-development/${developmentId}`),

  // 更新记录发展
  updateRecordDevelopment: (developmentId: number, data: RecordDevelopmentInter) =>
    request.put<ApiResponse<any>>(`/record-development/${developmentId}`, data),

  // 更新记录
  updateRecord: (recordId: number, data: RecordInter) =>
    request.put<ApiResponse<any>>(`/record/${recordId}`, data),

  // 关闭问题
  closeRecord: (recordId: number) =>
    request.put<ApiResponse<any>>(`/record/${recordId}`, { is_closed: true }),

  // 获取雷达图数据
  getRadarData: (unitId: number) =>
    request.get<ApiResponse<any>>(`/summary/radar/${unitId}`),

  // 获取单位未解决的记录
  getUnsolvedRecords: (unitId: number) =>
    request.get<ApiResponse<RecordInter[]>>(`/record/unit/${unitId}`),

  // 获取单位已解决的记录
  getSolvedRecords: (unitId: number) =>
    request.get<ApiResponse<RecordInter[]>>(`/record/unit/${unitId}/solved`),

  // 删除记录
  deleteRecord: (recordId: number) =>
    request.delete<ApiResponse<any>>(`/record/${recordId}`),
};
