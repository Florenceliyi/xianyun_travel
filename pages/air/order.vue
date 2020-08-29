<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <orderForm></orderForm>
      </div>

      <!-- 侧边栏 -->
      <div class="aside"></div>
    </el-row>
  </div>
</template>

<script>
import orderForm from "@/components/air/orderForm.vue";
export default {
  components: {
    orderForm,
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>