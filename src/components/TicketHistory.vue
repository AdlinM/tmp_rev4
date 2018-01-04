<template>
    <div>
       <h3>Histories</h3>
        <v-server-table id="list-table" :url="apiUrl" :columns="columns" :options="options" ref="ticketHistoryTable">
          <template slot="statusText" slot-scope="props">
            <div v-bind:class="statusClass(props.row.ticketStatus)">{{props.row.ticketStatus}}</div>
          </template>
        </v-server-table>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import {ServerTable} from 'vue-tables-2'

Vue.use(ServerTable)
export default {
  props: ['uiid'],
  data () {
    return {
      apiUrl: window.AppConfig.apiUrl + 'tickethistory',
      columns: ['statusText', 'createdAt', 'changedBy', 'changedTo'],
      options: {
        headings: {
          statusText: 'Status',
          createdAt: 'Date Time',
          changedBy: 'Changed By',
          changedTo: 'Changed To'
        },
        sortable: [],
        perPageValues: [],
        filterable: false,
        params: {
          limit: null,
          ticket_uuid: this.uiid
        },
        requestFunction: function (data) {
          return axios.get(window.AppConfig.apiUrl + 'tickethistory', { params: data })
        },
        responseAdapter: function (resp) {
          return {
            data: resp.data._embedded.history,
            count: resp.data.total_items
          }
        },
        templates: {
          changedTo (h, row) {
            return row.changedTo !== null ? row.changedTo : '-'
          },
          createdAt (h, row) {
            return row.createdAt !== null ? moment(row.createdAt).format('YYYY-MM-DD, h:mm:ss A') : '-'
          }
        }
      }
    }
  },
  methods: {
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
    }
  }
}
</script>
<style lang='sass'>
  h3
    font-size: 20px
  #text-label
    margin-bottom: 0
  #list-table
    table
      margin-top: 0
</style>
