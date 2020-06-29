<template>
    <CSidebar 
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
        <el-menu
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
                <router-link :to="{name:'Conference'}">
					<el-menu-item index="3">
						<i class="iconfont icon-yonghuming"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Meetingman'}">
					<el-menu-item index="2">
						<i class="iconfont icon-shezhi_guanli"></i>
						<span slot="title">设置</span>
					</el-menu-item>
				</router-link>
        </el-menu>
        <!-- <Menu class="sideb_content" theme="dark" :active-name="activemenu" style="width:100%">
            <MenuItem name="1" :to="{name:'dashboard'}">
                <Icon type="" class="iconfont icon-11111"/>
                仪表盘
            </MenuItem>
            <router-link  :to="{name:'Conference'}" >
                <MenuItem name="3">
                    <Icon class="iconfont icon-yonghuming"/>
                    视频会议
                </MenuItem>
            </router-link>
            <router-link  :to="{name:'Meetingman'}">
                <MenuItem name="2">
                    <Icon class="iconfont icon-shezhi_guanli"/>
                    设置
                </MenuItem>
            </router-link>
            
        </Menu> -->
    </CSidebar>
</template>

<script>
// import nav from './_nav'
export default {
  name: 'TheSidebar',
  data(){
      return {
          activemenu:"1"
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
        menuList(){ 
            let path = this.$route.matched[1].meta.title
            this.activemenu = path
        }
    }
}
</script>
<style lang="scss" scopad>
.el-menu-vertical-demo{
    i{
        color: #FFFFFF;
		margin-right: 24px;
    }
}
</style>

