<template>
    <div class="System">
        <el-button class="system_but" type="success" round size="mini" @click="systemsave">快照</el-button>
        <div class="system_content">
            <div class="system_content_top">
                <div>当前快照</div>
                <div @click="GetSnapshotList">
                    <i class="iconfont icon-zhongqi"></i>
                    刷新
                </div>
            </div>
            <div class="system_content_botm">
                <div>快照名称</div>
                <div v-for="(a,index) in dataarr" :key="index">
                    {{a}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'system',
    data(){
        return {
            activeName:'cloudmode',
            dataarr:[],
        }
    },
    mounted(){
        this.GetSnapshotList();
    },
    methods:{
        GetSnapshotList(){
            var url = this.$store.state.IPPORT + "/api/v1/GetSnapshotList?session="+ this.$store.state.token;
            // console.log(url)
            this.$http.get(url).then(result=>{
                console.log(result)
                if(result.status == 200){
                    var itme=result.data;
                    this.dataarr=itme.strName
                    console.log(this.dataarr)
                }
            })
        },
        systemsave(){
            var url = this.$store.state.IPPORT + "/api/v1/CreateSnapshot?session="+ this.$store.state.token;
            // console.log(url)
            this.$http.get(url).then(result=>{
                console.log(result)
                if(result.status == 200){
                    if(result.data.bStatus){
                        this.$message('保存成功')
                        this.GetSnapshotList();
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.System{
    padding: 0 10px;
}
.system_but{
    font-size: 14px;
    background-color: #74C7B2;
    padding: 5px 18px;
}
.system_content_top{
    display: flex;
    justify-content: space-between;
}
.system_content_top div:nth-child(1){
    opacity: 0.7;
}
.system_content_top div:nth-child(2){
    color: #53BCA1;
    cursor:pointer;
}
.system_content_botm{
    width: 100%;
    height: 500px;
    border: 1px solid #BFBFBF;
    overflow: auto;
    padding: 10px 10px;
    
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    opacity: 0.8;
}
.system_content_botm div{
    margin-bottom: 10px;
}

.system_content{
    width: 350px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    margin: 20px 0;
}

</style>