<template>
  <section>
    <notes-list :notes="notes"></notes-list>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="no-more-notes">All notes loaded</div>
      <div slot="no-results" class="no-results">Notes not found</div>
      <div slot="spinner">
        <loading :status="true"></loading>
      </div>
    </infinite-loading>
  </section>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import NotesList from '@/components/NotesList'
import Loading from '@/components/Loading'
import NoteService from '@/services/NoteService'
import { NOTES_PER_PAGE } from '@/constants'

export default {
  components: {
    InfiniteLoading,
    NotesList,
    Loading
  },
  props: {
    order: {
      type: String,
      default: 'ASC'
    },
    filter: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      notes: [],
      page: 0
    }
  },
  methods: {
    async infiniteHandler ($state) {
      const notes = []
      const filter = {
        order: `created_at ${this.order}`,
        skip: NOTES_PER_PAGE * this.page,
        limit: NOTES_PER_PAGE,
        ...this.filter
      }

      notes.push(...await NoteService.loadNotes(filter))

      if (notes.length) {
        this.notes.push(...notes)
        this.page += 1
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    addNote (note) {
      this.notes.push(note)
    }
  }
}
</script>

<style>
h4 {
  margin-top: 10px;
  margin-bottom: 0px;
}
.no-results {
  margin-bottom: 25px;
  color: grey;
  font-style: italic;
}
.no-more-notes {
  margin-bottom: 25px;
  color: grey;
  font-style: italic;
}
</style>
