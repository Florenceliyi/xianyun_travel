<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <!-- :trigger-on-focus="false" 属性表示输入之后才会匹配搜索建议 -->
        <el-autocomplete
          v-model="form.departCity"
          :trigger-on-focus="false"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :trigger-on-focus="false"
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <!-- :pickerOptions="disableBeforeDay" 用于禁用当天日期前的所有日期 -->
        <el-date-picker
          :pickerOptions="disableBeforeDay"
          v-model="form.departTime"
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" },
      ],
      currentTab: 0,
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departTime: "",
      },
      //禁用当天日期前的所有日期选择；
      disableBeforeDay: {
        disabledDate(time) {
          return time.getTime() < new Date().setDate(new Date().getDate() - 1);
        },
      },
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      this.currentTab = index;
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch(value, cb) {
      console.log(value);
      if (value.trim().length == 0) {
        return;
      }
      //调用城市请求接口方法;
      //返回一个promise对象;
      // this.queryCity(value).then((res) => {
      //   console.log(res);
      //   const backList = res;
      //   if (backList) {
      //     // console.log(backList);
      //     cb(backList);
      //   }
      // });
      //async await改写promise
      const backList = await this.queryCity(value);
      if (backList.length > 0) {
        //不在下拉列表中选择，则默认选择第一项;
        const str = backList[0].value.slice(0, 2);
        this.form.departCity = str;
        this.form.departCode = backList[0].sort;
      } else {
        this.$message.warning("查无此城！");
        //清空输入框；
        this.form.departCity = "";
      }
      cb(backList);
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDestSearch(value, cb) {
      if (value.trim().length == 0) {
        return;
      }
      //cb方法传递一个数组带有value属性的对象，其值为搜索出来的值；
      // cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      // const backList = this.queryCity(value);
      // this.queryCity(value).then((res) => {
      //   console.log(res);
      //   const backList = res;
      //   if (backList) {
      //     // console.log(backList);
      //     cb(backList);
      //   }
      // });
      const backList = await this.queryCity(value);
      if (backList.length > 0) {
        //不在下拉列表中选择，则默认选择第一项;
        //切割字符串不要“市”
        // console.log(backList[0].value.length);

        const str = backList[0].value.slice(0, 2);
        this.form.destCity = str;
        this.form.destCode = backList[0].sort;
      } else {
        this.$message.warning("查无此城！");
        //清空输入框；
        this.form.destCity = "";
      }
      cb(backList);
    },

    //搜索城市的方法封装;
    queryCity(value) {
      return this.$axios
        .get("/cities", { params: { name: value } })
        .then((res) => {
          console.log(res);
          const list = res.data.data.map((x) => ({ ...x, value: x.name }));
          console.log(list);
          return list;
        });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      // console.log(item);
      //将值赋值给form表单中的数据;

      const str = item.value.slice(0, 2);

      this.form.departCity = str;
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      const str = item.value.slice(0, 2);
      // console.log("当前选择的目标城市：" + str);
      this.form.destCity = str;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      console.log(value);
      this.form.departTime = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      // const { departCity, departCode, destCity, destCode } = this.form;
      // this.form.departCity = destCity;
      // this.form.departCode = destCode;
      // this.form.destCity = departCity;
      // this.form.destCode = departCode;

      //解构赋值的简便写法; [a,b,c] = [c, a, b] a = c, b = a, c = b
      [
        this.form.departCity,
        this.form.departCode,
        this.form.destCity,
        this.form.destCode,
      ] = [
        this.form.destCity,
        this.form.destCode,
        this.form.departCity,
        this.form.departCode,
      ];
    },

    // 提交表单是触发
    handleSubmit() {
      console.log(this.form);
      //在url上带上form表单中的参数;
      this.$router.push({ path: "/air/flights", query: this.form });
    },

    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$confirm("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
    cursor: pointer;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
