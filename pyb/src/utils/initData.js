import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
import { checkToken } from '@/api/users/userApi';
import { getAllVoList } from '@/api/category/categoryApi';
const InitData = {
  install(Vue, options) {}
};
export default InitData;
