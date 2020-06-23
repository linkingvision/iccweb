<template>
    <div class="particiants">
        <!-- 头部 -->
        <!-- <div class="particiants_title">
            <div class="particiants_logo"></div>
        </div> -->
        <!-- 返回 -->
        <!-- <div>
            <CButton class="particiants_title_but iconfont icon-fanhui" type="submit" @click="drop" to="dashboard"> 返回首页</CButton>
        </div> -->
        <!-- 身体 -->
        <div class="particiants_content" @mouseover="mouseOver"  @mouseleave="mouseLeave">
            <div class="content_you">
                <div class="conten_you_stup">
                    <div class="conten_you_stupcen" @click="drop">
                        关闭
                    </div>
                </div>
                <video class="l5video" id="l5video" autoplay webkit-playsinline playsinline></video>
            </div>
            <div class="content_zuo">
                <!-- 1 -->
                <div class="content_zuo_con">
                    <div class="content_zuo_title">参议人员</div>
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
                <!-- 2 -->
                <div class="content_zuo_con1">
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
                </div>
                <!-- 3 -->
                <div class="content_zuo_con2">
                    <div class="content_zuo_title">聊天</div>
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
            </div>
        </div>
    </div>
</template>
<script>
// import '../../../assets/js/adapter'
import {H5sPlayerRTC} from '../../../assets/js/h5splayer.js'
export default {
    name:"participants",
    data(){
        return {
            chatwith: '',
            h5handler:undefined,
            usertoken:this.$route.params.token,
            userdata:[]
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
        $(".conten_you_stup").hide()
        if(this.usertoken!= undefined){
            this.l5svideplay()
            this.mettuselest();
        }else{
            this.drop()
        }
    },
    methods:{
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
            this.$router.push({
                path: 'Conference'
            })
        },
        //播放视频
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
    // height: 100%;
    height: 96vh;
    background-color: #252A32;
    // position: fixed;
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
        // height: 100%;
        height: 96vh;
        display: flex;
        .content_zuo{
            width: 15%;
            min-width: 260px;
            height: 98vh;
            color: #FFFFFF;
            //1
            .content_zuo_con{
                width: 100%;
                height: 30%;
                .content_zuo_title{
                    background:rgba(29,33,39,1);
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
            .content_zuo_con1{
                width: 100%;
                height: 20%;
                .content_zuo_title{
                    background:rgba(29,33,39,1);
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
            .content_zuo_con2{
                width: 100%;
                height: 50%;
                .content_zuo_title{
                    background:rgba(29,33,39,1);
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
                    height: 50%;
                    overflow: auto;
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
                    // height: 50%;
                    padding: 10px 18px;
                    background-color: #2E343C;
                    div{
                        margin: 10px 0;
                    }
                    .chatwith_inp{
                        .chatwith_input{
                            width: 100%;
                            background:rgba(37,41,49,1);
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
        .content_you{
            width: 85%;
            height: 96vh;
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
                    background:rgba(46,52,60,0.7);
                    border-radius:17px;
                    padding: 10px 30px;
                    // text-align: center;
                }
            }
            .l5video{
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
        }
    }
}
</style>