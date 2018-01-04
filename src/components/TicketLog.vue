<template>
    <div>
       <h3>Notes</h3>
        <v-server-table id="list-table" :url="apiUrl" :columns="columns" :options="options" ref="ticketHistoryTable"></v-server-table>
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
      apiUrl: window.AppConfig.apiUrl + 'ticketlog',
      columns: ['createdAt', 'createdBy', 'message'],
      options: {
        headings: {
          createdAt: 'Date Time',
          createdBy: 'Created By',
          message: 'Message'
        },
        sortable: [],
        perPageValues: [],
        filterable: false,
        params: {
          limit: null,
          ticket_uuid: this.uiid
        },
        requestFunction: function (data) {
          return axios.get(window.AppConfig.apiUrl + 'ticketlog', { params: data })
        },
        responseAdapter: function (resp) {
          return {
            data: resp.data._embedded.log,
            count: resp.data.total_items
          }
        },
        templates: {
          createdAt (h, row) {
            return row.createdAt !== null ? moment(row.createdAt).format('YYYY-MM-DD, h:mm:ss A') : '-'
          }
        }
      }
    }
  }
}
</script>
<style lang='sass' scoped>
  h3
    font-size: 20px
  #text-label
    margin-bottom: 0
  #list-table
    table
      margin-top: 0
</style>
