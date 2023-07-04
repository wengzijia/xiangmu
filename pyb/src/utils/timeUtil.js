import moment from 'moment';

export function formatSecond(time) {
  return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
}
export function formatDateSecond(time) {
  return moment(time * 1000).format('YYYY-MM-DD');
}
