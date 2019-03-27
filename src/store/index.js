import vuex from 'vuex'
import vue from 'vue'
import state from './state'
import * as mutations from './mutation'
import createPersistedState from 'vuex-persistedstate'
vue.use(vuex)
export default new vuex.Store({
  state,
  mutations,
  plugins: [createPersistedState()]
})