import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: null,
  sidebarMinimize: false,
  darkMode: true,
  lang:"zhchs",
  token:null,
  user:null,
  root:null,
  IPPORT:'',
  WSROOT:'',
  title:'',
  VideoCodec:'',
  Resolution:'',
  Resolution:'',
  room:'',
  pushaudio:'',
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  // toggleSidebarMobile (state) {
  //   const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
  //   state.sidebarShow = sidebarClosed ? true : 'responsive'
  // },
  set (state, [variable, value]) {
    state[variable] = value
  },
  toggle (state, variable) {
    state[variable] = !state[variable]
  }
}

export default new Vuex.Store({
  state,
  mutations
})