<template>
    <div class=liveview>
        <!-- 左侧数据栏 -->
		<div class="liveview_left">
            <el-input
                class="liveview_left_input"
                placeholder="输入设备关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="设备" name="1" >
                    <el-tree
                        :data="data"
                        node-key="id"
                        :filter-node-method="filterNode"
                        ref="tree"
                        @node-click="handleNodeClick"
                        :props="defaultProps">
                        <span slot-scope="{ data }" style="width:100%;">
                            <div style="width:100%;display: flex;justify-content: space-between;">
                                <!-- draggable="true" 
                                    @dragstart="dragStart($event,data.token,data.label,data.streamprofile, data.name,data.disabled_me,node)" -->
                                <span 
                                    class="size_color" 
                                    draggable="true" 
                                    @dragstart="dragStart($event,data.token,data.label,data.streamprofile, data.name,data.disabled_me)">
                                    <span style="font-size: 12px;" :class="data.iconclass" :id="'icon'+data.token"></span>
                                    <span :class="data.iconclass1" style="padding-left: 4px;">{{data.label}}</span>
                                </span>
                                <span :class="data.iconclass2" class="black" style="">{{$t("message.live.Videorecording")}}</span>
                            </div>
                        </span>
                    </el-tree>
                </el-collapse-item>
                <el-collapse-item title="用户" name="2">
                    <div class="content_zuo_con">
                        <div class="content_zuo_content">
                            <div class="content_zuo_user" v-for="(a,index) in userdata" :key="index">
                                <div class="user_icon">
                                    <i class="icon_size" :class="[a.icon,a.bOnline ? '' : 'icon_size1']"></i>
                                    <div class="user_size">{{a.strName}}</div>
                                </div>
                                <div class="user_onl iconfont icon-chakanshipin" @click="call(a.strName)"></div>
                                <!-- <div class="user_onl1" v-else>离线</div> -->
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="联系人" name="3">
                    <div class="content_zuo_con">
                        <div class="content_zuo_content">
                            <div class="content_zuo_user" v-for="(a,index) in Contactdata" :key="index">
                                <div class="user_icon">
                                    <i class="icon_size" :class="[a.icon,a.bOnline ? '' : 'icon_size1']"></i>
                                    <div class="user_size">{{a.strName}}</div>
                                </div>
                                <div class="user_onl iconfont icon-chakanshipin" @click="call(a.strName)"></div>
                                <!-- <div class="user_onl1" v-else>离线</div> -->
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                
            </el-collapse>
		</div>
		<!-- 右边视频栏 -->
      	<div class="liveview_right" id="videoPanel">
            <div id="video_hed">
                <div name='flex' style="position: relative;" class="videoColor"  v-for="r in rows" :key="r">
                    <div 
                        class="palace" 
                        name="flex" 
                        v-for="c in cols" 
                        :key="c" 
                        @contextmenu.prevent="stopVideo($event)" 
                        @click="videoClick(r,c,$event)"
                        @drop="dropTarget($event,r,c)" 
                        @dragover.prevent="dragover($event)" >
                        <live-play v-bind:id="'h'+r+c" :h5id="'h'+r+c" :rows="rows" :cols="cols" :h5videoid="'hvideo'+r+c"></live-play>
                    </div>
                </div>
            </div>
			<div class="liveview_group blocks">
				<el-button type="button" class="iconfont icon-tubiao_huaban1" data-row="1|1" @click="changePanel($event)"></el-button>
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben" data-row="1|3" @click="changePanel($event)"></el-button>
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben2" data-row="2|2" @click="changePanel($event)"></el-button>

				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben3" data-row="1|6" @click="changePanel($event)"></el-button>
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben4" data-row="1|7" @click="changePanel($event)"></el-button>

				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben5" data-row="3|3" @click="changePanel($event)"></el-button>

				
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben6" data-row="1|13" @click="changePanel($event)"></el-button>

				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben7" data-row="4|4" @click="changePanel($event)"></el-button>
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben8" data-row="5|5" @click="changePanel($event)"></el-button>
				<el-button type="button" class="iconfont icon-tubiao_huaban1fuben9" @click="panelFullScreen($event)"> </el-button>
			</div>
		</div>
    </div>
