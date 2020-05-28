import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'

/**
 * 创建时间
 * @param   {Number|String} val - 时间值
 * @returns {Date}              - 返回新创建时间Date
 */
export const date = val => val ? isNumber(val) ? new Date(val) : new Date((val + '').replace(/-/g, '/')) : new Date()

/**
 * 格式化时间
 * @function
 * @param   {Number|String} val    - 时间值
 * @param   {String}        format - 格式值。年：YYYY|YY、月：MM|M、日：DD|D、时：hh|h、分：mm|m、秒：ss|s
 * @returns {String}               - 返回格式后的值
 * @example
 * import { formatDate } from 'formatDate';
 *
 * formatDate(1566454268088, 'YYYY年MM月DD日 h:mm:ss')
 * // => "2019年08月22日 14:11:08"
 *
 * formatDate('2019-08-22T01:50:00.000+0000', 'YYYY-MM-DD hh:mm:ss')
 * // => "2019-08-22 09:50:00"
 *
 * formatDate("Thu Aug 22 2019 14:14:18 GMT+0800 (中国标准时间)", 'YYYY/MM/DD hh:mm:ss')
 * // => "2019/08/22 14:14:18"
 */
export const formatDate = (val, format = 'YYYY-MM-DD hh:mm:ss') => {
  if (!val) {
    return val
  }

  const newDate = date(val)

  if (isNaN(newDate.getTime())) {
    return val
  }

  if (/YYYY/.test(format)) {
    format = format.replace(/YYYY/g, newDate.getFullYear())
  } else if (/YY/.test(format)) {
    format = format.replace(/YY/g, (newDate.getFullYear() + '').replace(/\d{2}/, ''))
  }

  if (/MM/.test(format)) {
    format = format.replace(/MM/g, (newDate.getMonth() + 1 + '').padStart(2, '0'))
  } else if (/M/.test(format)) {
    format = format.replace(/M/g, newDate.getMonth() + 1)
  }

  if (/DD/.test(format)) {
    format = format.replace(/DD/g, (newDate.getDate() + '').padStart(2, '0'))
  } else if (/D/.test(format)) {
    format = format.replace(/D/g, newDate.getDate())
  }

  if (/hh/.test(format)) {
    format = format.replace(/hh/gi, (newDate.getHours() + '').padStart(2, '0'))
  } else if (/h/.test(format)) {
    format = format.replace(/h/gi, newDate.getHours())
  }

  if (/mm/.test(format)) {
    format = format.replace(/mm/g, (newDate.getMinutes() + '').padStart(2, '0'))
  } else if (/m/.test(format)) {
    format = format.replace(/m/g, newDate.getMinutes())
  }

  if (/ss/.test(format)) {
    format = format.replace(/ss/g, (newDate.getSeconds() + '').padStart(2, '0'))
  } else if (/s/.test(format)) {
    format = format.replace(/s/g, newDate.getSeconds())
  }

  return format
}
