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
const Participants = () => import('@/views/mainpage/dashboard/Participants')

const Conference = () => import('@/views/mainpage/Conference')
const OneToOne = () => import('@/views/mainpage/OneToOne')
const ConferenceControl = () => import('@/views/mainpage/ConferenceControl')
const Control = () => import('@/views/mainpage/ConferenceControl/Control')

const Setting = () => import('@/views/mainpage/Setting')
const Meetingman = () => import('@/views/mainpage/setting/Meetingman')
const Userinfo = () => import('@/views/mainpage/setting/userinof')
const Roleinfo = () => import('@/views/mainpage/setting/roleinof')
// const Device = () => import('@/views/mainpage/setting/device')
const Stream = () => import('@/views/mainpage/setting/Stream')
const Onvif = () => import('@/views/mainpage/setting/Onvif')
const File = () => import('@/views/mainpage/setting/File')
const DeviceAll = () => import('@/views/mainpage/setting/DeviceAll')
const TranCustomize = () => import('@/views/mainpage/setting/TranCustomize')
const TranDefault = () => import('@/views/mainpage/setting/TranDefault')
const DeviceSdk = () => import('@/views/mainpage/setting/device_sdk')
const WebrtcCloudmode = () => import('@/views/mainpage/setting/WebrtcCloudmode')
const WebrtcForwardingmode = () => import('@/views/mainpage/setting/WebrtcForwardingmode')
const WebrtcTurnmode = () => import('@/views/mainpage/setting/WebrtcTurnmode')
const Safetyinfo = () => import('@/views/mainpage/setting/Safetyinof')
const Protocol = () => import('@/views/mainpage/setting/Protocol')
const Contact = () => import('@/views/mainpage/setting/Contact')
const Docker = () => import('@/views/mainpage/setting/Docker')


const Login = () => import('@/views/Login')
const Logout = () => import('@/views/Logout')

Vue.use(Router)



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
                    path: 'Conference',
                    name: "Conference",
                    component: Conference,
                    meta: {
                      title: '3',
                      type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
                    },
				},
				{
                    path: 'OneToOne',
                    name: "OneToOne",
                    component: OneToOne,
                    meta: {
                      title: '4',
                      type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
                    },
				},
				{
                    path: 'ConferenceControl',
                    name: "ConferenceControl",
                    component: ConferenceControl,
                    meta: {
                      title: '5',
                      type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
                    },
				},
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
					path: 'Control',
					name: "Control",
					component: Control,
					meta: {
						title: '控制',
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
							path: 'Userinfo',
							name: "User",
							component: Userinfo,
							meta: {
								title: '2-2',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},
						{
							path: 'Roleinfo',
							name: "Roleinfo",
							component: Roleinfo,
							meta: {
							title: '2-3',
							type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							}
						},
						{
							path: 'Safetyinfo',
							name: "Safetyinfo",
							component: Safetyinfo,
							meta: {
							title: '2-14',
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
							path: 'DeviceAll',
							name: "DeviceAll",
							component: DeviceAll,
							meta: {
								title: '2-7',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'TranDefault',
							name: "TranDefault",
							component: TranDefault,
							meta: {
								title: '2-8',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'TranCustomize',
							name: "TranCustomize",
							component: TranCustomize,
							meta: {
								title: '2-9',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'DeviceSdk',
							name: "DeviceSdk",
							component: DeviceSdk,
							meta: {
								title: '2-10',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'WebrtcCloudmode',
							name: "WebrtcCloudmode",
							component: WebrtcCloudmode,
							meta: {
								title: '2-11',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'WebrtcForwardingmode',
							name: "WebrtcForwardingmode",
							component: WebrtcForwardingmode,
							meta: {
								title: '2-12',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'WebrtcTurnmode',
							name: "WebrtcTurnmode",
							component: WebrtcTurnmode,
							meta: {
								title: '2-13',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Protocol',
							name: "Protocol",
							component: Protocol,
							meta: {
								title: '2-14',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Contact',
							name: "Contact",
							component: Contact,
							meta: {
								title: '2-15',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Docker',
							name: "Docker",
							component: Docker,
							meta: {
								title: '2-16',
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

if(sessionStorage.getItem('mcutoken')){
	store.state.token=sessionStorage.getItem('mcutoken');
  }
  if(sessionStorage.getItem('mcuuser')){
	store.state.user=sessionStorage.getItem('mcuuser');
  }
  if(sessionStorage.getItem('mculang')){
	store.state.lang=sessionStorage.getItem('mculang');
  }
  if(sessionStorage.getItem('mcuroot')){
	store.state.root=sessionStorage.getItem('mcuroot');
  }
  let root=process.env.VUE_APP_URL;
  if (root == undefined){
	  root = window.location.protocol + '//' + window.location.host + window.location.pathname;
  }
  console.log(root)
  store.state.IPPORT=root

  var wsroot = process.env.VUE_APP_PORT;
  if (wsroot == undefined)
  {
	  wsroot = window.location.host;
  }
  console.log(wsroot)
  store.state.WSROOT=wsroot

  