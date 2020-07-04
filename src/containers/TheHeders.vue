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
                        <CDropdown
                            color="link"
                            :caret="false">
                            <template #toggler-content>
                                <i class="iconfont icon-yonghuming"></i> {{user}}
                            </template>
                            <CDropdownItem :to="{name:'Logout'}">
                                <div class="about_ab"><i class="iconfont icon-tuichudenglu"></i>退出登录</div>
                            </CDropdownItem>
                        </CDropdown>
                    </div>
                    <div>
                        <CDropdown
                            color="link"
                            :caret="false">
                            <template #toggler-content>
                                <i class="iconfont icon-qita"></i>
                            </template>
                            <CDropdownItem >
                                <div class="about_ab"><i class="iconfont icon-guanyu"></i>关于</div>
                            </CDropdownItem>
                            <CDropdownItem href="doc/api.html">
                                <div class="about_ab"><i class="iconfont icon-guanyu"></i>API</div>
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
        data(){
            return{
                gEvvalue:120,
                user:this.$store.state.user,
                // show: false,
                navbarText: false,
                navbarDropdown: false,
                toggle:this.$store.state.darkMode
            }
        },
        watch:{
            toggle(a){
                console.log(a,"heders")
            }
        },
        mounted(){
            console.log("heders",this.toggle)
        }
    }
</script>
<style scoped>
i{
    font-size:16px;
}
.toggler{
    padding: 0;
    text-align: center;
    line-height: 40px;
}

/* 铃铛 */
.el-badge >>> .el-badge__content{
    border: 0;
}
.el-badge >>> .el-badge__content.is-fixed{
    top: 10px;
    padding: 0 4px;
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
    margin-right: -10px;
}

.c_ding{
  width: 100%;
  height:40px;
  /* background-color: #202020; */
  color:rgba(255,255,255,1);
  position: fixed;
  top: 0;
  bottom: 0;
  padding: 0 13px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}
/* logo */
.c_logo{
	width: 160px;
	height: 100%;
}
.c_use{
	width: 89%;
	height: 100%;
	font-size:14px;
	font-family:Source Han Sans CN;
	font-weight:400;
	line-height: 40px;
	display: flex;
	justify-content: space-between;
}

</style>