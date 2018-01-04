import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/auth/Login'
import Logout from '@/components/Logout'
import ForgotPassword from '@/components/auth/ForgotPassword'
import ResetPassword from '@/components/auth/ResetPassword'
import Homepage from '@/components/Homepage'
import Tickets from '@/components/Tickets'
import TicketDetail from '@/components/TicketDetail'
import TicketCreate from '@/components/TicketCreate'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage,
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets',
      name: 'Tickets',
      component: Tickets,
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets/create',
      name: 'Tickets Create',
      component: TicketCreate,
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets/:id',
      name: 'Ticket Detail',
      component: TicketDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true, bodyClass: 'authPage' }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { requiresGuest: true, bodyClass: 'authPage' }
    },
    {
      path: '/reset-password/:uiid',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: { requiresGuest: true, bodyClass: 'authPage' }
    }
  ]
})
