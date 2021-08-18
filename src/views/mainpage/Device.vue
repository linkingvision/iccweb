<template>
    <div class="device" id="device">
        <div class="sele"  v-show="!share" id="sele">
            
            <!-- <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div>
            <div class="select"></div> -->
        </div>
        <div class="conten_you_stup">
            <div class="conten_you_stupcen">
                <div @click="Reconnection" style="width:90px; padding-top: 16px;">
                    <el-select id="selectt" style="width:75%" v-model="Bitratess" size="small" placeholder="请选择" @change="change">
                        <el-option
                        v-for="item in Bitrates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select></div>
                <div class="but_g iconfont" :class="icon.audio" @click="dropaudio"> </div>
                <div class="but_g iconfont " :class="icon.desktopicon"  @click="desktop"> </div>
                <div class="but_g iconfont icon-huiyi"  @click="FullScreen"> </div>
                <div class="but_g iconfont icon-huiyiguanli" @click="show"> </div>
                <div class="but_g iconfont icon-guaduan" style="font-size:32px" @click="drop"> </div>
            </div>
        </div>
        <div class="share" v-show="share" id="share">
            <video class="l5video" id="l5video" autoplay webkit-playsinline playsinline></video>
        </div>
        <div class="serig" id="serig">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="用户" name="1">
                    <div class="content_zuo_con">
                        <div class="content_zuo_content">
                            <div class="content_zuo_user" v-for="(a,index) in userdata" :key="index">
                                <div class="user_icon">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-ziyuan1"></use>
                                    </svg>
                                    <!-- <i class="icon_size" :class="[a.icon,a.bOnline ? '' : 'icon_size1']"></i> -->
                                    <div class="user_size">{{a}}</div>
                                </div>
                                <!-- <div class="user_onl iconfont icon-shipin1" @click="call(a.strName)"></div> -->
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
                    <div class="DesktopSwitch" id="DesktopSwitch" style="width: 100%; height:150px;">
                        <video class="l5sdesktop" id="l5sShadesktop" muted autoplay webkit-playsinline playsinline></video>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="消息" name="3">
                    <div class="content_zuo_con2">
                        <!-- <div class="content_zuo_content" id="chatrecord">
                            <div class="content_zuo_user" v-for="(a,index) in chatrecord" :key="index">
                                <div class="user_icon">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-ziyuan1"></use>
                                    </svg>
                                    <div class="user_size">{{a.user}}：</div>
                                </div>
                                <div class="user_onl" style="word-break: break-word;">{{a.msg}}</div>
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
                        </div> -->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="" name="5">
                    <div class="selects" style="position:relative;">
                        <video class="h5video" id="local" playsinline autoplay muted="muted"></video>
                    </div>
                </el-collapse-item>  
            </el-collapse>
        </div>
    </div>
