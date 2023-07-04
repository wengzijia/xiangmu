import moment from 'moment';

export function formatSecond(time) {
  return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
}
export function formatDateSecond(time) {
  return moment(time * 1000).format('YYYY-MM-DD');
}
export function minutes(time) {
  return moment(time * 1000).format('MM-DD HH:mm');
}
// 倒计时
export function theCountdown(time) {
  var endTime = new Date(`${time} 23:59:59`).getTime() / 1000 - parseInt(new Date().getTime() / 1000);
  let timeDay = parseInt(endTime / 60 / 60 / 24); //相差天数
  endTime = endTime - timeDay * 60 * 60 * 24;
  let timeHour = parseInt(endTime / 60 / 60); //相差⼩时
  endTime = endTime - timeHour * 60 * 60;
  let timeMinutes = parseInt(endTime / 60); //相差分钟
  // console.log('剩余' + timeDay + '天' + timeHour + '小时' + timeMinutes + '分钟');
  if (endTime < 0) {
    return '剩余' + 0 + '天' + 0 + '小时' + 0 + '分钟';
  }

  return '剩余' + timeDay + '天' + timeHour + '小时' + timeMinutes + '分钟';
}
