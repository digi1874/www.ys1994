import isObject from 'lodash/isObject'

export const setSessionStorageItem = (key, value) => {
  if (isObject(value)) {
    value = JSON.stringify(value)
  }

  sessionStorage.setItem(key, value)
}

export const getSessionStorageItem = (key) => {
  let value = sessionStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (err) {}

  return value
}
