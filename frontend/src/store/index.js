import {createStore} from 'vuex'

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/user/',
});

export default createStore({
    state: {
        status: '',
        user: {
            uuidUser: "-1",
            token: "",
        },
        userInfos: {},
    },

    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },

        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            state.user = user;
        },

        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
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
                        commit("setStatus", "")
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
            console.log("test : ", uuidUser)
            instance.get('/'+ uuidUser )
                .then((response) => {
                    commit("userInfos", response.data)
                    console.log(response)

                })
                .catch((error) => {
                    console.log(error)
                });
        }

    },
    modules: {}
})
