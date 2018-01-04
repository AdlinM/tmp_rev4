<template>
    <div class="container-fluid">
        <div class="block">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Dashboard</router-link></li>
            <li class="breadcrumb-item active">Ticket List</li>
          </ol>
          <div id="list-table-form" class="row">
            <div class="col-md-6 col-sm-6">
                <div id="filter-table" class="form-inline">
                    <div class="form-group">
                       <date-picker v-model="filterByDateTime" range lang="en" width="212" :not-after="filterByDateTimeNotAfter" placeholder="Date Time Period"></date-picker>
                    </div>
                    <div class="form-group">
                        <input type="text" id="filterByTicketCode" v-model="filterByTicketCode" class="form-control input-sm" placeholder="Ticket Code">
                    </div>
                    <div class="form-group">
                        <select id="filterByStatus" v-model="filterByStatus" class="form-control input-sm">
                          <option value="" selected >All Status</option>
                          <option value="open">Open</option>
                          <option value="in progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-sm btn-info" @click="doFilter">Search</button>
                </div>
            </div>
            <div class="col-md-6 col-sm-6">
              <router-link class="btn btn-sm btn-info pull-right" to="/tickets/create"><i class="fa fa-plus-circle" aria-hidden="true"></i> Add Ticket</router-link>
            </div>
        </div>
        <p v-if="totalAllRecord" class="pull-right">Total: {{totalAllRecord}} records</p>
          <v-server-table id="list-table" :url="apiUrl" :columns="columns" :options="options" @loaded="onTableLoaded" ref="ticketTable">
            <template slot="statusText" slot-scope="props">
              <div v-bind:class="statusClass(props.row.ticketStatus)">{{props.row.ticketStatus}}</div>
            </template>
            <template slot="actionButtons" slot-scope="props">
              <div class="action-buttons ">
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <router-link class="btn btn-action btn-sm btn-transparent text-center show-button" v-bind:to="'/tickets/' + props.row.uuid" title="Show Detail Ticket"><i class="fa fa-folder-open"/></router-link>
                </div>
                <div v-if="props.row.ticketStatus !== 'Closed'" class="col-md-6 col-sm-6 col-xs-6">
                 <button type="button" @click="closeTicket(props.row)" class="btn btn-action btn-sm btn-transparent text-center delete-button" href="#" title="Close Ticket"><i class="fa fa-times-circle"/></button>
                </div>
              </div>
            </template>
          </v-server-table>
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import {ServerTable} from 'vue-tables-2'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'

Vue.use(ServerTable)
export default {
  components: {
    DatePicker
  },
  data () {
    return {
      totalAllRecord: 0,
      filterByTicketCode: null,
      filterByStatus: '',
      filterByDateTime: null,
      filterByDateTimeNotAfter: moment().format('YYYY-MM-DD'),
      /* filterByDateTime: {
        text: 'Today',
        startPeriod: null,
        endPeriod: null
      }, */
      apiUrl: window.AppConfig.apiUrl + 'ticket',
      columns: ['ticketId', 'ticketCode', 'problem', 'customerName', 'customerLocationId', 'statusText', 'createdAt', 'actionButtons'],
      options: {
        perPage: 25,
        headings: {
          ticketId: 'Ticket ID',
          ticketCode: 'Code',
          problem: 'Problem',
          customerName: 'Customer Name',
          customerLocationId: 'Location Id',
          statusText: 'Status',
          createdAt: 'Date Time',
          actionButtons: ''
        },
        // orderBy: {column: false},
        // sortable: ['ticketId', 'ticketCode', 'problem', 'customerName', 'customerLocationId', 'statusText'],
        sortable: [],
        perPageValues: [],
        filterable: false,
        // filterByColumn: true,
        // filterable: ['ticketId', 'account'],
        params: {
          limit: 25,
          status: null,
          code: null,
          start_date: null,
          end_date: null
        },
        requestFunction: function (data) {
          return axios.get(window.AppConfig.apiUrl + 'ticket', { params: data })
        },
        responseAdapter: function (resp) {
          return {
            data: resp.data._embedded.ticket,
            count: resp.data.total_items
          }
        },
        templates: {
          customerName (h, row) {
            return row.customer !== null ? row.customer.name : '-'
          },
          customerLocationId (h, row) {
            return row.customer !== null ? row.customer.locationId : '-'
          },
          createdAt (h, row) {
            return row.createdAt !== null ? moment(row.createdAt).format('YYYY-MM-DD, h:mm:ss A') : '-'
          }
        },
        requestKeys: {
          // limit: 20
        }
      }
    }
  },
  mounted () {
    let t_ = this
    let rfr = setInterval(function () {
      if (t_.$route.path === '/tickets') {
        return t_.refreshData()
      } else {
        clearInterval(rfr)
      }
    }, window.AppConfig.IntervalRefreshData)
  },
  methods: {
    onTableLoaded () {
      this.totalAllRecord = this.$refs.ticketTable.count
    },
    doFilter () {
      if (this.filterByDateTime !== null && this.filterByDateTime !== '') {
        this.options.params.start_date = moment(this.filterByDateTime[0]).format('YYYY-MM-DD')
        this.options.params.end_date = moment(this.filterByDateTime[1]).format('YYYY-MM-DD')
      } else {
        this.options.params.start_date = null
        this.options.params.end_date = null
      }
      this.options.params.code = this.filterByTicketCode === '' ? null : this.filterByTicketCode
      this.options.params.status = this.filterByStatus === '' ? null : this.filterByStatus
      this.$refs.ticketTable.refresh()
    },
    refreshData () {
      this.options.params.code = null
      this.filterByTicketCode = null
      this.options.params.status = null
      this.filterByStatus = null
      this.filterByDateTime = null
      this.options.params.start_date = null
      this.options.params.end_date = null
      if (typeof this.$refs.ticketTable !== 'undefined') {
        this.$refs.ticketTable.refresh()
      }
    },
    statusClass (statusText) {
      if (statusText === 'Open') {
        return 'status-text open'
      } else if (statusText === 'Closed') {
        return 'status-text closed'
      } else if (statusText === 'In Progress') {
        return 'status-text in-progress'
      } else {
        return 'status-text resolved'
      }
    },
    closeTicket (row) {
      let r = confirm('Are You Sure To Close Ticket:' + row.ticketId + '?')
      if (r) {
        return axios.post(window.AppConfig.apiUrl + 'tickets.close', {
          uuid: row.uuid
        })
        .then(response => {
          row.ticketStatus = 'Closed'
        })
        .catch(error => {
          if (typeof error.response !== 'undefined') {
            alert(error.response.data.validation_messages.uuid)
          } else {
            alert('something wrong, cannot close ticket')
          }
        })
      }
    }
  }
}
</script>

<style lang='sass' scoped>
  .action-buttons
    text-align: center
  #filter-table
    #filterByTicketCode
      width: 134px
    #filterByStatus
      width: 123px
</style>
