<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <orderForm :data="infoData" @setAllPrice="setAllPrice"></orderForm>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <orderAside :data="infoData" :allPrice="allPrice"></orderAside>
      </div>
    </el-row>
  </div>
</template>

<script>
import orderForm from "@/components/air/orderForm.vue";
import orderAside from "@/components/air/orderAside.vue";
export default {
  components: {
    orderForm,
    orderAside,
  },
  data() {
    return {
      // 机票信息
      infoData: {
        insurances: [], // 初始化保险数据
        seat_infos: {},
      },
      allPrice: 0,
    };
  },
  mounted() {
    const { query } = this.$route;

    this.$axios({
      url: `airs/${query.id}`,
      params: {
        seat_xid: query.seat_xid,
      },
    }).then((res) => {
      this.infoData = res.data;
    });
  },
  methods: {
    setAllPrice(price) {
      this.allPrice = price;
    },
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