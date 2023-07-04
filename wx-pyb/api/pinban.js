import {http, PINBAN_SINGLE_WEB} from "../utils/request.js"

export function pinban(data) {
    return http({
      url: PINBAN_SINGLE_WEB + '/pinban_single_web',
      method:'POST',
      data,
      myHeader: {
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    });
}
export function pinban_jing(data) {
  return http({
    url: PINBAN_SINGLE_WEB + '/pinban_single_web/pinban_jing',
    method:'POST',
    data,
    myHeader: {
      'Content-Type': 'application/x-www-form-urlencoded' 
    },
  });
}
export function getPinBanParams(data) {
  return http({
    url:  '/special/miniCollageParams/getPinBanParams',
    method:'POST',
    data
  });
}
export function signByBehavior(data) {
  return http({
    url:  '/logs/miniUsersBehaviorLog/signByBehavior',
    method:'POST',
    data
  });
}