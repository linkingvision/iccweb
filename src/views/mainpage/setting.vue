<template>
	<div class="setting_all">
		<div class="setting_zuo">
			<!-- <Menu class="sideb_content" theme="dark" :active-name="activemenu" style="width:100%">
				<MenuItem :to="{name:'Meetingman'}" name="2-1">会议管理</MenuItem>
				<MenuItem :to="{name:'Userinfo'}" name="2-2">用户管理</MenuItem>
				<MenuItem :to="{name:'Roleinof'}" name="2-3">角色管理</MenuItem>
				<MenuItem :to="{name:'Device'}"  name="2-4">设备管理</MenuItem>
			</Menu> -->
			<el-menu
			:default-active="activemenu"
				class="el-menu-vertical-demo"
				background-color="#252525"
				text-color="#717F87"
				active-text-color="#3277FF">
				<router-link :to="{name:'Meetingman'}">
					<el-menu-item index="2-1">
						<i class="iconfont icon-huiyiguanli-"></i>
						<span slot="title">会议管理</span>
					</el-menu-item>
				</router-link>
				

				<el-submenu index="2-2">
					<template slot="title">
						<i class="iconfont icon-huiyiguanli"></i>
						<span>用户管理</span>
					</template>
					<!-- 二级 -->
					<router-link :to="{name:'User'}">
						<el-menu-item index="2-2">
							<span slot="title">用户管理</span>
						</el-menu-item>
					</router-link>
					<router-link :to="{name:'Roleinof'}">
						<el-menu-item index="2-3">角色管理</el-menu-item>
					</router-link>
				</el-submenu>

				<el-submenu index="2-4">
					<template slot="title">
						<i class="iconfont icon-shezhi_guanli"></i>
						<span>设备管理</span>
					</template>
					<!-- 二级 -->
					<router-link :to="{name:'Stream'}">
						<el-menu-item index="2-4">H5-STREAM</el-menu-item>
					</router-link>
					<router-link :to="{name:'Onvif'}">
						<el-menu-item index="2-5">H5-ONVIF</el-menu-item>
					</router-link>
					<router-link :to="{name:'File'}">
						<el-menu-item index="2-6">H5-FILE</el-menu-item>
					</router-link>
					<router-link :to="{name:'Deviceall'}">
						<el-menu-item index="2-7">ALL</el-menu-item>
					</router-link>
				</el-submenu>
				<!-- <router-link :to="{name:'Device_sdk'}">
					<el-menu-item index="2-10">
						<i class="el-icon-menu"></i>
						<span slot="title">SDK管理</span>
					</el-menu-item>
				</router-link> -->
				<el-submenu index="2-8">
					<template slot="title">
						<i class="iconfont icon-transcode-management"></i>
						<span>转码管理</span>
					</template>
					<!-- 二级 -->
					<router-link :to="{name:'Tran_default'}">
						<el-menu-item index="2-8">默认</el-menu-item>
					</router-link>
					<router-link :to="{name:'Tran_customize'}">
						<el-menu-item index="2-9">自定义</el-menu-item>
					</router-link>
				</el-submenu>

				<el-submenu index="2-11">
					<template slot="title">
						<i class="iconfont icon-WebRTC"></i>
						<span>WEBRTC</span>
					</template>
					<!-- 二级 -->
					<router-link :to="{name:'Webrtc_cloudmode'}">
						<el-menu-item index="2-11">云模式</el-menu-item>
					</router-link>
					<router-link :to="{name:'Webrtc_Forwardingmode'}">
						<el-menu-item index="2-12">转发模式</el-menu-item>
					</router-link>
					<router-link :to="{name:'Webrtc_turnmode'}">
						<el-menu-item index="2-13">TURN服务</el-menu-item>
					</router-link>
				</el-submenu>
				
			</el-menu>
		</div>
		<div class="setting_you">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Dashboard',
	data(){
		return{
			activemenu:"2-1"
		}
	},
	methods:{
		menuList(){ 
            let path = this.$route.meta.title
            // console.log(path,this.$route)
            this.activemenu = path
        }
		
	},
	mounted(){
		this.menuList();
	},
	created(){
	}
}
</script>
<style lang="scss" scoped>
.setting_all{
	display: flex;
	height: 96vh;
	// background-color: #fff;
	justify-content: space-between;
	flex-wrap: wrap;
	.setting_zuo{
		margin-top: 1vh;
		width: 14%;
		// min-width: 220px;
		height: 95vh;
		overflow-y: auto;
		// background-color: #fff;
		.el-submenu{
			.el-menu-item{
				padding-left: 70px!important;
				
			}
			.el-submenu__title{
				i{
					margin-right: 10px;
				}
			}
		}
	}
	
	i{
		margin-right: 10px;
	}
	.setting_you{
		padding: 1vh 5px;
		width: 86%;
		height: 96vh;
		overflow-y: auto;
		// background-color: #171717;
	}
	.setting_you::-webkit-scrollbar,.setting_zuo::-webkit-scrollbar{
		display: none;
	}
}
</style>