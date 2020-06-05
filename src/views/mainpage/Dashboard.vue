<template>
	<div class="dasboard_global">
		<CCard>
            <CCardBody>
                <!-- 弹窗 -->
                <el-dialog
                    class="dasboard_modal"
                    title="创建会议"
                    :visible.sync="myModal"
                    width="25%">
                    <el-form class="el_form" ref="form" label-position='left' :model="sizeForm" label-width="100px" size="small ">
                        <el-form-item label="会议名称">
                            <el-input v-model="sizeForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="会议类型">
                            <el-radio-group v-model="sizeForm.metttype" size="medium">
                                <el-radio  label="temporary">临时会议</el-radio>
                                <el-radio  label="regular">定期会议</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-col :span="24">
                                <el-date-picker
                                    style="width:100%"
                                    v-model="sizeForm.Startdate"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-col :span="24">
                                <el-date-picker
                                    style="width:100%"
                                    v-model="sizeForm.Eendate"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-col>
                        </el-form-item>
                        <!-- <el-form-item label="会议模式">
                            <el-input type='number' min='1' max="23" v-model="sizeForm.mettmode"></el-input>
                        </el-form-item> -->
                        <el-form-item label="会议模式">
                            <el-input-number size="small" :min="1" :max="23" v-model="sizeForm.mettmode"></el-input-number>
                        </el-form-item>
                        <el-form-item label="成员类型">
                            <el-radio-group v-model="sizeForm.member" size="medium">
                                <el-radio  label="user">会议人员</el-radio>
                                <el-radio  label="device">会议设备</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="会议成员" v-if="sizeForm.member=='user'">
                            <!-- <el-input v-model="sizeForm.user" v-if="sizeForm.member=='user'"></el-input> -->
                            <el-select v-model="sizeForm.user" filterable placeholder="请选择">
                                <el-option
                                v-for="item in sizeForm.userdata"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="会议设备" v-if="sizeForm.member=='device'">
                            <el-select v-model="sizeForm.token" filterable placeholder="请选择">
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
                        <CButton class="conten_buttom_but" type="primary"  @click="myModalADD">创建</CButton>
                    </span>
                </el-dialog>
                <el-dialog
                    class="dasboard_modal"
                    title="加入会议"
                    :visible.sync="myModal1"
                    width="25%">
                    <el-input v-model="joinform.usertoken" placeholder="请输入会议号"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <CButton class="conten_buttom_but" type="primary"  @click="Modalplay">创建</CButton>
                    </span>
                </el-dialog>

				<CRow class="margin_g">
					<CCol sm="12">
                        <div class="margin_g title_g">待办会议</div>
					</CCol>
					<CCol sm="8">
						<div class="dasboard_top">
							<div class="top_zuo">
                                
							    <div class="top_title"></div>
								<div class="top_zuo_zuo">
									<div>2020.01.23 10:20“视频播放技术交流视频会议”即将开始</div>
									<span>主持人：总经理</span>
									<span>人数：2/8</span>
								</div>
							</div>
                            <div class="top_you">
                                <!-- 2244 -->
                                <div class="top_you_butt"></div>
                            </div>
						</div>
					</CCol>
					<CCol sm="4">
                        <div class="dasboard_top1">
                            <div class="form-actions">
                                <CButton @click="myModaldata" class="form_butt mr-1" type="submit">创建会议</CButton>
                            </div>
                            <div class="form-actions">
                                <CButton @click="myModal1=true" class="form_butt1" type="submit">加入会议</CButton>
                            </div>
                        </div>
					</CCol>
				</CRow>
                <!-- 会议日程 -->
				<CRow class="margin_g">
                    <CCol sm="12">
                        <div class="margin_g title_g">会议日程</div>
					</CCol>
				</CRow>
                <CRow class="margin_g">
                    <CCol sm="4" class="margin_g" v-for="(a,index) in meetdata" :key="index">
                        <div class="dasboard_content">
                            <!-- 标题 -->
                            <div class="content_title">
                                <div class="content_title_back"></div>
                                <div class="content_title_size1" v-if="a.bStartStatus">进行中</div>
                                <div class="content_title_size2" v-if="!a.bStartStatus">筹备中</div>
                            </div>
                            <!-- 会议 -->
                            <div class="content_con_title">
                                <div class="content_con_title_size">{{a.strName}}</div>
                                <!-- <div class="content_size_ag">人数：4/12</div> -->
                            </div>
                            <div class="content_size_ag">
                                <span style="margin-right: 20px;">日期：{{a.beginTime}}</span>
                                <!-- <span>主持人：总经理</span> -->
                            </div>
                            <div class="content_size_ag">会议号：{{a.strToken}}</div>
                            <!-- 底部 -->
                            <div class="conten_buttom">
                                <div class="conten_buttom_zuo" v-if="a.strType=='regular'">
                                    <div class="conten_buttom_dian"></div>
                                    <div class="conten_buttom_size" >定期会议</div>
                                </div>
                                <div class="conten_buttom_zuo" v-if="a.strType=='temporary'">
                                    <div class="conten_buttom_dian1"></div>
                                    <div class="conten_buttom_size">临时会议</div>
                                </div>
                                <div class="conten_buttom_you">
                                    <CButton class="conten_buttom_but" type="submit" v-if="a.bStartStatus" @click="playvideo(a.strToken)">加入会议</CButton>
                                    <CButton class="conten_buttom_but1" type="submit" v-if="!a.bStartStatus" @click="Addparticipants(a.strToken,user,'user','1')">预约会议</CButton>
                                </div>

                            </div>
                        </div>
					</CCol>
				</CRow>
     		 </CCardBody>
		</CCard>
	</div>
