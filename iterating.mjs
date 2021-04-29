import setText, { appendText } from "./results.mjs";

export async function get() {
  //you can use await on functions that return promises
  const { data } = await axios.get("http://localhost:3000/orders/1");
  setText(JSON.stringify(data));
}

export async function getCatch() {
  try {
    const { data } = await axios.get("http://localhost:3000/orders/123");
    setText(JSON.stringify(data));
  } catch (error) {
    setText(error);
  }
}

export async function chain() {
  const { data } = await axios.get("http://localhost:3000/orders/1");
  const { data: address } = await axios.get(
    `http://localhost:3000/addresses/${data.shippingAddress}`
  );

  setText(`City: ${JSON.stringify(address.city)}`);
}

export async function concurrent() {
  //they both kick off at once
  const orderStatus = axios.get("http://localhost:3000/orderStatuses/");
  const orders = axios.get("http://localhost:3000/orders");

  setText("");

  const { data: statuses } = await orderStatus;
  const { data: order } = await orders;

  appendText(JSON.stringify(statuses));
  appendText(JSON.stringify(order[0]));
}

//never block a fast running process because you are waiting for a slow running one
export async function parallel() {
  setText("");
  //remember that async functions return implicit promise
  await Promise.all([
    (async () => {
      const { data } = await axios.get("http://localhost:3000/orderStatuses");
      appendText(JSON.stringify(data));
    })(),
    (async () => {
      const { data } = await axios.get("http://localhost:3000/orders");
      appendText(JSON.stringify(data));
    })(),
  ]);
}
