<template>
  <div class="videoconf">
      <el-dialog
            class="dasboard_modal"
			title="加入会议"
            @close='closepreview'
            :visible.sync="myModal1"
            width="50%">
            <div class="int" style="text-align:center;">
                <el-input class="textarea" v-model="input" placeholder="请输入房间名"></el-input>
            </div>
            <div class="up_content" >
                <div class="up_zuo">
                    <video class="l5video1" :id="h5sVideoLocal" muted autoplay webkit-playsinline playsinline></video>
                </div>
                <div class="up_you">
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

                    <!-- <div class="up_you_content">
                        <span>Video In</span>
                        <el-select style="width:75%" v-model="VideoIn" size="small" placeholder="请选择">
                            <el-option
                            v-for="item in VideoIns"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> -->

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
                    <div class="upvideoaudio">
                        <!-- <i class="iconfont icon-shexiangjikongzhi-2" @click='pushvideo=true' v-if="!pushvideo"></i>
                        <i class="iconfont icon-shexiangjikongzhi" @click='pushvideo=false' v-else></i> -->
                        
                        <i class="iconfont icon-yuyin1" @click='pushaudio=true' v-if="!pushaudio"></i>
                        <i class="iconfont icon-yuyin" @click='pushaudio=false' v-else></i>
                    </div>
                </div>
            
            </div>
            <div class="upvideoaudio">
                <div class="particip_buttom">
					<!-- <router-link :to="{name:Device}" style="color:#09C08F"> -->
                        <CButton class="part_buttom_but" type="primary"  @click="conent">加入会议室</CButton>
                    <!-- </router-link> -->
				</div>
            </div>
        </el-dialog>
    <div class="videoconf_left">
      <div class="videoconf_left_top">
        <div class="join">
          <div class="vode" style="background:#1EAC4F;font-size:50px;line-height: 70px;" @click="join()" >＋</div>
          <div class="code">加入会议</div>
        </div>
        <div class="set" >
          <div class="iconfont vode icon-huiyi1" style="font-size:35px;" @click="getup()"></div>
          <div class="code">创建会议</div>
        </div>
      </div>
      <div>
          <span style="padding:15px;font-weight:800; font-size:14px; color:#3277FF;">|</span>
          <span style="font-size:16px;">所有会议</span>
      </div>
      <div class="videoconf_left_center"></div>
      <div class="videoconf_left_bot"></div>
    </div>
    <div class="videoconf_right">
		<div style="padding-top:20px;">
          <span style="padding:15px;font-weight:800; font-size:14px; color:#3277FF;">|</span>
          <span style="font-size:16px;">会议纪要</span>
      </div>
	</div>
  </div>
