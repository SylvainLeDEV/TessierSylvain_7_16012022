<template>
  <div class="card">
    <!--    SUBMIT POST -->
    <v-card class="card__submit">
      <v-toolbar
          flat
          color="blue-grey"
          dark
      >
        <v-toolbar-title>Comment vas tu aujourd'hui ?</v-toolbar-title>
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
      <!--            <p v-else> Pour le moment une seule image est accepté </p>-->
      <v-card-actions>
        <v-spacer></v-spacer>
<!--        <v-btn v-if="imageUrl !== ''" @click="addPictureOnPosts"-->
<!--               text-->
<!--               icon-->
<!--               size="small"-->
<!--               color="#3A3B3C">-->
<!--          <v-icon>mdi-camera-flip-outline</v-icon>-->
<!--        </v-btn>-->
<!--        <input type="file"-->
<!--               style="display: none"-->
<!--               ref="fileInputPosts"-->
<!--               accept="image/png, image/jpeg, image/jpg, image/gif"-->
<!--               size="5242880"-->
<!--               @change="filePicturePosts">-->
        <v-btn
            class="btn-post"
            color="success"
            depressed
            :key="renderComponent"
            @click="addPost"

        >
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
    <!---->

    <!----------------------    container posts --------------->
    <main class="main" v-if="renderComponent">
      <div class="post" v-for="post in allPosts" :key="post.id">

        <header class="post__header">
          <img class="post__header-img" :src="post.User.picture" alt="Image profile">
          <div class="post__header-text">
            <router-link class="post__header-pseudo" @click="getUserProfile(post)"
                         :to="{ name: 'Profile', params:{uuid : post.User.uuid}}">
              <div> {{ post.User.firstName }}</div>
            </router-link>
            <div class="post__header-date"> {{ post.createdAt }}</div>
          </div>
        </header>

        <div class="post__body">
          <img class="post__body-img" v-if="post.imageUrl !== null " :src="post.imageUrl" alt="Image du post">
          <div v-if="updatePostTextArea == post.id">
          <textarea v-model="postUpdate" placeholder="Modifies ton post">
          </textarea>
            <v-btn
                color="success"
                icon
                depressed
                size="small"
                @click="validUpdatePost(post)"
            >
              <v-icon>mdi-check or done</v-icon>
            </v-btn>
          </div>

          <p v-else class="post__body-content">{{ post.content }}</p>
        </div>

        <div class="post__footer">

          <div class="post__footer-btn-comment">
            <v-btn
                class="test"
                icon
                size="small"
                color="none"
                @click="addCommentPost(post)">
              <v-icon>mdi-comment processing outline</v-icon>
            </v-btn>
            <p class="post__footer-btn-comment-p">
              {{ post.comment.length }}
            </p>
          </div>

          <div>
            <v-btn
                v-if="post.buttonModify"
                class="post__footer-btn-modify"
                color="blue-lighten-4"
                conten
                icon
                depressed
                size="small"
                @click="updatePost($event ,post)"
            >
              <v-icon
                  color="blue darken-3
