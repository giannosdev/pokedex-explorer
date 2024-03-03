<template>
  <div class="pokeball-loader">
    <div class="pokeball">
      <div class="pokeball__button"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokeballLoader'
};
</script>

<style lang="scss">
.pokeball-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .pokeball {
    position: relative;
    width: 100px;
    height: 100px;
    background: linear-gradient(180deg, #ff0000 50%, #ffffff 50%);
    border: 10px solid #000000;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    &__button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
      height: 30px;
      background: #ffffff;
      border: 5px solid #000000;
      border-radius: 50%;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
