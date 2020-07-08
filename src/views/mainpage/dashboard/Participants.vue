<template>
<div class="dasboard_global">
    <div class="particiants">
        <el-dialog
            class="dasboard_modal"
            title="开启视频上传"
            :visible.sync="myModal1"
            width="25%">
            <div class="up_you_content">
                <span>Video Codec</span>
                <el-select style="width:75%" v-model="VideoCodec" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in VideoCodecs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="up_you_content">
                <span>Video In</span>
                <el-select style="width:75%" v-model="VideoIn" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in VideoIns"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="up_you_content">
                <span>Resolution</span>
                <el-select style="width:75%" v-model="Resolution" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in Resolutions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="up_you_content">
                <span>Bitrate（Kpbs）</span>
                <el-select style="width:75%" v-model="Bitratess" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in Bitrates"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="particip_buttom">
                    <CButton class="part_buttom_but1" type="primary"  @click="myModal1=false">否</CButton>
                    <CButton class="part_buttom_but" type="primary"  @click="connection">是</CButton>
                </div>
            </span>
        </el-dialog>
        <!-- 身体 -->
        <div class="particiants_content" @mouseover="mouseOver"  @mouseleave="mouseLeave">
            <div class="content_you" id="fullscreen">
                <div class="conten_you_stup">
                    <div class="conten_you_stupcen">
                        <div class="iconfont icon-gongxiangpingmu"  @click="desktop"> </div>
                        <div class="iconfont icon-guaduan" @click="drop"> </div>
                        <div class="iconfont icon-fullscreen"  @click="FullScreen"> </div>
                    </div>
                </div>
                <video class="l5video" id="l5video" autoplay webkit-playsinline playsinline></video>
                <video class="l5video1" id="h5sVideoLocal" muted autoplay webkit-playsinline playsinline></video>
            </div>
            <div class="content_zuo">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="会议人员" name="1">
                        <div class="content_zuo_con">
                            <div class="content_zuo_content">
                                <div class="content_zuo_user" v-for="(a,index) in userdata" :key="index">
                                    <div class="user_icon">
                                        <i class="icon_size iconfont icon-yonghuming"></i>
                                        <div class="user_size">{{a.strName}}</div>
                                    </div>
                                    <div class="user_onl">在线</div>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="" name="2">
                        <template slot="title">
                            <div style="display: flex;justify-content: space-between;width: 85%; align-items: center;">
                                <div>共享桌面</div>
                                <div class="header-icon el-icon-info"></div>
                            </div>
                        </template>
                        <video class="l5sdesktop" id="l5sShadesktop" muted autoplay webkit-playsinline playsinline></video>
                    </el-collapse-item>
                    <el-collapse-item title="消息" name="3">
                        <div class="content_zuo_con2">
                            <div class="content_zuo_content">
                                <div class="content_zuo_user">
                                    <div class="user_icon">
                                        <i class="icon_size iconfont icon-yonghuming"></i>
                                        <div class="user_size">用户：</div>
                                    </div>
                                    <div class="user_onl">这是一个很重要的会议，大家先讨论一下</div>
                                </div>
                            </div>
                            <div class="content_zuo_but">
                                <div class="chatwith_inp">
                                    <el-input class="chatwith_input" v-model="chatwith" placeholder="请输入内容"></el-input>
                                </div>
                                <div class="chatwith_icon">
                                    <span class="iconfont icon-biaoqing"></span>
                                    <span class="iconfont icon-biaoqing"></span>
                                </div>
                                <div>
                                    <CButton class="form_butt1" type="submit">发送</CButton>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <!-- 1 -->
                
                <!-- 2 -->
                <!-- <div class="content_zuo_con1">
                    <div class="content_zuo_title">文档</div>
                    <div class="content_zuo_content">
                        <div class="content_doc">
                            <div class="doc_flex">
                                <div class="doc_icon iconfont icon-wenjian"></div>
                                <div class="doc_user">文档需求</div>
                            </div>
                            <div class="doc_flex">
                                <div class="doc_hide iconfont icon-xiazai"></div>
                                <div class="doc_dow iconfont icon-wenjian"></div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <!-- 3 -->
                
            </div>
        </div>
    </div>
