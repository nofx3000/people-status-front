import request from "../request";

export const menuApi = {
  // 获取菜单列表
  getMenuList: () => request.get<ApiResponse<MenuItemInter[]>>("/menu/"),
};
