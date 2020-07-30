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
        <!-- <el-dialog
            class="dasboard_modal"
            title="加入会议"
            :modal="false"
            :close-on-click-modal="false"
            :visible.sync="myModal"
            width="25%">
            是否接听会议?
            <span slot="footer" class="dialog-footer particip_buttom">
                <CButton class="part_buttom_but1" type="primary"  @click="myModal=false">否</CButton>
                <CButton class="part_buttom_but" type="primary"  @click="l5svideplay">是</CButton>
            </span>
        </el-dialog> -->
        <!-- 身体 -->
        <div class="particiants_content">
            <div class="content_you" id="fullscreen" @mouseover="mouseOver"  @mouseleave="mouseLeave">
                <div class="conten_you_stup">
                    <div class="conten_you_stupcen">
                        <div class="but_g iconfont" :class="icon.connectionicon"  @click="connection"> </div>
                        <div class="but_g iconfont icon-guaduan" @click="drop"> </div>
                        <div class="but_g iconfont " :class="icon.desktopicon"  @click="desktop"> </div>
                        <CDropdown
                            style="padding:0"
                            color="link"
                            placement="top-start"
                            :caret="false">
                            <template #toggler-content>
                                <i style="font-size: 26px;" class="but_col iconfont icon-ico" @click="qrcode"></i>
                            </template>
                            <div class="bottom_QR">
                                <div class="bottom_scan">{{$t("message.conference.Scan")}}</div>
                                <div class="bottom_QRcode">
                                    <div>
                                        <div ref="qrcodead" id="qrcodead1" style="margin-bottom: 16px;"></div>
                                        <div>Android</div>
                                    </div>
                                    <div>
                                        <div ref="qrcodeios" id="qrcodeios1" style="margin-bottom: 16px;"></div>
                                        <div>iOS</div>
                                    </div>
                                </div>
                            </div>
                        </CDropdown>
                        <div class="but_g iconfont icon-fullscreen"  @click="FullScreen"> </div>
                    </div>
                </div>
                <video class="l5video" id="l5video" autoplay webkit-playsinline playsinline></video>
                <video class="l5video1" id="h5sVideoLocal" muted autoplay webkit-playsinline playsinline></video>
            </div>
            <div class="content_zuo">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="联系人" name="1">
                        <div class="content_zuo_con">
                            <div class="content_zuo_content">
                                <div class="content_zuo_user" v-for="(a,index) in userdata" :key="index">
                                    <div class="user_icon">
                                        <i class="icon_size" :class="[a.icon,a.bOnline ? '' : 'icon_size1']"></i>
                                        <div class="user_size">{{a.strName}}</div>
                                    </div>
                                    <div class="user_onl iconfont icon-shexiangtou" @click="call(a.strName)"></div>
                                    <!-- <div class="user_onl1" v-else>离线</div> -->
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="" name="2" >
                        <template slot="title">
                            <div style="display: flex;justify-content: space-between;width: 85%; align-items: center;">
                                <div>共享桌面</div>
                                <!-- @click="DesktopSwitch"  -->
                                <div @click.stop="DesktopSwitch" class="desktop_icon"></div>
                            </div>
                        </template>
                        <video class="l5sdesktop" id="l5sShadesktop" muted autoplay webkit-playsinline playsinline></video>
                    </el-collapse-item>
                    <el-collapse-item title="消息" name="3">
                        <div class="content_zuo_con2">
                            <div class="content_zuo_content" id="chatrecord">
                                <div class="content_zuo_user" v-for="(a,index) in chatrecord" :key="index">
                                    <div class="user_icon">
                                        <i class="icon_size iconfont icon-yonghuming"></i>
                                        <div class="user_size">{{a.user}}：</div>
                                    </div>
                                    <div class="user_onl">{{a.msg}}</div>
                                </div>
                            </div>
                            <div class="content_zuo_but">
                                <div class="chatwith_inp">
                                    <el-input class="chatwith_input" v-model="chatwith" placeholder="请输入内容" @keyup.enter.native="sendnews"></el-input>
                                </div>
                                <div class="chatwith_icon">
                                    <span class="iconfont icon-biaoqing"></span>
                                    <span class="iconfont icon-biaoqing"></span>
                                </div>
                                <div>
                                    <CButton class="form_butt1" type="submit" @click="sendnews">发送</CButton>
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
import QRCode from 'qrcodejs2';
import '../../assets/js/adapter'
import uuid from '../../assets/js/uuid1'
import {H5sPlayerRTC,H5sRTCGetCapability,H5sRTCPush} from '../../assets/js/h5splayer.js'
import Vue from 'vue'
// import event from '../../containers/event'
// Vue.prototype.EVENT = event
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
            l5sdesktops:undefined,
            myModal1:false,
            Shareddesktop:true,//共享桌面
            golddesktops:false,//是否有人在共享屏幕
            timerRunInfo1:"",
            chatrecord:[],//聊天记录
            icon:{
                connectionicon:"icon-shexiangjikongzhi-2",
                desktopicon:"icon-zhuomiangongxiang1"
            }
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
        this.$root.bus.$off('meettoken');
        clearInterval(this.timerRunInfo1);
    },
    mounted(){
        // console.log("**",this.EVENT)
        $(".conten_you_stup").hide()
        this.mettuselest();
        this.updisplay();
        if(this.usertoken!=undefined){
            console.log("播放",this.usertoken)
            this.l5svideplay()
        }
        this.golddesktop();
        var _this=this
        _this.$root.bus.$on('meettoken', function(token){
            console.log("播放",token)
            _this.usertoken=token
            _this.l5svideplay()
            // _this.myModal=true;
        });
        _this.$root.bus.$on('sharedstart', function(token){
            console.log("播放",token)
            _this.$message('共享屏幕开始');
            _this.desktops(token);
        });
        _this.$root.bus.$on('sharedstop', function(token){
            console.log("停止",token)
            _this.$message('共享屏幕关闭');
            _this.desktsotp();
        });
    },
    methods:{
        // 二维码
        qrcode () {
            console.log(this.tokenshou)
            if(this.usertoken==undefined){
                return false;
            }else{
                var android= window.location.protocol + '//' + window.location.host + '/single.html?token=' + this.usertoken+"&h5splayer=ws";
                var ios= window.location.protocol + '//' + window.location.host + '/single.html?token=' + this.usertoken+"&h5splayer=rtc";
            }
            this.$refs.qrcodead.innerHTML="";
            this.$refs.qrcodeios.innerHTML="";
            console.log(android,ios)
            var qrcode = new QRCode(this.$refs.qrcodead, {
                width: 100,
                height: 100// 高度
            })
            var qrcode1 = new QRCode(this.$refs.qrcodeios, {
                width: 100,
                height: 100// 高度
            })
            qrcode.clear();
            qrcode1.clear();
            qrcode.makeCode(android);
            qrcode1.makeCode(ios);
        },
        //聊天
        sendnews(){
            console.log("回车",this.chatwith);
            if (this.v1 != undefined)
            {
                if(this.chatwith){
                    console.log("回车1");
                    this.v1.send(this.usertoken,this.chatwith)
                    this.chatwith=""
                }else{
                    this.$message('消息不能为空');
                }
            }
        },
        //是否有人在使用共享桌面
        golddesktop(){
            var url = this.$store.state.IPPORT + "/api/v1/GetShareDesktopStatus?token="+this.usertoken+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(result.data.bShare){
                        console.log("刚进来看看有没有共享屏幕",result.data.bShare)
                        this.desktops(result.data.user)
                        this.golddesktops=result.data.bShare;
                    }else(
                        console.log("刚进来看看有没有共享屏幕",result,"没有")
                    )
                }
            })
        },
        golddesktopss(){
            var url = this.$store.state.IPPORT + "/api/v1/GetShareDesktopStatus?token="+this.usertoken+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(result.data.bShare){
                        console.log("刚进来看看有没有共享屏幕",result.data.bShare)
                        this.golddesktops=result.data.bShare;
                    }else(
                        console.log("刚进来看看有没有共享屏幕",result,"没有")
                    )
                }
            })
        },
        //所有人共享屏幕开始
        desktops(token){
            if (this.l5sdesktops != undefined){
                this.l5sdesktops.disconnect();
                delete this.l5sdesktops;
                this.l5sdesktops = undefined;
                $("#l5sShadesktop").get(0).load();
                $("#l5sShadesktop").get(0).poster = '';
            }
            this.timerRunInfo1 = setInterval(() => {
                var url = this.$store.state.IPPORT + "/api/v1/GetSrc?token="+token+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        console.log(result,"同步")
                        if(result.data.strToken==token){
                            console.log("同步1")
                            clearInterval(this.timerRunInfo1);
                            // return false
                            let conf = {
                                videoid:"l5sShadesktop",
                                protocol: window.location.protocol, //http: or https:
                                host: this.$store.state.WSROOT, //localhost:8080
                                streamprofile: "main", // {string} - stream profile, main/sub or other predefine transcoding profile
                                rootpath: '/', // '/'
                                token: token,
                                hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                                session: this.$store.state.token //session got from login
                            };
                            console.log("播放",conf);
                            this.l5sdesktops = new H5sPlayerRTC(conf);
                            this.l5sdesktops.connect();
                        }
                    }
                })
            }, 2000)
        },
        //关闭所有人共享屏幕
        desktsotp(){
            if (this.l5sdesktops != undefined){
                this.l5sdesktops.disconnect();
                delete this.l5sdesktops;
                this.l5sdesktops = undefined;
                $("#l5sShadesktop").get(0).load();
                $("#l5sShadesktop").get(0).poster = '';
            }
        },
        //拨打电话
        call(user){
            var token = uuid(4, 10);
            this.usertoken=token
            var starfs=new Date().getTime();
            var endds=new Date().getTime();
            var ks=new Date(starfs).toISOString()+"08:00";
            var jss=new Date(endds).toISOString()+"08:00";

            var url = this.$store.state.IPPORT + "/api/v1/OnetoOneConference?name="
            +this.$store.state.user+"&token="
            +token+"&begintime="
            +ks+"&endtime="
            +jss+"&user="
            +user+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result)
                this.l5svideplay();
            })
        },
        //切换视频
        DesktopSwitch(){
            console.log("桌面切换")
            // $("#l5sShadesktop").after($("#l5video"))
            // $("#l5video").after($("#l5sShadesktop"))
            var insert = function(nodeInsert,nodeTo){
                if(nodeInsert.insertAdjacentElement)
                {
                    nodeTo.insertAdjacentElement('beforeBegin',nodeInsert);
                }
                else
                {
                    nodeTo.parentNode.insertBefore(nodeInsert,nodeTo);
                }
            }
            var obj= document.createElement("a");
            var t1 = document.getElementById("l5video");
            var t2 = document.getElementById("l5sShadesktop");
            insert(obj,t2);
            insert(t2,t1);
            insert(t1,obj);
            //     document.body.removeChild(obj);
        },
        //共享桌面
        desktop(){
            if (this.l5sdesktops != undefined)
            {
                this.l5sdesktops.disconnect();
                delete this.l5sdesktops;
                this.l5sdesktops = undefined;
                $("#l5sShadesktop").get(0).load();
                $("#l5sShadesktop").get(0).poster = '';
                this.icon.desktopicon="icon-zhuomiangongxiang"
                return false
            }
            if(this.golddesktops==true){
                this.$message('有用户正在共享桌面');
                this.golddesktopss();
            }else{
                if(this.icon.desktopicon=="icon-zhuomiangongxiang"){

                    var url = this.$store.state.IPPORT + "/api/v1/StopShareDesktop?token="+this.usertoken+"&session="+ this.$store.state.token;
                    this.$http.get(url).then(result=>{
                        if(result.status==200){
                            console.log("关闭共享",result)
                            if (this.l5sdesktop != undefined)
                            {
                                this.l5sdesktop.disconnect();
                                delete this.l5sdesktop;
                                this.l5sdesktop = undefined;
                                $("#l5sShadesktop").get(0).load();
                                $("#l5sShadesktop").get(0).poster = '';
                                this.icon.desktopicon="icon-zhuomiangongxiang1"
                            }
                        }
                    })
                }else{
                    var url = this.$store.state.IPPORT + "/api/v1/StartShareDesktop?token="+this.usertoken+"&session="+ this.$store.state.token;
                    this.$http.get(url).then(result=>{
                        if(result.status==200){
                            console.log("共享成果",result)
                            this.icon.desktopicon="icon-zhuomiangongxiang"
                            if (this.l5sdesktop != undefined)
                            {
                                this.l5sdesktop.disconnect();
                                delete this.l5sdesktop;
                                this.l5sdesktop = undefined;
                            }
                            var audioout=this.audioout.toString();
                            var pushType=""
                            if (this.Shareddesktop == true)
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
                            console.log("************",conf1)
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
                    })
                }
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
        //开启视频
        connection(){
            this.myModal1=false
            if(this.icon.connectionicon=="icon-shexiangjikongzhi-2"){
                this.icon.connectionicon="icon-shexiangjikongzhi"
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
                    callback: this.PlaybackCB, //Callback for the event
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
                // return false
                this.v1.connect(
                    this.VideoIn,
                    this.VideoCodec,
                    this.Bitratess,
                    this.Resolution,
                    this.AudioIn,
                    false
                );
            }else{
                if (this.v1 != undefined)
                {
                    this.v1.disconnect();
                    delete this.v1;
                    this.v1 = undefined;
                    $("#h5sVideoLocal").get(0).load();
                    $("#h5sVideoLocal").get(0).poster = '';
                    this.icon.connectionicon="icon-shexiangjikongzhi-2 "
                }
            }
        },
        PlaybackCB(event, userdata){
            
            var msgevent = JSON.parse(event);
            var chatrecorddata={
                user:msgevent.user,
                msg:msgevent.msg
            }
            this.chatrecord.push(chatrecorddata)
            this.$nextTick(() => {
                let ele = document.getElementById('chatrecord');
                ele.scrollTop = ele.scrollHeight;
            })
            console.log("Playback callback ", event,msgevent,this.chatrecord,chatrecorddata);
        },
        //获取列表
        mettuselest(){
            // console.log(this.$store.state.IPPORT)
            var url = this.$store.state.IPPORT + "/api/v1/GetOnlineUserList?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result)
                var data=result.data.userList
                if(data.length==0){
                    return false
                }
                for(var i=0; i<data.length;i++){
                    if(this.$store.state.user==data[i].strName){
                        continue
                    }
                    var userdata={
                        strName: data[i].strName,
                        icon:"iconfont icon-yonghuming",
                        bOnline:true
                    }
                    this.userdata.push(userdata)
                    
                }
            })
        },
        //退出
        drop(){
            // $("#" + this.h5videoid).get(0).load();
            // $("#" + this.h5videoid).get(0).poster = '';
            // console.log("41")
            this.icon.desktopicon="icon-zhuomiangongxiang1"
            this.icon.connectionicon="icon-shexiangjikongzhi-2"
            if (this.l5sdesktops != undefined){
                this.l5sdesktops.disconnect();
                delete this.l5sdesktops;
                this.l5sdesktops = undefined;
            }
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
                var url = this.$store.state.IPPORT + "/api/v1/StopShareDesktop?token="+this.usertoken+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    console.log("关闭",result)
                })
            }
            // this.$router.push({
            //     path: 'Conference'
            // })
        },
        //播放视频
        l5svideplay(){
            this.myModal=false;
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
    // position: fixed;
    //头部
    .l5video{
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
    .l5sdesktop{
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
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
            // .l5sdesktop{
            //     width: 100%;
            //     height: 100%;
            //     object-fit: fill;
            // }
            .el-collapse{
                .desktop_icon{
                    width: 35px;
                    height: 35px;
                    background: url("~@/views/gallery/paricipant_icon_gx.png") no-repeat;
                    background: {
                        size: 100%;
                        
                    };
                }
                .el-collapse-item__wrap{
                    background: none;
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
                                            color: #0099da;
                                            margin-right: 8px;
                                        }
                                        .icon_size1{
                                            font-size:15px;
                                            margin-right: 8px;
                                        }
                                        .user_size{
                                            font-size:16px;
                                            font-family:PingFang SC;
                                            font-weight:500;
                                        }
                                    }
                                }
                                .user_onl{
                                    font-size:14px;
                                    font-family:PingFang SC;
                                    font-weight:500;
                                    color:rgba(59,205,107,1);
                                    cursor:pointer;
                                }
                                .user_onl1{
                                    font-size:14px;
                                    font-family:PingFang SC;
                                    font-weight:500;
                                    color:#FFFFFF;
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
                                            color: #0099da;
                                            margin-right: 8px;
                                        }
                                        .user_size{
                                            font-size:14px;
                                            font-family:PingFang SC;
                                            font-weight:500;
                                        }
                                    }
                                    .user_onl{
                                        width: 70%;
                                        font-size:14px;
                                        font-family:PingFang SC;
                                        font-weight:500;
                                    }
                                }
                            }
                            .content_zuo_but{
                                width: 100%;
                                height: 30%;
                                padding: 10px 18px;
                                div{
                                    margin: 10px 0;
                                }
                                .chatwith_inp{
                                    .chatwith_input{
                                        width: 100%;
                                        border-radius:2px;
                                        /deep/ .el-input__inner{
                                            border: none !important;
                                            background:rgba(238,240,245,1)!important;
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
                    background:rgba(0,0,0,0.5);
                    padding: 0 10px;
                    border-radius:35px;
                    display: flex;
                    justify-content: space-around;
                    .but_g{
                        font-size: 26px;
                        color: #FFFFFF;
                        padding: 10px 10px;
                        margin: 0 20px;
                    }
                    .bottom_QR{
                        font-size:16px;
                        font-weight:600;
                        
                        text-align: center;
                        
                        .bottom_scan{
                            font-size:16px;
                            font-weight:600;
                            margin-bottom: 20px;
                            padding: 0 20px;
                        }
                        .bottom_QRcode{
                            display: flex;
                            div{
                                padding: 0 20px;
                            }
                        }
                    }
                }
            }
            // .l5video{
            //     width: 100%;
            //     height: 100%;
            //     object-fit: fill;
            // }
            .l5video1{
                display: none;
            }
        }
    }
}
</style>