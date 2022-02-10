<template>
  <div class="card">
    <!--    SUBMIT POST -->
    <v-card class="card__submit">
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
            v-model="contentPost"
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
      <p v-else> Pour le moment une seule image est accepté </p>
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
    <!---->

    <!--    container posts and comment-->
    <main class="main" v-for="post in allPosts" :key="post.id">
      <div class="post" v-if="renderComponent">

        <header class="post__header">
          <img class="post__header-img" :src="post.User.picture" alt="Image profile">
          <div class="post__header-text">
            <div class="post__header-pseudo"> {{ post.User.firstName }}</div>
            <div class="post__header-date"> {{ post.createdAt }}</div>
          </div>
        </header>

        <div class="post__body">
          <img class="post__body-img" v-if="post.imageUrl !==''" :src="post.imageUrl" alt="Image du post">
          <p class="post__body-content">{{ post.content }}</p>
        </div>

        <div class="post__footer">
          <v-btn
              v-if="post.buttonDelete"
              class="post__footer-btn-delete"
              color="error"
              depressed
              icon
              size="small"
              @click="deletePost(post)"
          >
            <v-icon>mdi-delete outline</v-icon>
          </v-btn>
          <v-btn
              class="post__footer-btn-modify"
              color="success"
              icon
              depressed
              size="small"
          >
            <v-icon>mdi-pencil outline</v-icon>
          </v-btn>
          <div class="post__footer-btn-comment">
            <v-btn
                text
                icon
                size="small"
                color="none">
              <v-icon>mdi-comment processing outline</v-icon>
            </v-btn>
            <p class="post__footer-btn-comment-p">
              {{ post.comment.length }}
            </p>
          </div>
        </div>

      </div>
    </main>
    <!--    -->
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {

  name: 'Posts',

  data() {
    return {
      contentPost: '',
      image: null,
      imageUrl: "",
      renderComponent: true,
    }
  },

  mounted: function () {
    this.$store.dispatch('getAllPosts')

  },

  methods: {
    forceRerender() {
      this.$store.dispatch('getAllPosts')
          .then(() => {
            this.renderComponent = false;
          })
          .then(() => {
            this.$nextTick()
            this.renderComponent = true;
          });
    },
    addPictureOnPosts: function () {
      this.$refs.fileInputPosts.click();
    },
    filePicturePosts: function () {
      const eventChange = event.target.files
      const files = eventChange[0]
      const sizeFile = files.size
      const fileName = files.name

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

    addPost: function () {
      const user = localStorage.getItem('user')
      const uuidUser = JSON.parse(user)

      if (this.image !== null) {
        console.log(" ou LA")
        const formData = new FormData()
        formData.append('posts', this.image);
        formData.append('content', this.contentPost);
        formData.append('userUuid', uuidUser.uuidUser);

        const payloadAddPost = formData;
        this.$store.dispatch('addPost', payloadAddPost)
            .then(() => {
              this.$store.dispatch('getAllPosts')
            });

      } else if (this.contentPost === '') {
        alert("Ecris ton meilleur post !! ")
      } else {
        console.log("ICI")
        const payloadAddPost = {
          imageUrl: null,
          content: this.contentPost,
          userUuid: uuidUser.uuidUser
        };
        this.$store.dispatch('addPost', payloadAddPost)
            .then(() => {
              this.forceRerender()
            })
      }
      this.contentPost = ''
      this.image = null
      this.imageUrl = ''
    },

    deletePost: function (post) {

      console.log(post)
      const payloadDeletePost = {uuid: post.uuid}

      this.$store.dispatch('deletePost', payloadDeletePost)
          .then(() => {
            this.$store.dispatch('getAllPosts')
          })

    },
  },
  computed: {

    ...mapState({
      allPosts: 'allPosts'
    })
  },
}

</script>

<style scoped lang="scss">

.post {
  margin-top: 10px;
  border: solid 1px #DBDBDB;
  background: #FFF;
  border-radius: 5px;

  &__header {
    padding: 5px;
    display: flex;

    &-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border: 3px solid burlywood;
      border-radius: 50%;
    }

    &-text {
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

  }

  &__body {

    &-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    &-content {
      margin-left: -5px;
      margin-right: -5px;
      margin-bottom: 5px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;

    &-btn-comment {
      position: relative;
    }

    &-btn-comment > p {
      position: absolute;
      top: 25px;
      left: 25px;
    }
  }
}

</style>