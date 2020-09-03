<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ 1000</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 生成二维码的包
import QRCode from "qrcode";
export default {
  data() {
    return {
      //包含支付信息
      payInfo: "",
      //计时器id
      timerId: null,
    };
  },
  watch: {
    //需要页面加载完毕后，获取参数；
    // 该回调将会在侦听开始之后被立即调用
    // d: {
    //   handler: 'someMethod',
    //   immediate: true
    // },

    "$store.state.user.userInfo.token": {
      handler() {
        console.log("执行监听器,监听到有token值的时候，执行二维码的渲染操作");
        if (this.$store.state.user.userInfo.token) {
          console.log(this.$store.state.user.userInfo.token);
          this.renderQRCode();
        }
      },
      //页面打开的时候先触发一次；
      immediate: true,
    },
  },
  mounted() {
    //进入页面开始轮询；
    this.timerId = setInterval(async () => {
      const hasPay = await this.isPay();
      //支付成功，关掉轮询的定时器；
      if (hasPay) {
        console.log("支付成功。。。");
        clearInterval(this.timerId);
        return;
      }
    }, 3000);
  },
  methods: {
    renderQRCode() {
      const { id } = this.$route.query;
      const { userInfo } = this.$store.state.user;
      this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }).then((res) => {
        console.log(res);
        //二维码数组在payInfo中;
        const { payInfo, price } = res.data;

        this.payInfo = payInfo;
        // 生成二维码到canvas
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, payInfo.code_url, {
          width: 200,
        });
      });
    },
    async isPay() {
      const { id } = this.$route.query;
      const {
        api,
        user: { userInfo },
      } = this.$store.state;
      //发送支付请求；
      return this.$axios({
        url: `airorders/checkpay`,
        method: "POST",
        data: {
          id,
          nonce_str: this.payInfo.nonce_str,
          out_trade_no: this.payInfo.order_no,
        },
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }).then((res) => {
        console.log("支付中。。。");
        const { statusTxt } = res.data;
        if (statusTxt == "支付完成") {
          this.$confirm("订单支付成功", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "success",
          });
          //返回成功的promise对象，传值true；
          return Promise.resolve(true);
        }
        //返回成功的promise对象，传值false；
        return Promise.resolve(false);
      });
    },
  },
  destroyed() {
    //声明周期销毁阶段销毁定时器；
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>