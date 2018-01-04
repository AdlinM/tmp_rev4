<template>
  <div class="row">
      <div class="col-md-6">
          <div id="filter-table" class="form-inline">
              <div class="form-group">
                  <input type="text" v-model="filterText" class="form-control" @keyup.enter="doFilter" placeholder="Search By Name">
              </div>
              <button type="button" @click="doFilter" class="btn btn-default">Search</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    doFilter () {
      this.$events.fire('filter-set', this.filterText)
    }
  }
}
</script>

<style lang="sass" scoped>
  #filter-table
    margin-top: 20px
</style>
