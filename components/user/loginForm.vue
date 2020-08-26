<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules" class="form">
      <el-form-item class="form-item" prop="username">
        <el-input placeholder="用户名/手机" v-model="form.username" @change="onChange"></el-input>
        <!-- <div class="el-form-item__error" v-if="form.username == ''">请输入用户名</div> -->
      </el-form-item>

      <el-form-item class="form-item" prop="password">
        <el-input placeholder="密码" v-model="form.password" type="password" @change="onChange"></el-input>
        <!-- <div class="el-form-item__error" v-if="form.password == ''">请输入密码</div> -->
      </el-form-item>

      <p class="form-text">
        <nuxt-link to="#">忘记密码</nuxt-link>
      </p>

      <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        username: "",
        password: "",
      },
      // 表单规则
      rules: {
        //校验规则对应prop内传进的属性，一个属性对应一个数组，
        username: [
          {
            required: true,
            message: "请输入用户名或手机",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            min: 4,
            max: 6,
            message: "请输入密码，长度必须为4~6个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  //   watch: {
  //     form: {
  //       handler: function (val) {
  //         //val返回一个监听所有form属性中的对象;
  //         if (val.username == "") {
  //         }
  //       },
  //       /* deep属性可以监听多重嵌套的数据 */
  //       deep: true,
  //     },
  //   },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      console.log(this.form);
      // 验证表单
      this.$refs["form"].validate((valid) => {
        console.log(valid);
        // 为true表示没有错误
        if (valid) {
          //   this.$axios({
          //     url: "/accounts/login",
          //     method: "POST",
          //     data: this.form,
          //   })
          //     .then((res) => {
          //       console.log(res);
          //     })
          //     .catch((err) => {
          //       this.$emit("error", true);
          //     });

          //vuex改写store
          // 新增代码
          this.$store.dispatch("user/login", this.form).then((res) => {
            // 成功提示
            this.$message({
              message: "登录成功，正在跳转",
              type: "success",
            });
            // 跳转到首页
            setTimeout(() => {
              this.$router.replace("/");
            }, 1000);
          });
        }
      });
    },
    onChange() {},
  },
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
  .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>