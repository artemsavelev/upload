import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reportWarming: []
  },
  mutations: {
    doWarmMutations(state, data) {
      console.log('warm mutations', data)
      state.reportWarming = data

    }

  },
  actions: {
    async doWarmActions({commit}) {
      const data = {
        url: "10.33.8.109:5432",
        base: "bi-project-05",
        user: "postgres",
        password: "postgres",
        command_type: "GetData",
        schema: "",
        table: "vdwh_content",
        columns: []
      }

      // const response = await fetch('http://10.33.8.109:9040/DataSource/GetData', {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      //
      // }).then(res => {
      //   console.log(res)
      // })
      //
      // headers: {
      //   'Content-type': 'application/json'
      // },

      await axios.post('http://10.33.8.109:9040/DataSource/GetData',
          data, {
            headers: {
              'Content-type': 'application/json',
            },
          }
      )
          .then(response => {
            console.log('warm', response)
            commit('doWarmMutations', response.data)
          })
          .catch(error => {
            console.log(error);
          });
    },
  },
  getters: {
    doWarmGetter(state) {
      return state.reportWarming
    }

  },
  modules: {
  }
})
