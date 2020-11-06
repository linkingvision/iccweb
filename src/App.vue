<template>
  <router-view></router-view>
</template>

<script>
export default {
	name: 'App',
	data(){
		return {
		}
	},
	
}
</script>
<style>
/* 通用svg图标 */
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/* 下拉 */

.el-select{
  width: 100%!important;
}
</style>
<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
  // 表格
	.c-app {
		background-color: #F7F7F7;
	}
  	.dasboard_global{
		width: 100%;
		height: 100%;
		min-width: 993px;
		// min-height: 900px;
		box-sizing: border-box;
	}
	.particip_buttom{
		width: 100%;
		display: flex;
		justify-content: space-around;
		text-align: center;
		.part_buttom_but1{
			padding: 5px 30px;
			border: 1px solid #3277FF;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:600;
			color:#3277FF;
		}
		.part_buttom_but{
			padding: 5px 30px;
			background:#3277FF;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
		}
	}
	.button_edi{
		margin-bottom: 10px;
		.form_butt{
		background:rgba(50,119,255,1);
		border-radius:2px;
		padding: 2px 16px;
		font-size:12px;
		font-family:PingFang SC;
		font-weight:600;
		color:rgba(255,255,255,1);
		margin-right: 20px;
		border-color: none;
		}
		.form_butt1{
			background:rgba(55,62,72,1);
			border:1px solid rgba(50,119,255,1);
			padding: 2px 16px;
			font-size:12px;
			font-family:PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			box-sizing: border-box;
		}
		
	}
	.button_table{
		.form_butt{
			background:rgba(50,119,255,1);
			border-radius:2px;
			padding: 5px 16px;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			margin-right: 20px;
			border-color: none;
		}
		.form_butt1{
			background:rgba(55,62,72,1);
			border:1px solid rgba(50,119,255,1);
			padding: 5px 16px;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			box-sizing: border-box;
		}
	}
</style>
