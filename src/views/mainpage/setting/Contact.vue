<template>
	<div class="dasboard_global">
        <!-- 编辑弹窗 -->
        
        <el-dialog class="user_pop" width="25%" close="dialog" :title="label.Edit" :visible.sync="editPopup">
            <!-- 1 -->
            <el-form label-position="left" :rules="rules" ref="ruleForm" label-width="150px" :model="editform">
                <el-form-item label="联系人">
                    <el-input disabled v-model="editform.strContact"></el-input>
                </el-form-item>
                <el-form-item label="H323" prop="strH323">
                    <el-input v-model="editform.strH323"></el-input>
                </el-form-item>
                <el-form-item label="SIP" prop="strSIP">
                    <el-input v-model="editform.strSIP"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="editPopup = false">{{$t("message.setting.Cancel")}}</el-button> -->
                <el-button class="pop_but" type="primary" @click="changepwss('ruleForm')">{{$t("message.setting.OK")}}</el-button>
            </div>
        </el-dialog>
        <!-- 添加 -->
        <el-dialog class="user_pop"  width="25%" :title="eltitle" :visible.sync="dialogFormVisible">
            <!-- 1 -->
            <el-form label-position="left" :rules="rules" ref="ruleForm" label-width="150px" :model="form">
                <el-form-item label="联系人">
                    <el-input v-model="form.strContact"></el-input>
                </el-form-item>
                <el-form-item label="H323" prop="strH323">
                    <el-input v-model="form.strH323"></el-input>
                </el-form-item>
                <el-form-item label="SIP" prop="strSIP">
                    <el-input v-model="form.strSIP" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogFormVisible = false">{{$t("message.setting.Cancel")}}</el-button> -->
                <el-button  class="pop_but" @click="addContact('ruleForm')" type="primary">{{$t("message.setting.OK")}}</el-button>
            </div>
        </el-dialog>
        <div class="button_edi">
            <CButton class="form_butt" @click="dialogFormVisible = true" type="submit">添加联系人</CButton>
            <CButton class="form_butt1" @click="deleteContacts" type="submit">删除联系人</CButton>
        </div>
        <el-table
            :data="tableData.filter(data => !search || data.strUser.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
            @select='selectCall'
            @select-all='select_Call'
            style="width: 100%">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
            prop="strContact"
            label="联系人"
            width="180">
            </el-table-column>
            <el-table-column
            prop="strH323"
            label="H323"
            min-width="50">
            </el-table-column>
            <el-table-column
            prop="strSIP"
            label="SIP"
            min-width="50">
            </el-table-column>
            <el-table-column
                min-width="50"
                class="size"
                fixed="right">
                <template  slot-scope="scope">
                    <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteContact(scope.$index,scope.row,tableData)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
