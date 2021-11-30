import axios from 'axios'
const baseurl = 'http://server.mybarrefitness.com';

const service = axios.create({
  baseURL : baseurl,
  timeout : 5000
})
export default class HttpUtil {
  static get(url, params={}) {
    return new Promise((resolve, reject) => {
      service.get(url, {
        params
      })
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
    })
  }

  static post(url, data={}) {
    return new Promise((resolve, reject) => {

      service.post(url, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => { 
        console.error(err);
        reject(reject)
        })
    })
  }
  static put(url, data={}) {
    return new Promise((resolve, reject) => {

      service.put(url, data)
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
    })
  }
}