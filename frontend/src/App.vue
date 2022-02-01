<template>
<!--  <Loader/>-->
  <v-app>
    <v-layout style="overflow: hidden">
      <v-app-bar
          absolute
          color="deep-purple"
      >
        <v-app-bar-nav-icon v-if="$route.path !== '/'" @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Groupomania</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer v-if="$route.path !== '/'"
                           v-model="drawer"
                           absolute
                           temporary >
        <v-list nav dense >
          <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
            <v-list-item prepend-icon="mdi-home" title="Groupomania" to="/posts"></v-list-item>

            <v-list-item prepend-icon="mdi-account" title="Profile" to="/profile"></v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-card
            class="mx-auto overflow-hidden"
            height="400"
        >
          <router-view/>
        </v-card>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>

// import Loader from "@/components/Loader";

export default {
  name: 'App',
  // components: {Loader},
  data: () => ({
    drawer: false,
    group: null,
  }),
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

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

#app {
  max-width: 100%;
  //align-items: center;
  //justify-content: center;
  //padding: 32px;
}

body {
  //background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);
  background: -webkit-gradient(linear, left top, left bottom, from(#9356DC), to(#FF79DA));
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 15px;
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
  background: #2196F3;
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
  color: #2196F3;
  text-decoration: underline;
}

.card__action:hover {
  cursor: pointer;
}

.button:hover {
  cursor: pointer;
  background: #1976D2;
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