<template>
    <CSidebar 
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
        <Menu class="sideb_content" theme="dark" :active-name="activemenu" style="width:100%">
            <MenuItem name="1" :to="{name:'dashboard'}">
                <Icon type="" class="iconfont icon-11111"/>
                会议首页
            </MenuItem>
            <router-link  :to="{name:'Conference'}" >
                <MenuItem name="3">
                    <Icon class="iconfont icon-yonghuming"/>
                    视频会议
                </MenuItem>
            </router-link>
            <!-- target="_blank" -->
            <router-link  :to="{name:'Meetingman'}" target="_blank">
                <MenuItem name="2">
                    <Icon class="iconfont icon-yonghuming"/>
                    设置管理
                </MenuItem>
            </router-link>
            
        </Menu>
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
.sideb_content{
    background: none;
    text-align: center;
    .ivu-menu-item{
        // margin-left: -10%;
        font-family:PingFang SC;
        font-weight:500;
        text-decoration: none;
    }
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item{
    color: #FFFFFF;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened{
    background: none;
}
.ivu-menu-submenu{
    .ivu-menu-submenu-title{
        color: #FFFFFF !important;
    }
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active{
    background: none !important;
    color: #3277FF;
}
</style>

