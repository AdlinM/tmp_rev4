<template>
    <form class="app-login-box animated zoomIn" method="POST" v-on:submit.prevent="onSubmit">
        <div class="app-login-logo">
          <img src="../../assets/images/logo_150x150.png" class="img-logo img-responsive center-block" />
        </div>
        <div class="app-login-box-title">
          <div class="title">Forgot Password</div>
          <div v-if="successMsg === null" class="subtitle">Please insert your company & Email Address</div>
        </div>
        <div class="app-login-box-container">
          <div v-if="errorMsg !== null" class="alert alert-danger" v-html="errorMsg"></div>
          <div v-if="successMsg !== null" class="alert alert-success" v-html="successMsg"></div>
          <div v-if="successMsg === null" class="form-group" v-bind:class="user.account.error !== null ? 'has-error':''">
              <input type="text" class="form-control" id="account" v-model="user.account.value" placeholder="Company" autofocus>
              <p v-if="user.account.error !== null" class="error">{{user.account.error}}</p>
          </div>
          <div v-if="successMsg === null" class="form-group" v-bind:class="user.emailAddress.error !== null ? 'has-error':''">
              <input type="text" class="form-control" id="emailAddress" v-model="user.emailAddress.value" placeholder="Email Address" >
              <p v-if="user.emailAddress.error !== null" class="error">{{user.emailAddress.error}}</p>
          </div>
          <button v-if="successMsg === null" type="submit" class="btn btn-info pull-right" :disabled="isLoading"><i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i> Reset Password</button>
          <router-link to="/login">Back To Login</router-link>
          <div class="clearfix"></div>
        </div>
    </form>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      errorMsg: null,
      successMsg: null,
      isLoading: false,
      user: {
        account: {
          rule: 'any',
          value: null,
          error: null
        },
        emailAddress: {
          rule: 'email',
          value: null,
          error: null
        }
      }
    }
  },
  methods: {
    onSubmit () {
      this.isLoading = true
      this.errorMsg = null
      let hasError = false
      for (let i = 0; i < Object.keys(this.user).length; i++) {
        if (this.user[Object.keys(this.user)[i]].value === null || this.user[Object.keys(this.user)[i]].value === '') {
          this.user[Object.keys(this.user)[i]].error = 'This field is required.'
          hasError = true
        } else if (this.user[Object.keys(this.user)[i]].rule === 'integer' && !parseInt(this.user[Object.keys(this.user)[i]].value, 10)) {
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
      axios.post(window.AppConfig.baseApiUrl + 'api/resetpassword/email', {
        emailAddress: this.user.emailAddress.value,
        account: this.user.account.value
      })
      .then(response => {
        this.isLoading = false
        this.successMsg = 'Password reset complete, Please check your email.'
      })
      .catch(error => {
        this.isLoading = false
        if (typeof error.response !== 'undefined') {
          let validationMessages = error.response.data.validation_messages
          if (Object.keys(validationMessages).length) {
            let errorMessages = '<ul>'
            for (let i = 0; i < Object.keys(validationMessages).length; i++) {
              errorMessages = errorMessages + '<li>' + validationMessages[Object.keys(validationMessages)[i]] + '</li>'
            }
            errorMessages = errorMessages + '</ul>'
            this.errorMsg = errorMessages
          }
        } else {
          this.errorMsg = 'something wrong, cannot send request'
        }
      })
    }
  }
}

</script>

<style lang="sass" scoped>
@import '../../sass/auth'
</style>