import {createStore} from 'vuex'

const axios = require('axios');

let user = localStorage.getItem('user')

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/user/',
});

const instancePosts = axios.create({
    baseURL: 'http://localhost:3000/api/post/',
})

if (!user) {
    user = {
        uuidUser: "-1",
        token: "",
    }
} else {
    try {
        user = JSON.parse(user)
        instance.defaults.headers.common['Authorization'] = user.token;
        instancePosts.defaults.headers.common['Authorization'] = user.token;
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
        pictureProfile: '',
        poste: '',
        bio: '',
        createdAt: {
            createdAt: "",
            temps: ""
        },
        deleteUserStatus: null,
        // POSTS
        allPosts: [],
        postCreatedAt: []

    },
    getters: {
        getUser: function (state) {
            return state.userInfos
        },
        getAllPosts: function (state) {
            return state.allPosts
        },
    },

    mutations: {

        //PROFILE USER
        setStatus: function (state, status) {
            state.status = status;
        },

        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            instancePosts.defaults.headers.common['Authorization'] = user.token;
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
        },

        deleteUserStatus: function (state, deleteUserStatus) {
            state.user = {
                uuidUser: "-1",
                token: "",
            }
            localStorage.removeItem('user')
            state.deleteUserStatus = deleteUserStatus

        },

        //POSTS
        allPosts: function (state, allPosts) {
            allPosts.forEach((post) => {
                const datePostCreat = new Date(post.createdAt)
                let dateLocal = datePostCreat.toLocaleString('fr-FR', {
                    hour: 'numeric',
                    minute: 'numeric',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                post.comment.forEach((comment) => {

                    let timeDiff = function (date1, date2) {
                        let a = new Date(date1).getTime(),
                            b = new Date(date2).getTime(),
                            diff = {};

                        diff.milliseconds = a > b ? a % b : b % a;
                        diff.seconds = diff.milliseconds / 1000;
                        diff.minutes = diff.seconds / 60;
                        diff.hours = diff.minutes / 60;
                        diff.days = diff.hours / 24;
                        diff.weeks = diff.days / 7;

                        return diff;
                    }
                    const dateNow = new Date()
                    const datePostCreat = new Date(comment.createdAt)
                    const timeDiffComment = timeDiff(dateNow, datePostCreat)
                    switch (true) {
                        case timeDiffComment.minutes <= 59 :
                            comment.createdAt = `${Math.trunc(timeDiffComment.minutes)}min`
                            break;

                        case timeDiffComment.days <= 1 :
                            comment.createdAt = `${Math.trunc(timeDiffComment.hours)}h`
                            break;

                        case timeDiffComment.weeks <= 1 :
                            comment.createdAt = `${Math.trunc(timeDiffComment.days)} jour(s)`
                            break;

                        case timeDiffComment.weeks >= 1 :
                            comment.createdAt = `${Math.trunc(timeDiffComment.weeks)} semaine`
                            break;

                        default:
                            console.log(timeDiffComment);
                    }
                })
                return post.createdAt = dateLocal
            })
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
                })
                .catch((error) => {
                    commit("setStatus", "error_auth")
                    console.log(error)
                });
        },

        updateUserInfos: ({commit}, payloadUserInfos) => {
            instance.put('/' + payloadUserInfos.uuidUser, payloadUserInfos.dataUser, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    commit('setStatus', 'userInfosUpdate')
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
                })
                .catch((erro) => {
                    commit("setStatus", "picture_error")
                    console.log(erro)
                })
        },

        updateUserBio: ({commit}, payloadUpdateBio) => {

            instance.put('/' + payloadUpdateBio.uuidUser, payloadUpdateBio.updateBio, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    commit('setStatus', 'update_bio')
                    commit('updateUserBio', response.data.profileObject.bio)
                })
                .catch(() => {
                    commit("setStatus", 'update_bio_error')
                })
        },

        updateUserPoste: ({commit}, payloadUpdatePoste) => {
            instance.put('/' + payloadUpdatePoste.uuidUser, payloadUpdatePoste.updatePoste, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    commit('setStatus', 'update_poste')
                    commit('updateUserPoste', response.data.profileObject.poste)
                })
                .catch((err) => {
                    commit("setStatus", 'update_poste_error')
                    console.log(err)
                })
        },

        deleteUser: async ({commit}, payloadDeleteUser) => {
            await instance.post('/login', {
                email: payloadDeleteUser.email,
                password: payloadDeleteUser.password
            })
                .then(async () => {
                    commit('setStatus', 'user_ok')

                    await instance.delete('/' + payloadDeleteUser.uuidUser)
                        .then((response) => {
                            commit('deleteUserStatus', true)
                            console.log(response)
                        })
                        .catch((err) => {
                            commit('deleteUserStatus', false)
                            console.log(err)
                        })

                })
                .catch((error) => {
                    commit('setStatus', 'error_password')
                    console.log(error)
                });
        },

        //POSTS

        getAllPosts: async ({commit}) => {
            commit("setStatus", "loading_posts")
            return await new Promise((resolve, reject) => {
                 instancePosts.get('/')
                    .then((response) => {
                        const user = localStorage.getItem('user')
                        const uuidUser = JSON.parse(user)
                        response.data.forEach((post) => {
                            if (uuidUser.uuidUser === post.User.uuid) {
                                post.buttonModify = true
                                post.buttonDelete = true
                            } else {
                                post.buttonModify = false
                                post.buttonDelete = false
                            }

                            post.comment.forEach((comment) => {
                                if (uuidUser.uuidUser === comment.posterId) {
                                    comment.buttonModify = true
                                    comment.buttonDelete = true
                                } else {
                                    comment.buttonModify = false
                                    comment.buttonDelete = false
                                }
                            })

                        })
                        commit('allPosts', response.data)
                        resolve(response)
                    })
                    .catch((err) => {
                        commit('setStatus', "no_posts")
                        console.log(err)
                        reject(err)
                    })
            })
        },

        addPost: async ({commit}, payloadAddPost) => {
            commit("setStatus", "addpost_ok")
            await instancePosts.post('/createpost', payloadAddPost)
                .then(() => {
                    console.log('Add post')
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        deletePost: async ({commit}, payloadDeletePost) => {
            commit("setStatus", "post_posted")
            await instancePosts.delete('/' + payloadDeletePost.uuid)
                .then(() => {
                    console.log('Post Delete')
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        updatePost: async ({commit}, payloadUpdatePost) => {
            commit("setStatus", "post_posted")
            await instancePosts.put('/' + payloadUpdatePost.uuidPost, {
                content: payloadUpdatePost.content,
                uuid: payloadUpdatePost.uuid
            }, {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then((response) => {
                    console.log("Post update :", response)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        addCommentPost: async ({commit}, payloadAddComment) => {
            commit("setStatus", "addComment_ok")
            await instancePosts.patch('/create-comment-post', payloadAddComment)
                .then((response) => {
                    console.log("response addComent :", response)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        deleteComment: async ({commit}, payloadDeleteComment) => {
            console.log("log Payloade dans addPost : ", payloadDeleteComment)
            commit("setStatus", "comment_delete")
            await instancePosts.delete('/delete-comment-post/' + payloadDeleteComment.uuid)
                .then((response) => {
                    console.log("Comment delete :", response)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        updateComment: async ({commit}, payloadUpdateComment) => {
            console.log("log Payloade dans addPost : ", payloadUpdateComment)
            commit("setStatus", "post_posted")
            await instancePosts.put('/edit-comment-post/' + payloadUpdateComment.uuidComment, {
                content: payloadUpdateComment.content,
            })
                .then((response) => {
                    console.log("Post update :", response)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

    },
    modules: {}
})
