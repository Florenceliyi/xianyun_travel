<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item, index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" v-model="item.username" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" v-model="item.id" class="input-with-select">
              <el-select v-model="value" slot="prepend" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
                <el-option label="护照" value="2" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <!-- 移除乘机人按钮 -->
          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div class="insurance-item" v-for="(item, index) in data.insurances" :key="index">
        <el-checkbox
          :label="`${item.type}：￥${item.price}/份×${users.length}  最高赔付${item.compensation}`"
          @change="handleInsurance(item.id,$event)"
          border
        ></el-checkbox>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">{{counting.cons}}</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>

        <el-button to type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
        <input type="hidden" :value="allPrice" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //乘机人数据信息;
      users: [
        {
          username: "",
          id: "",
        },
      ],
      value: "身份证",
      insurances: [], // 保险数据
      contactName: "", // 联系人名字
      contactPhone: "", // 联系人电话
      captcha: "", // 验证码
      invoice: false, // 发票,
      //倒计时标识;
      counting: {
        isGoing: false,
        cons: "点击发送验证码",
        time: 60,
        timerId: null,
      },
    };
  },
  props: {
    // 接收父组件order机票信息
    data: {
      type: Object,
      default: {},
    },
  },
  watch: {
    data(val) {
      console.log(val);
    },
    // users: {
    //   handler(val) {
    //     console.log(val);
    //   },
    //   deep: true,
    // },
    // value(val) {
    //   console.log(val);
    // },
  },
  computed: {
    // 计算总价格
    allPrice() {
      console.log(123);
      let price = 0;
      let len = this.users.length;

      price += this.data.seat_infos.org_settle_price * len;

      this.insurances.forEach((v) => {
        price += this.data.insurances[v - 1].price * len;
      });

      price += this.data.airport_tax_audlet * len;

      // 触发设置总金额事件
      this.$emit("setAllPrice", price);

      return price;
    },
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      //超过5个不能再添加;
      if (this.users.length >= 5) {
        this.$message.warning("最多只能添加5位乘机人");
        return;
      }
      this.users = [
        ...this.users,
        {
          username: "",
          id: "",
        },
      ];
    },

    // 选择保险
    handleInsurance(id, e) {
      console.log(e);
      //   console.log(this.insurances);
      if (id && e == true) {
        this.insurances.push(id);
      }
      if (id && e == false) {
        this.insurances.forEach((v, i) => {
          if (v == id) {
            this.insurances.splice(i, 1);
          }
        });
      }

      console.log(this.insurances);
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    async handleSendCaptcha() {
      if (!this.contactPhone) {
        this.$confirm("手机号码不能为空", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
        return;
      }

      if (this.contactPhone.length !== 11) {
        this.$confirm("手机号码格式错误", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
        return;
      }
      //倒计时中，不发送请求;
      if (this.counting.isGoing) {
        return;
      } else {
        console.log(this.counting.isGoing);
        console.log("定时器已经开启");

        const backData = await this.$axios({
          url: `/captchas`,
          method: "POST",
          data: {
            tel: this.contactPhone,
          },
        });
        const { code } = backData.data;
        if (code) {
          //数据已经返回了
          const res = await this.$confirm(`模拟手机验证码为：${code}`, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning",
          });
          if (confirm) {
            //开启定时器标识;
            this.counting.isGoing = true;
            //开启一个60s的定时器
            this.counting.timerId = setInterval(() => {
              this.counting.time--;
              this.counting.cons = `剩余${this.counting.time}秒重新发送`;
              console.log(this.counting.time);
              if (this.counting.time < 0) {
                clearInterval(this.counting.timerId);
                //重新设置文本；
                this.counting.cons = "重新发送验证码";
                //重新设定时间;
                this.counting.time = 60;
                //关闭定时器开启标识；
                this.counting.isGoing = false;
              }
            }, 1000);
          } else {
            console.log("取消发送");
          }
        } else {
          //验证码不通过；
          this.$message.warning("验证码不通过，请重新输入");
        }
      }
    },

    // 提交订单
    handleSubmit() {
      const orderData = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: this.invoice,
        captcha: this.captcha,
        seat_xid: this.data.seat_infos.seat_xid,
        air: this.data.id,
      };

      const { token } = this.$store.state.user.userInfo;
      console.log(this.$route);
      //判断是否有token值
      if (!token) {
        //带上当前的url信息，跳转登录页面；
        let url = this.$route.fullPath;
        //触发vuex的公共方法注意要加上文件夹名字；
        this.$store.commit("order/setSourceURL", url);
        this.$message.warning("请先登录！");
        this.$router.push("/user/login");
      }
      this.$axios({
        url: `/airorders`,
        method: "POST",
        data: orderData,
        headers: {
          Authorization: `Bearer ${token || "NO TOKEN"}`,
        },
      })
        .then((res) => {
          console.log(res);
          const { id } = res.data.data;
          console.log(id);
          // 跳转到付款页
          this.$router.push({
            path: "/air/pay",
            query: {
              id,
            },
          });
          this.$message({
            message: "正在生成订单！请稍等",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          const { message } = err.response.data;
          // 警告提示
          this.$confirm(message, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>