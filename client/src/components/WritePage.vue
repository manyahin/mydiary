<template>
  <div>
    <form class="pure-form" @submit.prevent="saveNote">
      <fieldset>
        <textarea
          placeholder="What happened?"
          autofocus=true
          required
          v-model.trim="body"
          @keydown.enter="handleCmdEnter($event)">
        </textarea>
        <div class="pure-g">
          <div class="pure-u-2-3 message">
            <span v-show="message">{{ message }}</span>
            <img v-show="loading" src="static/ajax-loader.gif" alt="Loading...">
          </div>
          <div class="pure-u-1-3">
            <button class="pure-button" :disabled="loading" type="submit">Write</button>
          </div>
        </div>
        <div class="pure-g post-date">
          <div class="pure-u-1-1">
            <span>Post date:</span>
            <date-picker type="datetime" :show-time-panel="showTimePanel" first-day-of-week="1" width="150" v-model="postDate" lang="en">
              <template v-slot:footer>
                <button class="mx-btn mx-btn-text" @click="toggleTimePanel">
                  {{ showTimePanel ? 'select date' : 'select time' }}
                </button>
              </template>
            </date-picker>
          </div>
        </div>
      </fieldset>
    </form>
    <infinite-notes-list order="desc" :key="lastUpdate"></infinite-notes-list>
  </div>
</template>

<script>
import NoteService from '@/services/NoteService'
import InfiniteNotesList from '@/components/InfiniteNotesList'

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  components: {
    InfiniteNotesList,
    DatePicker
  },
  data () {
    return {
      body: '',
      message: '',
      loading: false,
      lastUpdate: 0,
      postDate: undefined,
      showTimePanel: false
    }
  },
  methods: {
    saveNote () {
      this.message = ''
      this.loading = true

      if (!this.body.length) {
        this.message = 'The note cannot be empty'
        this.loading = false
        return
      }

      let note = {}
      note.created_at = this.postDate || new Date()
      note.body = this.body

      NoteService.addNote(note)
        .then(this.noteSaved)
        .then(this.clearBody)
    },
    noteSaved ({data}) {
      this.message = `Written ${data.count_symbols} symbols`
      this.lastUpdate = +new Date()
    },
    clearBody () {
      this.body = ''
      this.loading = false
    },
    handleCmdEnter ({ctrlKey, metaKey}) {
      if (ctrlKey || metaKey) {
        this.saveNote()
      }
    },
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 150px;
    border: 1px solid #0F595B;
    border-radius: 4px;
    display: block;
    caret-color: grey;
    padding: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  /* Hack: autofocus attr cause red border since page loaded,
     disable it for textarea */
  textarea:required:invalid {
    border: 1px solid #1A2943 !important;
    color: white !important;
  }
  button[type="submit"] {
    margin-top: 10px;
    width: 100%;
    border-radius: 4px;
    background-color: #0F595B;
    border: 1px solid #1A2943;
    color: white;
    padding: 4px 6px;
    font-size: 20px;
    font-weight: 200;
  }
  .message {
    font-size: 15px;
    margin-top: 15px;
  }
  .post-date {
    margin-top: 10px;
    text-align: right;
  }
</style>
