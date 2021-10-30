/** @format */

import React from "react";
import successimg from '../../assets/images/thanh-toan/success.jpg'
import dateFormat from "dateformat";
import qs from "qs";
import { formatPrice } from "./../../utils/helper";

function hoanthanh(props) {
  const vnp_Params = props.location.search;
  const vnp_Amount = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_Amount;
  const vnp_BankCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_BankCode;
  const vnp_ResponseCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_ResponseCode;

  const now = new Date();
  console.log(vnp_Amount);

  return (
    <div className="py-20 px-8 ">
      <h3 className="mb-6 text-2xl">
        Cảm ơn bạn. Đơn hàng của bạn đã được nhận.
      </h3>
      <div className="grid grid-cols-4 mb-4 pb-4 border-b-2 border-solid border-gray  ">
        <div>
          <h3 className="text-base uppercase font-semibold ">Mã đơn hàng</h3>
          <p className="text-gray">{dateFormat(now, "mmssHHssyyyyddss")}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold">Ngày</h3>
          <p className="text-gray">{dateFormat(now, "HH:mm  dd-mm-yyyy")}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">Tổng Cộng</h3>
          <p className="text-gray">{formatPrice(Number(vnp_Amount) / 100)}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">
            Phương Thức Thanh Toán
          </h3>
          <p className="text-gray">Thanh Toán Qua VNPAY</p>
        </div>
      </div>
      <div className="text-center w-full m-auto flex justify-center">
        <img src={successimg} alt="" />
      </div>
      <div>
        <p>
          Status :{" "}
          {`${
            vnp_ResponseCode === "00" ? "Ban Thanh Toan Thanh Cong" : "That Bai"
          }`}
        </p>
        <p>Ngan Hang : {vnp_BankCode}</p>
      </div>
    </div>
  );
}

export default hoanthanh;
