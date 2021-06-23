<template>
    <div class="Vcroom">
        <!-- 添加弹窗 -->
        <el-dialog width="25%" :title="eltitle" :visible.sync="dialogFormVisible">
            
            <el-form class="el_form" ref="form" label-position='left' label-width="100px" size="small " :model="form">
                <el-form-item label="会议室名称">
                    <el-input v-model="form.Name"></el-input>
                </el-form-item>
                <el-form-item label="房间号">
                    <!-- <el-input v-model="form.roomid">
                    </el-input> -->
                    {{form.roomid}}
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer button_table">
                <el-button class="form_butt1" @click="dialogFormVisible = false">{{$t("message.setting.Cancel")}}</el-button>
                <el-button class="form_butt" type="primary" @click="platformyes">{{$t("message.setting.OK")}}</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog width="25%" :title="eltitle" :visible.sync="editPopup">
            
            <el-form class="el_form" ref="form" label-position='left' label-width="100px" size="small " :model="editform">
                <el-form-item label="会议室名称">
                    <el-input v-model="editform.Name"></el-input>
                </el-form-item>
                <el-form-item label="房间号">
                    <!-- <el-input v-model="editform.roomid">
                    </el-input> -->
                    {{editform.roomid}}
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer button_table">
                <el-button class="form_butt1" @click="editPopup = false">{{$t("message.setting.Cancel")}}</el-button>
                <el-button class="form_butt" type="primary" @click="edityes">{{$t("message.setting.OK")}}</el-button>
            </div>
        </el-dialog>
        <div class="btn">
            <el-button size="small" type="primary" @click="addroom"> 添加 </el-button>
            <el-button size="small" @click="deleteselect"> 删除 </el-button>
        </div>
        
        <div class="Vcdata">
            <el-table :data="tableData.slice((currentPage1-1)*pageSize,currentPage1*pageSize)" style="width: 100%" @select='selectCall'
            @select-all='select_Call'>
                <el-table-column width="20">
                </el-table-column>
                <el-table-column type="selection" width="100">
                </el-table-column>
                <!-- <el-table-column prop="index" label="编号">
                </el-table-column> -->
                <el-table-column prop="nId" label="房间号">
                </el-table-column>
                <el-table-column prop="strName" label="虚拟会议室名称">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    min-width="140">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index,scope.row)" type="text" size="small">{{$t("message.setting.edit")}}</el-button>
                        <el-button @click.native.prevent="deleteRow(scope.$index,scope.row, tableData)" type="text" size="small">{{$t("message.setting.DeleteAll")}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                style="text-align: center;"
                layout=" prev, pager, next,total, jumper"
                @size-change="handleSizeChange1" 
                @current-change="handleCurrentChange1"
                :current-page="currentPage1"
                :page-size="15"
                :total="total2">
            </el-pagination>
        </div>
    </div>
</template>
<script>

export default({
    name:'Vcroom',
    data(){
        return{
            eltitle:this.$t("message.setting.Configuration"),
            dialogFormVisible:false,//添加弹窗
            editPopup:false,//编辑弹窗
            tableData:[],
            form:{
                Name:"会议室1"
            },
            editform:{
                Name:"",
            },
            selectop:[],
            editindex:"",
            rowid:'',
            currentPage1: 1,
            pageSize: 15,
            total2: 0,
            btnLock:true,
        }
    },
    mounted(){
        this.getdata()
    },
    methods:{
        getdata(){
            var url = this.$store.state.IPPORT + "/api/v1/GetVMRoomList?session=" + this.$store.state.token;
            this.$http.get(url).then(result => {
                if(result.status == 200){
                    var item = result.data.vmr;
                    // console.log(item);
                    this.tableData = [];
                    for (var i=0; i < item.length; i++) {
                        var tabledata = {
                            index:i+1,
                            nId:item[i].nId,
                            strName:item[i].strName
                        }
                        this.tableData.push(tabledata);
                    }
                    // console.log(this.tableData);
                    this.total2=this.tableData.length;
                }
            }).catch(error => {
            console.log("GetSystemInfo", error);
            });
        },
        addroom(){
            this.dialogFormVisible=true;
            do
            var number = Math.floor(Math.random()*10000);
            while( number < 1000 )
            this.form.roomid = number
        },
        platformyes(){
            if (this.form.Name == '') {
                alert("会议室名字不能为空")
                return
            }
            this.dialogFormVisible=false;
            console.log(this.form.roomid);
            var url = this.$store.state.IPPORT + "/api/v1/AddVMRoom?id=" +this.form.roomid+"&name="+
            this.form.Name+"&session="+this.$store.state.token;
            this.$http.get(url).then(result=>{
                if(result.status==200){
                    if(result.data.bStatus==true){
                        this.tabledata = [];
                        this.getdata()
                    }else{
                        this.$message({
                            message: '添加失败',
                            type: 'warning'
                        });
                        return false;
                    }
                }
            })
        },
        //编辑
        handleEdit(index,row){
            this.editindex=((this.currentPage1-1)*15)+index;
            this.editPopup=true
            this.editform.Name = row.strName
            this.editform.roomid = row.nId
            this.rowid = row.nId
        },
        edityes(){
            this.editPopup=false;
            var form = this.editform
            // console.log(form);
            // console.log(this.editindex);
            // console.log(this.tableData);
            // return
            if (form.roomid!=this.rowid) {
                return
            }
            var url = this.$store.state.IPPORT + "/api/v1/DelVMRoom?session=" + this.$store.state.token +"&id="+form.roomid;
            this.$http.get(url).then(result=>{
                if(result.status==200){

                    var list = {
                        index:this.editindex+1,
                        nId:form.roomid,
                        strName:form.Name
                    }
                    this.tableData.splice(this.editindex, 1,list)
                    var url = this.$store.state.IPPORT + "/api/v1/AddVMRoom?id=" +form.roomid+"&name="+
                    form.Name+"&session="+this.$store.state.token;
                    this.$http.get(url).then(result=>{
                        if(result.status==200){
                            if(result.data.bStatus==true){
                                console.log(result.data);
                            }else{
                                this.$message({
                                    message: '添加失败',
                                    type: 'warning'
                                });
                                return false;
                            }
                        }
                    })
                }
            })
        },
        //单项删除
        deleteRow(index, row,rows) {
            if (this.btnLock) {
                this.btnLock=false;
                var roomid;
                // console.log(index,row,rows);
                var url = this.$store.state.IPPORT + "/api/v1/GetVMRoomList?session=" + this.$store.state.token;
                this.$http.get(url).then(result => {
                    roomid = result.data.vmr[index].nId
                    console.log(roomid);
                    var url2 = this.$store.state.IPPORT + "/api/v1/DelVMRoom?session=" + this.$store.state.token
                    + "&id=" +roomid;
                    this.$http.get(url2).then(result => {
                        this.getdata()
                        this.btnLock=true;
                        this.$message({
                            message: "删除成功",
                            type: 'warning'
                        });
                    })
                })                   
            }else{
                return ;
            }
        },
        deleteselect(){
            var selectop=this.selectop;
            console.log(selectop)
            for(var i=selectop.length-1;i>=0;i--){
                var url = this.$store.state.IPPORT + "/api/v1/DelVMRoom?session="+ this.$store.state.token + "&id=" +selectop[i].roomid;
                this.$http.get(url).then(result=>{
                    if(result.status==200){
                        if(result.data.bStatus==true){
                            this.getdata()
                            this.$message({
                                message: "删除成功",
                                type: 'warning'
                            });
                        }else{
                            this.$message({
                                message:this.$t("message.camera.Delete_failed"),
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
                    index:row[i].index-1,
                    roomid:row[i].nId,
                    strName:row[i].strName
                };
                this.selectop.push(selectop);
            }
            console.log(this.selectop);
            
        },
        select_Call(row){
            this.selectop=[];
            for(var i=0;i<row.length;i++){
                var selectop={
                    index:row[i].index-1,
                    roomid:row[i].nId,
                    strName:row[i].strName
                };
                this.selectop.push(selectop);
            }
            console.log(this.selectop);
        },
        //分页
        handleSizeChange1(val) {
            console.log(`每页 ${val} 条`); 
            this.currentPage1 = 1;
            this.pageSize = val;
        },
        handleCurrentChange1(val) {
            console.log(`当前页: ${val}`);
            this.currentPage1 = val;
        },
    }
})
</script>
<style lang="scss" scoped>
    .Vcroom{
        width: 100%;
        height: 100%;
    }
</style>
