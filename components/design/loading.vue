<template>
  <div class="loading">
    <div class="shapes">
      <div v-for="item in 4" :key="item" :class="'shape shape' + item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotation {
  from {
    transform:rotate(0deg);
  }to {
    transform:rotate(360deg);
  }
}
@keyframes shape1 {
  from {
    transform:translate(0, 0);
  }to {
    transform:translate(20px, 20px);
  }
}
@keyframes shape2 {
  from {
    transform:translate(0, 0);
  }to {
    transform:translate(-20px, 20px);
  }
}
@keyframes shape3 {
  from {
    transform:translate(0, 0);
  }to {
    transform:translate(20px, -20px);
  }
}
@keyframes shape4 {
  from {
    transform:translate(0, 0);
  }to {
    transform:translate(-20px, -20px);
  }
}
.loading {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.35);

  .shapes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    width:40px;
    height:40px;
    transform:rotate(10deg);
    animation:rotation 1s infinite;
  }

  .shape {
    margin: 5px;
    border-radius:5px;
    width:10px;
    height:10px;
  }

  .shape1 {
    background-color:#8ec31f;
    animation:shape1 0.5s ease 0s infinite alternate;
  }
  .shape2 {
    background-color:#00a7de;
    animation:shape2 0.5s ease 0s infinite alternate;
  }
  .shape3 {
    background-color:#9172ac;
    animation:shape3 0.5s ease 0s infinite alternate;
  }
  .shape4 {
    background-color:#f6c400;
    animation:shape4 0.5s ease 0s infinite alternate;
  }
}
</style>
