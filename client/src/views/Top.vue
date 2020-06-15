<template>
  <div class="about">
    <canvas @mousedown="startPainting" @mouseup="finishedPainting" @mousemove="draw" id="canvas"></canvas>
  </div>
</template>

<script>
export default {
  data: () => ({
    message: 'Hello Vue!',
    painting: false,
    canvas: null,
    ctx: null
  }),
  mounted () {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
  },
  methods: {
    getCursorPosition (canvas, event) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      return { x, y }
    },
    startPainting (e) {
      this.painting = true
      this.draw(e)
      console.log(this.painting)
    },
    finishedPainting () {
      this.painting = false
      console.log(this.painting)
    },
    draw (e) {
      if (!this.painting) return
      console.log(this.getCursorPosition(this.canvas, e))
    }
  }
}
</script>
