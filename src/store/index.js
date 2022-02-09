import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import notify from "@/store/notify";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reportWarming: []
  },
  mutations: {
    doWarmMutations(state, data) {
      // console.log('warm mutations', data)
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
      // })

      // response.json().then(e => {
      //   commit('doWarmMutations', e)
      //     }
      // )


      await axios.post('http://10.33.8.109:9040/DataSource/GetData',
          data, {
            headers: {
              'Content-type': 'application/json',
            },
          }
      )
          .then(response => {
            if (response.status === 200) {
              // console.log('warm', response)
              commit('doWarmMutations', response.data)
            }
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
    notify
  }
})
