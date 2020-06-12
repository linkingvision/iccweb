<template>
  <CFooter :fixed="true">
    <div class="footer_bottom">
      <!-- <a href="https://coreui.io" target="_blank">CoreUI</a> -->
      <span class="ml-1 ">&copy; {{new Date().getFullYear()}} linkingvision.com</span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
<style lang="scss">
.footer_bottom{
  width: 100%;
  text-align: center;
}
</style>
