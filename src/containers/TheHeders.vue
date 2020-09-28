<template>
    <div class="c_ding">
        <div class="heder_Mask" @click="clicktogg"></div>
        <button style="font-size:25px" class="toggler iconfont icon-hanbaobao" @click="togg"></button>
        <div class="c_logo"></div>
        <div class="c_use">
            
            <div></div>
            <div class="use_you">
                <!-- <button 
                    @click="skin" 
                    class="c-header-nav-btn"
                    >
                    <CIcon v-if="$store.state.darkMode" name="cil-sun"/>
                    <CIcon v-else name="cil-moon"/>
                </button> -->
                <div class="use_you_top">
                    <div class="c_Docker" id="Docker"></div>
                    <div class="use_user" id="rtc_togg">
                        <!-- 1 -->
                        <!-- <CDropdown
                            color="link"
                            :caret="false">
                            <template #toggler-content>
                                <el-badge class="item">
                                    <i style="color:#ea5252;font-weight: 600;" class="iconfont icon-zhongqi"></i>
                                </el-badge>
                            </template>
                            <div class="news_hed">
                                <div class="news_size"><div class="news_img"></div>修改后请您重启</div>
                                
                                <div class="news_hed1">
                                    <div style="cursor:pointer " @click="Reboot">重启</div>
                                    <div @click="rtctogg">忽略</div>
                                </div>
                            </div>
                        </CDropdown> -->
                        <el-tooltip content="重启" placement="bottom" effect="dark">
                            <el-button @click="Rebootdialog=true" style="border: none;background: none; color:#fff;line-height: 0.9;padding-right: 10px;" >
                                <i style=" font-size: 18px;color:#ea5252;font-weight: 500;" class="iconfont icon-zhongqi"></i>
                            </el-button>
                        </el-tooltip>
                    </div>
                        <!-- 2 -->
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
                                <div class="about_ab"><i class="iconfont icon-API"></i>API</div>
                            </CDropdownItem>
                            <CDropdownItem @click="skin">
                                <div class="about_ab"><i class="iconfont icon-mingpianhuanfu"></i>主题</div>
                            </CDropdownItem>
                            <CDropdownItem @click="Rebootdialog=true">
                                <div class="about_ab"><i class="iconfont icon-zhongqi"></i>重启</div>
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
                <CModal
                    title="重启"
                    :show.sync="Rebootdialog">
                    <div class="bottom_QR">
                        <div>确定要重启吗？</div>
                        <div class="button_table">
                            <el-button class="form_butt1" @click="Rebootdialog = false">{{$t("message.setting.Cancel")}}</el-button>
                            <el-button class="form_butt" type="primary" @click="Reboot">{{$t("message.setting.OK")}}</el-button>
                        </div>
                    </div>
                </CModal>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { Loading } from 'element-ui';
    export default {
        name: 'TheHeders',
        data(){
            return{
                Rebootdialog:false,
                about:false,
                gEvvalue:120,
                user:this.$store.state.user,
                // show: false,
                navbarText: false,
                navbarDropdown: false,
                toggle:"",
                information:{
                    strVersion: ""
                }
            }
        },
        watch:{
            toggle(a){
                this.$root.bus.$emit('skintoggle', a);
            }
        },
        mounted(){
            $(".heder_Mask").hide()
            this.GetSystemInfo()
            var _this=this
            $("#rtc_togg").hide();
            _this.$root.bus.$on('webrtc', function(token){
                $("#rtc_togg").show();
            });
            this.Docker()
        },
        methods:{
            Docker(){
                var url = this.$store.state.IPPORT + "/api/v1/GetEnableLinkagent?session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        console.log(result)
                        if(result.data.enable){
                            document.getElementById('Docker').style.display='block'
                        }
                    }
                })
            },
            Reboot(){
                var url = this.$store.state.IPPORT + "/api/v1/Restart?session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        if(result.data.bStatus){
                            console.log("重启",result.data.bStatus)
                        }
                    }
                })
                var loading = Vue.prototype.$loading({
                    lock: true,
                    text: '拼命加载中...',
                    background:"RGBA(0, 0, 0, 0.5)",
                    target: '.bottom_QR'  // 需要loading的元素的类名
                })
                setTimeout(()=>{
                    loading.close();
                    this.$nextTick(()=>{
                        this.$router.push({
                            name: `Logout`,
                            path: 'Logout',
                        })
                    })
                },1000*30)
            },
            rtctogg(){
                $("#rtc_togg").hide();
            },
            skin(){
                this.toggle=this.$store.state.darkMode
                this.$store.commit('toggle', 'darkMode')
            },
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
/* 重启 */
.bottom_QR{
    min-height: 150px;
    font-size:16px;
    font-weight:600;
    text-align: center;
    padding-top: 20px;
}
.news_hed{
    width: 140px;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 0 10px;
}
.news_hed1{
    width: 100%;
    display: flex;
    justify-content: space-around;
}
.news_size{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.news_img{
    width: 20px;
    height: 20px;
    background: url("../assets/imgs/Reboot.png") no-repeat center;
}
/* 隐藏按钮 */
.c-header-nav-btn{
    border: none;
    background: none;
}
/*弹框 */
.heder_Mask{
    width: 100%;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    /* z-index: -10; */

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
    height: 14px;
    line-height: 12px;
    padding: 0 4px;
}
/* .el-badge >>> .el-badge__content.is-fixed{
    top: 10px;
    padding: 0 4px;
} */
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
  /* color:rgba(255,255,255,1); */
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
.c_Docker{
    width: 40px;
	height: 100%;
    background: url("~@/assets/imgs/Docker.png") center center no-repeat;
    display: none;
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