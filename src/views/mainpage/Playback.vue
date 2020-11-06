<template>
    <div class="playback">
        <div class="playback_snap_zuo">
            <el-input
                class="liveview_left_input"
                placeholder="输入设备关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="设备" name="1" >
                    <el-tree
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :filter-node-method="filterNode"
                        ref="tree"
                        highlight-current
                        :props="defaultProps">
                        <span slot-scope="{ data }">
                            <i :class="data.iconclass" style="color:rgb(142, 132, 132);"></i>
                            <span :class="data.iconclass1" style="padding-left: 4px;">{{data.label}}</span>
                        </span>
                    </el-tree>
                </el-collapse-item>
                <el-collapse-item title="用户" name="2">
                    <el-tree
                        :data="userdata"
                        show-checkbox
                        node-key="id"
                        :filter-node-method="filterNode"
                        ref="userdata"
                        highlight-current
                        :props="defaultProps">
                        <span slot-scope="{ data }">
                            <i :class="data.iconclass" style="color:#0099da;"></i>
                            <span :class="data.iconclass1" style="padding-left: 4px;">{{data.label}}</span>
                        </span>
                    </el-tree>
                </el-collapse-item>
                <el-collapse-item title="联系人" name="3">
                    <el-tree
                        :data="Contactdata"
                        show-checkbox
                        node-key="id"
                        :filter-node-method="filterNode"
                        ref="Contactdata"
                        highlight-current
                        :props="defaultProps">
                        <span slot-scope="{ data }">
                            <i :class="data.iconclass" style="color:#0099da;"></i>
                            <span :class="data.iconclass1" style="padding-left: 4px;">{{data.label}}</span>
                        </span>
                    </el-tree>
                </el-collapse-item>
                
            </el-collapse>
        </div>
        <div class="playback_snap_you">
            <div class="snap_you_top">
                <div class="snap_you_topfast">
                    <div class="snap_you_topinterval">日期</div>
                    <el-select v-model="value" placeholder="请选择" @change="datechange">
                        <el-option
                        v-for="item in selectdate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="snap_you_topdate">
                    <div class="snap_you_topinterval">开始日期</div>
                    <el-date-picker
                        v-model="startvalue"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                    <div class="snap_you_topinterval1">-</div>
                    <div class="snap_you_topinterval">结束日期</div>
                    <el-date-picker
                        v-model="endvalue"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <div class="snap_you_topbutt">
                    <el-button class="snap_you_topbutt1" @click="getCheckedNodes">{{$t("message.archive.search")}}</el-button>
                    <el-button class="snap_you_topbutt2" @click="tableDatak">{{$t("message.archive.Clear")}}</el-button>
                </div>
            </div>
            <div class="snap_you_bottom">
                <!-- 有按钮 -->
                <el-table
                    stripe
                    :data="tableData1.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%;">
                    <el-table-column
                        prop="token"
                        :label="label.Token" >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.token }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        :label="label.Name">
                            <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="starf"
                        :label="label.StartTime">
                            <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span>{{ scope.row.starf }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="end"
                        :label="label.EndTime">
                            <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span>{{ scope.row.end }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="end"
                        :label="label.Type">
                            <template slot-scope="scope">
                            <span>{{ scope.row.type }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        width=310px>
                        <template slot-scope="scope">
                            <div class="button_edi">
                                <a :href="scope.row.url" :download="scope.row.urlto"><button type="button" style="margin-right: 40px;" class="iconfont icon-download"></button></a>
                                <button type="button" class="iconfont icon-play" @click="Refresh1(scope.$index, scope.row)" data-toggle="modal" data-target="#myModal"></button>
                            </div>
                        </template>
                        </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    style="text-align: center;"
                    layout="prev, pager, next"
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :before-close="handleClose"
            class="dasboard_modal"
            :title="label.Playback"
            :visible.sync="myModal1"
            width="30%">
            <div style="display: flex;justify-content: space-between;">
                <span>{{$t("message.archive.StartTime")}}:{{rowstarf}}</span>
                <span>{{$t("message.archive.EndTime")}}:{{rowend}}</span>
            </div>
            <div class="text-center">
                <video class="videoo" id="pbplayarch"></video>
                <div class="block" @mousedown ="timelinndown($event)" @mouseup="timelinnup($event)">
                    <el-slider v-model="timelink" :max="max" @change="timelinn(timelink)" :show-tooltip="false"></el-slider>
                </div>
                <!-- <el-button :class="icon" @click="resume()" class="strart"></el-button> -->
                <div class="playback_function">
                    <div :class="icon" @click="resume()" class="strart"></div>
                    <!-- 倍速 -->
                    <el-select v-model="region" size="mini" style="width:70px!important" @change="Speed()">
                        <el-option
                            v-for="item in regiondata"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!-- 实时时间 -->
                    <span>{{displayc}}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import '../../assets/js/adapter'
import {H5sPlayerWS,H5sPlayerHls,H5sPlayerRTC,H5sPlayerAudBack} from '../../assets/js/h5splayer'
export default {
    
    name:"Playback",
    data() {
        return {
            activeNames: ['1','2','3'],//左边
            v1:undefined,
            label:{
                Name:this.$t("message.table.Name"),
                Token:this.$t("message.table.Token"),
                Time:this.$t("message.table.Time"),
                StartTime:this.$t("message.table.StartTime"),
                EndTime:this.$t("message.table.EndTime"),
                Playback:this.$t("message.archive.Playback")
            },
            icon:'icon_start',
            timelink:0,//滑块
            max:0,//滑块最大值
            value: '',
            endvalue: new Date().getTime(),
            startvalue:new Date().getTime() - 3600 * 1000 * 1,
            myModal1:false,
            region:'0.5',
            regiondata:[{
                    value: "0.5",
                    label: "0.5"
                }, {
                    value: "1.0",
                    label: "1.0"
                }, {
                    value: "2.0",
                    label: "2.0"
                }, {
                    value: "4.0",
                    label: "4.0"
                }, {
                    value: "8.0",
                    label: "8.0"
                }, {
                    value: "16.0",
                    label: "16.0"
            }],
            selectdate: [{
                    value: (new Date().getTime() - 3600 * 1000 * 1),
                    label: this.$t("message.archive.Onehour")
                }, {
                    value: (new Date().getTime() - 3600 * 1000 * 24),
                    label: this.$t("message.archive.Oneday")
                }, {
                    value: (new Date().getTime() - 3600 * 1000 * 24 * 7),
                    label: this.$t("message.archive.Oneweek")
                }, {
                    value: (new Date().getTime() - 3600 * 1000 * 24 * 30),
                    label: this.$t("message.archive.Onemonth")
            }],
            //分页
            currentPage: 1, // 当前页码
            total: 0, // 总条数
            pageSize: 10,//一页数量
            search: '',
            filterText: '',
            userdata:[],//用户列表
            Contactdata:[],//联系人列表
            data:[],//摄像机
            defaultProps: {
                children: 'children',
                label: 'label',
                token:"token",
                iconclass:"iconclass"
            },
            tableData1: [],
            rowstarf:"",//跟进进度条开始时间
            rowend:"",//进度条结束时间
            displayc:"",//实时时间
            url:"",//图片地址
            timerRunInfo:''
        }
    },
    beforeDestroy() {
        this.handleClose();
        clearInterval(this.timerRunInfo);
        // this.$root.bus.$off('liveplay');
    },
    mounted(){
        this.mettuselest();
        this.Contactselest();
        this.GetSrc();
        this.timerRunInfo = setInterval(() => {
            this.mettuselest();
            this.Contactselest();
        }, 30*1000);
    },
    methods:{
        //获取列表
        GetSrc(){
            var url = this.$store.state.IPPORT + "/api/v1/GetSrc?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result)
                if (result.status == 200){
                    var data =  result.data;
                    var srcGroup = {children: []};
                    srcGroup.label='摄像机';
                    srcGroup.iconclass="iconfont  icon-kaiqishexiangtou1";
                    for(var i=0; i< data.src.length; i++){
                        var item = data.src[i];
                        if(item.nType=="H5_RTCM_CH"||item.nType=="H5_RTCS_CH"){
                            continue
                        }
                        var newItem ={
                                token : item['strToken'],
                                label : item['strName'],
                                iconclass : 'iconfont  icon-kaiqishexiangtou1',
                                iconclass2 : 'iconfont  icon-shexiangtou',
                                name:item['strName']+"--"+"主码流",
                                disabled_me:false};
                        
                        if(!item['bOnline'])
                            newItem['iconclass'] = 'iconfont icon-kaiqishexiangtou';

                        if(item['nType'] == 'H5_CLOUD')
                            newItem['iconclass'] = 'mdi mdi-cloud-upload fa-fw';
                        
                        if(item['bRec'] == true)
                            newItem['iconclass2'] = 'iconfont icon-radioboxfill none';
                            
                    srcGroup.children.push(newItem);
                    }
                    this.data.push(srcGroup);
                } 
            }).catch((err) =>{
                console.log('GetSrc failed', err);
            })
            
        },
        mettuselest(){
            var url = this.$store.state.IPPORT + "/api/v1/GetOnlineUserList?session="+ this.$store.state.token;
            var mettdata=[]
            this.$http.get(url).then(result=>{
                // console.log(result)
                var data=result.data.userList
                if(data.length==0){
                    return false
                }
                for(var i=0; i<data.length;i++){
                    if(this.$store.state.user==data[i].strName){
                        continue
                    }
                    var userdata={
                        token : data[i].strName+'-rtcm',
                        label : data[i].strName,
                        iconclass : 'iconfont icon-yonghuming',
                    }
                    mettdata.push(userdata)
                }
                this.userdata=mettdata
                // console.log(this.userdata,data)
            })
            
        },
        
        Contactselest(){
            // console.log(this.$store.state.IPPORT)
            // this.Contactdata=[]
            var Contactdata=[]
            var url = this.$store.state.IPPORT + "/api/v1/GetContactList?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                // console.log(result)
                var data=result.data.contacts
                if(data.length==0){
                    return false
                }
                for(var i=0; i<data.length;i++){
                    var userdata={
                        token : data[i].strContact+'-rtcm',
                        label : data[i].strContact,
                        iconclass : 'iconfont icon-yonghuming',
                    }
                    Contactdata.push(userdata)
                }
                this.Contactdata=Contactdata
            })
        },

        datechange(){
            console.log(this.value)
            this.startvalue=this.value
        },
        PlaybackCB(event, userdata){
            console.log("Playback callback ", event,userdata);
            
            var msgevent = JSON.parse(event);
            if (msgevent.type === 'H5S_EVENT_PB_TIME')
            {
                this.displayc=msgevent.pbTime.strTime;
                var starf=new Date(this.rowstarf).getTime()/1000;
                var endd=new Date(msgevent.pbTime.strTime).getTime()/1000;
                var staefend=endd-starf;
                this.timelink=staefend;
            }
        },
        //播放
        Refresh1(index, row){
            if (this.v1 != undefined){
                this.v1.disconnect();
                delete this.v1;
                this.v1 = undefined;
            }
            console.log(index, row);
            this.rowstarf=row.starf;
            this.rowend=row.end;
            this.url=row.url;
            this.myModal1=true
            var pbconf1 = {
                begintime: row.starf,
                endtime: row.end,
                showposter: 'true', //'true' or 'false' show poster
                callback: this.PlaybackCB,
                serverpb: 'true',
                userdata:  this // user data
            };
            this.$nextTick(()=>{
                console.log(row.token);
                let conf = {
                    videoid: "pbplayarch",
                    protocol: window.location.protocol, //http: or https:
                    host: this.$store.state.WSROOT, //localhost:8080
                    rootpath:'/', // '/'
                    token:row.token,
                    pbconf: pbconf1, //This is optional, if no pbconf, this will be live.
                    hlsver:'v1', //v1 is for ts, v2 is for fmp4
                    session:this.$store.state.token
                };
                var end=new Date(row.end).getTime();
                var starf=new Date(row.starf).getTime();
                var starfend=(end-starf)/1000;//时间差
                console.log(starfend,conf);
                // return false
                this.max=starfend;
                this.v1 = new H5sPlayerRTC(conf);
                this.v1.connect();
                setTimeout(function(){
                    this.v1.start();
                }.bind(this),500);
            })
        },
        //开始
        resume(){
            var strart=this.icon;
            console.log(strart);
            if(strart=="icon_start"){
                console.log(strart);
                this.icon="icon_stop";
                this.v1.pause();
            }
            if(strart=="icon_stop"){
                console.log(strart);
                this.icon="icon_start";
                this.v1.resume();
            }
        },
        //拖
        timelinndown(err){
            console.log('a',err)
            this.v1.pause();
        },
        timelinnup(err){
            console.log('a',err)
            this.v1.resume();
        },
        timelinn(timelink){
            console.log(timelink);
            this.v1.seek(timelink);
            this.icon="icon_start";
        },
        //关闭
        handleClose(){
            if (this.v1 != undefined){
                console.log('关闭')
                this.myModal1=false
                this.v1.disconnect();
                delete this.v1;
                this.v1 = undefined;
            }
        },
        //倍速
        Speed(){
            console.log( this.region);
            this.v1.speed(this.region);
        },
        // 表格归档 下载 刷新
        
        //按钮搜索
        async getCheckedNodes() {
            this.tableData1=[];
            var nodes='';
            var userdata=this.$refs.userdata.getCheckedNodes()//用户列表
            var Contactdata=this.$refs.Contactdata.getCheckedNodes()//联系人列表
            var datas=this.$refs.tree.getCheckedNodes()//摄像机
            if(userdata.length!=0&&Contactdata.length!=0&&datas.length!=0){
                console.log('0000')
            }
            if(userdata.length!=0){
                nodes=this.$refs.userdata.getCheckedNodes();
            }else if(Contactdata.length!=0){
                nodes=this.$refs.Contactdata.getCheckedNodes();
            }else if(datas.length!=0){
                nodes=this.$refs.tree.getCheckedNodes();
            }
            
            console.log("node值",nodes);
            // return false
            var srartdate=new Date(this.startvalue).toISOString()+"08:00";
            var enddate= new Date(this.endvalue).toISOString()+"08:00";
            // console.log(this.endvalue,this.startvalue,srartdate,enddate)
            for(var l=0 ;l<nodes.length; l++){
                if(nodes[l].token!=undefined){
                    console.log(nodes[l].token,nodes[l].label)
                    var label=nodes[l].label
                    // return false
                    var url = this.$store.state.IPPORT + "/api/v1/Search?type=record&token="+nodes[l].token+"&start="+srartdate+"&end="+enddate+"&session="+ this.$store.state.token;
                    // console.log(url);
                    //return false;
                    await this.$http.get(url).then(result=>{
                        console.log(result)
                        if(result.status == 200){
                            this.$message('Query successful');
                            var data=result.data;
                            console.log(data,label)
                            for(var i=0;i<data.record.length;i++){
                                var item=data.record[i];
                                var urlto=item["strPath"].split("/");
                                var timeitem={
                                        name: label,
                                        token: item["strToken"],
                                        starf : item["strStartTime"],
                                        end : item["strEndTime"],
                                        type: item['nType'],
                                        percentage:0,
                                        url:item["strPath"],
                                        urlto:urlto[urlto.length-1],
                                        strFileName:""
                                    };
                                    
                                    //   console.log(data)
                                    if(item['nType']==="H5_REC_MANUAL"){
                                            timeitem["type"] = this.$t("message.archive.ManualRecord");
                                    }
                                    if(item['nType']==="H5_REC_ALARM "){
                                            timeitem["type"] = this.$t("message.archive.AlarmRecord");
                                    }
                                    if(item['nType']=="H5_REC_SCHEDULE "){
                                            timeitem["type"] = this.$t("message.archive.Schedulerecord");
                                    }else{
                                        timeitem["type"] = this.$t("message.archive.ManualRecord");
                                    }
                                    // console.log(timeitem);
                                    //填充
                                    this.tableData1.push(timeitem);
                            }
                            
                            this.total=this.tableData1.length;
                        }
                    }).catch(error => {
                        console.log('Snapshot failed!', error);
                        this.$message('Query failed !');
                    });
                }
            }
        },
        //清空表格
        tableDatak(){
            this.tableData1=[];
            this.total=0;
        },
        //分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        //模糊查询
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    },
     //模糊查询
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    }
    
}
</script>

