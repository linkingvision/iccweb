<template>
    <div class="particiants">
        <!-- 头部 -->
        <div class="particiants_title">
            <div class="particiants_logo"></div>
        </div>
        <!-- 返回 -->
        <div>
            <CButton class="particiants_title_but iconfont icon-fanhui" type="submit" to="dashboard"> 加入会议</CButton>
        </div>
        <!-- 身体 -->
        <div class="particiants_content">
            <div class="content_zuo">
                787
            </div>
            <div class="content_you">
                <video class="l5video" id="l5video" autoplay webkit-playsinline playsinline></video>
            </div>
        </div>
    </div>
</template>
<script>
// import '../../../assets/js/adapter'
import {H5sPlayerWS,H5sPlayerHls,H5sPlayerRTC,H5sPlayerAudBack} from '../../../assets/js/h5splayer.js'
export default {
    name:"participants",
    data(){
        return {
            h5handler:undefined,
            usertoken:this.$route.params.token
        }
    },
    beforeDestroy() {
        if (this.h5handler != undefined)
        {
            this.h5handler.disconnect();
            delete this.h5handler;
            this.h5handler = undefined;
        }
    },
    mounted(){
        if(this.usertoken!= undefined){
            this.l5svideplay()
        }else{
            this.$router.push({
                path: 'dashboard'
            })
        }
        console.log(this.$route.params.token)
    },
    methods:{
        l5svideplay(){
            var wsroot = process.env.VUE_APP_PORT;
            if (wsroot == undefined)
            {
                wsroot = window.location.host;
            }
            // console.log(playid,token,streamprofile)
            let conf = {
                videoid:"l5video",
                protocol: window.location.protocol, //http: or https:
                host: wsroot, //localhost:8080
                streamprofile: "main", // {string} - stream profile, main/sub or other predefine transcoding profile
                rootpath: '/', // '/'
                token: this.usertoken,
                hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                session: this.$store.state.token //session got from login
            };
            this.h5handler = new H5sPlayerRTC(conf);
            this.h5handler.connect();
        }
    }
}
</script>
<style lang="scss" scoped>
.particiants{
    width: 100%;
    height: 100%;
    background-color: #252A32;
    position: fixed;
    //头部
    .particiants_title{
        width: 100%;
        height: 50px;
        background-color: #151515;
        padding: 0 34px;
        .particiants_logo{
            width: 160px;
            height: 100%;
            background: url('../../../assets/imgs/l5s_logo_bai.png') no-repeat center center;
        }
    }
    //返回
    .particiants_title_but{
        background: none;
        border: none;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:500;
        color: #FFFFFF;
        margin: 10px 40px;
        padding: 0;
    }
    //身体
    .particiants_content{
        width: 100%;
        // height: 100%;
        display: flex;
        .content_zuo{
            width: 20%;
            height: 100vh;
        }
        .content_you{
            width: 80%;
            height: 100vh;
            .l5video{
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
        }
    }
}
</style>