export function getLocalToken() {
  let token = localStorage.getItem('Access-Token');
  return token;
}
export function setLocalToken(token) {
  localStorage.setItem('Access-Token', token);
}
export function getSessionToken() {
  let token = sessionStorage.getItem('Access-Token');
  return token;
}
export function setSessionToken(token) {
  sessionStorage.setItem('Access-Token', token);
}
