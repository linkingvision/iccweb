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


const Setting = () => import('@/views/mainpage/setting')
const Meetingman = () => import('@/views/mainpage/setting/Meetingman')
const Userinfo = () => import('@/views/mainpage/setting/userinof')
const Roleinof = () => import('@/views/mainpage/setting/roleinof')
// const Device = () => import('@/views/mainpage/setting/device')
const Stream = () => import('@/views/mainpage/setting/stream')
const Onvif = () => import('@/views/mainpage/setting/onvif')
const File = () => import('@/views/mainpage/setting/file')
const Deviceall = () => import('@/views/mainpage/setting/deviceall')
const Tran_customize = () => import('@/views/mainpage/setting/Tran_customize')
const Tran_default = () => import('@/views/mainpage/setting/Tran_default')
const Device_sdk = () => import('@/views/mainpage/setting/device_sdk')

const Webrtc_cloudmode = () => import('@/views/mainpage/setting/webrtc_cloudmode')
const Webrtc_Forwardingmode = () => import('@/views/mainpage/setting/webrtc_Forwardingmode')
const Webrtc_turnmode = () => import('@/views/mainpage/setting/webrtc_turnmode')


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
					path: 'Participants',
					name: "Participants",
					component: Participants,
					meta: {
						title: '播放',
						type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
					},
				},
				{
					path: 'Setting',
					name: "Setting",
					component: Setting,
					meta: {
						title: '2',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					},
					children: [
						{
							path: 'Meetingman',
							name: "Meetingman",
							component: Meetingman,
							meta: {
							  title: '2-1',
							  type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},
						{
							path: 'Userinfo',
							name: "User",
							component: Userinfo,
							meta: {
								title: '2-2',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},
						{
							path: 'Roleinof',
							name: "Roleinof",
							component: Roleinof,
							meta: {
							title: '2-3',
							type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							}
						},
						{
							path: 'Stream',
							name: "Stream",
							component: Stream,
							meta: {
								title: '2-4',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},
						{
							path: 'Onvif',
							name: "Onvif",
							component: Onvif,
							meta: {
								title: '2-5',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'File',
							name: "File",
							component: File,
							meta: {
								title: '2-6',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Deviceall',
							name: "Deviceall",
							component: Deviceall,
							meta: {
								title: '2-7',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Tran_default',
							name: "Tran_default",
							component: Tran_default,
							meta: {
								title: '2-8',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Tran_customize',
							name: "Tran_customize",
							component: Tran_customize,
							meta: {
								title: '2-9',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Device_sdk',
							name: "Device_sdk",
							component: Device_sdk,
							meta: {
								title: '2-10',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Webrtc_cloudmode',
							name: "Webrtc_cloudmode",
							component: Webrtc_cloudmode,
							meta: {
								title: '2-11',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Webrtc_Forwardingmode',
							name: "Webrtc_Forwardingmode",
							component: Webrtc_Forwardingmode,
							meta: {
								title: '2-12',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Webrtc_turnmode',
							name: "Webrtc_turnmode",
							component: Webrtc_turnmode,
							meta: {
								title: '2-13',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						}
					]
				}
            ]
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