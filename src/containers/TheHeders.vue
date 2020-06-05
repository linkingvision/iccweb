<template>
    <div class="c_ding">
        <div class="c_logo"></div>
        <div class="c_use">
            <CHeader with-subheader>
                <!-- <CToggler
                in-header
                class="ml-3 d-lg-none"
                @click="$store.commit('toggleSidebarMobile')"
                >
                    <span class="toggler el-icon-s-fold"></span>
                </CToggler> -->
                <!-- <CToggler
                in-header
                class="ml-3 d-md-down-none"
                @click="$store.commit('toggleSidebarDesktop')"
                >
                    <span class="toggler el-icon-s-unfold"></span>
                </CToggler> -->
            </CHeader>
            <div class="use_you">
                <div class="use_you_top">欢迎你</div>
                <div class="use_you_top">
                    <router-link to='logout'>
                        <span class="">
                            <i class="iconfont icon-yonghuming"></i> {{user}}
                        </span>
                    </router-link>
                    <!-- <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            admin<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link to='logout'>
                                <el-dropdown-item divided ><i class="el-icon-arrow-down el-icon--right"></i>用户</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TheHeders',
        data(){
            return{
                gEvvalue:120,
                user:this.$store.state.user
            }
        }
    }
</script>
<style scoped>
a{
    color: #FFFFFF;
}
.toggler{
    color: #FFF;
}
i{
    font-size:16px;
}
/* 铃铛 */
.el-badge >>> .el-badge__content{
    border: 0;
}
.el-badge >>> .el-badge__content.is-fixed{
    top: 10px;
    padding: 0 4px;
}
/* 下拉 */
.el-dropdown{
    color: #FFFFFF;
}
/* 顶部 */
.use_you{
    /* width: 20%; */
    display: flex;
    /* justify-content: space-between; */
}
.use_you .use_you_top{
    margin-right: 30px;
}
.c-header.c-header-fixed{
	position:static;
}
.c-header {
    background: none;
    border-bottom:none;
}
.c_ding{
  width: 100%;
  height: 50px;
  background-color: #151515;
  position: fixed;
  top: 0;
  bottom: 0;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
}
/* logo */
.c_logo{
	width: 160px;
	height: 100%;
	background: url("../assets/imgs/l5s_logo_bai.png") center center no-repeat;
	/* background-size: 100%; */
}
.c_use{
	width: 89%;
	height: 100%;
	font-size:14px;
	font-family:Source Han Sans CN;
	font-weight:400;
	color:rgba(255,255,255,1);
	line-height: 50px;
	display: flex;
	justify-content: space-between;
}
.c-dark-theme .c-header {
    border-bottom: 0;
}
</style>