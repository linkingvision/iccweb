<template>
	<CHeader with-subheader>
		<!-- 导航栏 -->
		<CSubheader class="px-3">
			{{this.$route.matched[1].meta.name}}
		</CSubheader>
	</CHeader>
</template>

<script>

export default {
  name: 'TheHeader',
  mounted(){
	  console.log(this.$route)
  }
}
</script>
<style scoped>
.c-header{
	min-height: 46px;
}
.c-app .c-subheader{
	background: #F2F2F2;
	height: 45px;
	min-height: 40px;
	line-height: 45px;
	color: #000000;
	font-size: 16px;
	font-weight: 600;
}
.c-dark-theme .c-subheader {
	background: #4A4A4E;
	height: 45px;
	min-height: 40px;
	line-height: 45px;
	font-size: 16px;
	font-weight: 600;
	color: #FFFFFF;
    /* border-bottom: 1px solid #5B5F63; */
}
.c-dark-theme .c-header {
    background: #2c2c34;
    border-bottom: 0;
}
.breadcrumb{
	margin: 0;
	border: 0;
}
.dao_dian{
	text-align: center;
	line-height: 25px;
	font-size: 30px;
	color: #55C3EB;
}
</style>
