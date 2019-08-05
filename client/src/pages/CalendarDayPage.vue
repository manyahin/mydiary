<template>
  <div class="calendar-day">
    <router-link :to="{ name: 'calendar' }" class="return-to-calendar">← Back to Calendar</router-link>
    <loading :status="loading"></loading>
    <notes-list :notes="notes" :loading="loading"></notes-list>
    <div class="nav">
      <router-link class="pure-button next-day" :to="{ name: 'calendarDay', params: { date: previousDay }}">Previous day</router-link>
      <router-link class="pure-button previous-day" :to="{ name: 'calendarDay', params: { date: nextDay }}">Next day</router-link>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NotesList from '@/components/NotesList'
import Loading from '@/components/Loading'

export default {
  data () {
    return {
      date: this.$moment(this.$route.params.date, 'YYYY-MM-DD'),
      notes: [],
      loading: true
    }
  },
  components: {
    NotesList,
    Loading
  },
  computed: {
    nextDay () {
      return this.$moment(this.date).add(1, 'day').format('YYYY-MM-DD')
    },
    previousDay () {
      return this.$moment(this.date).subtract(1, 'day').format('YYYY-MM-DD')
    }
  },
  async created () {
    this.loading = true
    await this.getPostForSpecificDate()
    this.loading = false

    // todo: this thing doesn't work correctly
    // this.handleKeys()
  },
  watch: {
    async '$route' (to, from) {
      this.loading = true
      this.notes = []
      this.date = this.$moment(this.$route.params.date, 'YYYY-MM-DD')
      await this.getPostForSpecificDate()
      this.loading = false
    }
  },
  methods: {
    async getPostForSpecificDate () {
      const filter = {
        where: {
          and: [
            {
              created_at: {
                gte: this.date.startOf('day').toISOString()
              }
            },
            {
              created_at: {
                lte: this.date.endOf('day').toISOString()
              }
            }
          ]
        },
        order: 'created_at ASC'
      }

      let { data } = await axios.get('Notes?filter=' + JSON.stringify(filter))

      this.notes = data
    },
    handleKeys () {
      window.addEventListener('keydown', e => {
        if (e.keyCode === 39) { // right
          this.goNextDay()
        } else if (e.keyCode === 37) { // left
          this.goPreviousDay()
        }
      })
    },
    goNextDay () {
      this.$router.push({name: 'calendarDay', params: {date: this.nextDay}})
    },
    goPreviousDay () {
      this.$router.push({name: 'calendarDay', params: {date: this.previousDay}})
    }
  }
}
</script>

<style>
.return-to-calendar {
  color: black;
}

.calendar-day {
  margin-top: 20px;
  margin-bottom: 20px;
}

.nav .next-day {
  float: left;
}

.nav .previous-day {
  float: right;
}
</style>
