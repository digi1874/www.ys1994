/*
 * @Author: lin.zhenhui
 * @Date: 2020-03-19 20:51:19
 * @Last Modified by: lin.zhenhui
 * @Last Modified time: 2020-05-27 11:47:50
 */

export const USER = {
  API_BASE_URL: process.server ? `http://localhost:${process.env.NODE_ENV === 'development' ? 8031 : 8030}/user/` : '/user/',
  GRADE_COLOR: {
    1: '666',
    2: '8ec31f',
    3: '00a7de',
    4: '9172ac',
    5: 'f6c400'
  }
}
