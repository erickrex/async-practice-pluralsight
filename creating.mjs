import setText, { appendText } from "./results.mjs";

export function timeout() {
  const wait = new Promise((resolve) => {
    setTimeout(() => {
      resolve("Timeout!");
    }, 1500);
  });

  wait.then((text) => setText(text));
}

export function interval() {
  let counter = 0;
  const wait = new Promise((resolve) => {
    setInterval(() => {
      console.log("INTERVAL");

      resolve(`Timeout ${++counter}`); //once its settled its finished but the interval keeps running
    }, 1500);
  });
  wait
    .then((text) => setText(text))
    .finally(() => appendText(`-- Done ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  const wait = new Promise((resolve) => {
    interval = setInterval(() => {
      console.log("INTERVAL");
      resolve(`Timeout ${++counter}`); //once its settled its finished but the interval keeps running
    }, 1500);
  });
  wait.then((text) => setText(text)).finally(() => clearInterval(interval));
}

export function xhr() {
  //executer function for promise takes 2 parameters
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    //onerror is triggered only when there is a network failure, all other fails end up in the onload function
    xhr.onerror = () => reject("Request failed");
    xhr.send();
  });

  request.then((result) => setText(result)).catch((reason) => setText(reason));
}

export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressTypes = axios.get("http://localhost:3000/addressTypes");

  //.all continues until or are fulfilled or one is rejected, whichever happens first, the functions run in order
  Promise.all([categories, statuses, userTypes, addressTypes])
    .then(([cat, stat, type, address]) => {
      setText("");
      appendText(JSON.stringify(cat.data));
      appendText(JSON.stringify(stat.data));
      appendText(JSON.stringify(type.data));
      appendText(JSON.stringify(address.data));
    })
    .catch((reasons) => {
      setText(reasons);
    });
}

export function allSettled() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressTypes = axios.get("http://localhost:3000/addressTypes");

  //.allSettled does not return an array but rather an object with status and value, it waits until they are all settled to call the .then function
  Promise.allSettled([categories, statuses, userTypes, addressTypes])
    .then((values) => {
      let results = values.map((v) => {
        if (v.status === "fulfilled") {
          return `FULLFILLED: ${JSON.stringify(v.value.data[0])} `;
        }
        return `REJECTED: ${v.reason.message} `;
      });
      setText(results);
    })
    .catch((reasons) => {
      setText(reasons);
    });
}

export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users");
  //race stops when the first promise settles, if it settles with a rejection it will procede to the catch
  Promise.race([users, backup])
    .then((users) => setText(JSON.stringify(users.data)))
    .catch((reason) => setText(reason));
}
