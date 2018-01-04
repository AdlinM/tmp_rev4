<template>
  <div class="container-fluid">
    <div class="block">
      <div id="ticket-detail">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Dashboard</router-link></li>
          <li class="breadcrumb-item"><router-link to="/tickets">Ticket List</router-link></li>
          <li class="breadcrumb-item active">Ticket Detail #{{ ticket.ticketId }}</li>
        </ol>
        <div class="row detail-ticket">
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Ticket Id</div> <div class="col-md-10">{{ ticket.ticketId }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Created On</div> <div class="col-md-10">{{ ticket.createdOn }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Customer</div> <div class="col-md-10">{{ ticket.customerName }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Code</div> <div class="col-md-10">{{ ticket.ticketCode }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Problem</div> <div class="col-md-10">{{ ticket.problem }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Status</div> <div class="col-md-10"><span v-bind:class="statusClass(ticket.ticketStatus)">{{ticket.ticketStatus}}</span></div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Location Id</div> <div class="col-md-10">{{ ticket.customerLocationId }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Devices</div> <div class="col-md-10">{{ ticket.devices }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Address</div> <div class="col-md-10">{{ ticket.customerAddress }}</div>
          </div>
          <div class="col-md-12 row div-group">
            <div class="col-md-2 text-label">Phone</div> <div class="col-md-10">{{ ticket.customerPhone }}</div>
          </div>
        </div>
        <ticket-history :uiid="$route.params.id"/>
        <div class="clearfix"></div>
        <ticket-log :uiid="$route.params.id"/>
        <image-gallery ref="ticketImageDiv" :images="ticket.images"/>
        <div v-if="ticket.marker !== null" class="map-container">
          <h3>Location</h3>
          <Gmap-Map ref="ticketLocation" style="width: 100%; height: 600px;" :zoom="15" :center="ticket.marker.position">
            <Gmap-Marker :position="ticket.marker.position" @click="showInfoWindow(ticket.marker, ticket.marker.id)" :key="ticket.marker.id" icon="/static/markers/user-icon.png"></Gmap-Marker>
            <gmap-info-window :options="infoWindow.options" :position="infoWindow.position" :opened="infoWindow.IsOpen" @closeclick="infoWindow.IsOpen=false" ><div v-html="infoWindow.content"></div></gmap-info-window>
          </Gmap-Map>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
require('@/bootstrap')
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'
import TicketHistory from '@/components/TicketHistory'
import TicketLog from '@/components/TicketLog'
import ImageGallery from '@/components/ImageGallery'
Vue.use(VueGoogleMaps, {
  load: {
    key: window.AppConfig.googleApiKey,
    libraries: 'geometry,places'
  }
})
export default {
  components: {
    TicketHistory,
    TicketLog,
    ImageGallery
  },
  data () {
    return {
      ticket: {
        ticketId: null,
        createdOn: null,
        ticketCode: null,
        problem: null,
        customerName: null,
        customerLocationId: null,
        ticketStatus: null,
        devices: null,
        customerAddress: null,
        customerPhone: null,
        marker: null,
        histories: [],
        notes: [],
        images: [],
        technicianTrackingMarkers: [],
        technicianTrackingMarkerLines: [],
        technicianTrackingMarkerLineOptions: {
          geodesic: true,
          strokeColor: '#000',
          strokeOpacity: 0,
          icons: [{
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 4
            },
            offset: '0',
            repeat: '20px'
          }]
        }
      },
      infoWindow: {
        position: null,
        content: null,
        id: null,
        IsOpen: false,
        options: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        }
      }
    }
  },
  mounted () {
    this.ticketDetail()
    this.ticketImages()
    VueGoogleMaps.loaded.then(() => {
      window.setTimeout(() => { this.technicianTracking() }, 1000)
    })
  },
  methods: {
    ticketDetail () {
      axios.get(window.AppConfig.apiUrl + 'ticket/' + this.$route.params.id)
      .then(response => {
        this.ticket.ticketId = response.data.ticketId
        this.ticket.createdOn = moment(response.data.createdAt).format('MMMM Do YYYY, h:mm:ss A')
        this.ticket.ticketCode = response.data.ticketCode
        this.ticket.problem = response.data.problem
        this.ticket.devices = response.data.devices
        this.ticket.customerName = response.data.customer !== null ? response.data.customer.name : '-'
        this.ticket.customerLocationId = response.data.customer !== null ? response.data.customer.locationId : '-'
        this.ticket.customerAddress = response.data.customer !== null ? response.data.customer.address : '-'
        this.ticket.customerPhone = response.data.customer !== null ? response.data.customer.phone : '-'
        this.ticket.ticketStatus = response.data.ticketStatus
        this.ticket.marker = response.data.customer !== null && (response.data.customer.latitude !== null && response.data.customer.longitude !== null) ? {
          id: 'client',
          position: {lat: parseFloat(response.data.customer.latitude), lng: parseFloat(response.data.customer.longitude)},
          content: '<h4>' + this.ticket.customerName + '</h4>' + (this.ticket.customerAddress !== null ? '<h5 class="text-center">' + this.ticket.customerAddress + '</h5>' : '')
        } : null
      })
      .catch(error => {
        if (typeof error.response !== 'undefined') {
          alert(error.response.data.validation_messages.uuid)
        } else {
          alert('something wrong, cannot close ticket')
        }
      })
    },
    GetPointAtDistance (metres, i) {
      if (metres === 0) return this.ticket.technicianTrackingMarkerLines.getPath().getAt(0)
      if (metres < 0) return null
      if (this.ticket.technicianTrackingMarkerLines.getPath().getLength() < 2) return null
      var dist = 0
      var olddist = 0
      // for (var i = 1; (i < this.ticket.technicianTrackingMarkerLines.getPath().getLength() && dist < metres); i++) {
      olddist = dist
      dist += google.maps.geometry.spherical.computeDistanceBetween( // eslint-disable-line
        this.ticket.technicianTrackingMarkerLines.getPath().getAt(i), // eslint-disable-line
        this.ticket.technicianTrackingMarkerLines.getPath().getAt(i - 1) // eslint-disable-line
      ) // eslint-disable-line
      // }
      if (dist < metres) {
        return null
      }
      var p1 = this.ticket.technicianTrackingMarkerLines.getPath().getAt(i - 2)
      var p2 = this.ticket.technicianTrackingMarkerLines.getPath().getAt(i - 1)
      var m = (metres - olddist) / (dist - olddist)
      return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m) // eslint-disable-line
    },
    markerOptions (marker, marker2) {
      // console.log(this.ticket.technicianTrackingMarkerLines.getPath().getAt(0).lng())
      return {
        path: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
        // path: 'M4 347 c-2 -7 -3 -58 -2 -113 3 -92 5 -100 26 -109 13 -6 22 -19 22, -31 0 -24 29 -54 52 -54 21 0 48 33 48 58 0 20 5 22 65 22 l65 0 0 -30 c0 -38, 31 -57 66 -41 18 8 24 19 24 41 0 20 5 30 15 30 24 0 18 64 -10 120 -24 47, -27 50 -65 50 -39 0 -40 1 -40 35 l0 35 -130 0 c-99 0 -132 -3 -136 -13z',
        scale: 0.7,
        strokeColor: 'white',
        strokeWeight: 0.10,
        fillOpacity: 1,
        fillColor: '#404040',
        offset: '5%',
        rotation: google.maps.geometry.spherical.computeHeading(marker.getPosition(), marker2.getPosition()), // eslint-disable-line
        anchor: new google.maps.Point(10, 25) // eslint-disable-line
      }
    },
    technicianTracking () {
      axios.get(window.AppConfig.apiUrl + 'tracking?ticket_uuid=' + this.$route.params.id)
      .then(response => {
        const trackings = response.data._embedded.tracking
        // const trackingLength = Object.keys(trackings).length
        let locations = []
        for (let i = 0; i < Object.keys(trackings).length; i++) {
          locations.push({lat: parseFloat(trackings[i].latitude), lng: parseFloat(trackings[i].longitude)})
        }
        this.ticket.technicianTrackingMarkerLines = new google.maps.Polyline({ // eslint-disable-line
          path: locations,
          geodesic: true,
          strokeColor: '#000',
          strokeOpacity: 1,
          strokeWeight: 2
        })
        this.ticket.technicianTrackingMarkerLines.setMap(this.$refs.ticketLocation.$mapObject)
        let th_ = this
        for (let i = 0; i < Object.keys(trackings).length; i++) {
          this.ticket.technicianTrackingMarkers[i] = new google.maps.Marker({position: {lat: parseFloat(trackings[i].latitude), lng: parseFloat(trackings[i].longitude)}, map: this.$refs.ticketLocation.$mapObject, icon: '/static/markers/technician-icon.png'}) // eslint-disable-line
        }
        for (let i = 0; i < Object.keys(trackings).length; i++) {
          if (i < Object.keys(trackings).length - 1) {
            this.ticket.technicianTrackingMarkers[i].setIcon(this.markerOptions(this.ticket.technicianTrackingMarkers[i], this.ticket.technicianTrackingMarkers[i + 1]))
          } else {
            this.ticket.technicianTrackingMarkers[i].addListener('click', function () {
              th_.showInfoWindow(
                {id: 'technicianTrackingMarkers_' + i, position: {lat: parseFloat(trackings[i].latitude), lng: parseFloat(trackings[i].longitude)}, content: i ? 'Technician Position' : 'Technician End Position'}, 'technicianTrackingMarkers_' + i
              )
            })
          }
        }
      })
      .catch(error => {
        console.log(error)
        if (typeof error.response !== 'undefined') {
          alert(error.response.data.detail)
        } else {
          alert('something wrong, cannot get technician tracking data')
        }
      })
    },
    ticketImages () {
      axios.get(window.AppConfig.apiUrl + 'ticketfile?ticket_uuid=' + this.$route.params.id)
      .then(response => {
        const ticketFiles = response.data._embedded.file
        for (let i = 0; i < Object.keys(ticketFiles).length; i++) {
          this.ticket.images.push({
            thumb: ticketFiles[i].thumbnailPath,
            src: ticketFiles[i].originalPath,
            title: ticketFiles[i].note
          })
        }
        if (Object.keys(ticketFiles).length) {
          return this.$refs.ticketImageDiv.runBaguetteBox()
        }
      })
      .catch(error => {
        console.log(error)
        if (typeof error.response !== 'undefined') {
          alert(error.response.data.detail)
        } else {
          alert('something wrong, cannot get ticket image data')
        }
      })
    },
    setDescription (description) {
      this.description = description
    },
    showInfoWindow (marker, id) {
      this.infoWindow.position = {lat: marker.position.lat, lng: marker.position.lng}
      this.infoWindow.content = marker.content
      if (this.infoWindow.id === id) {
        if (this.infoWindow.IsOpen) {
          this.infoWindow.IsOpen = false
        } else {
          this.infoWindow.IsOpen = true
        }
        this.infoWindow.id = marker.id
      } else {
        this.infoWindow.IsOpen = true
        this.infoWindow.id = marker.id
      }
    },
    updateiwOpen () {
      this.infoWindow.IsOpen = false
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
    }
  }
}
</script>

<style lang="sass" scoped>
  .detail-ticket
    .text-label
      font-weight: bold
    .div-group
      padding-bottom: 10px
</style>
