<template>
	<div class="dasboard_global">
        <!-- 编辑弹窗 -->
        <!-- 添加 -->
        <el-dialog
            class="dasboard_modal"
            width="25%"
            title="创建会议"
            :visible.sync="dialogFormVisible">
            <el-form class="el_form" ref="form" label-position='left' :model="sizeForm" label-width="100px" size="small ">
                <el-form-item label="会议名称">
                    <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="会议类型">
                    <el-radio-group v-model="sizeForm.metttype" size="medium">
                        <el-radio  label="temporary">临时会议</el-radio>
                        <el-radio  label="regular">定期会议</el-radio>
                    </el-radio-group>
                </el-form-item> -->
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
                <el-form-item label="会议模式">
                    <div class="mode">
                        <el-radio-group v-model="sizeForm.mettmodesetting" size="medium">
                            <el-radio  label="1pn"><span class="mode_back"></span> 1+N模式</el-radio>
                            <el-radio  label="nxn"><span class="mode_back1"></span> 等分模式</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="1+N模式" v-if="sizeForm.mettmodesetting=='1pn'">
                    <!-- <el-input v-model="sizeForm.user" v-if="sizeForm.member=='user'"></el-input> -->
                    <el-select v-model="sizeForm.one" filterable placeholder="请选择">
                        <el-option
                        v-for="item in sizeForm.onenmode"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="等分模式" v-if="sizeForm.mettmodesetting=='nxn'">
                    <el-select v-model="sizeForm.ep" filterable placeholder="请选择">
                        <el-option
                        v-for="item in sizeForm.epmode"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="成员类型">
                    <div class="mode">
                        <el-radio-group v-model="sizeForm.member" size="medium">
                            <el-radio  label="user">会议人员</el-radio>
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
                <el-form-item label="分辨率">
                    <el-select v-model="sizeForm.resolutiondata" filterable placeholder="请选择">
                        <el-option
                        v-for="item in sizeForm.resolution"
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
        <div class="button_edi">
            <CButton class="form_butt" @click="addclick" type="submit">创建会议</CButton>
            <CButton class="form_butt1" @click="deletClickall" type="submit">删除会议</CButton>
        </div>
        <el-table
            :data="tableData.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
            @select='selectCall'
            @select-all='select_Call'
            style="width: 100%">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="strName"
            label="会议名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="strType"
            label="会议模式"
            min-width="50">
            </el-table-column>
            <el-table-column
            prop="beginTime"
            label="开始时间"
            min-width="50">
            </el-table-column>
            <el-table-column
            prop="endTime"
            label="结束时间"
            min-width="50">
            </el-table-column>
            <el-table-column
            prop="strToken"
            label="会议号"
            min-width="50">
            </el-table-column>
            <el-table-column
                label="开始/关闭会议"
                min-width="50"
                class="size"
                fixed="right">
                <template  slot-scope="scope">
                    <el-switch
                        @change="mettchang(scope.row)"
                        v-model="scope.row.bStartStatus"
                        active-color="#13ce66">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                min-width="50"
                class="size"
                fixed="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search"
                    @change="handlechange(scope.$index,scope.row)"
                    size="mini"
                    placeholder="输入关键字"/>
                </template>
                <template  slot-scope="scope">
                    <el-button @click="deletClick(scope.$index,scope.row,tableData)" type="text" size="small">删除会议</el-button>
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
</template>

