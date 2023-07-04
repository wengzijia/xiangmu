import { http } from "../utils/request.js";
// 上报用户操作
export const reported = function (data) {
  return http({
    method: "POST",
    url: "/api/v1/action/reported",
    data,
    header: {
      "Content-type": "application/json;charset=UTF-8",
    },
  });
};

