<template>
  <v-card>
    <v-snackbar v-model="show"
                tile
                transition="scroll-x-transition"
                :outlined="outlined"
                :color="'#0d6efd'"
                :multi-line="mode === 'multi-line'"
                :top="y === 'top'"
                :right="x === 'right'"
                :bottom="y === 'bottom'"
                :left="x === 'left'"
                :timeout="timeout"
                :max-height="maxHeight"
                :max-width="maxWidth"
                :vertical="mode === 'vertical'">

      <div class="snackbar-container">
<!--        <div class="snackbar-item">-->
<!--          <v-icon class="item" :color="colorIcon" dark>{{ icon }}</v-icon>-->
<!--        </div>-->

        <div class="snackbar-item">
          {{ message }}
        </div>
      </div>

<!--      <template v-slot:action="{ attrs }">-->
<!--        <v-icon @click="show = false" :color="colorIcon" v-bind="attrs" class="mr-5" dark>{{ mdiClose }}</v-icon>-->
<!--      </template>-->
    </v-snackbar>
  </v-card>
</template>

<script>

import {mdiClose} from "@mdi/js";

export default {
  name: "Notify",

  updated() {
    // const getSnackProp = JSON.parse(localStorage.getItem('snackProp'))
    // this.maxHeight = getSnackProp.h
    // this.maxWidth = getSnackProp.w
    // this.x = getSnackProp.x.name
    // this.y = getSnackProp.y.name
    // this.outlined = getSnackProp.outlined
    // this.timeout = getSnackProp.duration
    // if (this.outlined) {
    //   this.colorIcon = this.color
    // } else {
    //   this.colorIcon = ''
    // }
  },

  created() {

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setSnack') {
        this.message = state.notify.payload.message
        this.color = state.notify.payload.color
        this.icon = state.notify.payload.icon
        this.show = true;

        console.log(this.color)
      }
    });

  },

  data () {
    return {
      mdiClose,
      icon: '',
      show: false,
      message: '',
      mode: '',
      color: '',
      outlined: false,
      colorIcon: '',
      timeout: 2000,
      maxHeight: 700,
      maxWidth: 700,
      x: 'right',
      y: 'top',
    }
  },


}
</script>

<style>

.snackbar-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.snackbar-item {
  margin-left: 20px;
}


</style>