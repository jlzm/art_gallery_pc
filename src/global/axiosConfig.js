import axios from 'axios';
import qs from 'qs';
import global from './global';
import {
  Message
} from 'element-ui';

axios.defaults.headers.post['Content-Type'] = global.CONTENTTYPE;
axios.defaults.baseURL = global.BASEURL;
axios.interceptors.request.use(
  config => {
    config.data || (config.data = {});
    if (!(config.headers && config.headers['Content-Type'])) { // 如果没有主动设置请求头
      config.data = qs.stringify(config.data);
    }
    config.timeout = 10000 * 6; // 60s
    return config;
  }
);
axios.interceptors.response.use((res) => {
  return res;
}, err => {
  Message({
    type: 'error',
    message: err.message
  });
  return Promise.reject(err);
});
export default {
  axios
};
