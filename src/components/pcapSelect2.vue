<template>
  <el-form style="width:580px; margin-left:30%;">
    <el-form-item label="省市区园区2:" label-width="120px">
      <el-cascader expand-trigger="click" :options="areaOptions" v-model="nowArea"  @active-item-change="getChildrens" @change="gitAllparkByarea" placeholder="请选择省/市/区"></el-cascader>
      <el-select v-model="nowPark" placeholder="请选择园区" @change="pcapChange">
        <el-option v-for="item in parks" :id="item.id" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  import Vue from 'vue';
  import Api from './api.js';
  export default{
    data(){
      return{
        areaOptions: [{label: '全部省/市/区', value: ''}],
        parks: [{label: '全部园区', value: ''}],
        nowArea: ["浙江", "杭州", "余杭区"],
        nowPark: '梦想小镇',
        nowParkId: ''
      }
    },
    methods: {
      async getChildrens(res){
        console.log(res.length);
        let selectProvinceIndex = this.provinces.indexOf(res[0]);
        if(res.length == 1){
          let province = res[0];
          await this.getAllCity(province, selectProvinceIndex+1);
        }else if(res.length == 2){
          let selectCityIndex = this.citys.indexOf(res[1]);
          await this.getAllArea(res, selectProvinceIndex+1, selectCityIndex);
        }else{
          let province = res[0];
          await this.getAllCity(province, selectProvinceIndex+1);
          let selectCityIndex = this.citys.indexOf(res[1]);
          await this.getAllArea(res, selectProvinceIndex+1, selectCityIndex);
        }
      },
      pcapChange(){
        for(let i = 0; i < this.parks.length; i++){
          if(this.parks[i].value == this.nowPark){
            this.nowParkId = this.parks[i].id;
          }
        }
      },
      async getAllProvince(){
        console.log('aaa');
        var self = this;
        this.provinces = await Api.getAllProvince();
        this.provinces = this.provinces.data.data;
        this.provinces.map((item, index)=>{
          self.areaOptions.splice(index+1, 1, {});
          Vue.set(self.areaOptions[index+1], 'label', item);
          Vue.set(self.areaOptions[index+1], 'value', item);
          Vue.set(self.areaOptions[index+1], 'children', []);
        });
      },
      async getAllCity(province, provinceIndex) {
        console.log('bbb');
        var self = this;
        let params = {
          province: province
        }
        this.citys = await Api.getAllCity(params);
        this.citys = this.citys.data.data;
        Vue.set(self.areaOptions[provinceIndex], 'children', []);
        this.citys.map(item=>{
          let cityItem = {
            value: item,
            label: item,
            children: []
          };
          self.areaOptions[provinceIndex].children.push(cityItem);
        });
      },
      async getAllArea(res, provinceIndex, cityIndex){
        console.log('ccc');
        var self = this;
        let params = {
          province: res[0],
          city: res[1]
        }
        this.areas =  await Api.getAllCityarea(params);
        this.areas.data.data.map((item, index)=>{
            self.areaOptions[provinceIndex].children[cityIndex].children.splice(index, 1, {});
            Vue.set(self.areaOptions[provinceIndex].children[cityIndex].children[index], 'label',item);
            Vue.set(self.areaOptions[provinceIndex].children[cityIndex].children[index], 'value',item);
        });
      },
      async gitAllparkByarea(){
        console.log('ddd');
        var self = this;
        if(this.nowArea && this.nowArea.length == 1){
          this.nowPark = '';
          this.parks = [{label: '全部园区', value: ''}];
        }else{
          let params = {
            province: this.nowArea[0],
            city: this.nowArea[1],
            area: this.nowArea[2]
          }
          let parks = await Api.gitAllparkByarea(params);
          this.nowPark = '';
          this.parks = [];
          parks.data.data.map(item=>{
            var mainparkitem = {
              id: item.id,
              value: item.name,
              label: item.name
            }
            self.parks.push(mainparkitem);
          });
          self.parks.unshift({id: '', value: '', label: '全部园区'})
        }
      }
    },
    async mounted() {
      if(this.nowArea.length > 1){
        await this.getAllProvince();
        await this.getChildrens(this.nowArea);
      }else{
        await this.getAllProvince();
      };

    }
  }
</script>

