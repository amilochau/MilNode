export default {
  data () {
    return {
      meta: {
        title: null,
        description: null
      },
      _description: {}
    }
  },

  computed: {
    title () {
      return this.meta.title
    },
    description () {
      return this.meta.description
    }
  },

  watch: {
    $route () {
      this.setMeta()
    },
    meta () {
      if (this.title) {
        document.title = `${this.title} — ${this.$applicationName}`
        this.$store.commit('app/TITLE', this.title)
      } else {
        document.title = this.$applicationName
        this.$store.commit('app/TITLE', this.$applicationName)
      }
      if (this.description) {
        this._description.setAttribute('content', this.description)
      }
    }
  },

  mounted () {
    this.bootstrapMeta()
  },

  methods: {
    bootstrapMeta () {
      if (typeof document === 'undefined') return

      this._description = document.querySelector('meta[name="description"]')
      this.setMeta()
    },
    setMeta () {
      const name = this.$route.name
      this.meta = this.$t('meta')[name] || this.getFallbackMeta()
    },
    getFallbackMeta () {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No meta defined for route ' + (this.$route.name))
      }
      return {}
    }
  }
}