<style lang="scss" scoped>
.playback{
    display: flex;
    justify-content: space-between;
    .playback_snap_zuo{
        width: 16%;
        min-width: 290px;
        height: 90vh;
        margin: 0 5px;
        overflow: auto;
        &::-webkit-scrollbar{
            display: none;
        }
        .liveview_left_input{
            margin: 10px 0;
        }
        //录像管理
        .black{
            display: none;font-size: 12px;color: #606266; padding-left: 4px;line-height: 26px;color: #f00;
        }
        .none{
            display: block;
        }
        
        .el_tree .el-tree-node__content{
            min-height: 24px;
            height: auto;
        }
    }
    .playback_snap_you{
        width: 82%;
        height: 90vh;
        .snap_you_top{
            padding: 15px 20px;
            @extend .g_flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .el-input__inner{
                background: none;
                padding: 0;
            }
            .snap_you_topfast{
                width: 17%;
                min-width: 240px;
                @extend .g_flex;
                justify-content: space-around;
                align-items: center;
                .snap_you_topinterval{
                    min-width: 40px;
                }
            }
            .snap_you_topdate{
                width: 45%;
                min-width: 600px;
                @extend .g_flex;
                justify-content: space-around;
                align-items: center;
            }
            .snap_you_topbutt{
                width: 15%;
                min-width: 160px;
                @extend .g_flex;
                justify-content: space-around;
                align-items: center;
                .snap_you_topbutt1{
                    background: #3ABBFE;
                    border: none;
                }
            }
        }
        .snap_you_bottom{
            height: 80vh;
            .button_edi button{
                border: 0;
                background:none;
                font-size: 24px;
                margin-right: 40px;
                button:last-child{
                    margin-right: 0;
                }
            }
            .el-table{
                height: 100%;
            }
        }
    }
    .dasboard_modal{
        .el-select.el-select--mini{
            .el-input__inner{
                background: none !important;
            }
        }
        .playback_function{
            display: flex;
            padding: 0 20%;
            justify-content: space-around;
            margin-top: 16px;
            .el-select {
                .el-input{
                    .el-input__inner{
                        width: 100px;
                    }
                }
            }
        }
        .videoo{
            width: 100%;
        }
    }
}


.icon_start{
    width: 32px;
    height: 32px;
    background: url('~@/views/gallery/Playback_start.png') no-repeat center;
    background-size: 100%;
}
.icon_stop{
    width: 32px;
    height: 32px;
    background: url('~@/views/gallery/Playback_stop.png') no-repeat center;
    background-size: 100%;
}
.g_flex{
    display: flex;
}
</style>