<template>
    <CSidebar >
        <Menu class="sideb_content" theme="dark" :active-name="activemenu" style="width:100%">
            <MenuItem name="1" to="dashboard">
                <Icon type="" class="iconfont icon-11111"/>
                视频会议
            </MenuItem>
            <MenuItem name="2" to="Meetingman">
                <Icon class="iconfont icon-11111"/>
                会议管理
            </MenuItem>
            <Submenu name="3" class="zuo_none">
                <template slot="title">
                    <Icon class="iconfont icon-yonghuming"/>
                    用户管理
                </template>
                <MenuItem to="Userinfo" name="3-1">用户管理</MenuItem>
                <MenuItem to="Roleinof" name="3-2">角色管理</MenuItem>
                <MenuItem name="3-3">分组管理</MenuItem>
            </Submenu>
        </Menu>
    </CSidebar>
</template>

<script>
// import nav from './_nav'
export default {
  name: 'TheSidebar',
  data(){
      return {
          activemenu:"2"
      }
  },
//   nav,
  computed: {
  },
  mounted(){
        if(this.$store.state.root==='Operator'){
          $(".zuo_none").hide()
          console.log("消失")
        }
        this.menuList();
  },
    methods:{
        menuList(){  // 这个方法里定义好，高亮和路由
            let path = this.$route.matched[1].meta.title// 获取到地址拦上#号后面的url地址
            // console.log(path,this.$route)
            this.activemenu = path
            // if(path.indexOf('事先定义好的理由') != -1){  // 是否包含，-1是包含，0不包含
            //     this.activemenu = 2
            // }
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