</template>
<script>
import {L5sPlayerRTC,L5sRTCPush,L5sRTCGetCapability} from '../../assets/js/l5splayer.js'
import '../../assets/js/iccivmjs.js'
export default {
  name: "videoconf",
  data() {
    return {
		h5sVideoLocal:"h5sVideoLocal",
        input:"1234",
        myModal1:false,
        Previewfun:undefined,
        pushvideo:true,
        pushaudio:false,
        VideoCodecs: [],
        VideoCodec:"",
        VideoIns: [],
        VideoIn:"",
        Resolutions: [],
        Resolution:"",
        Bitrates: [],
        Bitratess:"",
    };
  },
  mounted(){
	this.updisplay();
  },
  methods:{
     	closepreview(){
            console.log('关闭',this.Previewfun)
            if(this.Previewfun!=undefined){
                this.Previewfun.disconnect();
                delete this.Previewfun;
                this.Previewfun = undefined;
                console.log('关闭1')
            }
        },
		join(){
            this.myModal1=true;
			var h5sVideoLocal=this.h5sVideoLocal
            this.$nextTick (() =>
                    this.Preview(h5sVideoLocal)
            )
		},
        getup(){
            this.$router.push({
                path: '/Vcroom'
            })
        },
      	Preview(h5sVideoLocal){
            var pushvideo=this.pushvideo.toString();
            var pushaudio=this.pushaudio.toString();
            console.log(this.pushvideo,pushvideo,this.pushaudio,pushaudio)
            
            // return false
            if(this.Previewfun!=undefined){
                this.Previewfun.disconnect();
                delete this.Previewfun;
                this.Previewfun = undefined;
            }
            var conf1 = {
                localvideoid:h5sVideoLocal, //{string} - id of the local video element tag
                // localvideoidcopy:'h5sVideoLocalcopy',
                consolelog: 'true', // 'true' or 'false' enable/disable console.log
                video: pushvideo, // 'true' or 'false' enable/disable video
                audio: pushaudio, // 'true' or 'false' enable/disable audio
                // Efacingmode:"user", // {string} - user or environment; desktop remove this config 
                // videoin: this.VideoIn,
                // codec: this.VideoCodec,
                // bitrate: this.Bitratess,
                // resolution: this.Resolution,
                // audioin: this.AudioIn,
                // token:encodeURIComponent(this.$store.state.user),
                // desktopshare: bDesktopSharing // true or false for desktop sharing
			};
			window.saveconf=conf1
	        console.log(conf1)
            this.Previewfun= L5sRTCGetCapability(null,conf1,
            function(){
                console.log('RTC do not support !'); 
            });
        },
        updisplay(){
            var conf = {
                localvideoid:'h5sVideoLocal', //{string} - id of the local video element tag
                consolelog: 'true', // 'true' or 'false' enable/disable console.log
                video: "true", // 'true' or 'false' enable/disable video
                audio: "true", // 'true' or 'false' enable/disable audio
                token:encodeURIComponent(this.$store.state.user),
                // desktopshare: bDesktopSharing // true or false for desktop sharing
            };
            var up=L5sRTCGetCapability(this.UpdateCapability,conf,function(){
				console.log('RTC do not support !'); 
			});
        },
        UpdateCapability(capability){
            var json_data=JSON.parse(localStorage.getItem('mcuCamerasettingonetoone'))
            console.log(capability,json_data);
            if(capability){

                // for (let i = 0; i !== capability['videocodec'].length; ++i) {
                //     const data = capability['videocodec'][i];
                //     var src={
                //         value: data,
                //         label: data
                //     }
                //     this.VideoCodec = data
                //     this.VideoCodecs.push(src);
                // }
                // for (let i = 0; i !== capability['videocodec'].length; ++i) {
                //     const data = capability['videocodec'][i];
                //     if(json_data==null){
                //         if (data == 'H264')
                //         {
                //             this.VideoCodec = data
                //             this.VideoCodec1 = data
                //         }
                //     }else{
                //         this.VideoCodec = json_data.VideoCodec
                //     }
                // }
                for (let i = 0; i !== capability['videoin'].length; ++i) {
                    const data = capability['videoin'][i];
                    var src={
                        value: data.id,
                        label: data.name
                    }
                    if(json_data==null){
                        this.VideoIn=data.id
                    }else{
                        // console.log(data.name==json_data.VideoIn,data.name,json_data.VideoIn,"**********")
                        if(data.id==json_data.VideoIn){
                            this.VideoIn=data.id
                        }
                    }
                    this.VideoIns.push(src);
                }	
                // for (let i = 0; i !== capability['audioin'].length; ++i) {
                //     const data = capability['audioin'][i];
                //     var src={
                //         value: data.id,
                //         label: data.name
                //     }
                //     this.AudioIn=capability['audioin'][0].id
                //     this.AudioIns.push(src);
                // }
                
                // for (let i = 0; i !== capability['audioout'].length; ++i) {
                //     const data = capability['audioout'][i];
                //     var src={
                //         value: data.id,
                //         label: data.name
                //     }
                //     this.AudioOut=capability['audioout'][0].id
                //     this.AudioOuts.push(src);
                // }
                var videoCodec = ['h264','vp9','av1']
				for (let i = 0; i !== videoCodec.length; ++i) {
                    const data = videoCodec[i];
                    /* Default use 720P */
                    
                    var src={
                        value: data,
                        label: data
                    }
                    // this.Resolution=data
                    if(json_data==null){
                        if (data == 'vp9')
                        {
                            this.VideoCodec=data
                        }
                    }else{
                        this.VideoCodec = json_data.VideoCodec
                    }
                    this.VideoCodecs.push(src);
                }
                var resolution = ['QVGA', 'VGA', '720P', '1080P', '4K']
                for (let i = 0; i !== resolution.length; ++i) {
                    const data = resolution[i];
                    /* Default use 720P */
                    
                    var src={
                        value: data,
                        label: data
                    }
                    // this.Resolution=data
                    if(json_data==null){
                        if (data == '720P')
                        {
                            this.Resolution=data
                        }
                    }else{
                        this.Resolution = json_data.Resolution
                    }
                    this.Resolutions.push(src);
                }
                
                var bitrate = ['No limit', '128', '256', '512', '1024',"1500", '2048']
                for (let i = 0; i !== bitrate.length; ++i) {
                    const data = bitrate[i];
                    var src={
                        value: data,
                        label: data
                    }
                    // this.Bitratess=data
                    /* Default use 720P */
                    if (data == 'No limit')
                    {
                        this.Bitratess='No limit'
                    }
                    this.Bitrates.push(src);
                }
            }
        },
        conent(){
            this.$store.state.pushaudio=this.pushaudio
            if (this.Resolution=="QVGA") {
                this.Resolution = "lowres"
            }else if (this.Resolution == "VGA") {
                this.Resolution = "stdres"
            }else if (this.Resolution == "720P") {
                this.Resolution = "hires"
            }else if (this.Resolution == "1080P") {
                this.Resolution = "fhdres"
            }else if (this.Resolution == "4K") {
                this.Resolution = "4kres"
            }
            this.$store.state.VideoCodec=this.VideoCodec;
            this.$store.state.Resolution=this.Resolution;
            this.$store.state.Bitratess=this.Bitratess;
            this.$store.state.room=this.input;
			if (this.input=='') {
				alert("请输入房间名")
				return
			}
            this.myModal1=false;
			// this.Device="Device";
			this.$router.push({
                path: '/Device'
            })
        },
  }
};
</script>
<style lang="scss" scoped>
.videoconf {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .videoconf_right {
    width: 50%;
    height: 98%;
  }
  .videoconf_left {
    width: 46%;
    height: 98%;
    display: flex;
    flex-direction: column;
    .videoconf_left_top {
      width: 100%;
      height: 36%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .vode {
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        background: #3277FF;
        border-radius: 2px;
        cursor:pointer
      }
      .code{
          width: 80px;
          text-align: center;
          line-height: 30px;
      }
    }
    .videoconf_left_center {
      width: 100%;
      height: 29%;
      background: #202020;
      margin-top: 20px;
    }
    .videoconf_left_bot {
      width: 100%;
      height: 29%;
      background: #202020;
      margin-top: 20px;
    }
  }
  .dasboard_modal{
        .up_content{
            width: 100%;
            display: flex;
            padding-top: 10px;
            justify-content: space-between;
            .up_zuo{
                width: 50%;
                .l5video1{
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                }
            }
            .up_you{
                width: 50%;
                padding: 10px;
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
        }
        .upvideoaudio{
            margin-top: 15px;
            display: flex;
            justify-content:space-between;
            .icont{
                width: 50%;
                i{
                margin-right: 10px;
            }
            }
            .particip_buttom{
                width: 50%;
            }   
        }
    }
}
</style>