</template>
<script>
import {Room} from '../../assets/js/iccivmjs.js'
import {L5sPlayerRTC,L5sRTCPush,L5sRTCGetCapability} from '../../assets/js/l5splayer.js'
export default {
    name:'Device',
    data(){
        return{
            VideoCodec:this.$store.state.VideoCodec,
            Resolution:this.$store.state.Resolution,
            Bitratess:this.$store.state.Bitratess,
            pushaudio:this.$store.state.pushaudio,
            // room:1234,
            room:this.$store.state.room,
            user:this.$store.state.user,
            Bitrates:[],
            upuser:undefined,//打电话的user
            l5sdesktop:undefined,
            l5sdesktops:undefined,
            golddesktops:false,//是否有人在共享屏幕
            activeNames:['1','2','3','4','5'],
            icon:{
                connectionicon:"icon-shuaxin",
                desktopicon:"icon-zhuomiangongxiang1",
                audio:'icon-yangshengqi1'
            },
            shows:true,
            audioout:true,
            share:false,
            shares:true,
            usertoken:this.$route.params.token,
            videoPublisher:{},
            userdata:[],
        }
    },
    mounted(){
        if (this.room) {
            this.conent()
        }
        var bitrate = ['No limit','128', '256', '512', '1024',"1500", '2048']
        for (let i = 0; i !== bitrate.length; ++i) {
            const data = bitrate[i];
            var src={
                value: data,
                label: data
            }
            this.Bitrates.push(src);
        }
        this.mouse()
    },
    methods:{
        mouse(){
            $(".sele").mouseenter(function(){
                $(".conten_you_stup").show()
                $(".conten_you_stup").mouseenter(function(){
                    $(".conten_you_stup").show()
                })
            })
            $(".sele").mouseleave(function(){
                $(".conten_you_stup").hide()
                // $(".el-popper").heid()
            })
            $(".share").mouseenter(function(){
                $(".conten_you_stup").show()
                $(".conten_you_stup").mouseenter(function(){
                    $(".conten_you_stup").show()
                })
            })
            $(".share").mouseleave(function(){
                $(".conten_you_stup").hide()
            })
            $("#selectt").mouseenter(function(){
                $(".conten_you_stup").show()
            })
        },
        show(){
            if (this.shows) {
                $("#serig").hide()
                $("#sele").css("width","99%")
                this.shows=false;
            }else{
                $("#serig").show()
                $("#sele").css("width","83%")
                this.shows=true;
            }
            
        },
        Reconnection(){},
        dropaudio(){},
        drop(){},
        //共享桌面
        desktop(){
            console.log("**********",this.upuser)
            if (this.l5sdesktops != undefined){
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
            }else{
                if(this.icon.desktopicon=="icon-zhuomiangongxiang"){
                    console.log("关闭共享")
                    if (this.l5sdesktop != undefined)
                    this.shares=true;
                    {
                        this.l5sdesktop.disconnect();
                        delete this.l5sdesktop;
                        this.l5sdesktop = undefined;
                        $("#l5sShadesktop").get(0).load();
                        $("#l5sShadesktop").get(0).poster = '';
                        this.icon.desktopicon="icon-zhuomiangongxiang1"
                    }
                }else{
                    console.log("共享成果")
                    this.icon.desktopicon="icon-zhuomiangongxiang"
                    console.log(this.l5sdesktop);
                    if (this.l5sdesktop != undefined){
                        this.l5sdesktop.disconnect();
                        delete this.l5sdesktop;
                        this.l5sdesktop = undefined;
                    }
                    // var audioout=this.audioout.toString();
                    var pushType="";
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
                        callback: null, //Callback for the event
                        userdata: null, // user data
                        session: this.$store.state.token, //session got from login
                        consolelog: 'true' // 'true' or 'false' enable/disable console.log
                    };
                    var param = {
                        video: 'true', // 'true' or 'false' enable/disable video
                        audio: "false", // 'true' or 'false' enable/disable audio
                        //facingmode:"environment", // {string} - user or environment; desktop remove this config 
                        videoin: this.VideoIn,
                        codec: this.VideoCodec,
                        bitrate: this.Bitratess,
                        resolution: this.Resolution,
                        audioin: this.AudioIn,
                        desktopshare: true // true or false for desktop sharing
                    };
                    // return false
                    this.l5sdesktop = new L5sRTCPush(conf1);
                    this.l5sdesktop.connect(this.upuser, param);
                    this.shares=false;
                }
            }
        },
         //切换视频
        DesktopSwitch(){
            if (this.shares) {
                return
            }
            this.share = !this.share
            console.log("桌面切换",this.share)
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
            console.log(t2.insertAdjacentElement);
            insert(obj,t2);
            insert(t2,t1);
            insert(t1,obj);
            //     document.body.removeChild(obj);
        },
        FullScreen(){},
        //切换码率
        change(){
            console.log(parseInt(this.Bitratess));
            if(this.videoPublisher.publish){
                if (this.Bitratess=='No limit') {
                    var bit = '0'
                }else{
                    var bit = parseInt(this.Bitratess)
                }
                this.videoPublisher.changeBandwidth(bit*1000);
            }
        },
        conent(){
            var conf = {
                protocol: window.location.protocol, // {string} - 'http:' or 'https:'
                // host: window.location.host, //{string} - 'localhost:8080'
                host:this.$store.state.WSROOT, //{string} - 'localhost:8080'
                rootpath: "/", // {string} - path of the app running
                userid: this.user,
                username: this.user,
                vmrid:parseInt(this.room),
                // session: this.$store.state.token, //{string} - session got from login
                session: 'c1782caf-b670-42d8-ba90-2244d0b0ee83', //{string} - session got from login
                // consolelog: 'true', // 'true' or 'false' enable/disable console.log
            };
            let room = new Room(conf)
            this.publish(room);
        },
        publish(room){
            this.userdata.push(room.user.name)
            var bitrateTimer = [];
            room.connect();
            room.on("datachannelready", () => {
                let currentStream;
                let media = {audioSend: this.pushaudio,video: this.Resolution,vcodec:this.VideoCodec};
                var localFeed = room.findOrCreateLocalFeed("videoroom", "localcam");
                const _videoPublisher = localFeed.data_provider;
                this.videoPublisher = _videoPublisher;
                const joined = (data) => {
                    localFeed.extras = { remote_id: data.id };
                };
                const onlocalstream = (stream) => {
                    $("#local").get(0).srcObject = stream;
                    currentStream = stream;
                };
                const oncleanup = () => {

                };
                const onwebrtcState = (on) => {
                    console.log("onwebrtcState", on);
                    localFeed.makeLive();
                };
                _videoPublisher.on("joined", joined);
                _videoPublisher.on("onlocalstream", onlocalstream);
                _videoPublisher.on("webrtcState", onwebrtcState);
                _videoPublisher.on("oncleanup", oncleanup);
                const cleanup = () => {
                    _videoPublisher.removeListener("joined", joined);
                    _videoPublisher.removeListener("onlocalstream", onlocalstream);
                    _videoPublisher.removeListener("oncleanup", oncleanup);
                    if (currentStream) {
                        currentStream.getTracks().forEach((t) => t.stop());
                    }
                };
                _videoPublisher
                    .connect()
                    .then(() => {
                        _videoPublisher.publish(media);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
            room.on("onnewfeed", (feed) => {
                this.userdata=[];
                console.log("------ remote feed 1", feed);
                let currentStream;
                var remoteFeed = feed;
                if (remoteFeed.is_local) {
                    return;
                }
                const key = remoteFeed.user.id;
                // this.userdata.push(key)
                const videoSubscriber = remoteFeed.data_provider;
                var participants = videoSubscriber.room.participants;
                for (const k in participants) {
                    this.userdata.push(k);
                }
                console.log("------ remote feed 2", videoSubscriber);
                const joined = (data) => {
                };
                $("#sele").append(
                    '<div class="select" style="position:relative;" id="video'+key+'"><video class="h5video" id="'+key+'" playsinline autoplay></video></div>'
                    );
                $('#video'+key).append(
                    '<span class="label label-primary hide" id="curres'+key+'"style="padding:0 6px; position: absolute; bottom: 0px; left: 0px; margin: 15px;background:#212121;"></span>' +
                    '<span class="label label-info hide" id="curbitrate'+key+'"style="padding:0 6px; position: absolute; bottom: 0px; right: 0px; margin: 15px;background:#212121;"></span>'
                    );
                bitrateTimer.push(key);
                clearInterval(bitrateTimer[key])
                bitrateTimer[key] = setInterval(()=>{
                    // console.log(videoSubscriber);
                    var bitrate = videoSubscriber.plugin.getBitrate();
                    $('#curbitrate'+key).text(bitrate);
                    var width = $("#"+key).get(0).videoWidth;
                    var height = $("#"+key).get(0).videoHeight;
                    if(width > 0 && height > 0)
                        $('#curres'+key).removeClass('hide').text(width+'x'+height).show();
                }, 1000);
                let onremotestream = (stream) => {
                    console.log();
                    $("#"+key).get(0).srcObject = stream;
                    currentStream = stream;
                }
                const oncleanup = () => {
                    clearInterval(bitrateTimer[key])
                    $("#video"+key).remove();
                    this.userdata.splice(this.userdata.indexOf(key), 1)
                };
                console.log("------ remote feed 3");
                videoSubscriber.on("joined", joined);
                videoSubscriber.on("onremotestream", onremotestream);
                console.log("------ remote feed 4");
                videoSubscriber.on("oncleanup", oncleanup);
                const cleanup = () => {
                    videoSubscriber.removeListener("joined", joined);
                    videoSubscriber.removeListener("onremotestream", onremotestream);
                    videoSubscriber.removeListener("oncleanup", oncleanup);
                };
                console.log("------ remote feed 5");
                videoSubscriber
                    .connect(parseInt(feed.extras.remote_id))
                    .then(() => console.log("Connected"));
            }); 
        }
            
    }
}
</script>
<style lang="scss" scoped>

.conten_you_stup{
    // width: 100%;
    position: absolute;
    left: 25%;
    bottom: 15%;
    display: flex;
    justify-content: center;
    z-index: 10;
    cursor:pointer;
    .conten_you_stupcen{
        background:rgba(0,0,0,0.5);
        padding: 0 10px;
        padding-left: 35px;
        border-radius:35px;
        display: flex;
        justify-content: space-around;
        .but_g{
            line-height: 48px;
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
.DesktopSwitch{
        video{
            width: 100%;
            height: 100%;
            object-fit: fill;
        }
    }
.desktop_icon{
    width: 35px;
    height: 35px;
    background: url("~@/views/gallery/paricipant_icon_gx.png") no-repeat;
    background: {
        size: 100%;
        
    };
}
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
.content_zuo_con2{
    width: 100%;
    height: 15vh;
    // .content_zuo_content{
    //     width: 100%;
    //     height: 50%;
    //     overflow: auto;
    //     &::-webkit-scrollbar{
    //         display: none;
    //     }
    //     .content_zuo_user{
    //         width: 100%;
    //         display: flex;
    //         // flex-wrap: wrap;
    //         // justify-content: space-between;
    //         align-items: flex-start;
    //         padding: 10px 18px;
    //         .user_icon{
    //             width: 35%;
    //             display: flex;
    //             align-items: center;
    //             .icon_size{
    //                 font-size:14px;
    //                 color: #0099da;
    //                 margin-right: 8px;
    //             }
    //             .user_size{
    //                 font-size:14px;
    //                 font-family:PingFang SC;
    //                 font-weight:500;
    //             }
    //         }
    //         .user_onl{
    //             width: 70%;
    //             font-size:14px;
    //             font-family:PingFang SC;
    //             font-weight:500;
    //         }
    //     }
    // }
    // .content_zuo_but{
    //     width: 100%;
    //     height: 30%;
    //     padding: 10px 18px;
    //     div{
    //         margin: 10px 0;
    //     }
    //     .chatwith_inp{
    //         .chatwith_input{
    //             width: 100%;
    //             border-radius:2px;
    //             /deep/ .el-input__inner{
    //                 border: none !important;
    //                 background:rgba(238,240,245,1)!important;
    //             }
    //         }
    //     }
    //     .chatwith_icon{
    //         span{
    //             margin-right: 10px;
    //         }
    //     }
    //     .form_butt1{
    //         width: 100%;
    //         text-align: center;
    //         background:rgba(50,119,255,1);
    //         border-radius:2px;
    //         color: #FFFFFF;
    //     }
    // }
}
</style>