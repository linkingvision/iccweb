<template>
    <div class="dasboard_global Control_g">
        <!-- 弹窗 -->
        <el-dialog
            class="dasboard_modal"
            width="25%"
            title="添加参会者"
            :visible.sync="myModal">
            <el-form class="el_form" ref="form" label-position='left' :model="sizeForm" label-width="100px" size="small ">
                <el-form-item label="会议名称">
                    <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="成员类型">
                    <div class="mode">
                        <el-radio-group v-model="sizeForm.member" size="medium">
                            <el-radio  label="user">会议成员</el-radio>
                            <el-radio  label="device">会议设备</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="会议成员" v-if="sizeForm.member=='user'">
                    <!-- <el-input v-model="sizeForm.user" v-if="sizeForm.member=='user'"></el-input> -->
                    <el-select v-model="sizeForm.user" multiple filterable placeholder="请选择">
                        <el-option
                        v-for="item in sizeForm.userdata"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会议设备" v-if="sizeForm.member=='device'">
                    <el-select v-model="sizeForm.token" multiple filterable placeholder="请选择">
                        <el-option
                        v-for="item in sizeForm.tokendata"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <CButton class="conten_buttom_but" type="primary"  @click="invite">邀请</CButton>
            </span>
        </el-dialog>
        <el-dialog
            class="dasboard_modal"
            title="踢出会议"
            :visible.sync="myModal1"
            width="25%">
            <div style="font-size:16px;
                font-weight:600;
                color:rgba(255,255,255,1);">
                您确定要将选中用户踢出会议吗？
            </div>
            <div slot="footer" class="dialog-footer button_table">
              <el-button class="form_butt1" @click="myModal1 = false">{{$t("message.setting.Cancel")}}</el-button>
              <el-button class="form_butt" type="primary" @click="Delparticiant">{{$t("message.setting.OK")}}</el-button>
          </div>
        </el-dialog>
        <CModal
            title="扫一扫"
            :show.sync="myModal2">
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
        </CModal>
        <div class="Control">
            <div class="Control_zuo">
                <div class="Control_zuo_top">{{sizeForm.name}}</div>
                <el-table
                    :data="tableData.filter(data => !search || data.strName.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    stripe
                    @select='selectCall'
                    @select-all='select_Call'
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="index"
                        label="编号"
                        width="100">
                        <template  slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="strName"
                    label="会议名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    label="麦克风"
                    min-width="50">
                        <template>
                            <i class="iconfont icon-yuyin"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="扬声器"
                    min-width="50">
                        <template>
                            <i class="iconfont icon-yangshengqi"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="摄像头"
                    min-width="50">
                        <template>
                            <i class="iconfont icon-shexiangjikongzhi"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="踢出会议"
                    min-width="50">
                        <template>
                            <i class="iconfont icon-tichu"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="状态"
                    min-width="50">
                        <template slot-scope="scope">
                            <div v-if="scope.row.bOnline" style="color:rgba(51,178,108,1);">已连接</div>
                            <div v-else style="color:rgba(178,178,178,1);">未连接</div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    style="text-align: center;"
                    layout=" prev, pager, next,total, jumper"
                    @size-change="handleSizeChange1" 
                    @current-change="handleCurrentChange1"
                    :current-page="currentPage"
                    :total="total">
                </el-pagination>
            </div>
            <div class="Control_you">
                <div class="Control_you_top">
                    <div style="background:rgba(0,0,0,1);">
                        <video id="l5video" src=""  autoplay webkit-playsinline playsinline></video>
                    </div>
                    <div style="padding-left: 10px;" @click="l5svideplay">
                        <i class="iconfont" :class="play"></i>
                    </div>
                </div>
                <div class="Control_you_content">
                    <el-collapse v-model="activeNames">
                        <el-collapse-item title="会议模式" name="1">
                            <div class="Control_you_content1">
                                <el-radio-group v-model="sizeForm.mettmodesetting" size="medium">
                                    <el-radio  label="1pn"><span class="mode_back"></span> 1+N模式</el-radio>
                                    <el-radio  label="nxn"><span class="mode_back1"></span> 等分模式</el-radio>
                                </el-radio-group>
                                <div v-if="sizeForm.mettmodesetting=='1pn'">
                                    <span>1+N模式 </span>
                                    <el-select v-model="sizeForm.one" filterable placeholder="请选择">
                                        <el-option
                                        v-for="item in sizeForm.onenmode"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-if="sizeForm.mettmodesetting=='nxn'">
                                    <span>等分模式 </span>
                                    <el-select v-model="sizeForm.ep" filterable placeholder="请选择">
                                        <el-option
                                        v-for="item in sizeForm.epmode"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="会议控制" name="2" >
                            <div class="Control_you_content2">
                                <div class="Control_you_function" @click="usertokendata">
                                    <div class="Control_invite"></div>
                                    <div>邀请入会</div>
                                </div>
                                <div class="Control_you_function" @click="myModal1 = true">
                                    <div class="Control_Kickout"></div>
                                    <div>踢出会议</div>
                                </div>
                                <div class="Control_you_function" @click="share">
                                    <div class="Control_share"></div>
                                    <div>分享二维码</div>
                                </div>
                                <!-- <div class="Control_you_function">
                                    <div class="Control_Video"></div>
                                    <div>会议录像</div>
                                </div>
                                <div class="Control_you_function">
                                    <div class="Control_extend"></div>
                                    <div>延长会议</div>
                                </div>
                                <div class="Control_you_function">
                                    <div class="Control_cam"></div>
                                    <div>摄像头</div>
                                </div>
                                <div class="Control_you_function">
                                    <div class="Control_speake"></div>
                                    <div>扬声器</div>
                                </div>
                                <div class="Control_you_function">
                                    <div class="Control_microphone"></div>
                                    <div>麦克风</div>
                                </div> -->
                            </div>
                            <div class="Control_you_content2_button">
                                <CButton class="form_butt" type="submit" @click="Endmetting">
                                    结束会议
                                </CButton>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import '../../../assets/js/adapter'
