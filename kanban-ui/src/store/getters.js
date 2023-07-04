import device from "@/store/modules/device";

const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.info,
  device: state => state.device.deviceInfo,
};

export default getters;
