<template>
	<div  class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
		<TheHeders/>
		<!-- 左边菜单栏 -->
		<TheSidebar/>
		<CWrapper>
			<!-- 顶部导航 -->
			<!-- <TheHeader/> -->
			<!-- 内容 @click="-->
			<div @click="clicktogg" class="c-body">
				<main class="c-main">
					<CContainer fluid>
						<transition name="fade">
							<router-view></router-view>
						</transition>
					</CContainer>
				</main>
				
			<!-- 底部 -->
			<!-- <TheFooter/> -->
			</div>
		</CWrapper>
		
		<!-- :modal="false" -->
		<el-dialog
            class="dasboard_modal"
            title="加入会议"
            :close-on-click-modal="false"
            :visible.sync="myModal"
            width="25%">
            是否接听会议?
            <span slot="footer" class="dialog-footer particip_buttom">
                <CButton class="part_buttom_but1" type="primary"  @click="myModal=false">否</CButton>
                <CButton class="part_buttom_but" type="primary"  @click="l5svideplay">是</CButton>
            </span>
        </el-dialog>
			
	</div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeders from './TheHeders'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'

import '../assets/js/adapter'
import {H5sEvent} from '../assets/js/h5sevent.js'
// Vue.prototype.EVENT = event

export default {
	name: 'TheContainer',
	components: {
		TheSidebar,
		TheHeders,
		TheHeader,
		TheFooter,
	},
	data(){
		return {
			myModal:false,
			meettoken:undefined,
			sharedstart:undefined,
			sharedstop:undefined
		}
	},
	watch:{
		meettoken(token){
			console.log("改变",token)
			this.meettoken=token
			// this.myModal=true;
			this.l5svideplay()
		},
		sharedstart(token){
			console.log("改变1",token)
			this.$root.bus.$emit('sharedstart', token);
		},
		sharedstop(token){
			console.log("改变2",token)
			this.$root.bus.$emit('sharedstop', token);
		}
	},
	mounted(){
		//   console.log("event",events())
		this.open()
	},
	methods:{
		//播放
		l5svideplay(){
			if(this.meettoken!=undefined){
				this.myModal=false;
				if(this.$router.history.current.name!="OneToOne"){
					console.log("1")
					// this.$root.bus.$emit('meettoken', this.meettoken);
					this.$router.push({
						name: `OneToOne`,
						path: 'OneToOne',
						params: {
							token:this.meettoken
						}
					})
				}else{
					console.log("2")
					this.$root.bus.$emit('meettoken', this.meettoken);
				}
				console.log(this.$router.history.current.name)
			}
		},
		open(){
			var conf1 = {
				protocol: window.location.protocol, //http: or https:
				host:this.$store.state.WSROOT, //localhost:8080
				rootpath:'/', // '/'
				callback: this.EventCB, 
				userdata: null, // user data
				session: this.$store.state.token //session got from login
			};
			
			// console.log("*******2",conf1)
			this.e1 = new H5sEvent(conf1);
			this.e1.connect();
		},
		EventCB(event, userdata){
			var msgevent = JSON.parse(event);
			if(msgevent.type=="L5S_EVENT_CONF_INVITE"){
				this.meettoken=msgevent.confInvite.token;
			}
			// else if(msgevent.type=="H5S_EVENT_START_SHARE_DESKTOP"){
			// 	this.sharedstart=msgevent.shareDesktop.token;
			// 	console.log("****",msgevent)
			// }else if(msgevent.type=="H5S_EVENT_STOP_SHARE_DESKTOP"){
			// 	this.sharedstop=msgevent.stopShareDesktop.token;
			// 	console.log("****",msgevent)
			// }
			// console.log("****消息",msgevent)
		},
		clicktogg(){
			if(this.$store.state.sidebarShow){
				this.$store.commit('toggleSidebarDesktop')
			}
		}
	},
	beforeDestroy() {
		if (this.e1 != undefined)
		{
			this.e1.disconnect();
			delete this.e1;
			this.e1 = undefined;
		}
	},
}
</script>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
} */

/* 左边 */
.c-sidebar.c-sidebar-fixed {
    position: fixed;
    top: 0px;
	/* bottom: 50px; */
	z-index: 1000;
}
/* 右边内容 */
.c-wrapper{
	/* margin-top: 48px; */
	padding-top: 40px;
	box-sizing: border-box;
	margin: 0;
}
.c-wrapper:not(.c-wrapper-fluid) {
	height: 100vh;
}
.c-main {
	height: 90vh;
	overflow: scroll;
	padding: 0;
	/* background-color: #1E2228; */
}
.c-main::-webkit-scrollbar{
    display: none;
}
.c-main > .container-fluid{
	padding: 0;
	height: 100%;
}


/* // 顶部 */

.c-dark-theme .c-header {
    border-bottom: 0;
}
.c-header.c-header-fixed{
	position:static;
}
.c-header {
    min-height: 40px;
    background: none;
    border-bottom:none;
    box-sizing: border-box;
}
.c-header .c-header-toggler{
    border: none !important;
}
</style>
