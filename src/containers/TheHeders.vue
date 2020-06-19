<template>
    <div class="c_ding">
        <CButton style="font-size:25px" class="toggler iconfont icon-hanbaobao" @click="$store.commit('toggleSidebarDesktop')"></CButton>
        <div class="c_logo"></div>
        <div class="c_use">
            
            <div></div>
            <div class="use_you">
                    <!-- <button 
                    @click="() => $store.commit('toggle', 'darkMode')" 
                    class="c-header-nav-btn"
                    >
                    <CIcon v-if="$store.state.darkMode" name="cil-sun"/>
                    <CIcon v-else name="cil-moon"/>
                    </button> -->
                <div class="use_you_top">
                    <div class="use_user">
                        <router-link :to="{name:'Logout'}">
                            <span class="">
                                <i class="iconfont icon-yonghuming"></i> {{user}}
                            </span>
                        </router-link>
                    </div>
                    <div>
                        <CDropdown
                            color="link"
                            :caret="false"
                        >
                            <template #toggler-content>
                                <i class="iconfont icon-qita"></i>
                            </template>
                            <CDropdownItem >
                                <div class="about_ab"><i class="iconfont icon-guanyu"></i>关于</div>
                            </CDropdownItem>
                        </CDropdown>
                        
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TheHeders',
        computed: {
            show () {
            return this.$store.state.sidebarShow 
            },
            minimize () {
            return this.$store.state.sidebarMinimize 
            }
        },
        data(){
            return{
                gEvvalue:120,
                user:this.$store.state.user,
                // show: false,
                navbarText: false,
                navbarDropdown: false
            }
        }
    }
</script>
<style scoped>
/* a{
    color: #FFFFFF;
} */
i{
    font-size:16px;
}
.toggler{
    padding: 0;
    text-align: center;
    line-height: 40px;
    color: #FFF;
    /* margin-right: 5px; */
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
.about_ab i{
    margin-right: 6px;
}
/* 顶部 */
.use_you{
    /* width: 20%; */
    display: flex;
    /* justify-content: space-between; */
}
.use_you .use_you_top{
    display: flex;
    margin-right: 30px;
}
/* .use_user{
    margin-right: 10px;
} */

.c_ding{
  width: 100%;
  height:40px;
  /* background-color: #202020; */
  position: fixed;
  top: 0;
  bottom: 0;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}
/* logo */
.c_logo{
	width: 160px;
	height: 100%;
	background: url("../assets/imgs/l5s_logo1.png") center center no-repeat;
	background-size: 85%;
}
.c_use{
	width: 89%;
	height: 100%;
	font-size:14px;
	font-family:Source Han Sans CN;
	font-weight:400;
	color:rgba(255,255,255,1);
	line-height: 40px;
	display: flex;
	justify-content: space-between;
}

</style>