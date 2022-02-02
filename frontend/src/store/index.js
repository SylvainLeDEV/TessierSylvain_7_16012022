import {createStore} from 'vuex'

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/user/',
});

let user = localStorage.getItem('user')
if (!user) {
    user = {
        uuidUser: "-1",
        token: "",
    }
} else {
    try {
        user = JSON.parse(user)
        instance.defaults.headers.common['Authorization'] = user.token;
    } catch (ex) {
        user = {
            uuidUser: "-1",
            token: "",
        }
    }
}

export default createStore({
    state: {
        status: [''],
        user: user,
        userInfos: {},
        pictureProfile: '',
        createdAt:''
    },

    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },

        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            localStorage.setItem('user', JSON.stringify(user))
            state.user = user;
        },

        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
            state.createdAt = userInfos.createdAt
        },

        logout: function (state) {
            state.user = {
                uuidUser: "-1",
                token: "",
            }
            localStorage.removeItem('user')
        },

        updatePictureProfile: function (state, updatePictureProfile) {
            state.pictureProfile = updatePictureProfile
        }

    },
    actions: {
        createAccount: ({commit}, userInfo) => {
            commit("setStatus", "loading")
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/register', {
                    email: userInfo.email,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    poste: userInfo.poste,
                    password: userInfo.password
                })
                    .then((response) => {
                        commit("setStatus", "created")
                        resolve(response)
                    })
                    .catch((error) => {
                        commit("setStatus", "error_create")
                        reject(error)
                    });
            })
        },

        login: ({commit}, userInfo) => {
            commit("setStatus", "loading")
            return new Promise((resolve, reject) => {
                instance.post('/login', {
                    email: userInfo.email,
                    password: userInfo.password
                })
                    .then((response) => {
                        commit("logUser", response.data)
                        resolve(response)
                    })
                    .catch((error) => {
                        commit("setStatus", "error_login")
                        reject(error)
                    });
            })
        },

        getUserInfos: ({commit}, uuidUser) => {
            instance.get('/' + uuidUser)
                .then((response) => {
                    commit("userInfos", response.data)
                    commit("updatePictureProfile", response.data.picture)
                    console.log(response)
                })
                .catch((error) => {
                    commit("setStatus", "error_auth")
                    console.log(error)
                });
        },

        updatePictureProfile: ({commit}, payload) => {
            console.log(payload.picture)
            console.log(payload.uuidUser)
            instance.put('/' + payload.uuidUser, payload.picture
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    commit("setStatus", "picture_upload")
                    commit("updatePictureProfile", response.data.profileObject.picture)
                    console.log(response.data.profileObject.picture)
                })
                .catch((erro) => {
                    commit("setStatus", "picture_error")
                    console.log(erro)
                })
        },

    },
    modules: {}
})
