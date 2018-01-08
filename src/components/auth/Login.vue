<template>
    <form class="app-login-box animated fadeIn" method="POST" v-on:submit.prevent="onSubmit" autocomplete="false">
        <div class="blue-app-login-box">
          <div class="app-login-logo">
            <img src="../../assets/images/logo.png" class="img-logo img-responsive center-block" />
          </div>
        </div>
        <div class="app-login-box-container">
          <div v-if="errorMsg !== null" class="alert alert-danger">
              {{ errorMsg }}
          </div>
          <div class="form-group" v-bind:class="user.username.error !== null ? 'has-error':''">
              <input type="text" class="form-control" id="username" v-model="user.username.value" placeholder="Username" >
              <p v-if="user.username.error !== null" class="error">{{user.username.error}}</p>
          </div>
          <div class="form-group" v-bind:class="user.password.error !== null ? 'has-error':''">
              <input type="password" class="form-control" id="pwd" v-model="user.password.value" placeholder="Password">
              <p v-if="user.password.error !== null" class="error">{{user.password.error}}</p>
          </div>
          <button type="submit" class="btn btn-info pull-right" :disabled="isLoading"><i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i> Login</button>
          <router-link to="/forgot-password">Forgot Password?</router-link>
          <div class="clearfix"></div>
        </div>
    </form>
</template>

<script>
export default {
  data () {
    return {
      errorMsg: null,
      isLoading: false,
      user: {
        username: {
          required: true,
          rule: 'any',
          value: null,
          error: null
        },
        password: {
          required: true,
          rule: 'any',
          value: null,
          error: null
        }
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      this.errorMsg = null
      let hasError = false
      for (let i = 0; i < Object.keys(this.user).length; i++) {
        if (this.user[Object.keys(this.user)[i]].required && (this.user[Object.keys(this.user)[i]].value === null || this.user[Object.keys(this.user)[i]].value === '')) {
          this.user[Object.keys(this.user)[i]].error = 'This field is required.'
          hasError = true
        } else if ((this.user[Object.keys(this.user)[i]].value !== null || this.user[Object.keys(this.user)[i]].value !== '') && this.user[Object.keys(this.user)[i]].rule === 'integer' && !parseInt(this.user[Object.keys(this.user)[i]].value, 10)) {
          this.user[Object.keys(this.user)[i]].error = 'This field must be integer date.'
          hasError = true
        } else {
          this.user[Object.keys(this.user)[i]].error = null
        }
      }
      if (hasError) {
        this.isLoading = false
        return false
      }
      this.$store.dispatch('login', {
        username: this.user.username.value,
        password: this.user.password.value
      }).then((response) => {
        return this.$router.push('/')
      }).catch(error => {
        this.isLoading = false
        if (typeof error.response !== 'undefined') {
          this.errorMsg = error.response.data.detail
        } else {
          this.errorMsg = 'opss, something wrong'
        }
      })
    }
  }
}

</script>

<style lang="sass" scoped>
@import '../../sass/auth'
</style>