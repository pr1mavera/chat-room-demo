<template>
    <div id="app">
        {{name}}
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            name: 123
        }
    }
}
</script>

<style type="text/css" scoped>
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>