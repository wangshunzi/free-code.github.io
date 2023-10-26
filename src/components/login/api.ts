import axios from "axios";
import CryptoJS from "crypto-js";
const md5 = (str: string) => CryptoJS.MD5(str).toString();

// "email":"shunzi.wang@welltop.cn","password":"4UJHCZ",
export const login = (email: string, password: string) => {
  const url = "https://pre-api.welltop.tech/api/v1/user/session";
  return new Promise((resolve, reject) => {
    axios
      .post(url, { email, encrypted_passwd: md5(password) })
      .then((res) => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          reject("error: " + res.statusText);
        }
      })
      .catch(reject);
  });
};