</div>
</template>
<script>
import '../../../assets/js/adapter'
import {H5sPlayerRTC,H5sRTCGetCapability,H5sRTCPush} from '../../../assets/js/h5splayer.js'
export default {
    name:"participants",
    data(){
        return {
            activeNames: ['1','2','3'],//左边
            chatwith: '',
            h5handler:undefined,
            usertoken:this.$route.params.token,
            userdata:[],

            VideoCodecs: [],
            VideoCodec:"",

            VideoIns: [],
            VideoIn:"",

            AudioIns: [],
            AudioIn:"",

            AudioOuts: [],
            AudioOut:"",

            Resolutions: [],
            Resolution:"",

            Bitrates: [],
            Bitratess:"",
            audioout:true,
            v1:undefined,
            l5sdesktop:undefined,
            myModal1:true,
            Shareddesktop:false,//共享桌面
        }
    },
    beforeDestroy() {
        if (this.h5handler != undefined)
        {
            this.h5handler.disconnect();
            delete this.h5handler;
            this.h5handler = undefined;
        }
        if (this.v1 != undefined)
        {
            this.v1.disconnect();
            delete this.v1;
            this.v1 = undefined;
        }
        if (this.l5sdesktop != undefined)
        {
            this.l5sdesktop.disconnect();
            delete this.l5sdesktop;
            this.l5sdesktop = undefined;
        }
    },
    mounted(){
        $(".conten_you_stup").hide()
        if(this.usertoken!= undefined){
            this.l5svideplay()
            this.mettuselest();
            this.updisplay();
        }else{
            this.drop()
        }
    },
    methods:{
        //共享桌面
        desktop(){
            if(this.Shareddesktop){
                this.Shareddesktop=false
                if (this.l5sdesktop != undefined)
                {
                    this.l5sdesktop.disconnect();
                    delete this.l5sdesktop;
                    this.l5sdesktop = undefined;
                }
                console.log(this.Shareddesktop,"2");
            }else{
                this.Shareddesktop=true
                console.log(this.Shareddesktop,"1");
                if (this.l5sdesktop != undefined)
                {
                    this.l5sdesktop.disconnect();
                    delete this.l5sdesktop;
                    this.l5sdesktop = undefined;
                }
                var audioout=this.audioout.toString();
                var pushType=""
                if (this.Shareddesktop == "true")
                {
                    pushType = 'sharing';
                }
                var conf1 = {
                    localvideoid:'l5sShadesktop', //{string} - id of the local video element tag
                    //localvideodom: h5svideodomlocal, //{object} - local video dom. if there has videoid, just use the videoid
                    protocol: window.location.protocol, //http: or https:
                    host:this.$store.state.WSROOT, //localhost:8080
                    rootpath:'/', // {string} - path of the app running
                    user:this.$store.state.user, // {string} - user name
                    type:pushType, // {string} - media or sharing
                    audio: audioout,
                    callback: null, //Callback for the event
                    userdata: null, // user data
                    session: this.$store.state.token, //session got from login
                    consolelog: 'true' // 'true' or 'false' enable/disable console.log
                };
                console.log(conf1)
                // return false
                this.l5sdesktop = new H5sRTCPush(conf1);
                this.l5sdesktop.connect(
                    this.VideoIn,
                    this.VideoCodec,
                    this.Bitratess,
                    this.Resolution,
                    this.AudioIn,
                    this.Shareddesktop
                );
            }
        },
        //播放自己
        updisplay(){
            var up=H5sRTCGetCapability(this.UpdateCapability);
        },
        UpdateCapability(capability){
            
            console.log(capability);
            if(capability){

                for (let i = 0; i !== capability['videocodec'].length; ++i) {
                    const data = capability['videocodec'][i];
                    var src={
                        value: data,
                        label: data
                    }
                    this.VideoCodec = data
                    this.VideoCodecs.push(src);
                }
                for (let i = 0; i !== capability['videocodec'].length; ++i) {
                    const data = capability['videocodec'][i];
                    if (data == 'H264')
                    {
                        this.VideoCodec = data
                    }
                }
                for (let i = 0; i !== capability['videoin'].length; ++i) {
                    const data = capability['videoin'][i];
                    var src={
                        value: data.id,
                        label: data.name
                    }
                    this.VideoIn=data.id
                    this.VideoIns.push(src);
                }	

                for (let i = 0; i !== capability['audioin'].length; ++i) {
                    const data = capability['audioin'][i];
                    var src={
                        value: data.id,
                        label: data.name
                    }
                    this.AudioIn=capability['audioin'][0].id
                    this.AudioIns.push(src);
                }
                
                for (let i = 0; i !== capability['audioout'].length; ++i) {
                    const data = capability['audioout'][i];
                    var src={
                        value: data.id,
                        label: data.name
                    }
                    this.AudioOut=capability['audioout'][0].id
                    this.AudioOuts.push(src);
                }
                
                var resolution = ['QVGA', 'VGA', 'D1', '720P', '1080P', '4K', '8K']
                for (let i = 0; i !== resolution.length; ++i) {
                    const data = resolution[i];
                    /* Default use 720P */
                    
                    var src={
                        value: data,
                        label: data
                    }
                    // this.Resolution=data
                    if (data == '720P')
                    {
                        this.Resolution=data
                    }
                    this.Resolutions.push(src);
                }
                
                var bitrate = ['32', '64', '128', '256', '512', '1024', '2048', '4096']
                for (let i = 0; i !== bitrate.length; ++i) {
                    const data = bitrate[i];
                    var src={
                        value: data,
                        label: data
                    }
                    // this.Bitratess=data
                    /* Default use 720P */
                    if (data == '1024')
                    {
                        this.Bitratess=data
                    }
                    this.Bitrates.push(src);
                }
            }
        },
        //全屏
        FullScreen()
        {
            var elem = $("#fullscreen").get(0);
            //var elem = $("#videoPanel");
            if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
            ) {
                if (
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                ) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                        
                    }
                } else {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                }
            } else {
                console.log('Fullscreen is not supported on your browser.');
            }
        },
        connection(){
            this.myModal1=false
            if (this.v1 != undefined)
            {
                this.v1.disconnect();
                delete this.v1;
                this.v1 = undefined;
            }
            var audioout=this.audioout.toString();
            var conf1 = {
                localvideoid:'h5sVideoLocal', //{string} - id of the local video element tag
                //localvideodom: h5svideodomlocal, //{object} - local video dom. if there has videoid, just use the videoid
                protocol: window.location.protocol, //http: or https:
                host:this.$store.state.WSROOT, //localhost:8080
                rootpath:'/', // {string} - path of the app running
                user:this.$store.state.user, // {string} - user name
                type:'media', // {string} - media or sharing
                audio: audioout,
                callback: null, //Callback for the event
                userdata: null, // user data
                session: this.$store.state.token, //session got from login
                consolelog: 'true' // 'true' or 'false' enable/disable console.log
            };
            // return false
            this.v1 = new H5sRTCPush(conf1);
            console.log("*******",this.VideoCodec,"1*",
                this.VideoIn,"2*",
                this.Bitratess,"5*",
                this.Resolution,"3*",
                this.AudioIn,
                this.v1,
                true
            )
            // this.v1.connect(
            //     "a4afcd793d76a3effca436c6cd006d6baa6023164f5f739aceaa6ea5b28cda0b",
            //     "H264",
            //     "1024",
            //     "720P",
            //     "default"
            // );
            
            // return false
		    this.v1.connect(
                this.VideoIn,
                this.VideoCodec,
                this.Bitratess,
                this.Resolution,
                this.AudioIn,
                false
            );
        },
        //获取列表
        mettuselest(){
            // console.log(this.$store.state.IPPORT)
            var url = this.$store.state.IPPORT + "/api/v1/GetParticiant?token="+this.usertoken+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result)
                // this.userdata=result.data.particiants
                var data=result.data.particiants
                if(data.length==0){
                    return false
                }
                console.log(data)
                for(var i=0; i<data.length;i++){
                    if(data[i].strToken==this.usertoken){
                        continue
                    }
                    var userdata={
                        mosaicId: data[i].mosaicId,
                        nSolt: data[i].nSolt,
                        partId: data[i].partId,
                        strName: data[i].strName,
                        strToken: data[i].strToken,
                        strType: data[i].strType
                    }
                    this.userdata.push(userdata)
                    
                    // console.log(i,data[i].strToken,this.usertoken)
                }
            })
        },
        //退出
        drop(){
            // console.log("41")
            if (this.h5handler != undefined)
            {
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
            }
            if (this.v1 != undefined)
            {
                this.v1.disconnect();
                delete this.v1;
                this.v1 = undefined;
            }
            if (this.l5sdesktop != undefined)
            {
                this.l5sdesktop.disconnect();
                delete this.l5sdesktop;
                this.l5sdesktop = undefined;
            }
            this.$router.push({
                path: 'Conference'
            })
        },
        //播放视频
        l5svideplay(){
            if (this.h5handler != undefined)
            {
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
            }
            // console.log(playid,token,streamprofile)
            let conf = {
                videoid:"l5video",
                protocol: window.location.protocol, //http: or https:
                host: this.$store.state.WSROOT, //localhost:8080
                streamprofile: "main", // {string} - stream profile, main/sub or other predefine transcoding profile
                rootpath: '/', // '/'
                token: this.usertoken,
                hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                session: this.$store.state.token //session got from login
            };
            console.log("播放",conf);
            this.h5handler = new H5sPlayerRTC(conf);
            this.h5handler.connect();
        },
        mouseOver(){
            $(".conten_you_stup").show()
        },
        mouseLeave(){
            $(".conten_you_stup").hide()
        }
    }
}
</script>
<style lang="scss" scoped>
.particiants{
    width: 100%;
    height: 100%;
    // height: 96vh;
    background-color: #212121;
    // position: fixed;
    //头部
    .dasboard_modal{
        .up_you_content{
            margin-top: 20px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content:space-around;
            span{
                width: 45%;
            }
        }
    }
    .particiants_title{
        width: 100%;
        height: 50px;
        background-color: #151515;
        padding: 0 34px;
        .particiants_logo{
            width: 160px;
            height: 100%;
            background: url('../../../assets/imgs/l5s_logo_bai.png') no-repeat center center;
            background-size: 100%;
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
        height: 100%;
        // height: 96vh;
        display: flex;
        .content_zuo{
            width: 15%;
            min-width: 260px;
            height: 100%;
            overflow: scroll;
            // height: 98vh;
            color: #FFFFFF;
            &::-webkit-scrollbar{
                display: none;
            }
            .l5sdesktop{
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
            .el-collapse{
                .el-collapse-item__wrap{
                    .el-collapse-item__content{
                        //1
                        .content_zuo_con{
                            width: 100%;
                            height: 25vh;
                            overflow: auto;
                            &::-webkit-scrollbar{
                                display: none;
                            }
                            .content_zuo_content{
                                width: 100%;
                                height: 90%;
                                .content_zuo_user{
                                    width: 100%;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 10px 18px;
                                    .user_icon{
                                        display: flex;
                                        align-items: center;
                                        .icon_size{
                                            font-size:15px;
                                            opacity:0.7;
                                            color: #3171FF;
                                            margin-right: 8px;
                                        }
                                        .user_size{
                                            font-size:16px;
                                            font-family:PingFang SC;
                                            font-weight:500;
                                            color:rgba(255,255,255,1);
                                            opacity:0.7;
                                        }
                                    }
                                }
                                .user_onl{
                                    font-size:14px;
                                    font-family:PingFang SC;
                                    font-weight:500;
                                    color:rgba(59,205,107,1);
                                    opacity:0.7;
                                }
                            }
                            
                        }
                        //2
                        .content_zuo_con2{
                            width: 100%;
                            height: 40vh;
                            .content_zuo_content{
                                width: 100%;
                                height: 50%;
                                overflow: auto;
                                &::-webkit-scrollbar{
                                    display: none;
                                }
                                .content_zuo_user{
                                    width: 100%;
                                    display: flex;
                                    // flex-wrap: wrap;
                                    // justify-content: space-between;
                                    align-items: flex-start;
                                    padding: 10px 18px;
                                    .user_icon{
                                        width: 30%;
                                        display: flex;
                                        align-items: center;
                                        .icon_size{
                                            font-size:14px;
                                            opacity:0.7;
                                            color: #3171FF;
                                            margin-right: 8px;
                                        }
                                        .user_size{
                                            font-size:14px;
                                            font-family:PingFang SC;
                                            font-weight:500;
                                            color:rgba(255,255,255,1);
                                            opacity:0.7;
                                        }
                                    }
                                    .user_onl{
                                        width: 70%;
                                        font-size:14px;
                                        font-family:PingFang SC;
                                        font-weight:500;
                                        color:rgba(255,255,255,1);
                                        opacity:0.4;
                                    }
                                }
                            }
                            .content_zuo_but{
                                width: 100%;
                                height: 30%;
                                padding: 10px 18px;
                                background-color: #252525;
                                div{
                                    margin: 10px 0;
                                }
                                .chatwith_inp{
                                    .chatwith_input{
                                        width: 100%;
                                        background:#3C3C3C;
                                        border-radius:2px;
                                        /deep/ .el-input__inner{
                                            border: none !important;
                                        }
                                    }
                                }
                                .chatwith_icon{
                                    span{
                                        margin-right: 10px;
                                    }
                                }
                                .form_butt1{
                                    width: 100%;
                                    text-align: center;
                                    background:rgba(50,119,255,1);
                                    border-radius:2px;
                                    color: #FFFFFF;
                                }
                            }
                        }
                    }
                }
            }
            //1
            
            //2
            .content_zuo_con1{
                width: 100%;
                height: 20%;
                .content_zuo_title{
                    background:#2E2E2E;
                    width: 100%;
                    padding: 8px 12px;
                    font-size:15px;
                    font-family:PingFang SC;
                    font-weight:500;
                    opacity:0.7;
                    top: 0;
                }
                .content_zuo_content{
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    .content_doc{
                        display: flex;
                        padding: 8px 18px;
                        align-items: center;
                        justify-content: space-between;
                        .doc_flex{
                            width: 35%;
                            display: flex;
                            justify-content: space-around;
                            .doc_user{
                                font-size:14px;
                                font-family:PingFang SC;
                                font-weight:500;
                                color:rgba(255,255,255,1);
                                opacity:0.7;
                            }
                        }
                    }
                }
            }
            //3
            
        }
        .content_you{
            width: 85%;
            // height: 96vh;
            height: 100%;
            position: relative;
            
            .conten_you_stup{
                width: 100%;
                position: absolute;
                bottom: 15%;
                display: flex;
                justify-content: center;
                z-index: 10;
                cursor:pointer;
                .conten_you_stupcen{
                    background:rgba(255,255,255,0.1);
                    padding: 0 30px;
                    border-radius:35px;
                    display: flex;
                    justify-content: space-around;
                    div{
                        color: #FFFFFF;
                        padding: 10px 10px;
                        margin: 0 20px;
                    }
                }
            }
            .l5video{
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
            .l5video1{
                display: none;
            }
        }
    }
}
</style>