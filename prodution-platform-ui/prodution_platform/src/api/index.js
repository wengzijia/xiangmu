import systemManage from "./modules/systemManage";
import user from "./modules/user";
import menuManage from "./modules/menuManage";

export default {
  ...user,
  ...systemManage,
  ...menuManage
};
