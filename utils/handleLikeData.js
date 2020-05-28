export const handleLikeData = (data, state) => {
  if (data.userLike.state === 1) {
    --data.like
  } else if (data.userLike.state === 2) {
    --data.dislike
  }

  if (state === 1) {
    ++data.like
  } else if (state === 2) {
    ++data.dislike
  }
  data.userLike.state = state
  return data
}
