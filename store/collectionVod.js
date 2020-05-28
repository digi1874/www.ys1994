import { storeDefault, storeMutations } from '@/utils'

export const state = storeDefault

export const mutations = {
  ...storeMutations('collectionVod')
}
