import isObject from 'lodash/isObject'

export const setLocalStorageItem = (key, value) => {
  if (isObject(value)) {
    value = JSON.stringify(value)
  }

  localStorage.setItem(key, value)
}

export const getLocalStorageItem = (key) => {
  let value = localStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (err) {}

  return value
}
