<template>

  <div class="card">
    <h1 class="card__title" v-if="mode == 'login' "> Connexion </h1>

    <h1 class="card__title" v-else> Inscription </h1>

    <p class="card__subtitle" v-if="mode == 'login'"> Tu n'as pas encore de compte ? <span class="card__action"
                                                                                           @click="switchToCreateAccount"> Créer un compte </span>
    </p>
    <p class="card__subtitle" v-else> Tu as déjà un compte ? <span class="card__action" @click="switchToLogin"> Se connecter </span>
    </p>
    <div class="form-row">
      <input v-model="email" type="email" class="form-row__input" placeholder="Adresse mail">
    </div>

    <div class="form-row" v-if="mode == 'create'">
      <input v-model="firstName" type="text" class="form-row__input" placeholder="Prénom">
      <input v-model="lastName" type="text" class="form-row__input" placeholder="Nom">
    </div>

    <div class="form-row" v-if="mode == 'create'">
      <select v-model="poste" name="poste" id="poste" class="form-row__select">
        <option value='' class="form-row__placeholder-poste" hidden>Votre poste au sains de l'entreprise</option>
        <option value="Directeur général">Directeur général</option>
        <option value="Digital Brand Manager">Digital Brand Manager</option>
        <option value="Responsable communication">Responsable communication</option>
        <option value="Responsable marketing">Responsable marketing</option>
        <option value="développeur">Développeur</option>
        <option value="Designer">Designer</option>
      </select>
    </div>

    <div class="form-row">
      <input v-model="password" type="password" class="form-row__input" placeholder="Mot de passe">
    </div>

    <div class="form-row__invalid" v-if=" mode == 'login' && status == 'error_login'">
      Adresse mail et ou mot de passe invalide
    </div>

    <div class="form-row__invalid" v-if=" mode == 'create' && status == 'error_create'">
      Adresse mail déjà utilisée
    </div>

    <div class="form-row">
      <button @click="login" class="button" :class="{'button--disabled' : !validatedFileds}" v-if="mode == 'login'">
        <span v-if=" status == 'loading' ">Connexion en cours...</span>
        <span v-else>Connexion</span>
      </button>
      <button @click="createAccount" class="button" :class="{'button--disabled' : !validatedFileds}" v-else>
        <span v-if=" status == 'loading' ">Création en cours... <Loader/></span>
        <span v-else>Créer un compte</span>
      </button>
    </div>


  </div>

</template>

<script>

import {mapState} from 'vuex'
import Loader from "@/components/Loader";

export default {
  name: "login",
  components: {Loader},
  data: function () {
    return {
      mode: 'login',
      email: '',
      firstName: '',
      lastName: '',
      poste: '',
      password: '',

    }
  },

  mounted: function () {
    if (this.$store.state.user.uuidUser !== "-1") {
      this.$router.push("/profile/")
      return;
    }
  },

  computed: {
    validatedFileds: function () {
      if (this.mode == 'create') {
        if (this.email != "" && this.firstName != "" && this.lastName != "" && this.poste != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"])
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },

    login: function () {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      }).then(() => {
        this.$router.push("/profile")
      }).catch((error) => {
        console.log(error)
      })
    },

    createAccount: function () {
      this.$store.dispatch('createAccount', {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        poste: this.poste,
        password: this.password
      }).then((response) => {
        this.login();
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
      console.log(this.email, this.firstName, this.lastName, this.poste, this.password)
    },
  },
}


</script>

<style scoped lang="scss">

.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;


  &__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex: 1;
    min-width: 100px;
    color: black;

    &__::placeholder {
      color: #aaaaaa;
    }

  }

  &__select {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex: 1;
    min-width: 100px;
    color: black;

  }

  &__invalid {
    color: red;
  }

}

</style>