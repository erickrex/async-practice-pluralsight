import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

//promises are not lazy, they are eager
//the requests are kicked off immediately
//essence
export function get() {
  //http get request 1
  axios.get("http://localhost:3000/orders/1").then(({ data }) => {
    //then handles step 2
    setText(JSON.stringify(data));
  });
}

export function getCatch() {
  axios
    .get("http://localhost:3000/orders/1123123")
    .then(({ result }) => {
      if (result.status == 200) {
        setText(JSON.stringify(result.data));
      } else {
        setText("error");
      }
      //then handles step 2
      setText(JSON.stringify(result.data));
    })

    //inside catch block we should do some business logic handling
    .catch((err) => setText(err));
}

export function chain() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    });
}

export function chainCatch() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
      throw new Error("Error!!");
    })
    .catch((err) => {
      setText(err);
      throw new Error("Second Error");
      //return { data: {} }; you need a return to bypass the error, otherwise the second catch will catch the error you are throwing here because there is no data
    })
    .then(({ data }) => {
      setText(`City: ${data.my.city}`);
    })
    .catch((err) => setText(err));
}

export function final() {
  showWaiting();
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    })
    .catch((err) => setText(err))
    .finally(() => {
      setTimeout(() => {
        hideWaiting();
      }, 1500);

      appendText("--- Completely done");
    });
}
