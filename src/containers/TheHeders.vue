<template>
    <div class="c_ding">
        <div class="heder_Mask" @click="clicktogg"></div>
        <CButton style="font-size:25px" class="toggler iconfont icon-hanbaobao" @click="togg"></CButton>
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
                                <div @click="about=true" class="about_ab"><i class="iconfont icon-guanyu"></i>关于</div>
                            </CDropdownItem>
                            <CDropdownItem href="doc/api.html">
                                <div class="about_ab"><i class="iconfont icon-guanyu"></i>API</div>
                            </CDropdownItem>
                        </CDropdown>
                        
                    </div>
                </div>
                <el-dialog
                    class="plugin"
                    :visible.sync="about"
                    width="25%"
                    append-to-body
                    center>
                    <div class="plugin_back">
                    </div>
                    <div class="plugin_size">
                        <div>{{$t("message.dashboard.version")}}: {{information.strVersion}}</div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TheHeders',
        data(){
            return{
                about:false,
                gEvvalue:120,
                user:this.$store.state.user,
                // show: false,
                navbarText: false,
                navbarDropdown: false,
                toggle:this.$store.state.sidebarShow,
                information:{
                    strVersion: ""
                }
            }
        },
        watch:{
            toggle(a){
                console.log(a,"heders")
            }
        },
        mounted(){
            $(".heder_Mask").hide()
            this.GetSystemInfo()
        },
        methods:{
            togg(){
                $(".heder_Mask").toggle()
                this.$store.commit('toggleSidebarDesktop')
            },
            clicktogg(){
                if(this.$store.state.sidebarShow){
                    $(".heder_Mask").toggle()
                    this.$store.commit('toggleSidebarDesktop')
                }
            },
            GetSystemInfo(){
                var url = this.$store.state.IPPORT + "/api/v1/GetSystemInfo?session="+ this.$store.state.token;

                this.$http.get(url).then(result => {
                    //console.log(result);
                    if (result.status == 200) 
                    {
                        this.information = result.data;
                        // console.log(_this.information);
                    }
                }).catch(error => {
                    console.log('GetSystemInfo', error);
                });

            },
        }
    }
</script>
<style scoped>
/*弹框 */
.heder_Mask{
    width: 100%;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    z-index: -10;

}
.plugin >>> .el-dialog{
    background:none;
}
.plugin >>>.el-dialog__header{
  padding: 0;
}
.plugin >>> .el-dialog--center .el-dialog__body{
    padding: 11% 0;
    width: 100%;
    height: 260px;
    background: url("../assets/imgs/header_tk_bg.png") no-repeat center;
    background-size: 100%;
}
.plugin_back{
    width: 100%;
    height: 100px;
    background: url("../assets/imgs/header_tk_logo.png") no-repeat center;
    background-size: 50%;
}
.plugin_size{
    font-size:16px;
    font-family:PingFang SC;
    font-weight:400;
    color: #FFFFFF;
    text-align: center;
    opacity: 0.4;
}

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