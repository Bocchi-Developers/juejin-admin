// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim()
}

// 对象判断是否为空
export function objBlank(obj: any) {
  for (const i in obj) {
    return true
  }
  return false // 如果为空,返回false
}

export function reqName(result: string) {
  const name = result.split('/')[result.split('/').length - 1]
  return name
}
