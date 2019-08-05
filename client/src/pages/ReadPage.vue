<template>
  <div>
    <router-link class="pure-button link-to-calendar" to="/calendar">Open Calendar</router-link>
    <div class="filters pure-g">
      <div class="pure-u-1 pure-u-sm-1-2">
        Filters:
        <button @click="readAllNotes">All notes</button>
        <button @click="readStarredNotes">Only starred notes</button>
      </div>
      <div class="pure-u-1 pure-u-sm-1-2 search-form">
        <form id="submit" @submit.prevent="readBySearch">
          <input required type="text" placeholder="text to search" v-model="searchText">
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
    <infinite-notes-list order="asc" :key="infiniteId" :filter="filter"></infinite-notes-list>
  </div>
</template>

<script>
import InfiniteNotesList from '@/components/InfiniteNotesList'

export default {
  components: {
    InfiniteNotesList
  },
  data () {
    return {
      filter: {},
      searchText: '',
      infiniteId: +new Date()
    }
  },
  methods: {
    readAllNotes () {
      this.filter = {}
      this.infiniteId += 1
    },
    readStarredNotes () {
      this.filter = {
        where: {
          favorite: true
        }
      }
      this.infiniteId += 1
    },
    readBySearch () {
      this.filter = {
        where: {
          '$text': {
            search: this.searchText
          }
        }
      }
      this.infiniteId += 1
    }
  }
}
</script>

<style>
.filters {
  margin-top: 10px;
}

.link-to-calendar {
  margin-top: 10px;
}

.search-form {
  text-align: right;
}

@media screen and (max-width: 35.5em) {
  .search-form {
    margin-top: 8px;
    text-align: left;
  }
}
</style>
