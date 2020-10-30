<template>
    <div class="liveplay h5container" @click="Playtoken">
        <video class="h5video" :id="videoid" autoplay webkit-playsinline playsinline></video>
        <div class="liveplay_butt">
            <button class="iconfont icon-full" @click="FullScreen"></button>
            <button class="iconfont icon-roundclosefill" @click="CloseVideo"></button>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import '../../../assets/js/adapter'
import {H5sPlayerWS,H5sPlayerHls,H5sPlayerRTC,H5sPlayerAudBack} from '../../../assets/js/h5splayer.js'
import {H5siOS,H5sPlayerCreate} from '../../../assets/js/h5splayerhelper.js'
export default {
    name:"liveplay",
    props:['h5id', 'h5videoid',"cols","rows"],
    data(){
        return{
            proto: this.$store.state.liveviewrtc,
            videoid: this.h5videoid,
            h5handler:undefined,//v1
        }
    },
    beforeDestroy() {
        this.CloseVideo();
        // this.$root.bus.$off('liveplay');
    },
    mounted(){
        let _this = this;
        _this.$root.bus.$on('liveplay', function(token,streamprofile,name,label, id)
        {
            console.log("++++++++++++++++++++",token,name,label,_this.h5videoid,_this.h5id,id)
            if (_this.h5id != id)
            {
                return;
            }
            _this.PlayVideo(token,streamprofile,label,name);
             _this.tokenshou=token;
        });

    },
    methods:{
        // 播放的token
        Playtoken(){
            console.log(this.tokenshou)
            // if(this.tokenshou!=undefined){
            //     this.$root.bus.$emit('PlayVideotoken', this.tokenshou);
            // }
        },
        //播放
        PlayVideo(token,streamprofile,label,name){
            if (this.h5handler != undefined)
            {
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
            }
            let conf = {
                videoid: this.h5videoid,
                protocol: window.location.protocol, //http: or https:
                host: this.$store.state.WSROOT, //localhost:8080
	            streamprofile: streamprofile, // {string} - stream profile, main/sub or other predefine transcoding profile
                rootpath: '/', // '/'
                token: token,
                hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                session: this.$store.state.token //session got from login
            };
            this.h5handler = new H5sPlayerRTC(conf);
            this.h5handler.connect();
        },
        //关闭
        CloseVideo(){
            if (this.h5handler != undefined)
            {
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
                $("#" + this.h5videoid).get(0).load();
                $("#" + this.h5videoid).get(0).poster = '';
            }
        },

        //全屏
        FullScreen(){
            var elem = $("#"+this.h5id).get(0);
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
                    // this.Electronicoff();
                    // this.Electronicopen();
                    console.log("========  updateUIExitFullScreen");
                    this.updateUIExitFullScreen();
                } else {
                     console.log('panelFullScreen3');
                    // this.Electronicoff();
                    // this.Electronicopen();
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
        updateUIExitFullScreen(){
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
            {
                $('div[name="flex"]').height(this.contentHeight / this.rows);
            }
        },
        PtzControlShow(event){
            this.Presetdata=[];
            var cors=this.cols*this.rows;
            if(cors>9){
                return false
            }
		   //url
           var url = this.$store.state.IPPORT + "/api/v1/GetPresets?token="+this.tokenshou+"&session="+ this.$store.state.token;
            //重组
            this.$http.get(url).then(result=>{
                if(result.status == 200){
                    if(result.bStatus==false){
                        return false;
                    }else{
                        var data=result.data;
                        for(var i = 0; i < data.preset.length; i++){
                            var newItem ={
                                strName : data.preset[i].strName,
                                strToken : data.preset[i].strToken,};
                            this.Presetdata.push(newItem);
                            if(i>8){
                                break;
                            }
                        }
                    }
                }
            })
            var $container = $("#"+this.h5id);
            var $controls = $container.children(".liveplay_ptz");
            if (this.ptzshow == false)
            {
                $controls.css("display", "block");
                this.ptzshow = true;
            }else
            {
                $controls.css("display", "none");
                this.ptzshow = false;
            }
        },
    }
}
</script>


<style lang="scss" scoped>
    .liveplay{
        width: 100%;
        height: 100%;
        position: relative;
        .h5video{
            object-fit: fill;
            width: 100%;
            height: 100%
        }
        &:hover .liveplay_butt{
            display: block;
        }
        .liveplay_butt{
            position: absolute;
            display: none;
            top: 0;
            z-index:1012;
            width: 100%;
            height: 40px;
            line-height: 30px;
            background: url('~@/views/mainpage/liveview/imgs/liveview_buttback.png') no-repeat;
            background-size: 320px 35px;
            background-position-x:right;
            text-align: right;
            padding: 0 15px;
            button{
                background: none;
                border: none;
                padding: 0;
                margin: 0;
                color: #FFFFFF;
                margin-left: 15px;
            }
            .fw_butt{
                padding:0;display: inline;
                border: none;
                top: -2px;
                right: -15px;
            }
        }
    }



</style>