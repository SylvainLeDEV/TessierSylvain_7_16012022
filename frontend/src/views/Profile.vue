<template>
  <!--  //Déconexion-->
  <div class="card">

    <h1 class="card__title">{{ user.firstName }}, {{ user.lastName }} </h1>
    <!--    <h1 class="card__title" v-else>{{ user.firstName }}, {{ user.lastName }} </h1>-->
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
          alt="test"
          for="test"
      ></v-btn>

      <v-btn class="card__picture-btn ma-2"
             v-if="getUserUuid"
             @click="updatePictureProfile"
             text
             alt="test"
             icon
             size="small"
             color="#3A3B3C"
             for="test">
        <v-icon>mdi-camera-flip-outline</v-icon>
      </v-btn>
      <label for="test" class="label-btn-camera" >ici</label>
      <input type="file"
             id="test"
             alt="test"
             style="display: none"
             ref="fileInputPirctureProfile"
             accept="image/png, image/jpeg, image/jpg, image/gif"
             size="5242880"
             @change="onFilePictureProfile">
    </div>

    <!--Présentation PROFILE-->

    <div class="profile">
      <p class="profile__email"> Email : {{ user.email }}</p>

      <p class="profile__creatAt"> Nous a rejoints le : {{ createdAt.createdAt }} </p>
      <p class="profile__temps"> ça fait <span> {{ tempsParmiNous }} jours </span> que tu es parmi nous en tant que :
      </p>
      <div>
        <select v-if="getUserUuid" v-model="poste" name="poste" id="poste" @change="updatePoste" ref="poste"
                class="profile__poste">
          <option value="">{{ user.poste }}</option>
          <option value="Directeur général">Directeur général</option>
          <option value="Digital Brand Manager">Digital Brand Manager</option>
          <option value="Responsable communication">Responsable communication</option>
          <option value="Responsable marketing">Responsable marketing</option>
          <option value="Développeur">Développeur</option>
          <option value="Designer">Designer</option>
        </select>

        <p class="profile__poste" v-else>
          {{ user.poste }}
        </p>

      </div>

      <v-textarea
          v-model="bioValue"
          @input="$emit('input', $event.target.value)"
          @change="updateBio"
          color="teal"
          v-if="getUserUuid"
      >
        <template v-slot:label>
          <div>
            Bio <small>(optional)</small><br/>
          </div>
        </template>
      </v-textarea>

      <div v-else class="profile__bio">
        <h3 v-if="user.bio !==null"> Ma bio : </h3>
        <p class="profile__bio">
          {{ user.bio }}
        </p>
      </div>

    </div>

    <!--//Butoon DECONNEXION / MODOFIER / SUPPRIMER PROFILE-->
    <div class="form-row">
      <button @click="logout" class="button" v-if="getUserUuid">
        Déconnexion
      </button>
      <button class="button" v-if="getUserUuid">
        <UpdateInfoUser/>
      </button>
    </div>

    <button @click="deleteProfile" class="button button__deleteUser" v-if="getUserUuid">
      Supprimer le profil (Définitif)
    </button>


  </div>

</template>

<script>
import {mapState} from 'vuex'
import UpdateInfoUser from "@/components/UpdateInfoUser";

