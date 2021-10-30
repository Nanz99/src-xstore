/** @format */

import express from "express";
import dateFormat from "dateformat";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import querystring from "qs";
import cors from "cors";
const paymentRouter = express.Router();

paymentRouter.post(
  "/create_vnpayurl",
  expressAsyncHandler((req, res, next) => {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let orderId = req.body.orderId;

    let tmnCode = "TFKNMFBX";
    let secretKey = "VSDSRJASTYADHATKXPHDENYUUSSIZADJ";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    let returnUrl = `http://localhost:3000/payment/order-complete/${orderId}`;

    let date = new Date();

    let createDate = dateFormat(date, "yyyymmddHHmmss");
    
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let orderInfo = req.body.orderDescription;
    let orderType = req.body.orderType;
    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    return res.send(vnpUrl);
  })
);

paymentRouter.get(
  "/vnpay_return",
  expressAsyncHandler((req, res, next) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let tmnCode = "TFKNMFBX";
    let secretKey = "VSDSRJASTYADHATKXPHDENYUUSSIZADJ";
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if(secureHash === signed){
      res.render('success', {code: vnp_Params['vnp_ResponseCode']})
      res.send("thanhcong")
  } else{
      res.render('success', {code: '97'})
      res.send("that bai")
  }
  })
);

// paymentRouter.get('/vnpay_ipn', function (req, res, next) {
// 	let vnp_Params = req.query;
// 	let secureHash = vnp_Params['vnp_SecureHash'];

// 	delete vnp_Params['vnp_SecureHash'];
// 	delete vnp_Params['vnp_SecureHashType'];

// 	vnp_Params = sortObject(vnp_Params);

// 	let secretKey = config.get('vnp_HashSecret');
// 	let querystring = require('qs');
// 	let signData = querystring.stringify(vnp_Params, { encode: false });

// 	let hmac = crypto.createHmac("sha512", secretKey);
// 	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

// 	if(secureHash === signed){
// 		 let orderId = vnp_Params['vnp_TxnRef'];
// 		 let rspCode = vnp_Params['vnp_ResponseCode'];
// 		 //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
// 		 res.status(200).json({RspCode: '00', Message: 'success'})
// 	}
// 	else {
// 		 res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
// 	}
// });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default paymentRouter;
