import findLastIndex from 'lodash/findLastIndex'

const playTimes = [0, 0]
for (let i = 2; i < 6; i++) {
  playTimes[i] = (1 << i * 2) * 3600
}

export const grade = value => findLastIndex(playTimes, item => item <= value)
