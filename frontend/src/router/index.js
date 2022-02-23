import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/views/Login";
import Profile from "@/views/Profile";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    props: true

  },
  {
    path: '/profile/:uuid',
    name: 'Profile',
    component: Profile,
    props:true
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import(/* webpackChunkName: "about" */ '../views/Posts.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
