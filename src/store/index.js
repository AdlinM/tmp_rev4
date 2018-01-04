import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toggled: false,
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token')
  },
  mutations: {
    changeToggled (state) {
      if (state.toggled) {
        state.toggled = false
      } else {
        state.toggled = true
      }
    },
    login (state, tokens) {
      state.accessToken = tokens.access_token
      state.refreshToken = tokens.refresh_token
      console.log(state.accountData)
      if (!tokens.account_data !== null) {
        state.accountData = tokens.account_data
      }
    },
    logout (state) {
      state.toggled = false
      state.accessToken = null
      state.refreshToken = null
      state.error = null
    },
    beginPreload (state) {
      state.isPreloading = true
    },
    endPreload (state) {
      state.isPreloading = false
    }
  },
  actions: {
    doToggled ({
      commit
    }) {
      commit('changeToggled')
    },
    login ({
      state,
      commit,
      dispatch,
      rootState
    }, credentials) {
      return axios.post(window.AppConfig.baseApiUrl + 'oauth', {
        username: credentials.username,
        password: credentials.password,
        grant_type: 'password',
        client_id: window.AppConfig.clientId,
        client_secret: window.AppConfig.clientSecret
      })
      .then(response => {
        const a = response.data
        return dispatch('getAccountData', a.access_token).then((response) => {
          return dispatch('saveTokens', {tokens: a, accountData: JSON.stringify(response), isLocalLogin: false})
        }).catch(error => {
          return Promise.reject(error)
        })
      })
      .catch(error => {
        return Promise.reject(error)
      })
    },
    getAccountData ({
      state,
      commit,
      dispatch
    }, accessToken) {
      return axios.get(window.AppConfig.baseApiUrl + 'api/me', {headers: { Authorization: 'Bearer ' + accessToken }})
      .then(response => {
        return response.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
    },
    refreshToken ({
      state,
      commit,
      rootState
    }) {
      return axios.post(window.AppConfig.baseApiUrl + 'oauth', {
        grant_type: 'refresh_token',
        client_id: window.AppConfig.clientId,
        client_secret: window.AppConfig.clientSecret,
        refresh_token: state.refreshToken
      }).then(response => {
        return response.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
    },
    localLogin () {
      return {
        data: {
          access_token: localStorage.getItem('access_token'),
          refresh_token: localStorage.getItem('refresh_token')
        }
      }
    },
    logout ({
      commit,
      state
    }) {
      return axios.post(window.AppConfig.baseApiUrl + 'oauth/revoke', {
        token_type_hint: 'access_token',
        token: state.accessToken
      }).then(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        commit('logout')
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        commit('logout')
      })
    },
    saveTokens ({
      state,
      commit,
      dispatch,
      rootState
    }, params) {
      let a = params.tokens.access_token
      let b = params.tokens.refresh_token
      const c = params.accountData === null ? state.accountData : params.accountData
      if (!params.isLocalLogin) {
        localStorage.setItem('access_token', a)
        localStorage.setItem('refresh_token', b)
        localStorage.setItem('account_data', c)
      }
      commit('login', {
        access_token: a,
        refresh_token: b,
        account_data: c
      })
      axios.interceptors.request.use(config => {
        if (state.accessToken !== null) {
          config.headers.Authorization = 'Bearer ' + state.accessToken
        }
        return config
      })
      return axios.interceptors.response.use(undefined, function (err) {
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          return new Promise(function (resolve, reject) {
            return dispatch('refreshToken').then(response => {
              localStorage.setItem('access_token', response.access_token)
              localStorage.setItem('refresh_token', response.refresh_token)
              commit('login', {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                account_data: state.accountData
              })
              err.config.__isRetryRequest = true
              // err.config.headers.Authorization = 'Bearer ' + response.access_token
              return axios(err.config).then(resolve, reject)
            }).catch(() => {
              commit('logout')
              return router.push('/login')
            })
          })
        } else if (err.response.status === 400) {
          commit('logout')
          return router.push('/login')
        } else {
          return Promise.reject(err)
        }
      })
    },
    beginPreload: ({commit}) => commit('beginPreload'),
    endPreload: ({commit}) => commit('endPreload')
  },
  getters: {
    getToggled: state => {
      return state.toggled
    },
    isLoggedIn: state => {
      return state.accessToken
    },
    accessTokenHeader: state => {
      return 'Bearer' + state.accessToken
    },
    accessTokens: state => {
      return {
        access_token: state.accessToken,
        refresh_token: state.refreshToken
      }
    },
    accountData: state => {
      return JSON.parse(state.accountData)
    },
    isPreloading: state => state.isPreloading
  }
})
