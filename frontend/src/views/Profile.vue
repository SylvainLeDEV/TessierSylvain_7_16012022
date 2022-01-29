<template>

  <div class="card">
    <h1 class="card__title">Espace Perso</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>
    <!--    <p>{{user.prenom}} {{user.nom}} {{user.email}}</p>-->
    <!--    <img :src="user.photo"/>-->
    <div class="form-row">
      <button @click="logout()" class="button">
        Déconnexion
      </button>
    </div>
  </div>

</template>

<script>

export default {
  name: " Profile",

  mounted: function () {
    console.log(this.$store.state.user)
    if (this.$store.state.user.uuidUser == "-1") {
      this.$router.push("/")
      return ;
    }
    const uuidUser = this.$store.state.user.uuidUser
    this.$store.dispatch('getUserInfos', uuidUser);
  }

}

</script>

<style>

</style>