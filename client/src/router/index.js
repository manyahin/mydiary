import Vue from 'vue'
import Router from 'vue-router'
import WritePage from '@/pages/WritePage'
import ReadPage from '@/pages/ReadPage'
import CalendarPage from '@/pages/CalendarPage'
import CalendarDayPage from '@/pages/CalendarDayPage'
import NotePage from '@/pages/NotePage'
import PageNotFound from '@/pages/PageNotFound'

import Login from '@/components/Login'

import { store } from '@/store'
import auth from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (auth.loggedIn()) {
          next('/')
        } else {
          store.commit('SET_LAYOUT', 'login-layout')
          next()
        }
      }
    },
    {
      path: '/',
      redirect: 'write'
    },
    {
      path: '/write',
      component: WritePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/read',
      component: ReadPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar/:date',
      name: 'calendarDay',
      component: CalendarDayPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/note/:id',
      name: 'note',
      component: NotePage,
      math: { requiresAuth: true }
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next('/login')
    } else {
      store.commit('SET_LAYOUT', 'app-layout')
      next()
    }
  } else {
    next()
  }
})

export default router
