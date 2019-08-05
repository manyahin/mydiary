export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    beforeLoad () {
      this.loading = true
    },
    afterLoad () {
      this.loading = false
    }
  }
}
