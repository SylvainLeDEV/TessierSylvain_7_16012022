<template>

  <div class="card">

    <div class="form-row">
      <button @click="logout" class="button">
        Déconnexion
      </button>
    </div>

    <h1 class="card__title">{{ user.firstName }}</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>
    <img class="card__picture" :src="user.picture" alt="Image de profile">

    <div class="posts" v-for="post in user.posts" :key="post.id">
      <div class="posts__posts-name">
        <p>{{ post.userName }}</p>
        <div class="posts__content">
            <p>{{post.content}}</p>
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

  &__picture {

    width: 50%;
    border: 2px solid burlywood;
    border-radius: 50%;
  }

}

</style>