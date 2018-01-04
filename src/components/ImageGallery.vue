<template>
    <div v-if="images.length" class="vue-image-gallery">
       <h3>Images</h3>
       <div class="image-gallery">
        <a v-for="(image, $item) in images" :key="image.thumb" :href="image.src" :data-caption="image.title" >
          <img :src="image.thumb" />
        </a>
      </div>
    </div>
</template>
<script>
require('baguettebox.js/dist/baguetteBox.min.css')
const baguetteBox = require('baguettebox.js/dist/baguetteBox.min.js')
export default {
  props: ['images'],
  data () {
    return {
      items: []
    }
  },
  methods: {
    doClick (index) {
      const vueEnv = this
      window.setTimeout(() => { // simulate download
        for (index in this.images) {
          vueEnv.items.push(this.images[index])
        }
        this.$nextTick(() => {
          baguetteBox.run('.image-gallery', {
            filter: /.*/
          })
        })
      }, 1000)
    },
    runBaguetteBox () {
      window.setTimeout(() => {
        this.$nextTick(() => {
          baguetteBox.run('.image-gallery', {
            filter: /.*/
          })
        })
      }, 1000)
    }
  },
  created: function () {
    // bus.$on('loaded', this.runBaguetteBox)
  }
}
</script>
<style lang='sass'>
.vue-image-gallery
  margin: 10px 0
  a
    text-align: center
    display: inline-block
    margin: 5px
    max-width: 100px
    img
      max-width: 100px
</style>
