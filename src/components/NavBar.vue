<template>
  <div id="sidebar-wrapper" v-bind:class="{ toggled: this.isToggled }">
      <ul class="sidebar-nav">
          <li class="sidebar-brand">Mobile Operation</li>
          <li class="title">Menus</li>
          <li>
            <router-link to="/" v-on:click.native="closeOpenUserMenu">
            <span class="router-icon"><img src="../assets/images/icons/dashboard.png"/></span> Dashboard</router-link>
          </li>
          <li>
            <router-link to="/tickets" v-on:click.native="closeOpenUserMenu"><span class="router-icon"><img src="../assets/images/icons/ticket.png"/></span> Tickets</router-link>
          </li>
          <li>
              <router-link to="/tracking" v-on:click.native="closeOpenUserMenu"><span class="router-icon"><img src="../assets/images/icons/tracking.png"/></span> Tracking</router-link>
          </li>
      </ul>
  </div>
</template>


<script>
export default {
  beforeCreate () {
    // if (!this.$store.getters.isLoggedIn) {
      // this.$router.go('Login')
    // }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    closeOpenUserMenu () {
      this.$store.dispatch('doToggled')
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    isToggled () {
      return this.$store.getters.getToggled
    }
  }
}
</script>

<style lang="sass" scoped>
#sidebar-wrapper
  z-index: 1000
  position: fixed
  left: 250px
  width: 0
  top: 0
  height: 100%
  margin-left: -250px
  overflow-y: auto
  background: #2D3349
  -webkit-transition: all 0.5s ease
  -moz-transition: all 0.5s ease
  -o-transition: all 0.5s ease
  transition: all 0.5s ease
  &.toggled
    width: 250px
  &>.sidebar-nav
    position: absolute
    top: 0
    width: 250px
    margin: 0
    padding: 0
    list-style: none
    background: #2D3349
    li
      text-indent: 20px
      line-height: 40px
      border-bottom: 1px solid #292f43
      text-transform: uppercase
      font-weight: 600
      &.sidebar-brand
        cursor: default
        background: #272c40
        text-shadow: 1px 2px rgba(0,0,0,.2)
        border-bottom: 1px solid #292f43
        font-size: 24px
        text-align: left
        font-size: 18px
        color: #fff !important
        line-height: 60px
      &.title
        font-size: 11px
        color: #C5D1CD
        text-shadow: 1px 2px rgba(0,0,0,.2)
      &.logout
        margin-top: 20px
      a
        text-transform: uppercase
        font-size: 16px
        display: block
        text-decoration: none
        font-size: 13px
        font-weight: 600
        text-shadow: 1px 2px rgba(0,0,0,.2)
        width: 100%
        line-height: 30px
        padding: 10px 0
        transition: all .1s linear
        position: relative
        white-space: nowrap
        background: #2D3349
        color: #C5D1CD
        &.router-link-exact-active
          background: #272c40
        &:hover
          color: #FFF
          background: #272c40
      &:hover
        text-decoration: none
      &:active, &:focus
        text-decoration: none
    .router-icon
      margin-right: 3px
      img
        max-width: 15px  
@media (min-width:768px)
  
</style>