import {H5sPlayerRTC,H5sRTCGetCapability,H5sRTCPush} from '../../../assets/js/h5splayer.js'
export default {
    name:"Control",
    data(){
        return {
            play:"icon-youjian",
            sizeForm: {
                openmeeting:false,//是否开启会议
                name: this.$route.params.user,//名称
                metttype: 'regular',//会议类型
                Startdate: new Date(),//时间
                Eendate:new Date(new Date().getTime()+ 60*60 * 1000),//时间

                mettmodesetting:"nxn",
                one:"1p2",
                onenmode:[
                    {
                        value: "1p1",
                        label: "1p1"
                    },{
                        value: "1p2",
                        label: "1p2"
                    },{
                        value: "1p2A",
                        label: "1p2A"
                    },{
                        value: "1p3A",
                        label: "1p3A"
                    },{
                        value: "1p4A",
                        label: "1p4A"
                    },{
                        value: "1p5",
                        label: "1p5"
                    },{
                        value: "1p6A",
                        label: "1p6A"
                    },{
                        value: "1p7",
                        label: "1p7"
                    },{
                        value: "3p4",
                        label: "3p4"
                    },{
                        value: "PIP1",
                        label: "PIP1"
                    },{
                        value: "PIP3",
                        label: "PIP3"
                    },{
                        value: "1p2x2A",
                        label: "1p2x2A"
                    },{
                        value: "1p12",
                        label: "1p12"
                    },{
                        value: "1p16A",
                        label: "1p16A"
                    },{
                        value: "4x5A",
                        label: "4x5A"
                    },{
                        value: "1p1A",
                        label: "1p1A"
                    },{
                        value: "1p2x6A",
                        label: "1p2x6A"
                    },{
                        value: "1p1p2x4A ",
                        label: "1p1p2x4A "
                    }
                ],//1+n模式
                ep:"2x2",
                epmode:[
                    {
                        value: "1x1",
                        label: "1x1"
                    },{
                        value: "2x2",
                        label: "2x2"
                    },{
                        value: "3x3",
                        label: "3x3"
                    },{
                        value: "4x4",
                        label: "4x4"
                    },{
                        value: "5x5",
                        label: "5x5"
                    }
                ],//等分模式

                mettmode:'5x5',//模式
                mettmodesize:1,//位置
                member:'user',//成员类型
                user:'',//成员
                userdata:[],
                token:'',//设备
                tokendata:[],
                resolutiondata:"1080P",
                resolution:[{
                        value: "1080P",
                        label: "1080P"
                    },{
                        value: "720P",
                        label: "720P"
                    },{
                        value: "D1",
                        label: "D1"
                    },
                    {
                        value: "VGA",
                        label: "VGA"
                    }
                ]//分辨率
            },
            activeNames: ['1','2'],//左边
            openmett:false,
            tableData: [],
            total: 0, // 总条数 1
            currentPage: 1, // 当前页码1
            pageSize: 10,//一页数量
            search: '',//搜索
            editPopup:false,
            dialogFormVisible:false,
            eltitle:this.$t("message.setting.Configuration"),
            selectop:[],//选择那几个
            myModal:false,
            myModal1:false,
            myModal2:false,
            mettingtoken:this.$route.params.token,
            h5handler:undefined
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
        if(this.mettingtoken!= undefined){
            this.mettinglist();
            // this.l5svideplay()
        }else{
            this.signout()
        }
    },
    methods:{
        //扫一扫
        share(){
            this.myModal2=true;
            var android=""
            var ios=""
            if(this.mettingtoken==undefined){
                return false;
            }else{
                android= window.location.protocol + '//' + window.location.host + '/single.html?token=' + this.mettingtoken+"&h5splayer=ws";
                ios= window.location.protocol + '//' + window.location.host + '/single.html?token=' + this.mettingtoken+"&h5splayer=rtc";
            }
            this.$refs.qrcodead.innerHTML="";
            this.$refs.qrcodeios.innerHTML="";
            console.log(android,ios,this.$refs.qrcodead)
            var qrcode = new QRCode(this.$refs.qrcodead, {
                width: 150,
                height: 150// 高度
            })
            var qrcode1 = new QRCode(this.$refs.qrcodeios, {
                width: 150,
                height: 150// 高度
            })
            qrcode.clear();
            qrcode1.clear();
            qrcode.makeCode(android);
            qrcode1.makeCode(ios);
        },
        //结束会议
        Endmetting(){
            var url = this.$store.state.IPPORT + "/api/v1/StopConference?token="+encodeURIComponent(this.mettingtoken)+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    this.$message('会议结束');
                }
            })
        },
        //踢出参会者
        Delparticiant(){
            // if(this.selectop.length==0){
            //     this.myModal1 = false
            //     return false
            // }
            for(var i=0 ; i<this.selectop.length ; i++){
                var url = this.$store.state.IPPORT
                    + "/api/v1/DelParticiant?token="
                    +encodeURIComponent(this.mettingtoken)+"&participanttoken="
                    +encodeURIComponent(this.selectop[i].token)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    console.log(result)
                    this.myModal1 = false
                    this.mettinglist()
                    // this.$message(successfully);
                })
            }
        },
        //邀请入会
        invite(){
            var form=this.sizeForm;
            if(form.token.length!=0||form.user.length!=0){
                if(form.user.length>0){
                    this.Addparticipants(this.mettingtoken,form.user,"user")
                    // .then((a)=>{
                    //     console.log("aaaaa",a)
                    // })
                }
                if(form.token.length>0){
                    this.Addparticipants(this.mettingtoken,form.token,"device")
                }
            }
        },
        Addparticipants(token,usertoken,member){
            // return false
            for(var i=0 ; i<usertoken.length ; i++){
                var url = this.$store.state.IPPORT
                 + "/api/v1/CreateParticipant?token="
                 +encodeURIComponent(token)+"&participanttoken="
                 +encodeURIComponent(usertoken[i])+"&type="+member+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    this.myModal=false
                    this.mettinglist()
                    // this.$message(successfully);
                })
            }
        },
        ConferenceControl(index,row){
            console.log(row.strToken,row)
            return false
            this.$router.push({
                name: `Control`,
                path: 'Control',
                params: {
                    token:row.strToken
                }
            })
        },
        //播放视频
        l5svideplay(){
            // this.myModal=false;
            if(this.play=="icon-youjian"){
                this.play="icon-zantingtingzhi"
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
                    token: this.mettingtoken,
                    hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                    session: this.$store.state.token //session got from login
                };
                console.log("播放",conf);
                this.h5handler = new H5sPlayerRTC(conf);
                this.h5handler.connect();
            }else if(this.play=="icon-zantingtingzhi"){
                this.play="icon-youjian"
                if (this.h5handler != undefined)
                {
                    this.h5handler.disconnect();
                    delete this.h5handler;
                    this.h5handler = undefined;
                }
            }
        },
        //获取列表
        mettinglist(){
            var url = this.$store.state.IPPORT + "/api/v1/GetParticiant?token="+this.mettingtoken+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                // console.log(result)
                if(result.status==200){
                    var data=result.data.particiants;
                    this.tableData=[]
                    // console.log("***",result);
                    for(var i=0;i<data.length;i++){
                        if(data[i].strName==this.mettingtoken){
                            continue
                        }
                        var Role={
                            strToken: data[i].strToken,
                            strName: data[i].strName,
                            bOnline:data[i].bOnline
                        }
                        this.tableData.push(Role);
                        this.total=this.tableData.length
                    }
                }
            })
        },
        usertokendata(){
            this.myModal=true;
            var url1 = this.$store.state.IPPORT + "/api/v1/GetSrc?getonline=true&session="+ this.$store.state.token;
            this.$http.get(url1).then(result=>{
                if(result.status==200){
                    this.sizeForm.tokendata=[];
                    var data=result.data.src;
                    console.log("***",result);
                    for(var i=0;i<data.length;i++){
                        if(data[i].nType=="H5_RTCM_CH"||data[i].nType=="H5_RTCS_CH"){
                            continue
                        }
                        var Role={
                            value: data[i].strToken,
                            label: data[i].strName
                        }

                        this.sizeForm.tokendata.push(Role);
                    }
                }
                
            })
            var url2 = this.$store.state.IPPORT + "api/v1/GetUserList?session="+ this.$store.state.token;
            this.$http.get(url2).then(result=>{
                // console.log("***",result);
                if(result.status==200){
                    this.sizeForm.userdata=[];
                    var data=result.data.users;
                    for(var i=0;i<data.length;i++){
                        var Role={
                            value: data[i].strUser,
                            label: data[i].strUser
                        }
                        this.sizeForm.userdata.push(Role);
                    }
                }
            })
        },
        selectCall(row,index,i){
            console.log("INDEX",row);
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                console.log(row,index,i,((this.currentPage-1)*10)+i)
                var selectop={
                    token:row[i].strToken,
                    index:row[i].index-1,
                    type:"dan",
                };
                
                this.selectop.push(selectop);
                // console.log(this.selectop[i].type,this.selectop)
            }
            
        },
        select_Call(row,index){
            console.log(row);
            this.selectop=[];
            
            for(var i=0;i<row.length;i++){
                var selectop={
                    token:row[i].strToken,
                    index:((this.currentPage-1)*10)+i,
                    type:'duo',
                    Name:row[i].Name
                };
                this.selectop.push(selectop);
            }
            
            console.log(this.selectop)
        },
        //分页
        handleSizeChange1(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange1(val) {
            this.currentPage = val;
        },
        signout(){
            this.$router.push({
                path: 'ConferenceControl'
            }).catch((e) => {})
        },
        //搜索
        handlechange(){},
        addZero(n){
            return n<10?"0"+n:n;
        }
    }
}
</script>
<style lang="scss" scoped>
.dasboard_global{
    padding-left: 10px;
    .Control{
        width: 100%;
        height: 90vh;
        display: flex;
        justify-content: space-between;
        .Control_zuo{
            width: 74%;height: 100%;
            .Control_zuo_top{
                padding-left: 30px;
                font-size:16px;
                font-weight:800;
                color:rgba(255,255,255,1);
                line-height:50px;
                opacity:0.7;
            }
        }
        .Control_you{
            width: 25%;
            height: 95vh;
            min-width: 460px;
            overflow: auto;
            .Control_you_top{
                width: 100%;
                video{
                    width: 100%;
                    height: 80%;
                }
            }
            .Control_you_content{
                width: 100%;
                .Control_you_content1{
                    height: 16vh;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    padding: 0 25px;
                    .el-select{
                        width: 50%!important;
                    }
                    .mode_back{
                        padding: 15px 15px;
                        background: url("~@/views/gallery/conference_1pn.png"){
                            repeat:no-repeat;
                            position:center;
                            size: 100%;
                        };
                    }
                    .mode_back1{
                        padding: 15px 15px;
                        background: url("~@/views/gallery/conference_npn.png"){
                            repeat:no-repeat;
                            position:center;
                            size: 100%;
                        };
                    }
                }
                .Control_you_content2{
                    height: 35vh;
                    width: 100%;
                    padding: 15px;
                    display: flex;
                    // justify-content: space-between;
                    flex-wrap: wrap;
                    .Control_you_function{
                        width: 33%;
                        max-height: 120px;
                        text-align: center;
                        // background:linear-gradient(104deg,rgba(76,130,240,1),rgba(113,187,255,1));
                        .Control_invite{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_invite.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_Video{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_Video.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_extend{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_extend.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_Kickout{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_Kickout.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_cam{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_cam.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_share{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_share.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_speake{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_speake.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_invite{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_invite.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 20%;
                            };
                        }
                        .Control_microphone{
                            width: 100%;
                            height: 50%;
                            background: url("~@/views/gallery/Control_microphone.png"){
                                repeat:no-repeat;
                                position:center;
                                size: 16%;
                            };
                        }
                    }
                }
                .Control_you_content2_button{
                    height: 5vh;
                    width: 100%;
                    text-align: center;
                    .form_butt{
                        background:rgba(46,46,46,1);
                        border:1px solid rgba(50,120,255,1);
                        border-radius:5px;
                        color: #fff;
                        padding: 5px 20%;
                    }
                }
            }
        }
    }
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
        justify-content: space-between;
        div{
            padding: 0 20px;
        }
    }
}
input{
    width: 50%;
}
</style>