<template>
  <div>
    <div class="col-sm-12">
      <h5 class="mt-5">Отправка данных в Kafka</h5>
      <div class="input-group input-group-sm mb-3 col-sm-7 mt-3">
        <span class="input-group-text" id="basic-addon1">Ввод наименования топика</span>
        <input type="text" class="form-control" v-model="topic" placeholder="введите название топика" aria-label="Username" aria-describedby="basic-addon1">
        <button type="button" class="btn btn-primary" @click="createTopic" :disabled="!activate">Создать топик</button>
        <button type="button" class="btn btn-primary" @click="send" :disabled="!activateSend">Отправить данные</button>
<!--        <button type="button" class="btn btn-primary" @click="makeToast">Тест</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mapActions} from "vuex";

export default {
  name: "Kafka",
  components: {},
  props: ['tableName', 'clear'],
  computed: {
  },
  data () {
    return {
      fileProgress: 0,
      fileCurrent: '',
      topic: '',
      data: [],
      activate: false,
      activateSend: false

    }
  },
  mounted() {

  },
  updated() {
    this.activate = !!this.topic.length;
  },
  methods: {
    ...mapActions(['showSnack']),

    makeToast(message) {
      const data = {
        message: 'Топик с именем - "' +  message + '" создан.',
        color: 'success',
        icon: ''
      }
      this.showSnack(data)
      this.topic = ''
    },

    async createTopic() {
      await axios.post('http://10.33.8.109:8082/make_topic', this.topic,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then(response => {
            if (response.status === 200) {
              // console.log(response)
              const data = {
                message: 'Топик с именем - "' + this.topic + '" создан.',
                color: 'success',
                icon: ''
              }
              this.showSnack(data)
              this.activateSend = true
              console.log('Created topic ', this.topic)
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    async send() {
      let data = {
        topic: this.topic,
        dataBase: {
          url: "10.0.4.108:5432",
          base: "lusiadas",
          user: "postgres",
          password: "pgsqlom",
          command_type: "GetData",
          schema: "upload csv",
          table: this.tableName,
          columns: []
        }
      }

      await axios.post('http://10.33.8.109:8082/create_task?direction=out', data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            if (response.status === 200) {
              // console.log(response)
              const data = {
                message: 'Данные отправлены',
                color: 'success',
                icon: ''
              }
              this.showSnack(data)
              console.log('Send message in topic ', this.topic)
              this.topic = ''
            }
          })
          .catch(error => {
            console.log(error);
          });

      data = {}
    },

  }
}
</script>

<style scoped>

</style>