</template>

<script>
import Vue from 'vue'
import Liveplay from './liveview/Liveplay'
export default {
    name: 'Liveview',
    components: {
        'live-play': Liveplay
    },
	data(){
		return{
            proto: this.$store.state.liveviewrtc,
            activeNames: ['1','2','3'],//左边
            userdata:[],//用户列表
            Contactdata:[],//联系人列表
            data:[],//摄像机
			rows: 3,
			cols: 3,
			selectCol: 1,
			selectRow: 1,
			contentHeight: '',
            contentWidth: '',
            filterText:"",//搜索框
            data:[],
            data1:[],
            timerRunInfo:'',
            defaultProps: {
                children: 'children',
                label: 'label',
                token:"token",
                iconclass:"iconclass"
            },
		}
    },
    beforeDestroy() {
        // this.$root.bus.$off('meettoken');
        clearInterval(this.timerRunInfo);
    },
	mounted(){
        this.mettuselest();
        this.Contactselest();
        this.GetSrc();
        this.timerRunInfo = setInterval(() => {
            this.mettuselest();
            this.Contactselest();
        }, 30*1000);
        // console.log(listdatag,listdatagload,listdatag1,this.data)
        this.updateUI();
        $('#headswitch1').hide()
        var _this=this
        // _this.$root.bus.$on('PlayVideotoken', function(token){
        //     console.log("---------",token)
        // })
	},
	methods:{
        //拨打电话
        call(user){
            var _this=this
            console.log(user)
            if (user) {
                let vid = 'h' + _this.$data.selectRow + _this.$data.selectCol;
                _this.$root.bus.$emit('liveplay', user+'-rtcm', undefined, user,user,vid);
            }
            for(var i=1;i<=this.rows;i++){
                    for(var c=1;c<=this.cols;c++){
                        var video= document.getElementById("hvideo"+i+c)
                        console.log('video.paused++++',video.poster);
                        if(video.poster==""||video.poster=="http://localhost:6080/"||video.poster==_this.$store.state.IPPORT){
                            this.selectCol = c;
                            this.selectRow =i;
                            $(".h5container").removeClass('h5videoh');
                            $("#h"+this.selectRow+this.selectCol).addClass('h5videoh');
                            // console.log('video.paused1',video.poster,i,c);
                            return false
                        }else{
                            console.log('video.paused1',video.poster);
                        }
                    }
                }
        },
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
                        // 主副流
                        var node=[{
                        token : item['strToken'],
                        streamprofile : "main",
                        label :"主码流",
                        name:item['strName']+"--"+"主码流",
                        iconclass : 'mdi mdi-playlist-play fa-fw',
                        disabled_me:false
                        },{
                        token : item['strToken'],
                        streamprofile : "sub",
                        label :"辅码流",
                        name:item['strName']+"--"+"辅码流",
                        iconclass : 'mdi mdi-playlist-play fa-fw',
                        disabled_me:false
                        }]
                        var newItem ={
                                token : item['strToken'],
                                label : item['strName'],
                                iconclass : 'iconfont  icon-kaiqishexiangtou1',
                                iconclass2 : 'iconfont  icon-shexiangtou',
                                name:item['strName']+"--"+"主码流",
                                children:node,
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
                        strName: data[i].strName,
                        icon:"iconfont icon-yonghuming",
                        bOnline:true
                    }
                    mettdata.push(userdata)
                }
                this.userdata=mettdata
            })
            
        },
        
        Contactselest(){
            // console.log(this.$store.state.IPPORT)
            // this.Contactdata=[]
            var Contactdata=[]
            var url = this.$store.state.IPPORT + "/api/v1/GetContactList?session="+ this.$store.state.token;
            this.$http.get(url).then(result=>{
                console.log(result)
                var data=result.data.contacts
                if(data.length==0){
                    return false
                }
                for(var i=0; i<data.length;i++){
                    var userdata={
                        strName: data[i].strContact,
                        icon:"iconfont icon-yonghuming",
                        bOnline:true
                    }
                    Contactdata.push(userdata)
                }
                this.Contactdata=Contactdata
            })
        },
        //树形节点点击
        handleNodeClick(data, checked, indeterminate){
            console.log(data)
            if(data.streamprofile==undefined){
                data.streamprofile='main'
            }
            // return false;
            let _this =this;
            if(data.disabled_me==false){
                // document.getElementById("icon"+data.token).style.color="#5fbfa7";
                if (data.token) {
                    let vid = 'h' + _this.$data.selectRow + _this.$data.selectCol;
                    console.log("----------------------",data.label,vid);
                    _this.$root.bus.$emit('liveplay', data.token, data.streamprofile, data.name,data.label,vid);
                }
                if (data.strToken) {
                    let vid = 'h' + _this.$data.selectRow + _this.$data.selectCol;
                    console.log("----------------------",data,vid);
                    _this.$root.bus.$emit('liveplay', data.strToken, data.streamprofile, data.name,data.strName,vid);
                }
                for(var i=1;i<=this.rows;i++){
                    for(var c=1;c<=this.cols;c++){
                        var video= document.getElementById("hvideo"+i+c)
                        console.log('video.paused++++',video.poster);
                        if(video.poster==""||video.poster=="http://localhost:6080/"||video.poster==_this.$store.state.IPPORT){
                            this.selectCol = c;
                            this.selectRow =i;
                            $(".h5container").removeClass('h5videoh');
                            $("#h"+this.selectRow+this.selectCol).addClass('h5videoh');
                            // console.log('video.paused1',video.poster,i,c);
                            return false
                        }else{
                            console.log('video.paused1',video.poster);
                        }
                    }
                }
                    
            }else{
               console.log("不可用");
            }
        },
        //拖动播放
        dragStart(ev,token,label,streamprofile,name,disabled_me){
            // console.log(ev,token,label,streamprofile,name,disabled_me,"124");
            var drag={
                token:token,
                label:label,
                streamprofile:streamprofile,
                name:name,
                disabled_me:disabled_me,
            }
            this.drag=drag;
            ev.dataTransfer.setData("Text",ev.target.id);
        },
        dragover (ev) {
            // console.log(ev,"123",ev.target.id)
            // ev.preventDefalut()
        },
        dropTarget (ev,r,c) {
            let _this =this;
            var data=this.drag;
            if(data.streamprofile==undefined){
                data.streamprofile='main'
            }
            // return false;
            if(data.disabled_me==false){
                // document.getElementById("icon"+data.token).style.color="#5fbfa7";
                if (data.token) {
                    let vid = 'h' + r + c;
                    _this.$root.bus.$emit('liveplay', data.token, data.streamprofile, data.name,data.label,vid);
                }
                for(var i=1;i<=this.rows;i++){
                    for(var c=1;c<=this.cols;c++){
                        var video= document.getElementById("hvideo"+i+c)
                        // console.log('video.paused',video);
                        if(video.poster==""||video.poster=="http://localhost:6080/"||video.poster==_this.$store.state.IPPORT){
                            this.selectCol = c;
                            this.selectRow =i;
                            $(".h5container").removeClass('h5videoh');
                            $("#h"+this.selectRow+this.selectCol).addClass('h5videoh');
                            return false
                        }else{
                            console.log('video.paused1',!video.poster);
                        }
                    }
                }
                    
            }else{
               console.log("不可用");
            }
        },
		//点击宫格
		videoClick(r, c, $event) {
            this.selectCol = c;
            this.selectRow = r;
            console.log(r, c);
            $(".h5container").removeClass('h5videoh');
            $("#h"+r+c).addClass('h5videoh');
        },
        stopVideo(event){
            return;
        },
		// ui宽度
		updateUI() {
            if($(document.body).width() < 768)
            {
                this.contentHeight = $(document.body).height()*0.4;
            }else
            {
                this.contentHeight = $(document.body).height()*0.82;
            }
            $('div[name="flex"]').height(this.contentHeight / this.rows);
            //this.contentHeight = $(document.body).height()*0.8;
            let _this = this;
            // if (H5siOS() === true)
            // {
            //     $('.h5video').prop("controls", true);
            // }
        },
		//点击宫格
        changePanel(event) {
            let data = $(event.target).data('row');
            let _this = this;
             window.setTimeout(function() {
                if(data=='1|6'||data=='1|7'||data=='1|13'){
                    // console.log("121");
                    
                }else{
                    // console.log("45845454545");
                    $("#videoPanel .videoColor .palace").removeClass("Seven_Palace");
                    $("#videoPanel .videoColor .palace").removeClass("Six_Palace");
                    $("#videoPanel .videoColor .palace").removeClass("videoflexitem");
                }
                var list_gong=$(".palace");
                if(data=='1|6'){
                    // console.log("23")
                    list_gong.removeClass("videoflexitem");
                    list_gong.removeClass("Seven_Palace");

                    list_gong.addClass("Six_Palace");
                }
                if(data=='1|7'){
                    // console.log("234")
                    list_gong.removeClass("videoflexitem");
                    list_gong.removeClass("Six_Palace");

                    list_gong.addClass("Seven_Palace");
                }
                if(data=='1|13'){
                    // console.log("2345")
                    list_gong.removeClass("Six_Palace");
                    list_gong.removeClass("Seven_Palace");

                    list_gong.addClass("videoflexitem");
                }

		    }, 50);
            let cols = data.split('|')[1];
            let rows = data.split('|')[0];
            //this.map.clear();
            Object.assign(this.$data, {
                rows: parseInt(rows),
                cols: parseInt(cols)
            });
            Vue.nextTick(function () {
                //$('div[name="flex"]').height(($(".content").height() - 50) / rows);
                $('div[name="flex"]').height(_this.contentHeight / rows);
                var cors=_this.cols*_this.rows;
                console.log(cors)
                if(cors>9){
                    $('.ptz_id_show').hide()
                    $('.info_id_show').hide()
                    $('.ptzcontrols').hide()
                    $('.information').hide()
                }
                if(cors<=9){
                    $('.ptz_id_show').show()
                    $('.info_id_show').show()
                }
            })
        },
        //全屏
        panelFullScreen(event) {
            var elem = document.getElementById('video_hed');
            //var elem = $("#videoPanel");
            console.log('panelFullScreen', event);
            if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
            ) {
                if (
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                ) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    console.log("========  updateUIExitFullScreen");
                    this.updateUIExitFullScreen();
                } else {
                     console.log('panelFullScreen3');

                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                    this.updateUIEnterFullScreen();
                    if (document.addEventListener)
                    {
                        document.addEventListener('webkitfullscreenchange', this.updateUIExitFullScreen, false);
                        document.addEventListener('mozfullscreenchange', this.updateUIExitFullScreen, false);
                        document.addEventListener('fullscreenchange', this.updateUIExitFullScreen, false);
                        document.addEventListener('MSFullscreenChange', this.updateUIExitFullScreen, false);
                    }
                }
            } else {
                console.log('Fullscreen is not supported on your browser.');
            }
        },
        updateUIEnterFullScreen(){

            $('div[name="flex"]').height(screen.height / this.rows);
        },
        updateUIExitFullScreen(){
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
            {
                $('div[name="flex"]').height(this.contentHeight / this.rows);
            }
        },
        //最菜的写法
        headswitch(){
            $('#headswitch').show()
            $('#headswitch1').hide()
        },
        headswitch1(){
            $('#headswitch1').show()
            $('#headswitch').hide()
        },
        //模糊查询
        filterNode(value, data, node) {
            // 如果什么都没填就直接返回
            if (!value) return true;
            // 如果传入的value和data中的label相同说明是匹配到了
            if (data.label.indexOf(value) !== -1) {
            return true;
            }
            // 否则要去判断它是不是选中节点的子节点
            return this.checkBelongToChooseNode(value, data, node);
        },
        // 判断传入的节点是不是选中节点的子节点
        checkBelongToChooseNode(value, data, node) {
            const level = node.level;
            // 如果传入的节点本身就是一级节点就不用校验了
            if (level === 1) {
            return false;
            }
            // 先取当前节点的父节点
            let parentData = node.parent;
            // 遍历当前节点的父节点
            let index = 0;
            while (index < level - 1) {
            // 如果匹配到直接返回
            if (parentData.data.label.indexOf(value) !== -1) {
                return true;
            }
            // 否则的话再往上一层做匹配
            parentData = parentData.parent;
            index ++;
            }
            // 没匹配到返回false
            return false;
        },
    },
    //模糊查询
    watch: {
      filterText(val) {
        console.log("filter",val);
        this.$refs.tree.filter(val);
      }
    }
}
</script>

