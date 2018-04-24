<template>
  <div id="app">
    <pcap-select></pcap-select>
    <pcap-select1></pcap-select1>
    <pcap-select2></pcap-select2>
  </div>
</template>

<script>
import PcapSelect from './components/pcapSelect'
import PcapSelect1 from './components/pcapSelect1'
import PcapSelect2 from './components/pcapSelect2'

export default {
  name: 'App',
  components: {
    'pcap-select': PcapSelect,
    'pcap-select1': PcapSelect1,
    'pcap-select2': PcapSelect2
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
