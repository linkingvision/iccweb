<template>
    <div class="login_back">
        <div class="login_head">
            <div class="login_title"></div>
            <div class="login_content">
                <CCol sm="12">
                    <CCard class="content_beck">
                        <CCardBody>
                            
                            <CForm novalidate @submit.stop.prevent="login">
                                <CInput placeholder="Username" v-model="name">
                                    <template #prepend-content><i class="content_icon iconfont icon-yonghuming"></i> </template>
                                </CInput>
                                <CInput placeholder="password" type="password" v-model="passw">
                                    <template #prepend-content><i class="content_icon iconfont icon-suozi"></i> </template>
                                </CInput>
                                <div class="content_lang">
                                    <div class="lang_size">语言</div>
                                    <!-- <CSelect
                                    class="a"
                                        horizontal
                                        :options="selectOptions"
                                        placeholder="Please select"
                                    /> -->
                                    <!-- <i-select class="lang_back" :model="model1" style="width:200px">
                                        <i-option v-for="(item,index) in cityList" :key="index" :value="item.value">{{ item.label }}</i-option>
                                    </i-select> -->
                                    <Select class="lang_back" v-model="lang" @on-change="langchang">
                                        <Option  v-for="(item,index) in cityList" :key="index" :value="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                                <div class="form-actions">
                                    <CButton class="form_butt" type="submit">
                                        {{$t("message.login.login")}}
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </div>
            <div class="login_buttom">{{date}} © linkingvision.com</div>
        </div>
    </div>
</template>
<script>
import '../assets/js/jQuery.md5'
import { version } from '@babel/core';
import '../assets/js/adapter'
import {H5sEvent} from '../assets/js/h5sevent.js'
export default {
    data() {
        return {
            date:new Date().getFullYear(),
            name:"",
            passw:"",
            dialogVisible: false,
            selectOptions: [
                'English', '简体中文',
            ],
            lang:this.$store.state.lang,
            cityList: [
                {
                    value: 'en',
                    label: 'English'
                },
                {
                    value: 'zhchs',
                    label: '简体中文'
                },
            ],
            e1:undefined
        };
    },
    mounted(){
        console.log(sessionStorage.getItem('mcutoken'),sessionStorage.getItem('mcuuser'),sessionStorage.getItem('mculang'),sessionStorage.getItem('mcuroot'),this.$store.state.token,this.$store.state.user)
    },
    methods: {
        langchang(){
            console.log("111",this.lang)
            this.$i18n.locale=this.lang
            this.$store.state.lang=this.lang
            sessionStorage.mculang=this.lang
            console.log("11221",this.$store.state.lang,this.$i18n.locale)
        },
        login(){
            // return false;
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url=root+'api/v1/Login?user='+encodeURIComponent(this.name)+'&password='+encodeURIComponent($.md5(this.passw))+''
            
            // console.log(root,url)
            this.$http.get(url).then(result=>{
                // console.log(result)
                if(result.status == 200){
                    if(result.data.bStatus){
                        var data=result.data;
                        console.log(data)
                        this.$store.state.token=data.strSession
                        sessionStorage.mcutoken = this.$store.state.token
                        
                        this.loginroot(data.strSession,root)
                    }else{
                        // console.log(data)
                        // if(data.nFaultTimes<=3){
                        //     _this.frequency=3-data.nFaultTimes;
                        //     // console.log("data还能错次拉",3-data.nFaultTimes,_this.frequency);
                        //     $("#prompt").show();
                        //     $("#prompt1").hide();
                        // }else{
                        //     _this.lockingdate = Math.floor(data.tLockTimeResidue/60);
                        //     $("#prompt1").show();
                        //     $("#prompt").hide();
                        //     console.log("data请等待",_this.lockingdate,data.tLockTimeResidue)
                        // }
                        this.$message(this.$t("message.login.login_status_failed"));
                    }
                }
            })
            // this.$router.push({
            //     path: 'dashboard'
            // })
            // console.log('1111');
        },
        loginroot(strSession,root){
            var url=root+'api/v1/GetUserInfo?user='+encodeURIComponent(this.name)+'&session='+strSession;
            
            console.log(root,url)
            this.$http.get(url).then(result=>{
                if(result.status == 200){
                    var data=result.data;
                    console.log(data)
                    this.$store.state.user=data.strUser
                    this.$store.state.root=data.strUserType
                    sessionStorage.mcuuser = this.$store.state.user
                    sessionStorage.mcuroot=this.$store.state.root

                    // var conf1 = {
                    //     protocol: window.location.protocol, //http: or https:
                    //     host:this.$store.state.WSROOT, //localhost:8080
                    //     rootpath:'/', // '/'
                    //     callback: this.EventCB, 
                    //     userdata: null, // user data
                    //     session: strSession //session got from login
                    // };
                    
                    // // console.log("*******2",conf1)
                    // this.e1 = new H5sEvent(conf1);
                    // this.e1.connect();

                    this.$router.push({
                        path: 'dashboard'
                    })
                }
            })
        },
    }
};
</script>
<style lang="scss" scopad>

.login_back{
    width: 100%;
    height: 100%;
    position: fixed;
    background: url('./gallery/login_back.png') no-repeat;
    .login_head{
        text-align: center;
        margin: 12% auto 0;
        .login_title{
            height: 70px;
            margin-bottom: 30px;
            background: url('../assets/imgs/l5s_logo.png')no-repeat center center;
        }
        .login_content{
            margin: 0 auto;
            padding: 20px 2%;
            width:24%;
            background:#FFFFFF;
            // border: 2px solid rgba(30,34,40,0.1);
            box-shadow: -10px -10px 20px 10px rgba(226,226,226,0.3);
            .content_beck{
                background: none;
                border: none;
                .form-group{
                    font-size:10px;
                    font-family:PingFang SC;
                    font-weight:500;
                    color:rgba(34,38,44,1);
                    border-bottom: 1px solid rgba(226,226,226,1);
                    .content_icon{
                        color: #22262C;
                    }
                    .form-control{
                        background: none;
                        border: none;
                    }
                }
                .input-group-text{
                    background: none;
                    border: none;
                }
                .content_lang{
                    border-bottom: 1px solid rgba(226,226,226,1);
                    .lang_size{
                        text-align: left;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(34,38,44,1);
                    }
                    .lang_back{
                        .ivu-select-selection{
                            background: none;
                            border: none;
                        }
                    }
                }
                .form-actions{
                    .form_butt{
                        width: 100%;
                        border: none;
                        background:#3277FF;
                        margin: 20px 0;
                        padding: 5px;
                        font-size:14px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                    }
                }
            }
        }
        .login_buttom{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #FFFFFF;
            font-size:12px;
            font-family:PingFang SC;
            font-weight:600;
            background: rgba(0,0,0,0.4);
        }
    }
}
</style>