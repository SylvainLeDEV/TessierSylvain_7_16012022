<template>
  <div class="card">
    <v-card>
      <v-toolbar
          flat
          color="blue-grey"
          dark
      >
        <v-toolbar-title>Submit a post</v-toolbar-title>
      </v-toolbar>

      <v-card-text>

        <v-textarea
            filled
            label="Text"
        ></v-textarea>
      </v-card-text>

      <v-img
          v-if="imageUrl !==''"
          :lazy-src="imageUrl"
          :src="imageUrl"
          transition
          aspect-ratio="3"
          class="grey lighten-2"
          alt="Image de profile valid"
      >
      </v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="addPictureOnPosts"
               text
               icon
               size="small"
               color="#3A3B3C">
          <v-icon>mdi-camera-flip-outline</v-icon>
        </v-btn>
        <input type="file"
               style="display: none"
               ref="fileInputPosts"
               accept="image/png, image/jpeg, image/jpg, image/gif"
               size="5242880"
               @change="filePicturePosts">
        <v-btn
            color="success"
            depressed
            @click="addPost"
        >
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>

export default {

  name: 'Posts',

  mounted:function () {
    this.$store.dispatch('getAllPosts')
  },

  data(){
    return {
     image:null,
     imageUrl:"",
    }
  },
  methods:{
    addPictureOnPosts:function (){
      this.$refs.fileInputPosts.click();
    },
    filePicturePosts: function (){
      const eventChange = event.target.files
      const files = eventChange[0]
      const sizeFile = files.size
      const fileName = files.name
      console.log(files)

      if (sizeFile > 5 * 1024 * 1024) {
        event.preventDefault();
        alert('File too big (> 5MB)');
        return;
      }
      if (fileName.lastIndexOf('.') <= 0) {
        return alert('Ajouter une image valide')
      }

      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files)
      this.image = files
    },
    addPost:function (){
      this.image=null
      this.imageUrl=''
    },


  },
  computed: {

  },

}

</script>

<style>


</style>