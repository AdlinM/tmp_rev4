<template>
    <form class="app-login-box animated zoomIn" method="POST" v-on:submit.prevent="onSubmit">
        <div class="app-login-logo">
          <img src="../../assets/images/logo_150x150.png" class="img-logo img-responsive center-block" />
        </div>
        <div class="app-login-box-title">
          <div class="title">Reset Password</div>
          <div class="subtitle">Please insert your new password</div>
        </div>
        <div class="app-login-box-container">
          <div v-if="errorMsg !== null" class="alert alert-danger" v-html="errorMsg"></div>
          <div v-if="successMsg !== null" class="alert alert-success" v-html="successMsg"></div>
          <div v-if="successMsg === null" class="form-group" v-bind:class="user.password.error !== null ? 'has-error':''">
              <input type="password" class="form-control" id="password" v-model="user.password.value" placeholder="New Password" autofocus>
              <p v-if="user.password.error !== null" class="error">{{user.password.error}}</p>
          </div>
          <div v-if="successMsg === null" class="form-group" v-bind:class="user.passwordConfirmation.error !== null ? 'has-error':''">
              <input type="password" class="form-control" id="passwordConfirmation" v-model="user.passwordConfirmation.value" placeholder="Confirm New Password" >
              <p v-if="user.passwordConfirmation.error !== null" class="error">{{user.passwordConfirmation.error}}</p>
          </div>
          <button v-if="successMsg === null" type="submit" class="btn btn-info pull-right" :disabled="isLoading"><i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i> Change Password</button>
          <router-link v-if="successMsg !== null" to="/login">Back To Login</router-link>
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
      resetPasswordKey: null,
      user: {
        password: {
          rule: 'any',
          value: null,
          error: null
        },
        passwordConfirmation: {
          rule: 'confirmation',
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
        } else if (this.user[Object.keys(this.user)[i]].rule === 'confirmation' && (this.user.password.value !== this.user.passwordConfirmation.value)) {
          this.user[Object.keys(this.user)[i]].error = 'Password and password confirmation do not match.'
          hasError = true
        } else {
          this.user[Object.keys(this.user)[i]].error = null
        }
      }
      if (hasError) {
        this.isLoading = false
        return false
      }
      axios.post(window.AppConfig.baseApiUrl + 'api/resetpassword/newpassword', {
        resetPasswordKey: this.$route.params.uiid,
        newPassword: this.user.password.value,
        confirmNewPassword: this.user.passwordConfirmation.value
      })
      .then(response => {
        this.isLoading = false
        this.successMsg = 'Password has been changed.'
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