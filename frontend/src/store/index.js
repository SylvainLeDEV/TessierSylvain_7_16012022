import {createStore} from 'vuex'

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/user/',
});

const instancePosts = axios.create({
    baseURL: 'http://localhost:3000/api/post/'
})

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
        // Profiles USER
        status: [''],
        user: user,
        userInfos: {},
        dataUserForInfos: {
            firstName: "",
            lastName: "",
            email: "",
        },
        pictureProfile: '',
        poste: '',
        bio: '',
        createdAt: {
            createdAt: "",
            temps: ""
        },
        deleteUser: null,
        // POSTS
        allPosts: []

    },
    getters: {
        getUser: function (state) {
            return state.userInfos
        },
    },

    mutations: {

        //PROFILE USER
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

            const dateCreatProfile = new Date(userInfos.createdAt)
            let dateLocale = dateCreatProfile.toLocaleString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            state.createdAt.temps = dateCreatProfile
            state.createdAt.createdAt = dateLocale
            state.dataUserForInfos.firstName = userInfos.firstName
            state.dataUserForInfos.lastName = userInfos.lastName
            state.dataUserForInfos.email = userInfos.email
            state.bio = userInfos.bio

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
        },

        updateUserPoste: function (state, updateUserPoste) {
            state.poste = updateUserPoste
        },

        updateUserBio: function (state, updateUserBio) {
            state.bio = updateUserBio
            console.log("updatebio", updateUserBio)
        },

        deleteUser: function (state, deleteUser) {
            state.user = {
                uuidUser: "-1",
                token: "",
            }
            localStorage.removeItem('user')
            state.deleteUser = deleteUser
            console.log(deleteUser)
        },

        //POSTS
        allPosts: function (state, allPosts){
            state.allPosts = allPosts
        }
    },
    actions: {
        //PROFILE
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
                    // console.log(response)
                })
                .catch((error) => {
                    commit("setStatus", "error_auth")
                    console.log(error)
                });
        },

        updateUserInfos: ({commit}, payloadUserInfos) => {
            console.log(payloadUserInfos)
            console.log(payloadUserInfos.dataUser)
            instance.put('/' + payloadUserInfos.uuidUser, payloadUserInfos.dataUser, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    commit('setStatus', 'userInfosUpdate')
                    console.log(response)
                })
                .catch((err) => {
                    commit("setStatus", 'userInfosUpdate_error')
                    console.log(err)
                })
        },

        updatePictureProfile: ({commit}, payload) => {
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

        updateUserBio: ({commit}, payloadUpdateBio) => {
            console.log(payloadUpdateBio)
            console.log(payloadUpdateBio.updateBio)
            instance.put('/' + payloadUpdateBio.uuidUser, payloadUpdateBio.updateBio, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    commit('setStatus', 'update_bio')
                    commit('updateUserBio', response.data.profileObject.bio)
                    console.log(response)
                })
                .catch(() => {
                    commit("setStatus", 'update_bio_error')
                })
        },

        updateUserPoste: ({commit}, payloadUpdatePoste) => {
            console.log(payloadUpdatePoste)
            console.log(payloadUpdatePoste.updatePoste)
            instance.put('/' + payloadUpdatePoste.uuidUser, payloadUpdatePoste.updatePoste, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    commit('setStatus', 'update_poste')
                    commit('updateUserPoste', response.data.profileObject.poste)
                    console.log(response)
                })
                .catch((err) => {
                    commit("setStatus", 'update_poste_error')
                    console.log(err)
                })
        },

        deleteUser: ({commit}, payloadDeleteUser) => {
            instance.post('/login', {
                email: payloadDeleteUser.email,
                password: payloadDeleteUser.password
            })
                .then((response) => {
                    commit('setStatus', 'user_ok')
                    console.log(response)

                    instance.delete('/' + payloadDeleteUser.uuidUser)
                        .then((response) => {
                            commit('deleteUser', true)
                            console.log(response)
                        })
                        .catch((err) => {
                            commit('deleteUser', false)
                            console.log(err)
                        })

                })
                .catch((error) => {
                    commit('setStatus', 'error_password')
                    console.log(error)
                });
        },

        //POSTS

        getAllPosts: ({commit}) => {
            commit("setStatus", "loading_posts")
            instancePosts.get('/' )
                .then((response) => {
                    commit('allPosts', response.data)
                    console.log(response.data)
                })
                .catch((err) => {
                    commit('setStatus', "no_posts")
                    console.log(err)
                })
        },

        addPost: ({commit}, payloadAddPost) => {
            console.log(payloadAddPost)
            commit("setStatus", "post_posted")
            instancePosts.post('/', payloadAddPost,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response)=> {
                    console.log(response)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
    },
    modules: {}
})
