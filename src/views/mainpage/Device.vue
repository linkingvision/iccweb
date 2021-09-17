
<template>
    <div class="device" id="device">
        <div class="seles"  v-show="!share" id="fullscreen" style='position:relative;' @click.stop="sele">
            <div class="iconfont icon-fullscreen" style=" font-size:22px; position:absolute; top:0px; right:0px;z-index:1;"  @click.stop="FullScreen"> </div>
            <div class="sele" id="sele" style='position:relative'></div>
            <div class="conten_you_stup">
                <div class="conten_you_stupcen">
                    <div style="width:150px;"></div>
                    <div @click="Reconnection" style="width:110px; padding-top: 16px;">
                        <el-select id="selectt" style="width:75%" v-model="Bitratess" size="small" placeholder="请选择" @change="change">
                            <el-option
                            v-for="item in Bitrates"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:100px;"></div>
                    <div class="but_g iconfont " :class="icon.video" @click="dropvideo"> </div>
                    <div class="but_g iconfont" :class="icon.audio" @click="dropaudio"> </div>
                    <div class="but_g iconfont icon-huiyiguanli" @click="show"> </div>
                    <!-- <div class="but_g iconfont icon-yaoqingruhui"> </div> -->
                    <div class="but_g iconfont icon-huiyi"  @click.stop="chat"> </div>
                    <div class="but_g iconfont " :class="icon.desktopicon"  @click="desktop"> </div>
                    <div class="but_g iconfont icon-editor" style="font-size:33px;"> </div>
                    <div class="but_g iconfont icon-guaduan" style="font-size:32px" @click="drop"> </div>
                    <div style="width:300px;"></div>
                </div>
            </div>
            <div class="text" @click.stop="text">
                <el-input v-model="input" placeholder="请输入内容" @keyup.enter.native="onSubmit"></el-input>
            </div>

        </div>
        
        <div class="serig" id="serig">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="" name="5">
                    <div class="selects" style="position:relative;">
                        <video class="h5video" id="local" playsinline autoplay muted="muted"></video>
                    </div>
                </el-collapse-item>  
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
                <el-collapse-item title="聊天" name="3">
                    <div class="content_zuo_con2">
                        <div class="panel-body relative" style=" width:100%;height:72%;" id="chatroom" >
                        </div>
                        <div class="content_zuo_but">
                            <div class="chatwith_inp">

                                <el-input class="chatwith_input" type="textarea" :rows="3" resize="none" v-model="chatwith" placeholder="请输入内容"></el-input>
                                <CButton class="form_butt1" type="submit" @click="sendnews">发送</CButton>
                            </div>
                        </div>
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
            pushaudio:this.$store.state.pushaudio,
            pushvideo:this.$store.state.pushvideo,
            Resolution:this.$store.state.Resolution,
            rooms:this.$store.state.room,
            user:this.$store.state.user,
            Bitrates:[],
            Bitratess:'',
            upuser:undefined,//打电话的user
            l5sdesktop:undefined,
            l5sdesktops:undefined,
            golddesktops:false,//是否有人在共享屏幕
            activeNames:['1','2','3','4','5'],
            icon:{
                connectionicon:"icon-shuaxin",
                desktopicon:"icon-zhuomiangongxiang1",
                audio:'icon-yuyin1',
                video:this.$store.state.pushvideo ? 'icon-shexiangjikongzhi':'icon-shexiangjikongzhi-2'
            },
            chatwith: '',
            shows:true,
            audioout:true,
            share:false,
            shares:true,
            usertoken:this.$route.params.token,
            videoPublisher:{},
            userdata:[],
			room:'',
            input:'',
            textScreen:true
        }
    },
    mounted(){
        // console.log(this.pushaudio);
        if (this.pushaudio) {
            this.icon.audio="icon-yuyin"
        }else{
            this.icon.audio="icon-yuyin1"
        }

        if (this.rooms) {
            this.conent()
        }
        var bitrate = ['No limit','128', '256', '512', '1024',"1500", '2048']
            for (let i = 0; i !== bitrate.length; ++i) {
                const data = bitrate[i];
                var src={
                    value: data,
                    label: data
                }
                if (data == 'No limit')
                {
                    this.Bitratess=data
                }
                this.Bitrates.push(src);
            }
        // this.mouse()；
    },
    methods:{
        // chatwith(){},
        sendnews(){
            console.log("回车",this.chatwith);
            // if (this.v1 != undefined)
            // {
            //     if(this.chatwith){
            //         console.log("回车1");
            //         this.v1.send(this.upuser,this.chatwith)
            //         this.chatwith=""
            //     }else{
            //         this.$message('消息不能为空');
            //     }
            // }
            if (this.chatwith!=''&&this.room) {
                let message = {
                    type: "message",
                    text: this.chatwith,
                }
                this.room.text_room.send_txt(JSON.stringify(message));
                this.chatwith=''
            }
        },
        //全屏
        FullScreen(){
            var elem = $("#fullscreen").get(0);
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
        text(){
            console.log(this.input);
        },
        sele(){
            if (this.textScreen ==false) {
                $(".text").hide();
                this.textScreen = true;
            }
        },
        //聊天
        onSubmit(){
            if (this.input!=''&&this.room) {
                let message = {
                    type: "message",
                    text: this.input,
                }
                this.room.text_room.send_txt(JSON.stringify(message));
                this.input=''
            }
        },
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
                $(".seles").css("width","99%")
                this.shows=false;
            }else{
                $("#serig").show()
                $(".seles").css("width","83%")
                this.shows=true;
            }
            
        },
        Reconnection(){},
        //视频
        dropvideo(){
            let muted = this.videoPublisher.plugin.isVideoMuted();
            if(muted)
                this.videoPublisher.plugin.unmuteVideo();
            else
                this.videoPublisher.plugin.muteVideo();
            muted = this.videoPublisher.plugin.isVideoMuted();
            $('#mute').html(muted ? this.icon.video = "icon-shexiangjikongzhi-2" : this.icon.video = "icon-shexiangjikongzhi");
        },
        //音频
        dropaudio(){
            let muted = this.videoPublisher.plugin.isAudioMuted();
            console.log(muted,this.videoPublisher);
            if(muted)
                this.videoPublisher.plugin.unmuteAudio();
            else
                this.videoPublisher.plugin.muteAudio();
            muted = this.videoPublisher.plugin.isAudioMuted();
            $('#mute').html(muted ? this.icon.audio = "icon-yuyin1" : this.icon.audio = "icon-yuyin");
        },
        drop(){},
        //共享桌面
        desktop(){
			if (this.icon.desktopicon=='icon-zhuomiangongxiang1') {
                this.icon.desktopicon = "icon-zhuomiangongxiang"
            }else{
                this.icon.desktopicon = "icon-zhuomiangongxiang1"
            }
			let room = this.room;
			var conf = {
                protocol: window.location.protocol, // {string} - 'http:' or 'https:'
                // host: window.location.host, //{string} - 'localhost:8080'
                host:this.$store.state.WSROOT, //{string} - 'localhost:8080'
                rootpath: "/", // {string} - path of the app running
                userid: this.user,
                username: this.user,
                vmrid:parseInt(this.rooms),
                // session: this.$store.state.token, //{string} - session got from login
                session: 'c1782caf-b670-42d8-ba90-2244d0b0ee83', //{string} - session got from login
                // consolelog: 'true', // 'true' or 'false' enable/disable console.log
            };
            let screen = new Room(conf)
			screen.connect();
			screen.on("datachannelready", () => {
				console.log(room);
				let currentStream;
				let media = {video: 'screen', audioSend: false, videoRecv: false};
				var localFeed = room.findOrCreateLocalFeed("videoroom", 'screen');
				const _videoPublisher = localFeed.data_provider;
				const joined = (data) => {
					localFeed.extras = { remote_id: data.id };
				};
				const onlocalstream = (stream) => {
					console.log(stream);
					$("#l5sShadesktop").get(0).srcObject = stream;
					// $("#local").get(0).srcObject = stream;
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
        },
         //切换视频
        DesktopSwitch(){
            if (this.shares) {
                return
            }
            this.share = !this.share;
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
        chat(){
            if (this.textScreen) {
                $(".text").show();
                this.textScreen = false;
            }else{
                $(".text").hide();
                this.textScreen = true;
            }
            
        },
        //切换码率
        change(){
            console.log(parseInt(this.Bitratess),"-----------");
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
                vmrid:parseInt(this.rooms),
                // session: this.$store.state.token, //{string} - session got from login
                session: 'c1782caf-b670-42d8-ba90-2244d0b0ee83', //{string} - session got from login
                // consolelog: 'true', // 'true' or 'false' enable/disable console.log
            };
            let room = new Room(conf)
			this.room = room
            this.publish(room);
        },
        publish(room){
            this.userdata.push(room.user.name)
            var bitrateTimer = [];
            room.connect();
            room.on("datachannelready", () => {
                let currentStream;
                let media = {audioSend: this.pushaudio, video: this.Resolution,vcodec:this.VideoCodec};
                console.log(media);
                var localFeed = room.findOrCreateLocalFeed("videoroom", "localcam");
                const _videoPublisher = localFeed.data_provider;
                this.videoPublisher = _videoPublisher;
                const joined = (data) => {
                    localFeed.extras = { remote_id: data.id };
                };
                const onlocalstream = (stream) => {
                    $("#local").get(0).srcObject = stream;
                    // $("#local").get(0).play();
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
                let currentStream;
                console.log("------ remote feed 1", feed);
                var remoteFeed = feed;
                if (remoteFeed.is_local) {
                    return;
                }
                const key = remoteFeed.key
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
            room.on('datachannelrecvmsg',(text)=>{

                let date = text.date.substr(text.date.indexOf('T')+1,8);
                if (text.type=="message") {
                    $('#chatroom').append('<p style="margin-bottom: 0px;">[' + date + '] ' + text.from + ': ' + text.text);
                }
            })
        }
            
    }
}
</script>
<style lang="scss" scoped>

.conten_you_stup{
    width: 100%;
    position: absolute;
    left: 0%;
    bottom: 0%;
    display: flex;
    justify-content: center;
    z-index: 10;
    margin-right: -2px;
    cursor:pointer;
    .conten_you_stupcen{
        width: 100%;
        background:rgba(0,0,0,0.5);
        padding: 0 10px;
        padding-left: 35px;
        // border-radius:35px;
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
    height: 40vh;
    .content_zuo_but{
        width: 100%;
        height: 28%;
        padding: 15px 5px 0 10px;
        background: #2E2E2E;
        .chatwith_inp{
            display: flex;
            justify-content: space-between;
            .chatwith_input{
                width: 84%;
                // height: 100px;
                border-radius:2px;
                /deep/ .el-textarea__inner{
                    overflow-y: auto;
                    border: none !important;
                    background:#373438 !important;
                    &::-webkit-scrollbar {/*滚动条整体样式*/
                    width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
                    height: 8px;
                    scrollbar-arrow-color:red;
                }
                &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                    border-radius: 5px;
                    -webkit-box-shadow: inset 0 0 5px rgba(218, 218, 218,0.2);
                    box-shadow: inset 0 0 5px rgba(218, 218, 218,0.2);
                    background: rgba(218, 218, 218,0.2);
                    scrollbar-arrow-color:red;
                }
                &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                    -webkit-box-shadow: inset 0 0 5px rgba(218, 218, 218,0.2);
                    box-shadow: inset 0 0 5px rgba(218, 218, 218,0.2);
                    border-radius: 0;
                    background: rgba(218, 218, 218,0.1);
                }
                }
            }
        }
        .chatwith_icon{
            span{
                margin-right: 10px;
            }
        }
        .form_butt1{
            margin-top: 40px;
            width: 15%;
            height: 35px;
            text-align: center;
            background:rgba(50,119,255,1);
            border-radius:2px;
            color: #FFFFFF;
        }
    }
}
</style>