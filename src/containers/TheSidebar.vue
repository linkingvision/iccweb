<template>
    <CSidebar 
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
        <div class="side_togg">
            <button style="font-size:25px" class="toggler iconfont icon-hanbaobao" @click="togg"></button>
            <div class="c_logo"></div>
        </div>
        <el-menu
            v-if="$store.state.darkMode"
			:default-active="activemenu"
			class="el-menu-vertical-demo"
			background-color="#212121"
			text-color="#FFFFFF"
			active-text-color="#3277FF">
				<router-link :to="{name:'dashboard'}">
					<el-menu-item index="1">
						<i class="iconfont icon-11111"></i>
						<span slot="title">仪表盘</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'videoconf'}">
					<el-menu-item index="10">
						<i class="iconfont icon-duorenhuiyikuaizhuang"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'OneToOne'}">
					<el-menu-item index="4">
						<i class="iconfont icon-dianduidian-"></i>
						<span slot="title">对讲</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Vcroom'}">
					<el-menu-item index="11">
						<i class="iconfont icon-kongzhitai"></i>
						<span slot="title">虚拟会议室</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'liveview'}">
					<el-menu-item index="6">
						<i class="iconfont icon-shipin1"></i>
						<span slot="title">视频播放</span>
					</el-menu-item>
				</router-link>
				<router-link :to="{name:'Playback'}">
					<el-menu-item index="7">
						<i class="iconfont icon-videofill"></i>
						<span slot="title">回放</span>
					</el-menu-item>
				</router-link>
                <!-- <router-link :to="{name:'Conference'}">
					<el-menu-item index="3">
						<i class="iconfont icon-11111"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Meetingman'}">
					<el-menu-item index="2-1">
						<i class="iconfont icon-huiyiguanli-"></i>
						<span slot="title">会议管理</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'ConferenceControl'}">
					<el-menu-item index="5">
						<i class="iconfont icon-kongzhitai"></i>
						<span slot="title">会议控制</span>
					</el-menu-item>
				</router-link> -->
                
                <router-link :to="{name:'User'}">
					<el-menu-item index="2-2">
						<i class="iconfont icon-shezhi"></i>
						<span slot="title">设置</span>
					</el-menu-item>
				</router-link>
        </el-menu>
        <!-- //// -->
        <el-menu
            v-else
			:default-active="activemenu"
				class="el-menu-vertical-demo"
				background-color="#F3F5FA"
				text-color="#000000"
				active-text-color="#3277FF">

				<router-link :to="{name:'dashboard'}">
					<el-menu-item index="1">
						<i class="iconfont icon-11111"></i>
						<span slot="title">仪表盘</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'videoconf'}">
					<el-menu-item index="10">
						<i class="iconfont icon-duorenhuiyikuaizhuang"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'OneToOne'}">
					<el-menu-item index="4">
						<i class="iconfont icon-dianduidian-"></i>
						<span slot="title">对讲</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Vcroom'}">
					<el-menu-item index="11">
						<i class="iconfont icon-kongzhitai"></i>
						<span slot="title">虚拟会议室</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'liveview'}">
					<el-menu-item index="6">
						<i class="iconfont icon-shipin1"></i>
						<span slot="title">视频播放</span>
					</el-menu-item>
				</router-link>
				<router-link :to="{name:'Playback'}">
					<el-menu-item index="7">
						<i class="iconfont icon-videofill"></i>
						<span slot="title">回放</span>
					</el-menu-item>
				</router-link>
                <!-- <router-link :to="{name:'Conference'}">
					<el-menu-item index="3">
						<i class="iconfont icon-11111"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Meetingman'}">
					<el-menu-item index="2-1">
						<i class="iconfont icon-huiyiguanli-"></i>
						<span slot="title">会议管理</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'ConferenceControl'}">
					<el-menu-item index="5">
						<i class="iconfont icon-kongzhitai"></i>
						<span slot="title">会议控制</span>
					</el-menu-item>
				</router-link> -->
                
                <router-link :to="{name:'User'}">
					<el-menu-item index="2-2">
						<i class="iconfont icon-shezhi"></i>
						<span slot="title">设置</span>
					</el-menu-item>
				</router-link>
        </el-menu>
    </CSidebar>
</template>

<script>
// import nav from './_nav'
export default {
  name: 'TheSidebar',
  data(){
      return {
          activemenu:"1",
		  title:this.$store.state.title,
      }
  },
  watch:{
	title:{
		handler: function() {
			console.log(this.$route.matched[1].meta.title);
			this.menuList();
		},
	}
  },
//   nav,
  computed: {
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    }
  },
  mounted(){
        if(this.$store.state.root==='Operator'){
          $(".zuo_none").hide()
          console.log("消失")
        }
        this.menuList();
  },
    methods:{
        togg(){
            $(".heder_Mask").toggle()
            this.$store.commit('toggleSidebarDesktop')
        },
        menuList(){ 
			console.log(this.title);
            var path = this.$route.matched[1].meta.title
			// if (this.$store.state.title) {
			// 	path=this.$store.state.title
			// }
            this.activemenu = path
        }
    }
}
</script>
<style lang="scss" scopad>
.side_togg{
    width: 100%;
    display: flex;
    .toggler{
        color: #FFFFFF;
        padding: 0;
        padding-left: 13px;
    }
    .c_logo{
        width: 160px;
        height: 100%;
    }
}
</style>

