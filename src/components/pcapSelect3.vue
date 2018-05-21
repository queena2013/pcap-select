<template>
  <el-form style="width:580px; margin-left:30%;">
    <el-form-item label="省市区园区子园区:" label-width="130px">
      <el-cascader expand-trigger="click" :options="domains" placeholder="请选择区域" v-model="form.domain" @active-item-change="getChildrens" @change="getAllparkByarea"></el-cascader>
      <el-cascader expand-trigger="click" :options="parks" placeholder="请选择园区" v-model="form.park" :disabled="parks.length==0"></el-cascader>
    </el-form-item>
  </el-form>
</template>

<script>
  import Vue from 'vue';
  import Api from './api.js';
  import $ from 'jquery';
  export default{
    data(){
      return{
        domains: [],
        parks: [],
        form: {
          domain: ["浙江", "杭州", "余杭区"],
          park: ["59c1c867183c7c6a3d3aef31", "59e482b710cde1189a944bc5"]
        }
      }
    },
    methods:{
      async getChildrens(res) {
        var selectProvinceIndex = this.provinces.indexOf(res[0]);
        if(res.length == 1){
          let province = res[0];
          await this.getAllCity(province, selectProvinceIndex);
        }else if(res.length == 2){
          let selectCityIndex = this.citys.indexOf(res[1]);
          await this.getAllArea(res, selectProvinceIndex, selectCityIndex);
        }else{
          let province = res[0];
          await this.getAllCity(province, selectProvinceIndex);
          let selectCityIndex = this.citys.indexOf(res[1]);
          await this.getAllArea(res, selectProvinceIndex, selectCityIndex);
        }
      },
      async getAllProvince() {
        var self = this;
        this.provinces = await Api.getAllProvince();
        this.provinces = this.provinces.data.data;
        this.provinces.map((item, index)=>{
          self.domains.splice(index,1,{});
          Vue.set(self.domains[index],'label',item);
          Vue.set(self.domains[index],'value',item);
          Vue.set(self.domains[index],'children',[]);
        })
      },
      async getAllCity(province, provinceIndex) {
        var self = this;
        let params = {
          province: province
        }
        this.citys = await Api.getAllCity(params);
        this.citys = this.citys.data.data;
        Vue.set(self.domains[provinceIndex],'children',[]);
        this.citys.map(item=>{
          let cityItem = {
            value: item,
            label: item,
            children: []
          };
          self.domains[provinceIndex].children.push(cityItem);
        })
      },
      async getAllArea(res, provinceIndex, cityIndex) {
        var self = this;
        let params = {
          province: res[0],
          city: res[1]
        }
        this.areas = await Api.getAllCityarea(params);
        this.areas = this.areas.data.data;
        this.areas.map((item, index)=>{
          self.domains[provinceIndex].children[cityIndex].children.splice(index,1,{});
          Vue.set(self.domains[provinceIndex].children[cityIndex].children[index],'label',item);
          Vue.set(self.domains[provinceIndex].children[cityIndex].children[index],'value',item);
        })
      },
      async getAllparkByarea(){
        var self = this;
        let params={
          province:this.form.domain[0],
          city:this.form.domain[1],
          area:this.form.domain[2]
        }
        let nowParkdata = await Api.gitAllparkByarea(params);
        nowParkdata = nowParkdata.data.data;
        this.parks = [];
        // this.form.park = [];
        this.builds = [];
        this.form.build = '';
        this.floors = [];
        this.form.floor = '';
        this.roomnumbers = [];
        this.form.room = '';
        $(nowParkdata).each(function(index, item){
          var childParkList = [];
          if(item.childParkList.length > 0){
            for(var i=0; i<item.childParkList.length; i++){
              let childParkitem = {
                label:item.childParkList[i].name,
                value:item.childParkList[i].id
              }
              childParkList.push(childParkitem);
            }
            var mainparkitem = {
              label:item.name,
              value:item.id,
              children:childParkList
            }
          }else{
            var mainparkitem = {
              label:item.name,
              value:item.id
            }
          }
          self.parks.push(mainparkitem);
        });
      }
    },
    async mounted(){
      if(this.form.domain.length > 1){
        await this.getAllProvince();
        await this.getChildrens(this.form.domain);
        await this.getAllparkByarea();
      }else{
        await this.getAllProvince();
      }
    }
  }
</script>
