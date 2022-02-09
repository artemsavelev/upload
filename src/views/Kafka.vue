<template>
  <div>
    <div class="col-sm-12">
      <div class="row" v-if="fileProgress > 0">
        <div class="col-sm-12 text-center mb-4">
          <div class="progress" style="height: 20px">
            <div class="progress-bar" role="progressbar" :style="{ width: fileProgress + '%'}">{{ fileCurrent }}%</div>
          </div>
        </div>
      </div>

      <h5>Отправка данных в Kafka</h5>
      <div class="input-group input-group-sm mb-3 col-sm-7 mt-3">
        <span class="input-group-text" id="basic-addon1">Создать топик</span>
        <input type="text" class="form-control" v-model="topic" placeholder="введите название топика" aria-label="Username" aria-describedby="basic-addon1">
        <button type="button" class="btn btn-primary" @click="createTopic">Создать топик</button>
        <button type="button" class="btn btn-primary" @click="send">Отправить данные в топик</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Kafka",
  props: [''],
  computed: {
  },
  data () {
    return {
      fileProgress: 0,
      fileCurrent: '',
      topic: '',
      data: []


    }
  },
  methods: {
    async createTopic() {
      // console.log(this.topic)

      await axios.post('http://10.33.8.109:8082/make_topic', this.topic,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then(response => {
            // console.log(response)
          })
          .catch(error => {
            console.log(error);
          });
    },
    async send() {
      const data = {
        topic: this.topic,
        dataBase: {
          url: "10.0.4.108:5432",
          base: "chd_chigik2",
          user: "postgres",
          password: "pgsqlom",
          command_type: "GetData",
          schema: "",
          table: "RegDannie-po-passazhiropotoku",
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
            console.log(response)
          })
          .catch(error => {
            console.log(error);
          });
    },

  }
}
</script>

<style scoped>

</style>