<script>
import uuid from '../../../assets/js/uuid'
export default {
	name: 'roleinof',
	data(){
		return{
            openmett:false,
            tableData: [],
            total: 0, // 总条数 1
            currentPage: 1, // 当前页码1
            pageSize: 10,//一页数量
            search: '',//搜索
            editPopup:false,
            dialogFormVisible:false,
            eltitle:this.$t("message.setting.Configuration"),
			
			sizeForm: {
                name: 'Conference1',//名称
                metttype: 'regular',//会议类型
                Startdate: new Date(),//时间
                Eendate: new Date(),//时间

                mettmodesetting:"nxn",
                one:"1p2",
                onenmode:[
                    {
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

                mettmodesize:1,//位置
                member:'user',//成员类型
                user:'',//成员
                userdata:[],
                token:'',//设备
                tokendata:[],
                resolutiondata:"1080P",
                resolution:[
                    {
                        value: "VGA",
                        label: "VGA"
                    },{
                        value: "D1",
                        label: "D1"
                    },{
                        value: "720P",
                        label: "720P"
                    },{
                        value: "1080P",
                        label: "1080P"
                    }
                ]//分辨率
            },
            Role:[],
            label:{
                Created:this.$t("message.dashboard.Created"),
		        appointment:this.$t("message.dashboard.appointment")
            },
            selectop:[]//选择那几个
		}
    },
	mounted(){
        this.mettinglist();
	},
	methods:{
        //点击创建
        addclick(){
            this.dialogFormVisible = true
            this.usertokendata()
        },
        //打开会议
        mettchang(row){
            if(row.bStartStatus==true){
                // console.log(row.bStartStatus)
                var url = this.$store.state.IPPORT + "/api/v1/StartConference?token="+encodeURIComponent(row.strToken)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        this.$message('会议开始');
                    }
                })
            }else if(row.bStartStatus==false){
                var url = this.$store.state.IPPORT + "/api/v1/StopConference?token="+encodeURIComponent(row.strToken)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        this.$message('会议结束');
                    }
                })
                console.log(row.bStartStatus)
            }
        },
        //删除用户
        deletClick(index,row,rows){
            console.log(row)
            var index_xlh=((this.currentPage-1)*10)+index;
            var url = this.$store.state.IPPORT + "/api/v1/DeleteConference?token="+encodeURIComponent(row.strToken)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        if(result.data.bStatus){
                            console.log(result ,"删除");
                            this.$message('删除会议成功');
                            rows.splice(index_xlh, 1);
                        }else{
                            this.$message('请关闭会议或刷新重试');
                        }
                    }
                })
        },
        //全选删除
        deletClickall(){
            var selectop=this.selectop;
            console.log(selectop);
            // return false
            for(var i=0;i<selectop.length;i++){
                var index=selectop[i].index;
                //return false;
                var url = this.$store.state.IPPORT + "/api/v1/DeleteConference?token="+encodeURIComponent(selectop[i].strToken)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    console.log(result);
                    // console.log(this.tableData);
                    if(result.status==200){
                        if(result.data.bStatus==true){
                            //    this.reload();
                            //row.splice(index, 1);
                            this.mettinglist()
                        }else{
                            this.$message({
                                message: '删除失败',
                                type: 'warning'
                            });
                            return false;
                        }
                    }
                })
            }
        },
        //创建会议
        myModalADD(){
            var form=this.sizeForm;
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

            var token = uuid(4, 10);
            
            // return false
            var playmode=''
            if(form.mettmodesetting=='1pn'){
                playmode=form.one
            }else if(form.mettmodesetting=='nxn'){
                playmode=form.ep
            }
            // return false
            this.dialogFormVisible=false
            var url = this.$store.state.IPPORT + "/api/v1/CreateConference?name="+form.name
            +"&token="+encodeURIComponent(token)
            +"&begintime="+encodeURIComponent(form.Startdate)
            +"&endtime="+encodeURIComponent(form.Eendate)
            +"&type="+encodeURIComponent(form.metttype)
            +"&layoutmode="+encodeURIComponent(form.mettmodesetting)
            +"&layout="+encodeURIComponent(playmode)
            +"&layoutsize="+encodeURIComponent(form.resolutiondata)+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(form.token.length!=0||form.user.length!=0){
                        if(form.user.length>0){
                            console.log("1",form.token,form.user)
                            this.Addparticipants(token,form.user,"user",form.mettmodesize,this.label.Created)
                        }
                        if(form.token.length>0){
                            console.log("2",)
                            this.Addparticipants(token,form.token,"device",form.mettmodesize,this.label.Created)
                        }
                    }else if(form.token.length==0&&form.user.length==0){
                        this.$message(this.label.Created);
                        this.mettinglist()
                        
                    }
                }
            })
        },
        //添加参会者
        Addparticipants(token,usertoken,member,mettmodesize,successfully,){
            // return false
            for(var i=0 ; i<usertoken.length ; i++){
                var url = this.$store.state.IPPORT 
                + "/api/v1/CreateParticipant?token="
                +encodeURIComponent(token)+"&participanttoken="
                +encodeURIComponent(usertoken[i])+"&type="+member+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    this.dialogFormVisible=false
                    // this.$message(successfully);
                    this.mettinglist()
                })
            }
        },
        //搜索
        handlechange(){},
        //获取列表
        mettinglist(){
            var url = this.$store.state.IPPORT + "/api/v1/GetConference?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    // this.meetdata=result.data.conference
                    this.tableData=[];
                    var data=result.data.conference
                    for(var i=0;i<data.length;i++){
                        if(data[i].strType=="temporary"){
                            continue
                        }
                        var begin=new Date(parseInt(data[i].beginTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,'');  
                        var eng=new Date(data[i].endTime* 1000).toLocaleString().replace(/:\d{1,2}$/,'')

                        var beginTime=new Date(data[i].beginTime).getTime();
                        var endTime=new Date(data[i].endTime).getTime();
                        var begin=new Date(data[i].beginTime);  
                        var eng=new Date(data[i].endTime)

                        //年月日
                        var y = begin.getFullYear();
                        var m = this.addZero(begin.getMonth()+1);
                        var d = this.addZero(begin.getDate());
                        //时分秒
                        var h = this.addZero(begin.getHours());
                        var mm = this.addZero(begin.getMinutes());
                        var rq=y+'.'+m+'.'+d+" "+h+':'+mm;

                        //年月日
                        var y = eng.getFullYear();
                        var m = this.addZero(eng.getMonth()+1);
                        var d = this.addZero(eng.getDate());
                        //时分秒
                        var h = this.addZero(eng.getHours());
                        var mm = this.addZero(eng.getMinutes());
                        var eq=y+'.'+m+'.'+d+" "+h+':'+mm;

                        var listdata={
                            bStartStatus: data[i].bStartStatus,
                            beginTime: rq,
                            beginTime1:beginTime,
                            endTime: eq,
                            endTime1: endTime,
                            mosaicSize: data[i].mosaicSize,
                            mosaicType: data[i].mosaicType,
                            nId: data[i].nId,
                            strName: data[i].strName,
                            strToken: data[i].strToken,
                            strType: data[i].strType,
                        }
                        this.tableData.push(listdata)
                    }
                    // this.tableData.sort(function(a,b){
                    //     return  b.beginTime1-a.beginTime1
                    // })
                    this.total=this.tableData.length
                }
            })
        },
        usertokendata(){
            var url1 = this.$store.state.IPPORT + "/api/v1/GetSrc?getonline=true&session="+ this.$store.state.token;
            this.$http.get(url1).then(result=>{
                if(result.status==200){
                    this.sizeForm.tokendata=[];
                    var data=result.data.src;
                    for(var i=0;i<data.length;i++){
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
        },
        //分页
        handleSizeChange1(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange1(val) {
            this.currentPage = val;
        },
        selectCall(row){
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                // console.log(row[i].Token)
                var selectop={
                    strToken:row[i].strToken,
                };
                this.selectop.push(selectop);
            }
            
        },
        select_Call(row){
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                var selectop={
                    strToken:row[i].strToken,
                };
                this.selectop.push(selectop);
            // console.log(this.selectop);
            }
        },
        addZero(n){
            return n<10?"0"+n:n;
        }
	}
}
</script>

<style lang="scss" scoped>
.dasboard_modal{
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
    .mode{
        height: 40px;
        padding-top: 8px;
    }
}
/deep/ .dasboard_modal{
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
</style>