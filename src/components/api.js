import axios from 'axios';
const globalPath = 'http://114.55.251.155:3099';

let Api = {
  getAllProvince: () => {
    return axios.post(`${globalPath}/Park/getAllParkProvince`);
  },
  getAllCity: (params) => {
    return axios.post(`${globalPath}/Park/getAllParkCity_N`, params);
  },
  getAllCityarea: (params) => {
    return axios.post(`${globalPath}/Park/getAllParkArea`, params);
  },
  gitAllparkByarea: (params) => {
    return axios.post(`${globalPath}/Park/getAllMainParkByArea`, params);
  },
}

export default Api;
