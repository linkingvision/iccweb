<template>
<div>
</div>
</template>

<script>
// import * as types from '@/store/types'
export default {
    name: 'logout',
    mounted() {
        console.log("logout");
        // this.$store.commit(types.LOGOUT);
        sessionStorage.removeItem('mcutoken')
        this.$store.state.token = null
        sessionStorage.removeItem('mcuuser')
        this.$store.state.user = null
        sessionStorage.removeItem('mcuroot')
        this.$store.state.root = null
        this.$router.push({
            path: 'login'
        })
        
        // location.reload();
    }
}
</script>

