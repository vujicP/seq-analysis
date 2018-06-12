<template>
		<textarea id="data-editor" class="textarea" placeholder="" v-model="c"></textarea>
</template>



<script>
export default {

  props: ['content_parent'],

  data() {
    return {
      current: ''
    }
  },

  computed: {
    c: {
      get: function() {
        return this.current;
      },

      set: function(newValue) {
        this.current = newValue;
        this.$emit('loadContent', newValue)
      }
    },

    content_db() {
      if (this.$store.state.seq.currentdoc === '') return ''
      return this.$store.state.seq.currentdoc.properties.content;
    }
  },

  watch: {
    content_parent: function(newc) {
      this.c = newc;
    },
    content_db: function(newc) {
      this.c = newc;
    }
  }
}
</script>



<style>

#data-editor {
  min-height: 450px;
}

</style>