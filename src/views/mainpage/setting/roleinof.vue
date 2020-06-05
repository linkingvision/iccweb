<template>
	<div class="dasboard_global">
        <CCard>
            <CCardBody>
                <CButton class="form_butt" type="submit">添加角色</CButton>
                <CButton class="form_butt1" type="submit">删除角色</CButton>
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                    prop="strRoleToken"
                    label="日期"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="bConfig"
                    label="姓名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="bOperate"
                    label="地址">
                    </el-table-column>
                    <el-table-column
                        min-width="50"
                        class="size"
                        fixed="right">
                        <template>
                            <el-button type="text" size="small">{{$t("message.setting.edit")}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </CCardBody>
		</CCard>
	</div>
</template>

<script>
export default {
	name: 'roleinof',
	data(){
		return{
            tableData: []
		}
    },
	mounted(){
        if(this.$store.state.root==='Operator'){
            return false
        }else{
            this.rolesre();
        }
	},
	created(){
	},
	methods:{
        // 表格列表
        rolesre(){
            let root=process.env.VUE_APP_URL;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            var url = root + "api/v1/GetRoleList?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log("***",result);
                if(result.status==200){
                    // this.tableData2=result.data.users;
                    // this.tableData=[];
                    var data=result.data.roles;
                    for(var i=0;i<data.length;i++){
                        var datasrc={
                            strRoleToken:data[i].strRoleToken,
                            bConfig:data[i].permission.bConfig+"",
                            bOperate:data[i].permission.bOperate+""
                        }
                        console.log("***",datasrc);
                        this.tableData.push(datasrc);
                    }
                }
            })
        },
	}
}
</script>
<style >


</style>
<style lang="scss" scoped>
.dasboard_global{
    .form_butt{
        background:rgba(50,119,255,1);
        border-radius:2px;
        padding: 5px 10px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
        margin-right: 20px;
    }
    .form_butt1{
        background:rgba(55,62,72,1);
        border:1px solid rgba(50,119,255,1);
        border-radius:2px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
        box-sizing: border-box;
    }
}
</style>