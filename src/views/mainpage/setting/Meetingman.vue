<template>
	<div class="dasboard_global">
        <CCard>
            <CCardBody>
				<!-- 编辑弹窗 -->
                <!-- 添加 -->
                
                <el-dialog
                    title="创建会议"
                    :visible.sync="dialogFormVisible"
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
            </CCardBody>
		</CCard>
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
                name: 'name',//名称
                metttype: 'temporary',//类型
                Startdate: '',//时间
                Eendate: '',//时间
                mettmode:'1',//模式
                mettmodesize:1,//位置
                member:'user',//成员类型
                user:'',//成员
                userdata:[],
                token:'',//设备
                tokendata:[]
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
                        this.$message('删除会议成功');
                        rows.splice(index_xlh, 1);
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
            // console.log(this.sizeForm)
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

            var token = uuid(4, 16).toLowerCase();
            var usertoken=''
            var member=this.sizeForm.member
            if(member=='user'){
                usertoken=this.sizeForm.user
            }else if(member=='device'){
                usertoken=this.sizeForm.token
            }
            
            // return false
            var url = this.$store.state.IPPORT + "/api/v1/CreateConference?name="+form.name
            +"&token="+encodeURIComponent(token)
            +"&begintime="+encodeURIComponent(ks)
            +"&endtime="+encodeURIComponent(jss)
            +"&type="+encodeURIComponent(form.metttype)
            +"&layout="+encodeURIComponent(form.mettmode)
            +"&layoutsize=22&session="+ this.$store.state.token;
            // console.log(url)
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(usertoken!=''){
                        this.Addparticipants(token,usertoken,member,form.mettmodesize,this.label.Created)
                    }else if(usertoken==''){
                        console.log(url)
                        this.dialogFormVisible=false
                        this.$message(this.label.Created);
                        this.mettinglist()
                    }
                    // console.log(ks,jss,url,result)
                }
            })
        },
        //添加参会者
        Addparticipants(token,usertoken,member,mettmodesize,successfully){
            for(var i=0 ; i<usertoken.length ; i++){
                var size=Number(mettmodesize)+Number(i)
                console.log(usertoken[i],size)
                // return false
                var url = this.$store.state.IPPORT + "/api/v1/CreateParticipant?token="+encodeURIComponent(token)+"&token1="+encodeURIComponent(usertoken[i])+"&type="+member+"&solt="+size+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    this.dialogFormVisible=false
                    console.log(result)
                    this.$message(successfully);
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
                        var begin=new Date(parseInt(data[i].beginTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,'');  
                        var eng=new Date(data[i].endTime* 1000).toLocaleString().replace(/:\d{1,2}$/,'')
                        var listdata={
                            bStartStatus: data[i].bStartStatus,
                            beginTime: begin,
                            beginTime1: data[i].beginTime,
                            endTime: eng,
                            endTime1: data[i].endTime,
                            mosaicSize: data[i].mosaicSize,
                            mosaicType: data[i].mosaicType,
                            nId: data[i].nId,
                            strName: data[i].strName,
                            strToken: data[i].strToken,
                            strType: data[i].strType,
                        }
                        this.tableData.push(listdata)
                    }
                    this.tableData.sort(function(a,b){
                        return  b.beginTime1-a.beginTime1
                    })
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
	}
}
</script>

<style lang="scss" scoped>
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