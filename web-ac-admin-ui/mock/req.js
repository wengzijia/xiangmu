import axios from "axios"
// axios.get('/mock/api/getUsers').then(res=>{
//   console.log(res)
// })

export function mockApi(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        resolve(res.data)
      })
      .catch(res => {
        reject(res)
      })
  })
}