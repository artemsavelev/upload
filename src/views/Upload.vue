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

      <div class="input-group input-group-sm mb-3 col-sm-7">
<!--        <label class="input-group-text" for="inputGroupFile01">Загрузить</label>-->
        <input type="file" class="form-control" id="inputGroupFile01" @change="fileInputChange">
      </div>

      <!--      <div class="row" v-if="finish">-->
      <!--        <div class="col-sm-12">-->
      <!--          <ul class="list-group">-->
      <!--            <li class="list-group-item" v-for="file in fileOrders">-->
      <!--              {{ file.name }}-->
      <!--            </li>-->
      <!--          </ul>-->
      <!--        </div>-->
      <!--      </div>-->

      <h5 v-if="uploadTask.length">Загруженные файлы</h5>

      <v-data-table v-if="uploadTask.length"
                    :headers="headers"
                    :items="uploadTask"
                    hide-default-footer
                    class="elevation-1 mt-3">
        <template v-slot:item.actions="{ item }">
          <button type="button" class="btn btn-primary btn-sm" @click="toConvert(item)">Конвертировать</button>
        </template>
      </v-data-table>

      {{ doWarmGetter }}

      <v-data-table
          :headers="headers1"
          :items="this.doWarmGetter"
          hide-default-footer
          class="elevation-1 mt-3">
<!--        <template v-slot:item.actions="{ item }">-->
<!--          <button type="button" class="btn btn-primary btn-sm">Перейти к отправке</button>-->
<!--        </template>-->
      </v-data-table>



    </div>
<!--    <Warm :reportWarming="reportWarming" @transmit="getID" v-if="reportWarming.length"></Warm>-->
    <Kafka v-if="flag && reportWarming.length"></Kafka>

<!--    <Warm :reportWarming="reportWarming" @transmit="getID"></Warm>-->
<!--    <Kafka></Kafka>-->
  </div>
</template>

<script>
import axios from "axios"
import Warm from "@/views/Warm";
import Kafka from "@/views/Kafka";
import {mapActions, mapGetters} from 'vuex'

export default {
  components: {Kafka, Warm},
  computed: {
    ...mapGetters(['doWarmGetter']),
    headers () {
      return [
        { text: 'ID', value: 'guid' },
        // { text: 'Дата и вре', value: 'created' },
        { text: 'Дата и время загрузки', value: 'complit' },
        { text: 'Оригинальное имя файла', value: 'orginal_filename' },
        { text: 'Имя файла на диске', value: 'store_filename' },
        { text: 'Директория на сервере', value: 'store_path' },
        { text: 'Завершено', value: 'isdone' },
        { text: 'Ошибка', value: 'iserror' },
        { text: '', value: 'actions' },
      ]
    },
    headers1 () {
      return [
        { text: 'ID', value: 'guid' },
        { text: 'Created', value: 'db_schema' },
        { text: 'Количество строк подготовлено', value: 'qty_row_cashed' },
        { text: 'Общее количество строк', value: 'qty_row_source' },
        { text: 'Общее количество строк', value: 'ref_data_source' },
        { text: 'Original filename', value: 'ref_source_table' },
        { text: 'Таблица', value: 'vdwh_tablename' },
        { text: 'Завершено', value: 'warming_done' },
        { text: '', value: 'actions' },
      ]
    },
  },
  data () {
    return {
      ...mapActions(['doWarmActions']),
      finish: false,
      flag: false,
      uploadTask: [],
      fileOrders: [],
      fileFinish: [],
      fileProgress: 0,
      fileCurrent: '',
      UUID: '',
      description: 'upload_tasks',
      reportWarming: [],

    }
  },
  mounted() {
    this.getTable()
    this.doWarmActions()

  },
  beforeUpdate() {
  },

  methods: {
    getID(item) {
      console.log(item)
      this.flag = true
    },

    async toConvert(item) {
      console.log(item.guid)
      const data = {
        realm: "bi-project-05",
        datasourceobject: "d1db72c1-f33d-277b-ead0-afd249cc9dd5",
        rows: 100,
        step: 100
      }

      await axios.post('http://10.33.8.109:9097/WarmDataSource',
          data
      )
          .then(response => {
            // console.log(response)
            this.doWarmActions()
          })
          .catch(error => {
            console.log(error);
          });
    },

    // async doWarm(item) {
    //   const data = {
    //     url: "10.33.8.109:5432",
    //     base: "bi-project-05",
    //     user: "postgres",
    //     password: "postgres",
    //     command_type: "GetData",
    //     schema: "",
    //     table: "vdwh_content",
    //     columns: []
    //   }
    //
    //   await axios.post('http://10.33.8.109:9040/DataSource/GetData',
    //       data
    //   )
    //       .then(response => {
    //         console.log('warm', response.data)
    //         this.reportWarming = response.data
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    // },

    async fileInputChange() {
      let files = Array.from(event.target.files);
      this.fileOrders = files.slice()
      if (files.length) {
        this.UUID = this.generateUUID()
      }
      await this.create()

      // console.log(files)
      // for (let item of files) {
      //   await this.uploadFile(item)
      // }
      await this.uploadFile(files)
    },
    async create() {
      const data = {
        guid: this.UUID,
        description : this.description
      }
      await axios.post('http://10.33.8.109:5000/composer/api/bi-project-05/createobject?name=upload_tasks',
          data
      )
          .then(response => {

            // console.log(response)
          })
          .catch(error => {
            console.log(error);
          });
    },

    async uploadFile(files) {

      let form = new FormData();
      let file
      for (file of files) {
        form.append('file', file);
      }

      // form.append('file', file);
      // console.log(file)

      await axios.post('http://localhost:8082/upload/', form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              "Guid": this.UUID,
              "Realm": "bi-project-05"
            },
            onUploadProgress: (itemUpload) => {
              this.fileProgress = Math.round( (itemUpload.loaded / itemUpload.total) * 100 );
              // this.fileCurrent = file.name + ' ' + this.fileProgress;
              this.fileCurrent = this.fileProgress;
              console.log(file.name)
            }
          })
          .then(response => {
            this.fileProgress = 0
            this.fileCurrent = ''
            this.fileFinish.push(files)
            // this.fileOrders.push(files)
            // this.finish = true
            this.getTable()
          })
          .catch(error => {
            console.log(error);
          });

      this.fileProgress = 0;
      this.fileCurrent = '';
    },

    async getTable() {
      await axios.get('http://10.33.8.109:5000/composer/api/bi-project-05/table?name=upload_tasks')
          .then(response => {
            this.uploadTask = response?.data?.body
            // console.log(response.data.body)
          })
          .catch(error => {
            console.log(error);
          });
    },

    generateUUID() { // Public Domain/MIT
      let d = new Date().getTime();//Timestamp
      let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
  }

}
</script>