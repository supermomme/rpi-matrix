<template>
  <div>
    <canvas
      ref="topCanvas"
      @mousedown="startPainting"
      @mouseup="finishedPainting"
      @mousemove="draw"
      class="canvas"
      width="1000"
      height="1000"
    ></canvas>
    <p/>
    <button @click="clear" >Clear</button>
    R:<input type="range" v-model="color[0]" min="0" max="255">
    G:<input type="range" v-model="color[1]" min="0" max="255">
    B:<input type="range" v-model="color[2]" min="0" max="255">
    A:<input type="range" v-model="color[3]" min="0" max="1" step="0.01">
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    painting: false,
    canvas: null,
    pixelCanvas: null,
    currentCanvas: null,
    color: [255, 255, 255, 1]
  }),
  watch: {
    $route: {
      handler: 'fetchData',
      immediate: true
    },
    'top.uri': {
      handler: 'getTopImage'
    },
    'current.uri': {
      handler: 'getCurrentImage'
    }
  },
  mounted () {
    this.canvas = this.$refs.topCanvas
    // this.sizeCanvas()
  },
  computed: {
    current () {
      return this.$store.getters['image/get']('currentLayer')
    },
    top () {
      return this.$store.getters['image/get']('top')
    }
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        await this.$store.dispatch('image/get', 'currentLayer')
        await this.$store.dispatch('image/get', 'top')
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
        await this.getTopImage()
        await this.getCurrentImage()
      }
    },
    async getTopImage () {
      if (this.loading) return

      // get new img to pixelCanvas
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = () => {
          resolve()
        }
        img.src = this.top.uri
      })

      this.pixelCanvas = document.createElement('canvas')
      this.pixelCanvas.width = img.width
      this.pixelCanvas.height = img.height
      this.pixelCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
      await this.redrawCanvas()
    },
    async getCurrentImage () {
      if (this.loading) return

      // get new img to pixelCanvas
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = () => {
          resolve()
        }
        img.src = this.current.uri
      })

      this.currentCanvas = document.createElement('canvas')
      this.currentCanvas.width = img.width
      this.currentCanvas.height = img.height
      this.currentCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
      await this.redrawCanvas()
    },
    async redrawCanvas () {
      // Draw to actual canvas
      const ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.lineWidth = '0.3'
      ctx.strokeStyle = 'white'
      ctx.webkitImageSmoothingEnabled = false
      ctx.mozImageSmoothingEnabled = false
      ctx.imageSmoothingEnabled = false
      if (this.currentCanvas) ctx.drawImage(this.currentCanvas, 0, 0, this.currentCanvas.width, this.currentCanvas.height, 0, 0, this.canvas.width, this.canvas.height)
      if (this.pixelCanvas) ctx.drawImage(this.pixelCanvas, 0, 0, this.pixelCanvas.width, this.pixelCanvas.height, 0, 0, this.canvas.width, this.canvas.height)
      for (let x = 0; x < this.pixelCanvas.width; x++) {
        for (let y = 0; y < this.pixelCanvas.height; y++) {
          ctx.strokeRect(
            this.canvas.width / this.pixelCanvas.width * x,
            this.canvas.height / this.pixelCanvas.height * y,
            this.canvas.width / this.pixelCanvas.width,
            this.canvas.height / this.pixelCanvas.height
          )
        }
      }
    },
    getCursorCanvasPosition (event) {
      const rect = this.canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      return { x, y }
    },
    getCursorMatrixPosition (event) {
      const pos = this.getCursorCanvasPosition(event)
      pos.x = Math.floor(pos.x / this.canvas.width * this.pixelCanvas.width)
      pos.y = Math.floor(pos.y / this.canvas.height * this.pixelCanvas.height)
      return pos
    },
    startPainting (e) {
      this.painting = true
      this.draw(e)
    },
    finishedPainting () {
      this.painting = false
      this.send()
    },
    send () {
      this.$store.dispatch('image/patch', ['top', { uri: this.pixelCanvas.toDataURL() }])
    },
    draw (e) {
      if (!this.painting) return
      const { x, y } = this.getCursorMatrixPosition(e)
      const oldColor = this.pixelCanvas.getContext('2d').getImageData(x, y, 1, 1).data
      if (!(
        oldColor === this.color &&
        oldColor[0] === this.color[0] &&
        oldColor[1] === this.color[1] &&
        oldColor[2] === this.color[2] &&
        oldColor[3] === this.color[3]
      )) {
        const pixelContext = this.pixelCanvas.getContext('2d')
        pixelContext.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[3]})`
        pixelContext.fillRect(x, y, 1, 1)
        this.redrawCanvas()
      }
    },
    clear () {
      this.pixelCanvas.getContext('2d').clearRect(0, 0, this.pixelCanvas.width, this.pixelCanvas.height)
      this.redrawCanvas()
      this.send()
    }
  }
}
</script>

<style scoped>
.about {
  width: 100%;
  height: 100%;
}

.canvas{
  border: solid 2px red;
  background: #000;
}

</style>
