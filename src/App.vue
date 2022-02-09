<template>
  <div id="app">
    <nav class="navbar navbar-light" style="background-color: #ee8913;">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Omega</span>
      </div>
    </nav>
<!--    <div id="nav">-->
<!--      <router-link to="/upload" class="m-5">Upload</router-link>-->
<!--      <router-link to="/kafka">Warm</router-link>-->
<!--    </div>-->
<!--    <router-view/>-->
    <Upload/>
    <Notify/>
  </div>
</template>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: Montserrat, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #f88315;
}
</style>
<script>
import Upload from "@/views/Upload";
import Notify from "@/components/Notify";
export default {
  components: {Upload, Notify}
}
</script>