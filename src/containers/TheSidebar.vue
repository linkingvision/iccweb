<template>
    <CSidebar >
        <Menu class="sideb_content" theme="dark" active-name="1" style="width:100%">
            <MenuItem name="1" to="dashboard">
                <Icon type="" class="iconfont icon-11111"/>
                视频会议
            </MenuItem>
            <!-- <MenuItem name="2">
                <Icon class="iconfont icon-huiyi1"/>
                会议日程
            </MenuItem>
            <MenuItem name="3">
                <Icon class="iconfont icon-11111"/>
                会议录播
            </MenuItem> -->
            <Submenu name="4" class="zuo_none">
                <template slot="title">
                    <Icon class="iconfont icon-yonghuming"/>
                    用户管理
                </template>
                <MenuItem to="Userinfo" name="4-1">用户管理</MenuItem>
                <MenuItem to="Roleinof" name="4-3">角色管理</MenuItem>
                <MenuItem name="4-2">分组管理</MenuItem>
            </Submenu>
        </Menu>
    </CSidebar>
</template>

<script>
// import nav from './_nav'
export default {
  name: 'TheSidebar',
//   nav,
  computed: {
  },
  mounted(){
      if(this.$store.state.root==='Operator'){
          $(".zuo_none").hide()
          console.log("消失")
        }
  }
}
</script>
<style scoped>
</style>
<style lang="scss" scopad>
.sideb_content{
    background: none;
    text-align: center;
    .ivu-menu-item{
        // margin-left: -10%;
        font-family:PingFang SC;
        font-weight:500;
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

