<template>
	<div class="dasboard_global">
        <div class="button_edi">
            <CButton class="form_butt" type="submit">添加角色</CButton>
            <CButton class="form_butt1" type="submit">删除角色</CButton>
        </div>
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
</style>