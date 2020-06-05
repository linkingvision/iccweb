<template>
	<div style="height: 100%;">
		<div class="a">
			<div>Dashboard</div>
			<router-link :to="{name:'Login'}">line</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Dashboard',
	data(){
		return{
		}
	},
	methods:{
		
	},
	mounted(){
	},
	created(){
	}
}
</script>
<style scoped>
.a{
	width: 100%;
	display: flex;

	justify-content: space-between;
}
</style>