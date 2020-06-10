<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
/* 时间 */
.el-picker-panel{
    background-color: #1E2228 !important;
    border:none !important;
    color: #FFFFFF !important;
}
.el-picker-panel__footer{
  background-color: #1E2228 !important;
  border:none !important;
}
.el-picker-panel__footer .is-plain{
  background-color: #3277FF;
  border: none;
  color: #FFFFFF;
}
/* 表格 */
.el-table {
    background-color: #1E2228 !important;
}
.el-table th, .el-table tr{
    background-color: #1E2228 !important;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
	background: #3D4146 !important;
}
.el-table__body tr:hover>td {
  background:none!important;
}
.el-table__body tr.hover-row>td{
  background-color: #3D4146!important;
}

.el-table td, .el-table th.is-leaf {
	  color:rgba(255,255,255,1);
    border: none!important;
}
.el-checkbox__inner{
  background-color: #494B4E !important;
  border-radius: 50px !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #3277FF !important;
  border-color: rgba(255,255,255,1) !important;
}

/* 分页 */
.el-pagination li{
  background: none!important;
  color: #FFFFFF;
}
.el-pagination button{
  background: none!important;
  color: #FFFFFF!important;
}

/* 下拉 */
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
    background: #2E343C  !important;
    color: #3277FF !important;
}
.el-select{
  width: 100%!important;
}
.el-input__inner{
  background: none!important;
  color:rgba(255,255,255,1)!important;
}
.el-select-dropdown{
  background: #2E343C !important;
  border: 1px solid #B5B5B5 !important;
}
.el-select-dropdown__item{
  color:rgba(255,255,255,1)!important;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
  background-color: #4F5255!important;
}

.dasboard_global{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}
</style>
<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
  
  .breadcrumb-item.active{
      color: #55C3EB;
  }
  .c-sidebar-nav-link, .c-sidebar-nav-dropdown-toggle{
        padding: 0.8445rem 4rem !important;
  }
  .c-dark-theme .c-sidebar .c-sidebar-nav-link.c-active, .c-dark-theme .c-sidebar .c-active.c-sidebar-nav-dropdown-toggle {
    color: #fff;
    background:#4F5255;
  }
</style>
