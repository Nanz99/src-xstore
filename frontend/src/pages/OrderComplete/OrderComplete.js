/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { formatPrice } from "../../utils/helper";
import BankTransfer from "./BankTransfer/BankTransfer";
import { useDispatch } from "react-redux";
import { detailsOrder, payOrder } from "../../actions/orderActions";
import successimg from "../../assets/images/thanh-toan/success.jpg";
import dateFormat from "dateformat";
import {
  ORDER_CREATE_RESET,
  ORDER_PAY_RESET,
} from "../../constants/orderConstants";
import qs from "qs";

function OrderComplete(props) {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orderDetails);
  const orderId = props.match.params.id;

  const vnp_Params = props.location.search;
  const vnp_Amount = Number(qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_Amount)/100;
  const vnp_BankCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_BankCode;
  const vnp_CardType = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_CardType;
  const vnp_ResponseCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_ResponseCode;

  //Handle
  useEffect(() => {
    dispatch(detailsOrder(orderId));
    dispatch({ type: ORDER_CREATE_RESET });
    dispatch({ type: ORDER_PAY_RESET });
  }, [dispatch, orderId]);

  useEffect(() => {
    const paymentResult = {
      vnpayResult: {
        amount: vnp_Amount,
        bankCode: vnp_BankCode,
        cardType: vnp_CardType,
        responseCode: vnp_ResponseCode,
      },
    };
    if (order && order.isPaid === false && order.checkoutDetails.paymentMethod === "Thanh Toán Qua VNPAY") {
      dispatch(payOrder(order, paymentResult));
      dispatch({ type: ORDER_PAY_RESET });
    }
  }, [
    dispatch,
    order,
    vnp_BankCode,
    vnp_CardType,
    vnp_ResponseCode,
    vnp_Amount,
  ]);
  if (!order) return <Loading />;
  return (
    <div className="py-20 px-20 ">
      <h3 className="mb-6 text-2xl">
        Cảm ơn bạn. Đơn hàng của bạn đã được nhận.
      </h3>
      <div className="grid grid-cols-4 mb-4 pb-4 border-b-2 border-solid border-gray  ">
        <div>
          <h3 className="text-base uppercase font-semibold ">Mã đơn hàng</h3>
          <p className="text-gray">{order._id}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold">Thời gian</h3>
          <p className="text-gray">
            {dateFormat(order.createdAt, "HH:MM dd-mm-yyyy")}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">Tổng Cộng</h3>
          <p className="text-gray">
            {formatPrice(order.checkoutDetails.totalOrder)}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">
            Phương Thức Thanh Toán
          </h3>
          <p className="text-gray">{order.checkoutDetails.paymentMethod}</p>
        </div>
      </div>
      {order.checkoutDetails.paymentMethod === "Thanh Toán Khi Nhận Hàng" && (
        <h2 className="text-base font-semibold py-8 ">
          Trả tiền mặt khi nhận hàng.
        </h2>
      )}
      {order.checkoutDetails.paymentMethod === "Chuyển Khoản Ngân Hàng" && (
        <BankTransfer />
      )}
      <div className="text-center w-full m-auto flex justify-center">
        <img src={successimg} alt="" />
      </div>
      {order.checkoutDetails.paymentMethod === "Paypal" ? (
        <div>
          {order.paymentResult && (
            <p>
              <span>Trạng Thái : </span>
              <span>{`${(order.paymentResult.paypalResult.status = "COMPLETED"
                ? "Bạn Đã Thanh Toán Thành Công"
                : "Thanh Toán Thất Bại")}`}</span>
            </p>
          )}
          {/* <p>
            <span>Email thanh toán : </span>{" "}
            <span>{order.paymentResult.email_address}</span>
          </p> */}
        </div>
      ) : (
        ""
      )}
      {order.checkoutDetails.paymentMethod === "Thanh Toán Qua VNPAY" ? (
        <div className=" py-7 text-center">
          <p className="text-3xl tracking-wider font-semibold">
            Thanh toán{" "}
            {`${vnp_ResponseCode === "00" ? "Thành Công" : "Thất Bại"}`}
          </p>
          <p className="text-xl tracking-wider">
            <span className="font-semibold">Hình thức thanh toán: </span>{" "}
            <span>Qua {vnp_CardType}</span>{" "}
          </p>
          <p className="text-xl tracking-wider">
            <span className="font-semibold">Ngân hàng: </span>{" "}
            <span>{vnp_BankCode} Bank</span>{" "}
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default OrderComplete;
