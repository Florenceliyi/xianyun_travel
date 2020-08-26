<template>
  <div>
    <input type="text" v-model="this.$store.state.user.userInfo.newData.florence" />

    <button @click="handlerClick">点我修改数据</button>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.$store.state);
  },
  methods: {
    handlerClick() {
      console.log(this.$store.state.user.userInfo.newData.florence);
      this.$store.commit("user/changeData", "去佛罗伦萨吧~");
    },
  },
};
</script>

<style>
</style>