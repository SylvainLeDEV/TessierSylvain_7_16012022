<template>
  <div class="card">

    <div class="form-row">
      <button @click="logout" class="button">
        Déconnexion
      </button>
    </div>

    <h1 class="card__title">{{ user.firstName }}</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>

    <div class="card__picture-container">
      <img class="card__picture-img" :src="user.picture" alt="Image de profile">
      <v-btn class="card__picture-btn ma-2"
             text
             icon
             color="#3A3B3C">
        <v-icon>mdi-camera-flip-outline</v-icon>
      </v-btn>
    </div>
    <div class="posts" v-for="post in user.posts" :key="post.id">
      <div v-if="post == null" >
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

  methods: {
    logout: function () {
      this.$store.commit('logout')
      this.$router.push("/")
    }
  },

  computed: {
    ...mapState({
      user: "userInfos"
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
  }

  .posts{
    height: 100px;
  }

}

</style>