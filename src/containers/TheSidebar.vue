<template>
    <CSidebar 
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
        <div class="side_togg">
            <CButton style="font-size:25px" class="toggler iconfont icon-hanbaobao" @click="togg"></CButton>
            <div class="c_logo"></div>
        </div>
        <el-menu
			:default-active="activemenu"
				class="el-menu-vertical-demo"
				background-color="#212121"
				text-color="#FFFFFF"
				active-text-color="#3277FF">

				<router-link :to="{name:'dashboard'}">
					<el-menu-item index="1">
						<i class="iconfont icon-yibiaopan1"></i>
						<span slot="title">仪表盘</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Conference'}">
					<el-menu-item index="3">
						<i class="iconfont icon-11111"></i>
						<span slot="title">视频会议</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'OneToOne'}">
					<el-menu-item index="4">
						<i class="iconfont icon-huiyiguanli"></i>
						<span slot="title">对讲</span>
					</el-menu-item>
				</router-link>
                <router-link :to="{name:'Meetingman'}">
					<el-menu-item index="2">
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
        togg(){
            $(".heder_Mask").toggle()
            this.$store.commit('toggleSidebarDesktop')
        },
        menuList(){ 
            let path = this.$route.matched[1].meta.title
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
.el-menu-vertical-demo{
    i{
        color: #FFFFFF;
		margin-right: 24px;
    }
}
</style>

