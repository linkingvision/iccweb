<template>
	<div>
		<div  class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
			<TheHeders/>
			<!-- 左边菜单栏 -->
			<TheSidebar/>
			<CWrapper>
				<!-- 顶部导航 -->
				<!-- <TheHeader/> -->
				<!-- 内容 @click="-->
				<div @click="clicktogg" class="c-body">
					<main class="c-main">
						<CContainer fluid>
							<transition name="fade">
								<router-view></router-view>
							</transition>
						</CContainer>
					</main>
					
				<!-- 底部 -->
				<!-- <TheFooter/> -->
				</div>
			</CWrapper>
				
		</div>
  	</div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeders from './TheHeders'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
	TheHeders,
	TheHeader,
	TheFooter,
  },
  methods:{
	  clicktogg(){
		  if(this.$store.state.sidebarShow){
			  this.$store.commit('toggleSidebarDesktop')
		  }
	  }
  }
}
</script>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
} */
/* 左边 */
.c-sidebar.c-sidebar-fixed {
    position: fixed;
    top: 40px;
	/* bottom: 50px; */
	z-index: 1000;
}
/* 右边内容 */
.c-wrapper{
	/* margin-top: 48px; */
	padding-top: 40px;
	box-sizing: border-box;
	margin: 0;
}
.c-wrapper:not(.c-wrapper-fluid) {
	height: 100vh;
}
.c-main {
	height: 90vh;
	overflow: scroll;
	padding: 0;
	/* background-color: #1E2228; */
}
.c-main::-webkit-scrollbar{
    display: none;
}
.c-main > .container-fluid{
	padding: 0;
	height: 100%;
}


/* // 顶部 */

.c-dark-theme .c-header {
    border-bottom: 0;
}
.c-header.c-header-fixed{
	position:static;
}
.c-header {
    min-height: 40px;
    background: none;
    border-bottom:none;
    box-sizing: border-box;
}
.c-header .c-header-toggler{
    border: none !important;
}
</style>
