<template>
<!--    <Loader/>-->
  <v-app>
    <v-layout style="overflow: hidden">
      <v-app-bar
          absolute
          color="blue"
      >
        <v-app-bar-nav-icon v-if="$route.path !== '/'" @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-img alt="Logo groupomania" src="@/assets/Groupomania_logos/icon-left-font-monochrome-white.png" />
      </v-app-bar>
      <v-navigation-drawer v-if="$route.path !== '/'"
                           v-model="drawer"
                           absolute
                           temporary>
        <v-list nav dense>
          <v-list-item-group @click="drawer = !drawer" v-model="group" active-class="deep-purple--text text--accent-4">
            <v-list-item alt="test" prepend-icon="mdi-home" title="Groupomania" to="/posts"></v-list-item>

            <v-list-item alt="test" prepend-icon="mdi-account" title="Profil" @click="userProfile()"></v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-card
            class="mx-auto overflow-auto"
            height="100vh">

          <router-view/>
        </v-card>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>



export default {

  mounted() {

  },
  name: 'App',
  data: () => ({
    drawer: false,
    group: null,
    uuid: ''
  }),
  methods: {

    userProfile: async function () {

      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'))
        this.uuid = user.uuidUser

       await this.$router.push({name: 'Profile', params: {uuid: this.uuid}})
      }
      const uuidUser = location.href.substring(location.href.lastIndexOf('/') + 1)
      if (uuidUser === this.uuid) {
       await location.reload()
      }

    }

  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #082043;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #082043;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');
* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app > div > div > div > header > div > div > img {
  width: 50%;
  height: 100%;
  object-fit: cover;
  left: 50%;
  transform: translateX(-50%);
}

#app {
  max-width: 100%;

}

body {
  //background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);
  background: #e7e7e7;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}


.card {
  max-width: 100%;
  width: 540px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  z-index: -1;
}

.card__title {
  text-align: center;
  font-weight: 800;
}

.card__subtitle {
  text-align: center;
  color: #666;
  font-weight: 500;
}

.button {
  background: #082043;
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: .4s background-color;
}

.card__action {
  color: #082043;
  text-decoration: underline;
}

.card__action:hover {
  cursor: pointer;
}

.button:hover {
  cursor: pointer;
  background: #082043;
}

.button--disabled {
  background: #cecece;
  color: #ececec
}

.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}
</style>