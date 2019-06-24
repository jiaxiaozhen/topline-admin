// 封装本地存储中的用户信息
const USER_KEY = 'user_info'

export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export function setUser (data) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export function removeUser () {
  window.localStorage.removeItem(USER_KEY)
}
