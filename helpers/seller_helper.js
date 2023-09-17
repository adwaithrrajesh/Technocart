const seller_model = require("../model/seller_model");
const bcrypt = require("bcrypt");

module.exports = {
  InsertData: (seller) => {
    return new Promise(async (resolve, reject) => {
      seller.Password = await bcrypt.hash(seller.Password, 10);
      seller_model.create(seller);
      resolve(true);
    });
  },
  DoLogin: (seller) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let sellerDB = await seller_model.findOne({ Email: seller.Email });
      if (sellerDB) {
        let PasswordCheck = await bcrypt.compare(seller.Password,sellerDB.Password);
        if (PasswordCheck) {
          response = true;
        } else {
          response = false;
        }
      } else {
        response = false;
      }
      resolve(response);
    });
  },
};
