<template>
  <!--  //Déconexion-->
  <div class="card">

    <div class="form-row">
      <button @click="logout" class="button">
        Déconnexion
      </button>
    </div>

    <h1 class="card__title">{{ user.firstName }}</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>

    <!--// L'image de PROFILE-->
    <div class="card__picture-container">
      <img class="card__picture-img" v-if="imageUrl === ''" :src="picture" alt="Image de profile">
      <img class="card__picture-img" v-else :src="imageUrl" alt="Image de profile valid">

      <v-btn
          v-if="imageUrl !== ''"
          @click="validPictureProfile"
          class="card__picture-btn-valid"
          color="#1A8917"
          icon="mdi-check-outline"
          size="small"
      ></v-btn>

      <v-btn class="card__picture-btn ma-2" @click="updatePictureProfile"
             text
             icon
             size="small"
             color="#3A3B3C">
        <v-icon>mdi-camera-flip-outline</v-icon>
      </v-btn>
      <input type="file"
             style="display: none"
             ref="fileInputPirctureProfile"
             accept="image/png, image/jpeg, image/jpg, image/gif"
             size="5 * 1024 * 1024"
             @change="onFilePictureProfile">
    </div>


    <!--    //Pour les POSTS-->
    <div class="posts" v-for="post in user.posts" :key="post.id">
      <div v-if="post == null">
        <p> L'utilisateur n'as pas fait de posts </p>
      </div>
      <div class="posts__posts-name">
        <p>{{ post.userName }}</p>
        <div class="posts__content">
          <p>{{ post.content }}</p>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "Profile",
  mounted: function () {
    if (this.$store.state.user.uuidUser == "-1") {
      this.$router.push("/")
      return;
    }

    const uuidUser = this.$store.state.user.uuidUser
    this.$store.dispatch('getUserInfos', uuidUser);
  },

  data() {
    return {
      imageUrl: "",
      image: null
    }
  },


  methods: {
    logout: function () {
      this.$store.commit('logout')
      this.$router.push("/")
    },

    updatePictureProfile: function () {
      this.$refs.fileInputPirctureProfile.click();
    },
    onFilePictureProfile: function (event) {
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
        console.log(this.imageUrl)
      })
      fileReader.readAsDataURL(files)
      this.image = files
      console.log(this.image)
    },

    validPictureProfile: function () {
      if (!this.image) {
        return;
      }

      const formData = new FormData()
      formData.append('profile', this.image)
      console.log(formData.get('profile'))

      const payload = {
        uuidUser: this.$store.state.user.uuidUser,
        picture: formData

      }
      this.$store.dispatch('updatePictureProfile', payload)
      this.image = null
      this.imageUrl = ""
    },

  },

  computed: {
    ...mapState({
      user: "userInfos",
      picture : "pictureProfile"
    }),
  }
}


</script>

<style scoped lang="scss">

.card {

  &__picture-container {

    width: 50%;
    margin: 0 auto;
    border: 2px solid burlywood;
    border-radius: 50%;
    position: relative;


    .card__picture-img {
      border-radius: 50%;
      max-width: 100%;
    }

    .card__picture-btn {
      position: absolute;
      right: 0;
      bottom: 1%;
    }

    .card__picture-btn-valid {
      position: absolute;
      right: 75%;
      bottom: 6%;
    }
  }

  .posts {
    height: 100px;
  }

}

</style>