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
        localStorage.removeItem('mcutoken')
        this.$store.state.token = null
        localStorage.removeItem('mcuuser')
        this.$store.state.user = null
        localStorage.removeItem('mcuroot')
        this.$store.state.root = null
        this.$router.push({
            path: 'login'
        })
        
        // location.reload();
    }
}
</script>

