import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Current',
    component: () => import('../views/Current.vue')
  },
  {
    path: '/layer',
    name: 'Layer',
    component: () => import('../views/Layer.vue')
  },
  {
    path: '/top',
    name: 'Top',
    component: () => import('../views/Top.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
