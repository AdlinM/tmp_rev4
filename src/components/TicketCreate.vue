<template>
  <div class="container-fluid">
    <div class="block">
      <div id="ticket-detail">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Dashboard</router-link></li>
          <li class="breadcrumb-item"><router-link to="/tickets">Ticket List</router-link></li>
          <li class="breadcrumb-item active">Create Ticket</li>
        </ol>
        <form v-on:submit.prevent="store">
          <div v-if="errorMsg !== null" class="alert alert-danger" v-html="errorMsg"></div>
          <div class="form-group input-typeahead" v-bind:class="ticket.ticketId.error !== null ? 'has-error':''">
            <div v-show="ticket.ticketId.value === null">
              <i class="fa fa-spinner fa-spin" v-if="loading"></i>
              <input type="text" class="form-control " placeholder="Ticket Id" autocomplete="off" v-model="query" @keydown.down="down" @keydown.up="up" @keydown.enter="hit" @keydown.esc="reset" @blur="reset" @input="update" autofocus>
              <ul v-show="hasItems">
                <li v-for="(item, $item) in items" :key="item.ticketId" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                  <span v-text="item.ticketId"></span>
                </li>
              </ul>
            </div>
            <i v-show="ticket.ticketId.value !== null" class="fa fa-times reset" @click="resetTypeahead"></i>
            <input v-show="ticket.ticketId.value !== null" type="text" class="form-control typeahead-value" v-model="ticket.ticketId.label" readonly>
              <p v-if="ticket.ticketId.error !== null" class="error">{{ticket.ticketId.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.customerExchangeId.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.customerExchangeId.value" placeholder="Customer Exchange Id" >
              <p v-if="ticket.customerExchangeId.error !== null" class="error">{{ticket.customerExchangeId.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.exchangeId.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.exchangeId.value" placeholder="Exchange Id">
              <p v-if="ticket.exchangeId.error !== null" class="error">{{ticket.exchangeId.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.ticketCode.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.ticketCode.value" placeholder="Code">
              <p v-if="ticket.ticketCode.error !== null" class="error">{{ticket.ticketCode.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.devices.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.devices.value" placeholder="Devices">
              <p v-if="ticket.devices.error !== null" class="error">{{ticket.devices.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.problem.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.problem.value" placeholder="Problem">
              <p v-if="ticket.problem.error !== null" class="error">{{ticket.problem.error}}</p>
          </div>
          <div class="form-group" v-bind:class="ticket.ticketCreatedTime.error !== null ? 'has-error':''">
              <input type="text" class="form-control" v-model="ticket.ticketCreatedTime.value" placeholder="Created Time">
              <p v-if="ticket.ticketCreatedTime.error !== null" class="error">{{ticket.ticketCreatedTime.error}}</p>
          </div>
          <button type="submit" class="btn btn-info" :disabled="isLoading"><i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i> Add</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueTypeahead from 'vue-typeahead'

Vue.prototype.$http = axios

export default {
  extends: VueTypeahead,
  data () {
    return {
      errorMsg: null,
      isLoading: false,
      ticket: {
        ticketId: {
          rule: 'any',
          value: null,
          label: null,
          error: null
        },
        customerExchangeId: {
          rule: 'any',
          value: null,
          error: null
        },
        exchangeId: {
          rule: 'any',
          value: null,
          error: null
        },
        ticketCode: {
          rule: 'any',
          value: null,
          error: null
        },
        devices: {
          rule: 'any',
          value: null,
          error: null
        },
        problem: {
          rule: 'any',
          value: null,
          error: null
        },
        ticketStatus: {
          rule: 'any',
          value: 'Open',
          error: null
        },
        ticketCreatedTime: {
          rule: 'datetime',
          value: null,
          error: null
        }
      },
      src: window.AppConfig.apiUrl + 'ticket',
      data: {},
      limit: 5,
      minChars: 1,
      selectFirst: false,
      queryParamName: 'cari'
    }
  },
  methods: {
    onHit (item) {
      this.ticket.ticketId.value = item.ticketId
      this.ticket.ticketId.label = item.ticketId
    },
    resetTypeahead () {
      this.ticket.ticketId.value = null
      this.ticket.ticketId.label = null
    },
    prepareResponseData (data) {
      return data._embedded.ticket
    },
    store () {
      this.isLoading = true
      this.errorMsg = null
      let hasError = false
      for (let i = 0; i < Object.keys(this.ticket).length; i++) {
        if (this.ticket[Object.keys(this.ticket)[i]].value === null || this.ticket[Object.keys(this.ticket)[i]].value === '') {
          this.ticket[Object.keys(this.ticket)[i]].error = 'This field is required.'
          hasError = true
        } else if (this.ticket[Object.keys(this.ticket)[i]].rule === 'integer' && !parseInt(this.ticket[Object.keys(this.ticket)[i]].value, 10)) {
          this.ticket[Object.keys(this.ticket)[i]].error = 'This field must be integer date.'
          hasError = true
        } else {
          this.ticket[Object.keys(this.ticket)[i]].error = null
        }
      }
      if (hasError) {
        this.isLoading = false
        return false
      }
      axios.post(window.AppConfig.apiUrl + 'ticket', this.ticket)
      .then(response => {
        this.isLoading = false
        console.log(response)
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
          this.errorMsg = 'something wrong, cannot add ticket'
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .input-typeahead
    .fa-spin
      right: 15px
      padding: 15px 15px
      position: absolute
    .reset
      position: absolute
      margin-top: 9px
      font-size: 23px
      margin-left: 10px
      cursor: pointer
    .typeahead-value
      padding-left: 35px
    ul
      list-style: none
      padding: 0
      color: #000
      background: rgb(237, 239, 240)
      position: absolute
      min-width: 200px
      li
        padding: 10px
        border-bottom: 1px solid rgba(0, 0, 0, 0.06)
        &.active
          background: #272c40
          color: #fff
</style>
