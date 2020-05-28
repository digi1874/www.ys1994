import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import chunk from 'lodash/chunk'
import map from 'lodash/map'

const vodTableName = 'vods'
const userTableName = 'users'

let db
let status = 'loading'
const pending = []

if (!process.server && window.indexedDB) {
  const request = window.indexedDB.open('ys1994', 5)

  request.onsuccess = (e) => {
    db = e.target.result
    status = 'success'
    forEach(pending, item => item())
  }

  request.onerror = () => {
    status = 'error'
    forEach(pending, item => item())
  }

  request.onupgradeneeded = (e) => {
    db = e.target.result
    forEach([vodTableName, userTableName], (item) => {
      if (!db.objectStoreNames.contains(item)) {
        db.createObjectStore(item, { keyPath: 'id' })
      }
    })
  }
}

const handleStatus = (reject, handle) => {
  if (status === 'error') {
    reject(new Error('不支持indexedDB'))
  } else if (status === 'loading') {
    pending.push(() => handleStatus(reject, handle))
  } else if (status === 'success') {
    handle()
  }
}

function dbGet (tableName, id) {
  return new Promise((resolve, reject) => {
    handleStatus(reject, () => {
      const request = db.transaction([tableName]).objectStore(tableName).get(id)

      request.onsuccess = function () {
        if (request.result) {
          resolve(request.result)
        } else {
          reject(new Error('无数据'))
        }
      }

      request.onerror = function () {
        reject(new Error('获取失败'))
      }
    })
  })
}

function dbSave (type, tableName, data) {
  return new Promise((resolve, reject) => {
    handleStatus(reject, () => {
      const request = db.transaction([tableName], 'readwrite').objectStore(tableName)[type](data)

      request.onsuccess = function () {
        resolve('写入成功')
      }

      request.onerror = function () {
        reject(new Error('写入失败'))
      }
    })
  })
}

const dbAdd = (tableName, data) => dbSave('add', tableName, data)
const dbUpdate = (tableName, data) => dbSave('put', tableName, data)

const urlsChunk = (urls) => {
  if (isEmpty(urls)) {
    return []
  }

  urls = chunk(urls, 50)
  return map(urls, (item) => {
    return {
      urls: item,
      name: `${item[0].name} - ${item[item.length - 1].name}`
    }
  })
}
export const handleVodData = data => ({
  ...data,
  urlList: urlsChunk(data.urls),
  m3u8List: urlsChunk(data.m3u8s),
  downUrlList: urlsChunk(data.downURLs)
})
export const dbAddVod = data => dbAdd(vodTableName, handleVodData(data))
export const dbGetVod = id => dbGet(vodTableName, id)
export const dbUpdateVod = data => dbUpdate(vodTableName, handleVodData(data))

export const dbAddUser = data => dbAdd(userTableName, data)
export const dbGetUser = id => dbGet(userTableName, id)
export const dbUpdateUser = data => dbUpdate(userTableName, data)