</template>

<script>
import uuid from '../../assets/js/uuid'
export default {
	name: 'Dashboard',
	data(){
		return{
            myModal:false,
            myModal1:false,
            meetdata:[],
            user:this.$store.state.user,
            joinform:{
                usertoken:"",
            },
            sizeForm: {
                name: 'name',//名称
                metttype: 'temporary',//类型
                Startdate: '',//时间
                Eendate: '',//时间
                mettmode:'1',//模式
                mettmodesize:"1",//位置
                member:'user',//成员类型
                user:'',//成员
                userdata:[],
                token:'',//设备
                tokendata:[]
            },
		}
	},
	mounted(){
        this.meetingdata()
        // this.timerdata = setInterval(() => {
		//     this.meetingdata()
        // }, 5000);
	},
	methods:{
        //点击添加弹窗
        Modalplay(){
            // console.log(this.joinform.usertoken);
            this.playvideo(this.joinform.usertoken)
        },
        playvideo(usertoken){
            // console.log(usertoken)
            // return false
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url = root + "/api/v1/StartConference?token="+usertoken+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    this.myModal1==false;
                    this.$router.push({
                        name: `Participants`,
                        path: '/Participants',
                        params: {
                            token:usertoken
                        }
                    })
                }
            })
        },
        //创建会议
        myModalADD(){
            console.log(this.sizeForm)
            var form=this.sizeForm;
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            if(form.Startdate==''||form.Eendate==''){
                this.$message('时间不能为空');
                return false
            }
            var starfs=new Date(form.Startdate).getTime();
            var endds=new Date(form.Eendate).getTime();
            var ks=new Date(starfs).toISOString()+"08:00";
            var jss=new Date(endds).toISOString()+"08:00";
            // console.log(starfs,endds)
            if(starfs>endds){
                this.$message('结束时间不能比开始时间早');
                form.Eendate=''
                return false
            }
            // return false

            var token = uuid(4, 16).toLowerCase();
            var usertoken=''
            var member=this.sizeForm.member
            if(member=='user'){
                usertoken=this.sizeForm.user
            }else if(member=='device'){
                usertoken=this.sizeForm.token
            }
            
            // return false
            var url = root + "/api/v1/CreateConference?name="+form.name
            +"&token="+token
            +"&begintime="+ks
            +"&endtime="+jss
            +"&type="+form.metttype
            +"&layout="+form.mettmode
            +"&layoutsize=22&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    this.Addparticipants(token,usertoken,member,form.mettmodesize)
                    // console.log(ks,jss,url,result)
                }
            })
        },
        //添加参会者
        Addparticipants(token,usertoken,member,mettmodesize){
            // return false
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url = root + "/api/v1/CreateParticipant?token="+token+"&token1="+usertoken+"&type="+member+"&solt="+mettmodesize+"&session="+ this.$store.state.token;
            
            // return false
            this.$http.get(url).then(result=>{
                this.myModal=false
                console.log(result)
                this.$message('预约成功');
                this.meetingdata()
            })
        },
        //点击创建会议
        myModaldata(){
            if(this.$store.state.root==='Operator'){
                this.$message('没有权限');
                return false
                console.log("消失")
            }
            this.myModal=true;
            this.usertokendata();
        },
		meetingdata(){
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url = root + "/api/v1/GetConference?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    // this.meetdata=result.data.conference
                    this.meetdata=[];
                    var data=result.data.conference
                    for(var i=0;i<data.length;i++){
                        var begin=new Date(parseInt(data[i].beginTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,'');  
                        var eng=new Date(data[i].endTime)
                        var listdata={
                            bStartStatus: data[i].bStartStatus,
                            beginTime: begin,
                            beginTime1: data[i].beginTime,
                            endTime: eng,
                            mosaicSize: data[i].mosaicSize,
                            mosaicType: data[i].mosaicType,
                            nId: data[i].nId,
                            strName: data[i].strName,
                            strToken: data[i].strToken,
                            strType: data[i].strType,
                        }
                        this.meetdata.push(listdata)
                        // console.log("1*",listdata,this.meetdata)
                    }
                    this.meetdata.sort(function(a,b){
                        return  b.beginTime1-a.beginTime1
                    })
                }
                
            })
        },
        usertokendata(){
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url1 = root + "/api/v1/GetSrc?getonline=true&session="+ this.$store.state.token;
            this.$http.get(url1).then(result=>{
                if(result.status==200){
                    this.sizeForm.tokendata=[];
                    var data=result.data.src;
                    for(var i=0;i<data.length;i++){
                        var Role={
                            value: data[i].strToken,
                            label: data[i].strToken
                        }

                        this.sizeForm.tokendata.push(Role);
                    }
                }
                
            })
            var url2 = root + "api/v1/GetUserList?session="+ this.$store.state.token;
            this.$http.get(url2).then(result=>{
                console.log("***",result);
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
        }
	}
}
</script>
<style lang="scss" scoped>
.dasboard_global{
	width: 100%;
	height: 100%;
	// overflow: auto;
	box-sizing: border-box;
	.card{
		background: none;
		border: none;
        //顶部左
		.dasboard_top{
			width: 100%;
			height: 100%;
			background: url('../gallery/dash_oneback.png')no-repeat;
			padding: 4% 8% 6% 12%;
            display: flex;
            justify-content: space-between;
            border-radius: 10px;
            //第一个内容左边
            .top_zuo{
                width: 80%;
                height: 100%;
                //第一内容顶部
                .top_title{
                    height: 26%;
                    // font-size: 20px;
                    // font-family:AliHYAiHei;
                    // font-weight:600;
                    // color:rgba(255,255,255,1);
                    background: url('../../assets/imgs/l5s_logo_bai.png')no-repeat;
                }
                .top_zuo_zuo{
                    margin: 20px 0 0 6%;
                    div{
                        font-size:18px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        opacity:0.7;
                    }
                    span{
                        font-size:14px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        opacity:0.4;
                        margin-right: 15px;
                    }
                }
            }
            // 第一个内容右边
            .top_you{
                width: 64px;
                height: 100%;
                display: flex;
                align-items: center;
                .top_you_butt{
                    width: 64px;
                    height: 64px;
                    background: url('../gallery/dash_oneicon.png')no-repeat center center;
                }
            }
		}
        // 顶部右
        .dasboard_top1{
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: space-evenly;
            .form-actions{
                width: 100%;
                text-align: center;
                .form_butt{
                    width: 37%;
                    border: none;
                    background:#26A552;
                    padding: 8px;
                    font-size:14px;
                    font-family:PingFang SC;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                }
                .form_butt1{
                    width: 37%;
                    border: none;
                    background:#3277FF;
                    padding: 8px;
                    font-size:14px;
                    font-family:PingFang SC;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                }
            }
        }
        //内容
        .dasboard_content{
            width: 100%;
            height: 100%;
            min-height: 150px;
            background:rgba(46,52,60,1);
            border-radius: 4px;
            padding: 5%;
            .content_title{
                display: flex;
                justify-content: space-between;
                margin-bottom: 25px;
                .content_title_back{
                    width: 130px;
                    background: url('../../assets/imgs/l5s_logo_bai.png')no-repeat;
                    background-size:100%;
                    opacity:0.8;
                }
                .content_title_size1{
                    font-size:12px;
                    font-family:AliHYAiHei;
                    font-weight:500;
                    color:rgba(50,119,255,1);
                }
                .content_title_size2{
                    font-size:12px;
                    font-family:AliHYAiHei;
                    font-weight:500;
                    color:rgba(255,255,255,1);
                }
            }
            .content_con_title{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                .content_con_title_size{
                    font-size:16px;
                    font-family:PingFang SC;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                    opacity:0.7;
                }
            }
            .content_size_ag{
                margin-bottom: 10px;
                font-size:12px;
                font-family:PingFang SC;
                font-weight:600;
                color:rgba(255,255,255,1);
                opacity:0.4;
            }
            .conten_buttom{
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                align-items: center;
                .conten_buttom_zuo{
                    display: flex;
                    .conten_buttom_dian{
                        width:12px;
                        height:12px;
                        background:rgba(50,113,255,1);
                        border-radius:50%;
                        margin-right: 5px;
                    }
                    .conten_buttom_dian1{
                        width:12px;
                        height:12px;
                        background:rgba(38,165,82,1);
                        border-radius:50%;
                        margin-right: 5px;
                    }
                    .conten_buttom_size{
                        font-size:14px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        line-height:12px;
                        opacity:0.7;
                    }
                }
                .conten_buttom_you{
                    .conten_buttom_but{
                        background:#3277FF;
                        font-size:14px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                    }
                    .conten_buttom_but1{
                        font-size:14px;
                        font-family:PingFang SC;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        background:rgba(55,62,72,1);
                        border:1px solid rgba(50,119,255,1);
                    }
                }
            }
        }
	}
}
// 弹框 
/deep/ .dasboard_modal{
    .el-dialog{
        background-color: #2E343C;
        .conten_buttom_but{
            padding: 5px 30px;
            background:#3277FF;
            font-size:14px;
            font-family:PingFang SC;
            font-weight:600;
            color:rgba(255,255,255,1);
        }
    }
    .el-input-number__decrease, .el-input-number__increase{
        background: none;
    }
    .el-dialog__body{
        color: #FFF;
    }
    .el-form-item__label{
        color: #FFF;
    }
    .el-input__inner{
        color: #FFF !important;
        border:1px solid rgba(181,181,181,1);
    }
    .el-range-input{
        color: #FFF !important;
        background: none;
        border: none;
    }
    .el-radio-group{
        display: flex;
        justify-content: space-around;   
        align-items: center; 
        .el-radio{
            color: #FFF;
        }
    }
}

.margin_g{
    margin-bottom: 20px;
}
.title_g{
    font-size:16px;
    font-family:PingFang SC;
    font-weight:600;
    color:rgba(255,255,255,1);
}
</style>