">mdi-pencil outline
              </v-icon>
            </v-btn>

            <v-btn
                v-if="post.buttonDelete || user.isAdmin === true"
                class="post__footer-btn-delete"
                color="blue-grey-lighten-5"
                depressed
                icon
                size="small"
                @click="deletePost(post)"
            >
              <v-icon>mdi-delete outline</v-icon>
            </v-btn>
          </div>
          <!-- ---------------------------END POST -------------------------- -->

          <!------------------------------ COMMENT ----------------------------->

        </div>

        <div class="comment" v-if="commentPost == post.id">
          <div class="comment__add">
            <textarea class="comment__add-text" v-model="contentCommentPost" placeholder="Votre commentaire...">
          </textarea>
            <v-btn
                class="comment__add-btn"
                color="success"
                depressed
                @click="validAddComment(post)"
            >
              Publier
            </v-btn>

          </div>

          <div class="comment__containerComent" v-for="comment in post.comment" :key="comment.id">

            <div class="comment__containerComent-pseudo-date-img">
              <img class="comment__containerComent-img" :src="comment.userComment.picture" alt="Image profile">
              <div>
                <router-link :to="{ name: 'Profile', params:{uuid : comment.posterId}}">
                  <div class="comment__containerComent-pseudo"> {{ comment.userName }}</div>
                </router-link>
                <p class="comment__containerComent-date"> {{ comment.createdAt }}</p>
              </div>
            </div>
            <div class="comment__containerComent-textarea" v-if="updateCommentTextArea == comment.id">
          <textarea v-model="commentUpdate" placeholder="Modifies ton commentaire"></textarea>
              <v-btn
                  class="comment__containerComent-btn-validUpdate"
                  color="success"
                  icon
                  depressed
                  size="x-small"
                  @click="validUpdateComment(comment)"
              >
                <v-icon>mdi-check or done</v-icon>
              </v-btn>
            </div>
            <div v-else class="comment__containerComent-content">
              <p > {{ comment.content }} </p>
            </div>
            <div class="comment__containerComent-btn">
              <v-btn
                  v-if="comment.buttonModify"
                  class="comment__containerComent-btn-modify"
                  color="blue-lighten-4"
                  icon
                  depressed
                  size="x-small"
                  @click="updateComment(comment)"
              >
                <v-icon
                    color="indigo darken-5">mdi-pencil outline
                </v-icon>
              </v-btn>

              <v-btn
                  v-if="comment.buttonDelete || user.isAdmin"
                  class="comment__containerComent-btn-delete"
                  color="blue-grey-lighten-5"
                  depressed
                  icon
                  size="x-small"
                  @click="deleteComment(comment)"
              >
                <v-icon>mdi-delete outline</v-icon>
              </v-btn>
            </div>
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
  props: [],

  data() {
    return {
      contentPost: '',
      contentCommentPost: '',
      image: null,
      imageUrl: "",
      updatePostTextArea: null,
      updateCommentTextArea: null,
      postUpdate: [],
      commentPost: null,
      componentKey: 0,
      commentUpdate: [],
      renderComponent: true,
    }
  },

  created: function () {
    if (this.$store.state.user.uuidUser === "-1") {
      this.$router.push("/")
      return;
    }

    this.$store.dispatch('getAllPosts')

  },

  methods: {
    forceRerender() {

      this.renderComponent = false;

      this.$nextTick().then(() => {
        this.$store.dispatch('getAllPosts')
        this.renderComponent = true;
      })
      // this.componentKey++
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


      const payloadDeletePost = {uuid: post.uuid}

      this.$store.dispatch('deletePost', payloadDeletePost)
          .then(() => {
            this.forceRerender()
          })

    },

    updatePost: function (event, post) {
      this.updatePostTextArea === post.id ? this.updatePostTextArea = null : this.updatePostTextArea = post.id

    },

    validUpdatePost: function (post) {

      const payloadUpdatePost = {
        uuidPost: post.uuid,
        uuid: post.User.uuid,
        content: this.postUpdate
      }

      this.$store.dispatch('updatePost', payloadUpdatePost)
          .then(() => {
            this.forceRerender()
          })
      this.updatePostTextArea = null
      this.updatePostTextArea[post.id] = !this.updatePostTextArea[post.id]
    },

    addCommentPost: function (post) {
      this.commentPost === post.id ? this.commentPost = null : this.commentPost = post.id
    },

    validAddComment: function (post) {
      const localStorageUser = JSON.parse(localStorage.getItem('user'))
      const uuidUser = localStorageUser.uuidUser

      console.log(this.contentCommentPost)
      if (this.contentCommentPost !== '') {
        const payloadAddComment = {
          content: this.contentCommentPost,
          postUuid: post.uuid,
          posterId: uuidUser
        };

        this.$store.dispatch('addCommentPost', payloadAddComment)
            .then(() => {
              this.forceRerender()
            })
        this.contentCommentPost = ''
      } else {
        alert('Ecris ton meilleur commentaire !! ')
      }

    },

    deleteComment: function (comment) {
      const payloadDeleteComment = {uuid: comment.uuid}

      this.$store.dispatch('deleteComment', payloadDeleteComment)
          .then(() => {
            this.forceRerender()
          })
    },

    updateComment: function (comment) {
      this.updateCommentTextArea === comment.id ? this.updateCommentTextArea = null : this.updateCommentTextArea = comment.id
    },

    validUpdateComment: function (comment) {
      const payloadUpdateComment = {

        uuidComment: comment.uuid,
        content: this.commentUpdate
      }

      this.$store.dispatch('updateComment', payloadUpdateComment)
          .then(() => {
            this.forceRerender()
          })
      this.updateCommentTextArea = null
      this.updateCommentTextArea[comment.id] = !this.updateCommentTextArea[comment.id]
    },
  },
  computed: {

    ...mapState({
      user: 'user',
      allPosts: 'allPosts',
      postCreatedAt: 'postCreatedAt',
    }),

    allPosts() {
      return this.$store.getters.getAllPosts
    }

  },
}

</script>

<style scoped lang="scss">

.btn-post{
  background: green;
}

.post {
  margin-top: 25px;
  border: solid 1px #DBDBDB;
  border-radius: 5px;
  background: #FFF;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.5);

  &__header {
    padding: 5px;
    display: flex;


    &-pseudo {
      outline: none;
      color: #082043;
      text-decoration: none;

    }

    &-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border: 3px solid burlywood;
      border-radius: 50%;
    }

    &-date {
      font-size: 14px;
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
      margin: 10px -5px 5px 65px;
      min-height: 50px;
      text-align: left;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;

    &-btn-modify {
      margin-right: 5px;
    }

    &-btn-comment {
      position: relative;
    }

    &-btn-comment > p {
      position: absolute;
      font-size: 15px;
      color: black;
      top: 24px;
      left: 22px;
    }
  }
}

.comment {


  &__add {
    border-top: solid 2px rgba(140, 140, 140, 0.51);
    border-bottom: solid 2px rgba(140, 140, 140, 0.51);
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
    //border-radius: 5px;
    display: flex;
    padding: 10px;
    justify-content: space-around;
    align-items: center;


    &-text {
      background: #fff;
      border: 1px solid #dddfe2;
      box-shadow: inset 0 1px 1px 0 rgb(0 0 0 / 7%);
      margin-left: 0;
      padding: 8px;

    }

    &-btn {
      background-color: #082043;
      padding: 5px;

    }
  }

  &__containerComent {
    border-radius: 5px 30px 30px 30px;
    background: #d5d5d5;
    display: flex;
    padding: 10px;
    flex-direction: column;
    align-items: center;
    margin: 10px 10px 10px 15px;

    &-content {
      padding: 10px 0 0 55px;
      overflow-wrap: anywhere;
      text-align: left;
      width: 100%;
    }

    &-img {
      width: 45px;
      height: 45px;
      object-fit: cover;
      border-radius: 50%;
    }

    &-pseudo-date-img {
      width: 100%;
      display: flex;
      align-items: center;

      & > div {
        padding-left: 10px;
        text-align: left;
      }
    }
    &-textarea{
      display: flex;
      flex-direction: column;
      align-items: center;
      & > textarea{
        width: 100%;
      }
    }

    &-btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      &-modify {
        margin-right: 5px;
      }
    }

  }

}

</style>