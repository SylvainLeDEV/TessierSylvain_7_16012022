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
      <v-card>
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
                    :error-messages="errorMessage"
                    required
                ></v-text-field>

              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Password"
                    type="password"
                    v-model="password"
                    hint="example of helper text only on focus"
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
import isEmail from 'validator/lib/isEmail'

export default {
  name: 'UpdateInfoUser',

  data: () => ({
    dialog: false,
    firstNameUpdate: "",
    lastNameUpdate: "",
    emailUpdate: "",
    errorMessage: '',
    password: '',
  }),

  methods: {

    getInfosUser: function () {
      console.log(this.email)
      console.log(this.password)
      if (this.email !== undefined && isEmail(this.email)) {

        const updateInfosUser = {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          bio: undefined,
          poste: undefined
        }

        const payloadUserInfos = {
          uuidUser: this.$store.state.user.uuidUser,
          dataUser: updateInfosUser,
        }

        console.log(payloadUserInfos)

        this.$store.dispatch('updateUserInfos', payloadUserInfos)

        this.dialog = false
        location.reload()
      } else if (!this.email) {

        const updateInfosUser = {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
          bio: undefined,
          poste: undefined
        }

        const payloadUserInfos = {
          uuidUser: this.$store.state.user.uuidUser,
          dataUser: updateInfosUser,
        }

        console.log(payloadUserInfos)

        this.$store.dispatch('updateUserInfos', payloadUserInfos)

        this.dialog = false
        location.reload()

      } else {
        alert('Email valide obligatoire ')
        this.dialog = true
      }

      if (this.password) {
        if (this.password > 4) {
          const updateInfosUser = {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            bio: undefined,
            poste: undefined
          }

          const payloadUserInfos = {
            uuidUser: this.$store.state.user.uuidUser,
            dataUser: updateInfosUser,
          }

          console.log(payloadUserInfos)

          this.$store.dispatch('updateUserInfos', payloadUserInfos)

          this.dialog = false
          location.reload()
        } else {
          alert('mdp de plus de 4 character')
          this.dialog = true
        }
      }

    },
  },

  computed: {
    ...mapState({
      user: "userInfos",
      dataUserForInfos: 'dataUserForInfos',
    }),
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.v-dialog .v-overlay__content > .v-card, .v-dialog .v-overlay__content > .v-sheet {
  overflow-y: auto;
  max-height: 90vh;
  transform: translateY(-20%);
}

.v-dialog .v-overlay__content > .v-card > .v-card-text {
  padding: 0;
}

</style>
