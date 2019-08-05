<template>
  <section class="note">
    <div class="header pure-g">
      <div class="time pure-u-1-2">
        <router-link v-if="config.showLink" :to="{ name: 'note', params: { id: note.id } }">
          {{ noteCreatedTime }}
        </router-link>
        <span v-else>
          {{ noteCreatedTime }}
        </span>
      </div>
      <div class="actions pure-u-1-2">
        <img @click="favorite" :src="starIconSrc" :alt="!note.favorite ? 'star' : 'unstar'"
          class="star-icon" :class="{opacity: !note.favorite}">
      </div>
    </div>
    <div class="body">{{ note.body }}</div>
  </section>
</template>

<script>
import NoteService from '@/services/NoteService'

export default {
  props: {
    note: {
      type: Object
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
    // preload star icons
    const imgs = ['/static/star.png', '/static/star_filled.png']
    imgs.forEach(src => this.preLoadImage(src))
  },
  computed: {
    config () {
      return { showLink: true, fullDate: false, ...this.options }
    },
    noteCreatedTime () {
      return this.config.fullDate
        ? this.$moment(this.note.created_at).format('MMMM Do YYYY, h:mm:ss a')
        : this.$moment(this.note.created_at).format('HH:mm')
    },
    starIconSrc () {
      return '/static/' + (this.note.favorite ? 'star_filled.png' : 'star.png')
    }
  },
  methods: {
    favorite () {
      this.note.favorite = !this.note.favorite
      NoteService.favoriteNote(this.note)
    },
    preLoadImage (src) {
      let img = new Image()
      img.src = src
    }
  }
}
</script>

<style scoped lang="scss">
.note {
  padding: 8px 0;
  border-bottom: 1px solid rgba(1,1,1,0.1);

  .header {
    .time {
      color: grey;
      line-height: 26px;
      font-size: 20px;
      font-weight: 100;
    }

    .actions {
      text-align: right;

      .star-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;

        &.opacity {
          opacity: 0.2;
        }
      }
    }
  }

  .body {
    white-space: pre-wrap;
    line-height: 1.3em;
  }
}
</style>
