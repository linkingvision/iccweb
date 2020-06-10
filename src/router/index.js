import Vue from 'vue'
import Router from 'vue-router'
import VueI18n from 'vue-i18n'
import store from '../store'
import LangEn from '../../static/lang/en'
import LangZhCHS from '../../static/lang/zhchs'
import LangZhCHT from '../../static/lang/zhcht'
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: store.state.lang,
    messages: {
      'en': LangEn,
      'zhchs': LangZhCHS,
      'zhcht': LangZhCHT
    }
})

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/mainpage/Dashboard')
const Participants = () => import('@/views/mainpage/dashboard/participants')

const Meetingman = () => import('@/views/mainpage/Meetingman')

const Userinfo = () => import('@/views/mainpage/setting/userinof')
const Roleinof = () => import('@/views/mainpage/setting/roleinof')

const Login = () => import('@/views/login')
const Logout = () => import('@/views/logout')
// const liveplay = () => import('@/views/widgets/liveplay')


Vue.use(Router)



// meta: {
//     title: '首页',
//     type: 'login'  // 是否需要判断是否登录,这里是需要判断
// },


export default new Router({
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
            path: '/',
            redirect: '/dashboard',
            // name: 'Dashboard',
            component: TheContainer,
            meta: {
                title: '1',
                type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
            },
            children: [
                {
                    path: 'dashboard',
                    name: "dashboard",
                    component: Dashboard,
                    meta: {
                      title: '1',
                      type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
                    },
				},
				{
                    path: 'Meetingman',
                    name: "Meetingman",
                    component: Meetingman,
                    meta: {
                      title: '2',
                      type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
                    },
				},
                {
                  path: 'Userinfo',
                  name: "Userinfo",
                  component: Userinfo,
                  meta: {
                    title: '3-1',
                    type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
                  }
			  	},
				  {
					path: 'Roleinof',
					name: "Roleinof",
					component: Roleinof,
					meta: {
					  title: '3-2',
					  type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				}
            ]
		},
		{
			path: '/Participants',
			name: "Participants",
			component: Participants,
			meta: {
				title: '播放',
				type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
			},
		},
        {
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				title: 'login',
				type: '' // 不需要鉴权
			}
        },
        {
			path: '/logout',
			name: 'Logout',
			component: Logout,
			meta: {
				title: 'Logout',
				type: '' // 不需要鉴权
			}
        }
    ]
})

if(localStorage.getItem('mcutoken')){
	store.state.token=localStorage.getItem('mcutoken');
  }
  if(localStorage.getItem('mcuuser')){
	store.state.user=localStorage.getItem('mcuuser');
  }
  if(localStorage.getItem('mculang')){
	store.state.lang=localStorage.getItem('mculang');
  }
  if(localStorage.getItem('mcuroot')){
	store.state.root=localStorage.getItem('mcuroot');
  }
  let root=process.env.VUE_APP_URL;
  if (root == undefined){
	  root = window.location.protocol + '//' + window.location.host + window.location.pathname;
  }
  store.state.IPPORT=root