export default {
  name: "Profile",
  components: {UpdateInfoUser},
  mounted() {
    if (this.$store.state.user.uuidUser === "-1") {
      this.$router.push("/")
      return;
    }

    const userStorage = JSON.parse(localStorage.getItem('user'))
    const uuidUserStorage = userStorage.uuidUser
    // const uuidUser = this.$store.state.user.uuidUser
    const uuidUser = location.href.substring(location.href.lastIndexOf('/') + 1)
    this.$store.dispatch('getUserInfos', uuidUser)

    if (uuidUserStorage !== uuidUser) {
      return this.getUserUuid = false
    }

  },

  data() {
    const defaultForm = Object.freeze({
      bio: ''
    })
    return {
      form: Object.assign({}, defaultForm),
      imageUrl: "",
      image: null,
      profileCreatedAt: "",
      poste: '',
      bio: '',
      firstName: "",
      lastName: "",
      email: "",
      getUserUuid: true,
    }
  },


  methods: {
    logout: function () {
      this.$store.commit('logout')
      this.$router.push("/")
    },

    // Modifier la photo de profile
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
      })
      fileReader.readAsDataURL(files)
      this.image = files
    },
    validPictureProfile: function () {
      if (!this.image) {
        return;
      }

      const formData = new FormData()
      formData.append('profile', this.image)

      const payload = {
        uuidUser: this.$store.state.user.uuidUser,
        picture: formData
      }
      this.$store.dispatch('updatePictureProfile', payload)
      this.image = null
      this.imageUrl = ""
    },

    //Modifier les information utilisateur
    updateBio: function (e) {
      const updateBio = {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        bio: e.target.value,
        poste: undefined
      }

      const payloadUpdateBio = {
        uuidUser: this.$store.state.user.uuidUser,
        updateBio
      }
      this.bio = e.target.value
      this.$store.dispatch('updateUserBio', payloadUpdateBio)
    },

    updatePoste: function (e) {
      const updatePoste = {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        bio: undefined,
        poste: e.target.value
      }


      const payloadUpdatePoste = {
        uuidUser: this.$store.state.user.uuidUser,
        updatePoste
      }

      this.poste = e.target.value
      this.$store.dispatch('updateUserPoste', payloadUpdatePoste)

    },

    deleteProfile: function () {

      let valeurPassword = prompt('Renseigner votre mot de passe pour valider')


      const payloadDeleteUser = {
        uuidUser: this.$store.state.user.uuidUser,
        email: this.$store.state.userInfos.email,
        password: valeurPassword,
      }
      this.$store.dispatch('deleteUser', payloadDeleteUser)
          .then(() => {
            if (this.$store.state.status === "error_password") {
              alert('Mot de passe incorrect')
            } else if (this.$store.state.deleteUserStatus === true) {
              this.$store.commit('deleteUserStatus')
              this.$router.push("/")
              alert("Profil supprimer")
            } else {
              alert('Utilisateur non trouvé')
            }
          })

    }

  },

  computed: {
    tempsParmiNous() {
      const creatAt = new Date(this.$store.state.createdAt.temps)
      const dateNow = new Date()
      const diffDate = new Date(dateNow.getTime() - creatAt.getTime())
      return diffDate.getUTCDate()
    },

    bioValue() {
      if (this.bio !== "") {
        return this.bio
      } else {
        return this.$store.state.bio
      }
    },

    ...mapState({
      user: "userInfos",
      //temps passé depuis la création du profile en jour !
      createdAt: "createdAt",
      picture: "pictureProfile",
      bio: "bio",
      poste: "poste",
      dataUserForInfos: {
        firstNameUpdate: "firstName",
        lastNameUpdate: "lastName",
        emailUpdate: "email"
      },
    }),
  }
}


</script>

<style scoped lang="scss">
.label-btn-camera{
  display: none;
}
.card {

  &__picture-container {

    width: 200px;
    height: 200px;
    margin: 0 auto;
    border: 3px solid burlywood;
    border-radius: 50%;
    position: relative;


    .card__picture-img {
      border-radius: 50%;
      width: 99%;
      height: 99%;
      object-fit: cover;
    }

    .card__picture-btn {
      position: absolute;
      right: 0;
      bottom: 1%;
    }

    .card__picture-btn-valid {
      position: absolute;
      right: 75%;
      bottom: 4%;
    }
  }

  .posts {
    height: 100px;
  }

  .form-row {
    display: flex;
    flex: 1;
    gap: 16px;

    .button {
      margin: 15px 0;
    }
  }

  .profile {

    &__temps > span {
      font-weight: bold;
    }

    &__poste {
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

    &__bio {

    }
  }

  .button__deleteUser {
    background: #d92932;
  }
}

</style>