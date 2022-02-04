<template>

  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
    >
      <template v-slot:activator="{ props }">
        <button v-bind="props">
          Modifier ces informations
        </button>
      </template>
      <v-card class="card">
        <v-card-title>
          <span class="text-h5">Modifier vos informations</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"
                     sm="6"
                     md="4">
                <v-text-field
                    label="Prénom"
                    v-model="firstName"
                    required
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Nom"
                    v-model="lastName"
                    hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                    label="Email"
                    v-model="email"
                    error-messages="Email non valide"
                    :rules="[errorFunc]"
                    required
                ></v-text-field>
                

              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue-darken-1"
              text
              @click="dialog = false"
          >
            Fermer
          </v-btn>
          <v-btn
              color="blue-darken-1"
              text
              @click="getInfosUser"
          >
            Sauvegarder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

</template>

<script>
import {mapState} from "vuex";
// import validator from 'validator'

export default {
  name: 'UpdateInfoUser',

  data: () => ({
    dialog: false,
    firstNameUpdate: "",
    lastNameUpdate: "",
    emailUpdate: "",
  }),

  methods: {

    isChampsOk: function () {

      if (this.email !== "") {
        return true
      } else {
        return false
      }


    },
    errorFunc:function (){
        return "true"

    },
    getInfosUser: function () {

      const updateInfosUser = {
        email: this.email,
        firstName:this.firstName,
        lastName:this.lastName,
        bio: undefined,
        poste:undefined
      }
      // const formData = new FormData()
      // formData.append('profile', null)
      const payloadUserInfos = {
        uuidUser: this.$store.state.user.uuidUser,
        dataUser : updateInfosUser,
      }

      console.log(payloadUserInfos)

      this.$store.dispatch('updateUserInfos', payloadUserInfos)

      console.log(this.firstName, this.lastName, this.email)

      this.dialog = false
    },
  },

  computed: {
    ...mapState({
      user: "userInfos",
      dataUserForInfos : 'dataUserForInfos',
      picture: "pictureProfile",
    }),
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.v-dialog .v-overlay__content > .v-card, .v-dialog .v-overlay__content > .v-sheet {
  overflow: auto;
  max-height: 78vh;
  transform: translateY(-20%);
}

.v-dialog .v-overlay__content > .v-card > .v-card-text {
  padding: 0;
}

</style>
