<template>
  <div v-on:keyup="keyboardEvent" v-bind:class="{ hasLogin: this.isLoggedIn, authPage: !this.isLoggedIn }" >
    <nav-bar v-if="this.isLoggedIn"/>
    <div id="wrapper" v-bind:class="{ toggled: this.isToggled }">
      <div id="page-content-wrapper">
        <header v-if="this.isLoggedIn" v-bind:class="{ slideInDown: this.showHeaderMenu, slideOutUp: !this.showHeaderMenu, hide: this.hideHeaderMenu }" class="header animated">
            <nav class="navbar navbar-static-top" role="navigation">
                <a @click="doToggled" class="navbar-btn sidebar-toggle">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </a>
                <div class="navbar-right">
                  <ul class="nav navbar-nav">						
                      <li class="dropdown user user-menu">
                          <router-link to="/logout">Logout</router-link>
                      </li>
                  </ul>
                </div>
            </nav>
        </header>
        <div v-bind:class="{ toggled: this.isToggled }" id="nav-blocker" @click="doToggled"></div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  name: 'app',
  components: {
    NavBar
  },
  data () {
    return {
      showHeaderMenu: true,
      hideHeaderMenu: false,
      openUserMenu: false,
      transitionName: null
    }
  },
  methods: {
    doToggled () {
      this.$store.dispatch('doToggled')
    },
    keyboardEvent (keyCode) {
      // if press f1
      if (keyCode === 112) {
        if (this.showHeaderMenu) {
          this.showHeaderMenu = false
          setTimeout(function () { this.hideHeaderMenu = true }.bind(this), 500)
        } else {
          this.showHeaderMenu = true
          this.hideHeaderMenu = false
        }
      }
      // if press f2
      if (keyCode === 113) {
        this.$store.dispatch('doToggled')
      }
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    isToggled () {
      return this.$store.getters.getToggled
    }
  },
  mounted: function () {
    let th_ = this
    document.addEventListener('keydown', function (event) {
      if ([112, 113].indexOf(event.keyCode) !== -1) {
        event.preventDefault()
      }
      th_.keyboardEvent(event.keyCode)
    })
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,700,700i')
// Bootstrap
$icon-font-path: '../node_modules/bootstrap-sass/assets/fonts/bootstrap/'
@import '/sass/_variables'
@import 'node_modules/bootstrap-sass/assets/stylesheets/bootstrap'
// font awesome
$fa-font-path: '../node_modules/font-awesome/fonts/'
@import 'node_modules/font-awesome/scss/font-awesome'
@import '/sass/animate'
@import '/sass/app'

</style>