<style lang="scss">
.liveview{
    padding-top: 10px;
    display: flex;
    // flex-wrap: wrap;
    justify-content: space-between;
    /* 水印 */
    .liveview_left{
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
        .el-collapse{
            .el-collapse-item{
                height: 30vh;
                .el-collapse-item__wrap{
                    .el-collapse-item__content{
                        height: 25vh;
                        padding: 0 10px;
                        overflow: auto;
                        // ::-webkit-scrollbar{
                        //     display: none;
                        // }
                        //1
                        .content_zuo_con{
                            width: 100%;
                            height: 25vh;
                            overflow: auto;
                            &::-webkit-scrollbar{
                                display: none;
                            }
                            .content_zuo_content{
                                width: 100%;
                                height: 90%;
                                .content_zuo_user{
                                    width: 100%;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 10px 18px;
                                    .user_icon{
                                        display: flex;
                                        align-items: center;
                                        .icon_size{
                                            font-size:15px;
                                            color: #0099da;
                                            margin-right: 8px;
                                        }
                                        .icon_size1{
                                            font-size:15px;
                                            margin-right: 8px;
                                        }
                                        .user_size{
                                            font-size:16px;
                                            font-family:PingFang SC;
                                            font-weight:500;
                                        }
                                    }
                                }
                                .user_onl{
                                    font-size:20px;
                                    font-family:PingFang SC;
                                    font-weight:500;
                                    color:rgb(16, 108, 228);
                                    cursor:pointer;
                                }
                                .user_onl1{
                                    font-size:14px;
                                    font-family:PingFang SC;
                                    font-weight:500;
                                    color:#FFFFFF;
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }
    .liveview_right{
        width: 84%;
        /* 播放片段 */
        .h5videoh{
            /* border: 2px solid #f44336 !important;
            box-sizing: border-box; */
            box-shadow: 0 0 0 2px #f44336;
            // box-sizing: border-box;
            z-index: 10;
        }
        .videoColor {
            .palace{
                background-size: 10%;
                flex: 1 1 10%;
            }

            /* 六 */
            .Six_Palace{
                flex: 1 1 33.33%!important;
                height: 33.33% !important;
                &:nth-child(1){
                    flex: 1 1 66.66% !important;
                    height: 66.66% !important;
                }
                &:nth-child(3){
                    width: 33.33% !important;
                    position: absolute;
                    top: 33.33%;
                    right: 0;
                }
            }
            /* 十三宫格 */
            .videoflexitem{
                flex: 1 1 25% !important;
                width: 25% !important;
                height: 25% !important;
                &:nth-child(6){
                    position: absolute;
                    top: 50%;
                    left: 0;
                }
                &:nth-child(7){
                    flex: 1 1 50% !important;
                    height: 50% !important;
                }
                &:nth-child(8){
                    flex: 1 1 25% !important;
                    position: absolute;
                    top: 50%;
                    right: 0;
                }
            }
            /* 七宫格 */
            .Seven_Palace{
                flex: 1 1 33.33%;
                height: 33.33% !important;
                &:nth-child(1){
                    height: 100% !important;
                }
                &:nth-child(3){
                    width: 33.33% !important;
                    position: absolute;
                    top: 33.33%;
                    right: 0;
                }
                &:nth-child(2){
                    width: 33.33% !important;
                    position: absolute;
                    top: 33.33%;
                    right: 33.33%;
                }
                &:nth-child(6){
                    width: 33.33% !important;
                    position: absolute;
                    bottom: 0;
                    right: 33.33%;
                }
                &:nth-child(7){
                    width: 33.33% !important;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
        }
        div[name='flex'] {
            display: flex;
            flex-wrap: wrap;
            border-bottom: 0px !important;
            :hover {
                /*background-color: #3c8dbc;*/
                cursor: pointer;
            }
            +[name='flex'] {
                border-left: 0px !important;
            }
        }
        .liveview_group{
            width: 100%;
            padding: 20px 20%;
            display: flex;
            justify-content: space-between;
            button{
                border: none;
                background: none;
                font-size: 30px;
            }
        }
    }
}
</style>