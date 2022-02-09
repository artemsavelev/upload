import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "about" */ '../views/Upload.vue')
  },
  {
    path: '/warm',
    name: 'Warm',
    component: () => import('../views/Warm.vue')
  },
  {
    path: '/kafka',
    name: 'Kafka',
    component: () => import('../views/Kafka.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
