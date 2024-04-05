const axios = require("axios");

const data = {
  return_url: "https://dev.hiresmart.ai/",
  website_url: "https://dev.hiresmart.ai/",
  amount: "1000",
  purchase_order_id: "afadsfasdf",
  purchase_order_name: "asdfasdfasdf",

};

axios
  .post("https://a.khalti.com/api/v2/epayment/initiate/", data, {
    headers: {
      Authorization: "Key dcf686e684d246c9b7433df5df7cb7f0",
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
