<template>
  <div>
    <div class="col-sm-12">
      <h5>Доступные данные</h5>

      <v-data-table
          :headers="headers"
          :items="reportWarming"
          hide-default-footer
          class="elevation-1 mt-3">
        <template v-slot:item.actions="{ item }">
          <button type="button" class="btn btn-primary btn-sm" @click="toKafka(item)">Перейти к отправке</button>
        </template>
      </v-data-table>

    </div>
  </div>
</template>

<script>
export default {
  name: "Warm",
  props: ['reportWarming'],
  computed: {
    headers () {
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
      data: []


    }
  },
  methods: {
    toKafka(item) {
      // console.log(item)
      this.$emit('transmit', item)

    }

  }
}
</script>

<style scoped>

</style>