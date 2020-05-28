import isEmpty from 'lodash/isEmpty'
import { dbGetVod, handleVodData, dbUpdateVod, dbAddVod } from './indexedDB'

export const asyncDataGetVodDetail = async ({ $api, query }) => {
  let errorMsg, detail
  const get = async () => {
    try {
      const { data } = await $api.getVodDetail(query.id)
      detail = handleVodData(data)
    } catch ({ response, message }) {
      errorMsg = response.data.msg || message
    }
  }

  if (process.server) {
    await get()
  } else {
    try {
      detail = await dbGetVod(query.id * 1)
    } catch (err) {
      await get()
    }
  }
  return { errorMsg, vodDetail: detail }
}

export const getVodDetail = ({ vodId, $api }) => {
  return new Promise((resolve, reject) => {
    dbGetVod(vodId).then((data) => {
      resolve(data)
    }).catch(() => {
      $api.getVodDetail(vodId).then(({ data }) => {
        resolve(handleVodData(data))
      }).catch(reject)
    })
  })
}

export const handleDBVodData = ({ vodDetail, $api }) => {
  return new Promise((resolve, reject) => {
    !isEmpty(vodDetail) &&
    dbGetVod(vodDetail.id).then((data) => {
      if (data.updatedTime !== vodDetail.updatedTime) {
        dbUpdateVod({ ...vodDetail, saveTime: new Date() * 1 })
        resolve()
      } else if (/更/.test(data.serial) && (data.saveTime + 3600000) < new Date() * 1) {
        $api.getVodDetail(vodDetail.id + '?sync=1').then(({ data }) => {
          data = handleVodData(data)
          dbUpdateVod({ ...data, saveTime: new Date() * 1 })
          resolve(data)
        }).catch(reject)
      }
    }).catch(() => {
      dbAddVod({ ...vodDetail, saveTime: new Date() * 1 })
      resolve()
    })
  })
}
