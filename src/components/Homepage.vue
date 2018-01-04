<template>
  <div class="container-fluid">
    <div class="block">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">Dashboard</li>
      </ol>
      <div id="dasboard" class="row">
        <div class="col-md-4">
          <h3 class="text-center">Pie Chart</h3>
          <pie :labels="['January', 'February', 'March', 'April', 'May', 'June']" :datas="[40, 20, 12, 39, 10, 40]"/>
        </div>
        <div class="col-md-4">
          <h3 class="text-center">Pie Chart</h3>
          <pie :labels="['January', 'February', 'March', 'April', 'May', 'June']" :datas="[40, 20, 12, 39, 10, 40]"/>
        </div>
        <div class="col-md-4">
          <h3 class="text-center">Pie Chart</h3>
          <pie :labels="['January', 'February', 'March', 'April', 'May', 'June']" :datas="[40, 20, 12, 39, 10, 40]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/charts/Pie'
export default {
  components: {
    Pie
  },
  data () {
    return {
      msg: 'this is homepage'
    }
  }
}
</script>

<style lang="sass" scoped>
  #dasboard
    margin-top: 20px
  h3
    margin-top: 0
</style>
