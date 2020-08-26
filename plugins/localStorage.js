//引入插件`vuex-persistedstate`，该插件会把本地存储的数据读取到`store`
import createPersistedState from 'vuex-persistedstate'

export default ({
  store
}) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: "store", // 读取本地存储的数据到store
    })(store)
  })
}
