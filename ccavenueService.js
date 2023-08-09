const ccavneue = require("node-ccavenue");

const ccav = new ccavneue.Configure({
  merchant_id: "2653583",
  //working_key: "6E1563D3E94BF7CC764EC55261AC48EB",
  working_key: "B59786A01F7126008C4CFBC80DB822C1",
});

const encrypt = (order) => {
  return ccav.getEncryptedOrder(order);
};

const decrypt = (encodedData) => {
  const decyptedData = ccav.redirectResponseToJson(encodedData);

  return {
    data: decyptedData,
    responceCode: decyptedData.order_status,
  };
};

module.exports = {
  encrypt,
  decrypt,
};
