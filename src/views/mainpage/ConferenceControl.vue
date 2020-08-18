<template>
    <div class="dasboard_global">
        <div class="Conference_top">现有会议</div>
        <el-table
            :data="tableData.filter(data => !search || data.strName.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
            style="width: 100%">
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
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search"
                    @change="handlechange(scope.$index,scope.row)"
                    size="mini"
                    placeholder="输入关键字"/>
                </template>
                <template  slot-scope="scope">
                    <el-button @click="ConferenceControl(scope.$index,scope.row,tableData)" type="text" size="small">会议控制</el-button>
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
export default {
    name:"ConferenceControl",
    data(){
        return {
            openmett:false,
            tableData: [],
            total: 0, // 总条数 1
            currentPage: 1, // 当前页码1
            pageSize: 10,//一页数量
            search: '',//搜索
            editPopup:false,
            dialogFormVisible:false,
            eltitle:this.$t("message.setting.Configuration"),
            selectop:[]//选择那几个
        }
    },
    mounted(){
        this.mettinglist();
    },
    methods:{
        ConferenceControl(index,row){
            console.log(row.strToken,row)
            // return false
            this.$router.push({
                name: `Control`,
                path: 'Control',
                params: {
                    token:row.strToken,
                    user:row.strName
                }
            })
        },
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
        //分页
        handleSizeChange1(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange1(val) {
            this.currentPage = val;
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
    padding: 10px;
    .Conference_top{
        font-size:16px;
        font-weight:800;
        color:rgba(255,255,255,1);
        line-height:50px;
        opacity:0.7;
    }
}
input{
    width: 50%;
}
</style>