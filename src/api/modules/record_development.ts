import request from "../request";

export const recordDevelopmentApi = {
  getTopSixRecordDevelopments: () =>
    request.get<ApiResponse<RecordDevelopmentInter[]>>(
      "/record-development/"
    ),
};
