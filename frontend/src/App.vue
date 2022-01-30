<template>
    <Loader/>

    <div id="nav">

      <router-link to="/">Login</router-link>
      |
      <router-link to="/profile">Profile</router-link>
      |
      <router-link to="/home">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
</template>

<script>

import Loader from "@/components/Loader";
// import {mapState} from "vuex";
export default {
  components:{Loader},
  // computed: {
  //   ...mapState({
  //     user: "userInfos"
  //   })
  // },
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
  padding: 32px;
}

img {
  max-width: 100%;
  border-radius: 8px;
}

.card {
  max-width: 100%;
  width: 540px;
  background: white;
  border-radius: 16px;
  padding: 32px;

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