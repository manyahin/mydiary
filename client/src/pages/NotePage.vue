<template>
  <section>
    <h2>Note Page</h2>
    <note :note="note" :options="{fullDate: true, showLink: false}"></note>
    <comments :comments="comments" @onComment="addComment"></comments>
  </section>
</template>

<script>
import NoteService from '@/services/NoteService'

import Note from '@/components/Note'
import Comments from '@/components/Comments'

import LoadingMixin from '@/mixins/loading'

export default {
  components: {
    Note,
    Comments
  },
  mixins: [
    LoadingMixin
  ],
  data () {
    return {
      noteId: this.$route.params.id,
      note: {},
      comments: []
    }
  },
  created () {
    this.getNote()
  },
  methods: {
    async getNote () {
      this.beforeLoad()

      // also here I should use try/catch but I want something general
      let { data } = await NoteService.getNoteById(this.noteId)
      this.note = data
      this.comments = data.comments || []

      this.afterLoad()
    },
    async addComment (comment) {
      this.comments.push(comment)

      try {
        await NoteService.addCommentsToNote(this.note, this.comments)
        // todo: succefful notification
      } catch (err) {
        alert('failed to add comment')
        // this.comments.pop() we lost comment
        // may use vuex to return last comment to textarea in comments component?
        console.error(err)
      }
    }
  }
}
</script>

<style>
</style>
