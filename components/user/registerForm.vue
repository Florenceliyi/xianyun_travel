<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    /*官网的写法*/
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPassword");
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        console.log(value, this.form.password);
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    // const validatePass = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.form.password) {
    //     callback(new Error("两次输入密码不一致!"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      // 表单数据
      form: {
        username: "", // 登录用户名/手机
        password: "", // 登录密码
        checkPassword: "", // 确认密码
        nickname: "", // 昵称
        captcha: "", // 手机验证码
      },
      // 表单规则
      rules: {
        username: [
          {
            required: true,
            message: "请输入手机号长度为11位",
            trigger: "blur",
            min: 11,
            max: 11,
          },
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            message: "请输入密码，长度为4~6位",
            trigger: "blur",
            min: 4,
            max: 6,
          },
        ],
        checkPassword: [
          {
            validator: validateCheckPass,
            // validator: validatePass,
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur",
          },
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      if (!this.form.username) {
        this.$confirm("手机号码不能为空", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
        return;
      }

      //   if (this.form.username.length !== 11) {
      //     this.$confirm("手机号码格式错误", "提示", {
      //       confirmButtonText: "确定",
      //       showCancelButton: false,
      //       type: "warning",
      //     });
      //     return;
      //   }

      this.$axios({
        url: `/captchas`,
        method: "POST",
        data: {
          tel: this.form.username,
        },
      }).then((res) => {
        const { code } = res.data;
        this.$confirm(`模拟手机验证码为：${code}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success",
        });
      });
    },
    handleRegSubmit() {
      this.$refs["form"].validate((valid) => {
        console.log(valid);
        console.log(this.form);
        if (valid) {
          // 注册提交
          delete this.form.checkPassword;

          this.$axios({
            url: `/accounts/register`,
            method: "POST",
            data: this.form,
          }).then((res) => {
            //验证成功，跳转首页；
            console.log(res.data);
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
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