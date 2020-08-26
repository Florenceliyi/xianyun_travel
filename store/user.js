// 用户管理
//定义一个仓库的公共数据，定义一个函数返回一个数据对象；

/* export const state = () => {
  return {
    
  }
} */
//以下写法与上面写法一致;
export const state = () => ({
  // 采用接口返回的数据结构
  userInfo: {
    token: "",
    user: {},
    newData: {
      florence: 666
    }
  },
})

//mutations用于修改公共数据的方法；
export const mutations = {
  // 保存用户信息到state
  setUserInfo(state, data) {
    console.log(state, data);
    state.userInfo = data;
  },
  // 清除用户数据
  cleanUserInfo(state, info) {
    console.log(state, info);
    if (process.browser) {
      localStorage.removeItem("userInfo");
    }
    state.userInfo = {};
  },
  //测试mutation
  changeData(state, data) {
    console.log(state);
    console.log(data);
    // state.newData.florence = data;
    state.userInfo.newData.florence = data;
  }
};

//用于发数据中的异步请求的方法；
export const actions = {
  // 登录
  login({
    commit
  }, data) {
    return this.$axios({
      url: "/accounts/login",
      method: "POST",
      data: data
    }).then(res => {
      const data = res.data;
      // 保存到state
      commit("setUserInfo", data);
      return data;
    })
  }
};
