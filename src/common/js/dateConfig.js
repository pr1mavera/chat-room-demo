export function formatDate(date, format) {
  if (format === undefined) {
    format = date
    date = new Date()
  }
  var map = {
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    } else if (t === 'S') {
      const ms = `00${date.getMilliseconds()}`
      return ms.substr(ms.length - 3)
    }
    return all
  })
  return format
}

export function randomMin2Max(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function isTimeDiffLongEnough (cache, next) {
  const cacheT = new Date(cache.replace(/-/g, '/'))
  const nextT = new Date(next.replace(/-/g, '/'))
  return nextT - cacheT >= 60000
}
