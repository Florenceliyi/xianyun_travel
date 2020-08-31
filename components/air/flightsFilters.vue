<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>

      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item, index) in sizeOptions"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="delAll">
      筛选：
      <el-button size="small" type="primary" round @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      sizeOptions: [
        { name: "大", size: "L" },
        { name: "中", size: "M" },
        { name: "小", size: "S" },
      ],
      flag: false,
      newAirInfo: [],
      selecList: {
        airportName: "",
        depTime: "",
        airlineName: "",
        airSize: "",
      },
    };
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  mounted() {
    //找不到数据时的异步回调；
    setTimeout(() => {
      console.log("父组件传过来的数据");
      console.log(this.data);
      //   console.log(this.newAirInfo);
    }, 500);
  },
  watch: {
    data(val) {
      //   this.newAirInfo = val;
      //可以监听父组件传递组件的值是否已经有
      //   console.log(this.newAirInfo);
    },
  },
  methods: {
    judgeData() {
      /*把数组抽取出来每次筛选出来后，赋值给新声明的arr数组，实现下一个筛选的数组是上一个筛选后的数组，因此能实现多个下拉筛选框功能*/
      let arr = this.data.flights;

      let { airportName, depTime, airlineName, airSize } = this.selecList;
      if (airportName) {
        arr = arr.filter((airport) => {
          return airport.org_airport_name === airportName;
        });
      }
      if (depTime) {
        const startTime = depTime.split(",")[0];
        const endTime = depTime.split(",")[1];
        arr = arr.filter((depTime) => {
          const curTime = +depTime.dep_time.split(":")[0];
          if (curTime >= startTime && curTime < endTime) {
            return true;
          }
        });
      }
      if (airlineName) {
        arr = arr.filter((airline) => {
          return airline.airline_name === airlineName;
        });
      }
      if (airSize) {
        arr = arr.filter((planeSize) => {
          return planeSize.plane_size === airSize;
        });
      }
      console.log(arr);
      //筛选完毕的数组传给父组件;
      this.$emit("setDataList", arr);
    },

    // 选择机场时候触发
    handleAirport(value) {
      this.selecList.airportName = value;

      this.judgeData();
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      this.selecList.depTime = value;
      this.judgeData();
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      this.selecList.airlineName = value;
      this.judgeData();
    },

    // 选择机型时候触发
    handleAirSize(value) {
      this.selecList.airSize = value;
      this.judgeData();
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";

      this.$emit("setDataList", this.data.flights);
    },
  },
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
.delAll {
  margin: 10px 0;
}
</style>