import '../../../assets/js/jQuery.md5'
export default {
	name: 'Contact',
	data(){
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写H323或SIP至少一个'));
            }
        };
		return{
            total: 0, // 总条数 1
            currentPage: 1, // 当前页码1
            pageSize: 10,//一页数量
            search: '',//搜索
			tableData: [],
            editPopup:false,
            dialogFormVisible:false,
            eltitle:this.$t("message.setting.Configuration"),
			label:{
                Edit:this.$t("message.setting.edit"),

                label:this.$t("message.setting.user"),//选1
                user:this.$t("message.setting.username"),
                Password:this.$t("message.setting.password"),
                role:this.$t("message.setting.role"),
                type:this.$t("message.setting.Authority"),
                olPassword:this.$t("message.setting.currentpass"),
                nePassword:this.$t("message.setting.newpass"),
                confirmpass:this.$t("message.setting.confirmpassword"),//重复密码
                confirmpass1:this.$t("message.setting.confirmpass"),//重复新密码
            },
			form: {
                strContact:"Contact1",
                strH323: "h323:1000@192.168.1.1",
                strSIP:"sip:1000@192.168.1.1",
            },
            Role:[],
            editform: {
                strContact:"Contact1",
                strH323: "12345",
                strSIP:"12345",
            },
            selectop:[],//选择那几个
            rules: {
                strH323: [
                    { validator: checkAge, trigger: 'blur' }
                ],
                strSIP: [
                    { validator: checkAge, trigger: 'blur' }
                ]
            }
		}
    },
	mounted(){
        if(this.$store.state.root==='Operator'){
            return false
        }else{
            this.Contact();
        }
	},
	created(){
	},
	methods:{
        //添加联系人
        addContact(formName){
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
            });
            var form=this.form;
            console.log(form)
            let root=this.$store.state.IPPORT;
            if( form.strH323==""&&form.strSIP==""){
                this.$message('H323和SIP不能同时为空');
                return false;
            }
            this.dialogFormVisible=false;
            console.log(form.strContact,form.strSIP,form.strH323)
            var url = root + "/api/v1/AddContact?contact="+encodeURIComponent(form.strContact)+"&sip="+encodeURIComponent(form.strSIP)+"&h323="+encodeURIComponent(form.strH323)+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                // console.log("***",result,form,url);
                if(result.status==200){
                    if(result.data.bStatus==true){
                        this.Contact();
                    }else{
                        console.log(result)
                        this.$message({
                            message: result.data.strCode,
                            type: 'warning'
                        });
                        return false;
                    }
                }
            })
        },
		//点击编辑
		handleClick(index,row){
			this.editPopup = true;
			console.log("***",index,row);
            this.editform["strContact"]=row.strContact;
            this.editform["strH323"]=row.strH323;
            this.editform["strSIP"]=row.strSIP;
            // this.editform["strUserType"]=row.strUserType;
		},
        // 修改密码
		changepwss(formName){
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
            });
            var form=this.editform;
            let root=this.$store.state.IPPORT;
            if( form.strH323==""&&form.strSIP==""){
                this.$message('H323和SIP不能同时为空');
                return false;
            }
            var url = this.$store.state.IPPORT + "/api/v1/DeleteContact?contact="+encodeURIComponent(form.strContact)+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(result.data.bStatus==true){
                        var url = root + "/api/v1/AddContact?contact="+encodeURIComponent(form.strContact)+"&sip="+encodeURIComponent(form.strSIP)+"&h323="+encodeURIComponent(form.strH323)+"&session="+ this.$store.state.token;
                        this.$http.get(url).then(result=>{
                            // console.log("***",result,form,url);
                            if(result.status==200){
                                if(result.data.bStatus==true){
                                    this.Contact();
                                    this.editPopup=false
                                }else{
                                    return false;
                                }
                            }
                        })
                    }else{
                        console.log("删除失败")
                        return false;
                    }
                }
            })
        },
        //点击删除
        deleteContact(index, row,rows) {
          //var form=this.form;
            console.log(row,index);
            var index_xlh="";
            console.log("序列号H5_STREAM",this.currentPage,((this.currentPage-1)*10)+index);
            index_xlh=((this.currentPage-1)*10)+index;
            
            console.log("序列号1",index_xlh);
            // return false;
            //url
            var url = this.$store.state.IPPORT + "/api/v1/DeleteContact?contact="+encodeURIComponent(row.strContact)+"&session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result);
                console.log(this.tableData);
                if(result.status==200){
                    if(result.data.bStatus==true){
                        rows.splice(index_xlh, 1);
                        this.total=this.tableData.length
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'warning'
                        });
                        return false;
                    }
                }
            })
        },
        //全选删除
        deleteContacts(){
            var selectop=this.selectop;
            console.log(selectop)
            
            // return false
            //url
            for(var i=selectop.length-1;i>=0;i--){
                if(selectop[i].type=='duo'){
                    this.tableData.splice(selectop[i].index, 1);
                    console.log(selectop[i],i,selectop[i].index,this.currentPage)
                }
                console.log(selectop[i],i,selectop[i].index)
                var url = this.$store.state.IPPORT + "/api/v1/DeleteContact?contact="+encodeURIComponent(selectop[i].strContact)+"&session="+ this.$store.state.token;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        if(result.data.bStatus==true){
                            if(selectop[0].type=='dan'){
                                this.tableData=[];
                                this.Contact();
                            }
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
        selectCall(row){
            console.log("INDEX",row);
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                var selectop={
                    strContact:row[i].strContact,
                    type:"dan",
                    strH323:row[i].strH323,
                    strSIP:row[i].strSIP,
                };
                
                this.selectop.push(selectop);
            }
            
        },
        select_Call(row){
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                var selectop={
                    strContact:row[i].strContact,
                    index:((this.currentPage-1)*10)+i,
                    type:'duo',
                    strH323:row[i].strH323,
                    strSIP:row[i].strSIP,
                };
                this.selectop.push(selectop);
            }
        },
        //搜索
        // 表格列表
        Contact(){
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url = root + "api/v1/GetContactList?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log("***",result);
                if(result.status==200){
                    this.tableData=result.data.contacts;
                    this.total=this.tableData.length;
                }
            })
        },
        handleSizeChange1(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange1(val) {
            this.currentPage = val;
        },
    }
}
</script>

<style lang="scss" scoped>
.dasboard_global{
	/* 弹框input */
	.user_pop{
		.pop_but{
			width: 60px;
			background:rgba(50,113,255,1);
			border-radius:5px;
			padding: 5px 10px;
		}
		.editinput{
			border:1px solid rgba(181,181,181,1);
			-webkit-appearance: none;
			background:none;
			border-radius: 4px;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			display: inline-block;
			font-size: inherit;
			height: 40px;
			line-height: 40px;
			outline: 0;
			padding: 0 15px;
			-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			width: 100%;
		}
	}
}

</style>