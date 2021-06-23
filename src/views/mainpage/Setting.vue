<template>
  <div class="dasboard_global">
    <div class="setting_all">
      <div class="setting_zuo">
        <el-menu
          v-if="$store.state.darkMode"
          :default-active="activemenu"
          class="el-menu-vertical-demo"
          background-color="#252525"
          text-color="#d9d9d9"
          active-text-color="#3277FF"
        >
        <el-submenu index="2-15">
            <template slot="title">
              <i class="iconfont icon-lianxiren"></i>
              <span>联系人管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Contact' }">
              <el-menu-item index="2-15"> 联系人管理 </el-menu-item>
            </router-link>
          </el-submenu>
          <el-submenu index="2-14">
            <template slot="title">
              <i class="iconfont icon-xieyi"></i>
              <span>协议</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Protocol' }">
              <el-menu-item index="2-14">协议</el-menu-item>
            </router-link>
            <el-submenu index="2-11">
              <template slot="title">
                <span>WEBRTC</span>
              </template>
              <!-- 二级 -->
              <router-link :to="{ name: 'WebrtcCloudmode' }">
                <el-menu-item index="2-11">云模式</el-menu-item>
              </router-link>
              <router-link :to="{ name: 'WebrtcForwardingmode' }">
                <el-menu-item index="2-12">转发模式</el-menu-item>
              </router-link>
              <router-link :to="{ name: 'WebrtcTurnmode' }">
                <el-menu-item index="2-13">TURN服务</el-menu-item>
              </router-link>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2-8">
            <template slot="title">
              <i class="iconfont icon-transcode-management"></i>
              <span>转码管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'TranDefault' }">
              <el-menu-item index="2-8">默认</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'TranCustomize' }">
              <el-menu-item index="2-9">自定义</el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-4">
            <template slot="title">
              <i class="iconfont icon-shezhi_guanli"></i>
              <span>设备管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Stream' }">
              <el-menu-item index="2-4">RTSP/RTMP</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Onvif' }">
              <el-menu-item index="2-5">ONVIF</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'File' }">
              <el-menu-item index="2-6">文件</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'DeviceAll' }">
              <el-menu-item index="2-7">全部</el-menu-item>
            </router-link>
          </el-submenu>
          <!-- <router-link :to="{name:'Device_sdk'}">
					<el-menu-item index="2-10">
						<i class="el-icon-menu"></i>
						<span slot="title">SDK管理</span>
					</el-menu-item>
				</router-link> -->
          <el-submenu index="System1">
            <template slot="title">
              <i class="iconfont icon-xitongweihu"></i>
              <span>系统管理</span>
            </template>
            <!-- 系统维护 -->
            <el-submenu index="System">
              <template slot="title">
                <span>系统维护</span>
              </template>
              <!-- 二级 -->
              <router-link :to="{ name: 'System' }">
                <el-menu-item index="2-17">配置快照</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="Docker">
              <template slot="title">
                <span>Docker</span>
              </template>
              <router-link :to="{ name: 'Docker' }">
                <el-menu-item index="2-18">Docker</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="2-2">
            <template slot="title">
              <span>用户</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'User' }">
              <el-menu-item index="2-2">
                <span slot="title">用户管理</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Roleinfo' }">
              <el-menu-item index="2-3">角色管理</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Safetyinfo' }">
              <el-menu-item index="2-20">安全管理</el-menu-item>
            </router-link>
          </el-submenu>
            <el-submenu index="2-30">
              <template slot="title">
                <span>日志</span>
              </template>
              <!-- 二级 -->
              <router-link :to="{ name: 'LogLevel' }">
                <el-menu-item index="2-18">日志级别</el-menu-item>
              </router-link>
              <router-link :to="{ name: 'LogRotating' }">
                <el-menu-item index="2-30">循环覆盖</el-menu-item>
              </router-link>
            </el-submenu>
            <a href="/mediastore">
              <el-menu-item index="2-1-1">
                <span slot="title">文件夹</span>
              </el-menu-item>
            </a>
          </el-submenu>

          <!-- <el-submenu index="2-11">
					<template slot="title">
						<i class="iconfont icon-WebRTC"></i>
						<span>WEBRTC</span>
					</template>
					<router-link :to="{name:'WebrtcCloudmode'}">
						<el-menu-item index="2-11">云模式</el-menu-item>
					</router-link>
					<router-link :to="{name:'WebrtcForwardingmode'}">
						<el-menu-item index="2-12">转发模式</el-menu-item>
					</router-link>
					<router-link :to="{name:'WebrtcTurnmode'}">
						<el-menu-item index="2-13">TURN服务</el-menu-item>
					</router-link>
				</el-submenu> -->
          <!-- <el-submenu index="2-18">
					<template slot="title">
						<i class="iconfont icon-rizhi"></i>
						<span>日志</span>
					</template>
					<router-link :to="{name:'LogLevel'}">
						<el-menu-item index="2-18">日志级别</el-menu-item>
					</router-link>
					<router-link :to="{name:'LogRotating'}">
						<el-menu-item index="2-19">循环覆盖</el-menu-item>
					</router-link>
				</el-submenu> -->
          <!-- <el-submenu index="2-17">
					<template slot="title">
						<i class="iconfont icon-xitongweihu"></i>
						<span>系统维护</span>
					</template>
					<router-link :to="{name:'System'}">
						<el-menu-item index="2-17">配置快照</el-menu-item>
					</router-link>
				</el-submenu> -->
          
          <!-- <el-submenu index="2-16">
					<template slot="title">
						<i class="iconfont icon-rongqiyun"></i>
						<span>Docker</span>
					</template>
					<router-link :to="{name:'Docker'}">
						<el-menu-item index="2-16">
							Docker
						</el-menu-item>
					</router-link>
				</el-submenu> -->
        </el-menu>

        <el-menu
          v-else
          :default-active="activemenu"
          class="el-menu-vertical-demo"
          background-color="#FFFFFF"
          text-color="#000000"
          active-text-color="#3277FF"
        >
          <router-link :to="{ name: 'Meetingman' }">
            <el-menu-item index="2-1">
              <i class="iconfont icon-huiyiguanli-"></i>
              <span slot="title">会议管理</span>
            </el-menu-item>
          </router-link>

          <el-submenu index="2-2">
            <template slot="title">
              <i class="iconfont icon-huiyiguanli"></i>
              <span>用户管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'User' }">
              <el-menu-item index="2-2">
                <span slot="title">用户管理</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Roleinfo' }">
              <el-menu-item index="2-3">角色管理</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Safetyinfo' }">
              <el-menu-item index="2-20">安全管理</el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-15">
            <template slot="title">
              <i class="iconfont icon-lianxiren"></i>
              <span>联系人管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Contact' }">
              <el-menu-item index="2-15"> 联系人管理 </el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-4">
            <template slot="title">
              <i class="iconfont icon-shezhi_guanli"></i>
              <span>设备管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Stream' }">
              <el-menu-item index="2-4">RTSP/RTMP</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'Onvif' }">
              <el-menu-item index="2-5">ONVIF</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'File' }">
              <el-menu-item index="2-6">文件</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'DeviceAll' }">
              <el-menu-item index="2-7">全部</el-menu-item>
            </router-link>
          </el-submenu>
          <!-- <router-link :to="{name:'Device_sdk'}">
					<el-menu-item index="2-10">
						<i class="el-icon-menu"></i>
						<span slot="title">SDK管理</span>
					</el-menu-item>
				</router-link> -->
          <el-submenu index="2-8">
            <template slot="title">
              <i class="iconfont icon-transcode-management"></i>
              <span>转码管理</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'TranDefault' }">
              <el-menu-item index="2-8">默认</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'TranCustomize' }">
              <el-menu-item index="2-9">自定义</el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-11">
            <template slot="title">
              <i class="iconfont icon-WebRTC"></i>
              <span>WEBRTC</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'WebrtcCloudmode' }">
              <el-menu-item index="2-11">云模式</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'WebrtcForwardingmode' }">
              <el-menu-item index="2-12">转发模式</el-menu-item>
            </router-link>
            <router-link :to="{ name: 'WebrtcTurnmode' }">
              <el-menu-item index="2-13">TURN服务</el-menu-item>
            </router-link>
          </el-submenu>

          <!-- <el-submenu index="2-18">
					<template slot="title">
						<i class="iconfont icon-rizhi"></i>
						<span>日志</span>
					</template>
					<router-link :to="{name:'LogLevel'}">
						<el-menu-item index="2-18">日志级别</el-menu-item>
					</router-link>
					<router-link :to="{name:'LogRotating'}">
						<el-menu-item index="2-19">循环覆盖</el-menu-item>
					</router-link>
				</el-submenu> -->

          <el-submenu index="2-17">
            <template slot="title">
              <i class="iconfont icon-xitongweihu"></i>
              <span>系统维护</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'System' }">
              <el-menu-item index="2-14">配置快照</el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-14">
            <template slot="title">
              <i class="iconfont icon-xieyi"></i>
              <span>协议</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Protocol' }">
              <el-menu-item index="2-14">协议</el-menu-item>
            </router-link>
          </el-submenu>

          <el-submenu index="2-16">
            <template slot="title">
              <i class="iconfont icon-rongqiyun"></i>
              <span>Docker</span>
            </template>
            <!-- 二级 -->
            <router-link :to="{ name: 'Docker' }">
              <el-menu-item index="2-16"> Docker </el-menu-item>
            </router-link>
          </el-submenu>
          <a href="/mediastore">
            <el-menu-item index="2-1-1">
              <i class="iconfont icon-wenjian"></i>
              <span slot="title">文件夹</span>
            </el-menu-item>
          </a>
        </el-menu>
      </div>
      <div class="setting_you">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      activemenu: "2-1",
    };
  },
  methods: {
    menuList() {
      let path = this.$route.meta.title;
      // console.log(path,this.$route)
      this.activemenu = path;
    },
  },
  mounted() {
    this.menuList();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.setting_all {
  display: flex;
  height: 90vh;
  // background-color: #fff;
  justify-content: space-between;
  flex-wrap: wrap;
  .setting_zuo {
    margin-top: 1vh;
    width: 14%;
    // min-width: 220px;
    height: 90vh;
    overflow-y: auto;
    // background-color: #fff;
    .el-submenu {
      .el-menu-item {
        padding-left: 70px !important;
      }
    }
  }

  i {
    margin-right: 10px;
  }
  .setting_you {
    padding: 1vh 5px;
    width: 86%;
    height: 90vh;
    overflow-y: auto;
    // background-color: #171717;
  }
  .setting_you::-webkit-scrollbar,
  .setting_zuo::-webkit-scrollbar {
    display: none;
  }
}
</style>