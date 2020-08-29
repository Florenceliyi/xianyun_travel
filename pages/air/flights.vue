<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <!-- -->
        <flightsFilters :data="cacheFlightsData" @setDataList="setDataList"></flightsFilters>

        <!-- 航班头部布局 -->
        <flightsListHead></flightsListHead>

        <!-- 航班信息 -->
        <div>
          <flightsItem :data="item" v-for="(item, index) in dataList" :key="index"></flightsItem>
          <!-- 分页 -->
          <el-row type="flex" justify="center" style="margin-top:10px;">
            <!-- size-change：切换条数时候触发 -->
            <!-- current-change：选择页数时候触发 -->
            <!-- current-page: 当前页数 -->
            <!-- page-size：当前条数 -->
            <!-- total：总条数 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="flightsData.total"
            ></el-pagination>
          </el-row>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <flightsAside></flightsAside>
      </div>
    </el-row>
  </section>
</template>

<script>
import flightsListHead from "@/components/air/flightsListHead.vue";
import flightsItem from "@/components/air/flightsItem.vue";
import flightsFilters from "@/components/air/flightsFilters.vue";
import flightsAside from "@/components/air/flightsAside.vue";
import moment from "moment";

export default {
  components: {
    flightsListHead,
    flightsItem,
    flightsFilters,
    flightsAside,
  },
  data() {
    return {
      flightsData: {}, // 航班总数据
      dataList: [], // 航班列表数据，用于循环flightsItem组件，单独出来是因为要分页
      pageIndex: 1, // 当前页数
      pageSize: 5, // 显示条数
      cacheFlightsData: {
        //缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {},
      },
      flightsData: {
        // 航班总数据
        flights: [],
        info: {},
        options: {},
      },
    };
  },
  watch: {
    //监听是否有路由跳转，有则渲染新数据；
    $route() {
      this.getFlightsData();
    },
  },
  mounted() {
    this.getFlightsData();
  },
  methods: {
    //获取航班信息总数居;
    getFlightsData() {
      const backData = this.$axios({
        url: "/airs",
        params: this.$route.query,
      }).then((res) => {
        this.flightsData = res.data;
        // this.dataList = this.flightsData.flights;
        // 缓存一份新的列表数据数据，这个列表不会被修改
        // 而flightsData会被修改
        this.cacheFlightsData = { ...res.data };
        // console.log("要传给子组件的数据");
        // console.log(this.cacheFlightsData);
        this.setDataList(); // 初始化dataList数据，获取1 - 10条
      });
    },
    // 设置dataList数据
    setDataList(arr) {
      // 如果有新数据从第一页开始显示
      // console.log(arr);
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.flightsData.total = arr.length;
      }

      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.dataList = this.flightsData.flights.slice(start, end);
    },
    // 切换条数时触发
    handleSizeChange(value) {
      console.log("pageSize:" + value);
      this.pageSize = value;
      this.pageIndex = 1;
      this.setDataList();
    },

    // 切换页数时触发
    handleCurrentChange(value) {
      console.log("pageIndex:" + value);
      this.pageIndex = value;
      this.setDataList();
    },
  },
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>