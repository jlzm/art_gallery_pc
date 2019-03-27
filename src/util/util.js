function getStyle(node, attr) {
  if (typeof getComputedStyle !== 'undefined') {
    var value = getComputedStyle(node, null).getPropertyValue(attr)
    return attr === 'opacity' ? value * 100 : value // 兼容不透明度，如果是不透明度，则返回整数方便计算
  } else if (typeof node.currentStyle !== 'undefined') {
    if (attr === 'opacity') { // 兼容不透明度
      return Number(node.currentStyle.getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1])
    } else {
      return node.currentStyle.getAttribute(attr)
    }
  }
}
/**
 *
 * @param {string} dateStr
 */
function formatDate(dateStr, type) {
  var month = dateStr.slice(4, 6)
  var day = dateStr.slice(6)
  var nowYear = new Date().getFullYear()
  if (type === 2) {
    // toISOString "2018-10-02T03:02:06.000Z"
    month = dateStr.slice(5, 7)
    day = dateStr.slice(8, 10)
  }
  if (Number(month) < 10) {
    month = '0' + month
  }
  if (Number(day) < 10) {
    day = '0' + day
  }
  if (type === 1) {
    return nowYear + '-' + month + '-' + day
  } else if (type === 2) {
    return nowYear + '年' + month + '月' + day + '日'
  }
  return month + '/' + day
}
/**
 * 
 * @param {数组对象} arr 
 * @param {已有健} type 
 * @param {需要获取的健} getType 
 * @param {已有健键值} val 
 * 通过键与键值获取对象
 */
function getArrVal(arr, type, getType, val) {
  let returnVal
  if (!arr.length) {
    returnVal = ''
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][type] === val) {
      if (!getType) {
        returnVal = arr[i]
      } else {
        returnVal = arr[i][getType]
      }
      break
    }
  }
  return returnVal
}
/** debounce 函数防抖 
 *  delay秒内进行的两次调用只会执行一次
 */
function debounce(fn, delay) {
  let timer = null
  return function() {
    let context = this
    let arg = arguments
    clearTimeout(timer)
    time = setTimeout(function() {
      fn.apply(context, arg)
    }, delay)
  }
}
/** format hour*/
// 转换时间
function formatHour(time) {
  time = new Date(time)
  let hour = time.getHours()
  let minutes = time.getMinutes()
  hour < 10 && (hour = '0' + hour)
  minutes < 10 && (minutes = '0' + minutes)
  return hour + ':' + minutes
}

function getTime(time) {
  const weekmap = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  time = new Date(time)
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  let weeknum = time.getDay()
  let weekLabel = weekmap[weeknum]
  if (Number(month) < 10) {
    month = '0' + month
  }
  if (Number(day) < 10) {
    day = '0' + day
  }
  return {
    year,
    month,
    day,
    weekLabel,
    weeknum
  }
}

export default {
  getStyle,
  formatDate,
  debounce,
  formatHour,
  getArrVal,
  getTime
}