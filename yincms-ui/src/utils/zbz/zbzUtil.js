import { message as Message } from '@/utils/resetMessage';

/**
 * 错误处理
 * @param {Object} _response
 */
export function errorHandler(_response) {
  Message({ type: 'warning', message: _response.message });
  return '';
}

/**
 * 结果处理
 * @param {Object} _response ajax发送的请求结果进行统一处理
 * @returns 返回处理结果 两种情况 空值 结果
 */
export function resultHandler(_response) {
  let result = '';
  if (_response.code === '000000') {
    result = _response.data;
  } else {
    result = errorHandler(_response);
  }
  return result;
}
