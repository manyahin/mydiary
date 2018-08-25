import router from 'vue-router'

export default {
  loggedIn: () => {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    } else {
      return false
    }
  },
  getToken: () => {
    return localStorage.getItem('token')
  },
  logout: () => {
    localStorage.removeItem('token')
    router.go('/')
  }
}
