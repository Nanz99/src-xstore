/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { formatPrice } from "../../utils/helper";
import BankTransfer from "./BankTransfer/BankTransfer";
import { useDispatch } from "react-redux";
import { detailsOrder, payOrderVnpay } from "../../actions/orderActions";
import successimg from "../../assets/images/thanh-toan/success.jpg";
import dateFormat from "dateformat";
import { ORDER_CREATE_RESET, ORDER_PAY_RESET } from "../../constants/orderConstants";
import qs from "qs";

function OrderComplete(props) {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orderDetails);
  const { paypalResult } = useSelector((state) => state.orderPay);
  const orderId = props.match.params.id;

  const vnp_Params = props.location.search;
  const vnp_Amount =
    Number(
      qs.parse(vnp_Params, {
        ignoreQueryPrefix: true,
      }).vnp_Amount
    ) / 100;
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
  }, [dispatch, orderId]);

  useEffect(() => {
    if (vnp_Amount && vnp_BankCode && vnp_CardType && vnp_ResponseCode) {
      const vnpayResult = {
        amount: vnp_Amount,
        bankCode: vnp_BankCode,
        cardType: vnp_CardType,
        responseCode: vnp_ResponseCode,
      };
      if (vnp_ResponseCode === "00") {
        dispatch(payOrderVnpay(order, vnpayResult));
        dispatch({ type: ORDER_PAY_RESET });
      }
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
      <h3 className="mb-8 text-4xl">
        C???m ??n b???n. ????n h??ng c???a b???n ???? ???????c nh???n.
      </h3>
      <div className="grid grid-cols-4 mb-4 pb-4 border-b-2 border-solid border-gray  ">
        <div>
          <h3 className="text-base uppercase font-semibold ">M?? ????n h??ng</h3>
          <p className="text-gray">{order._id}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold">Th???i gian</h3>
          <p className="text-gray">
            {dateFormat(order.createdAt, "HH:MM dd-mm-yyyy")}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">T???ng C???ng</h3>
          <p className="text-gray">
            {formatPrice(order.checkoutDetails.totalOrder)}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">
            Ph????ng Th???c Thanh To??n
          </h3>
          <p className="text-gray">{order.checkoutDetails.paymentMethod}</p>
        </div>
      </div>

      <div className="text-center w-full m-auto flex justify-center">
        <img src={successimg} alt="" />
      </div>

      <div>
        <h2 className="text-3xl mb-5 tracking-wider text-gray capitalize">
          Th??ng tin thanh to??n
        </h2>
        {order.checkoutDetails.paymentMethod === "Thanh To??n Khi Nh???n H??ng" && (
          <h2 className="text-base font-semibold py-8 ">
            Tr??? ti???n m???t khi nh???n h??ng.
          </h2>
        )}
        {order.checkoutDetails.paymentMethod === "Chuy???n Kho???n Ng??n H??ng" && (
          <BankTransfer />
        )}
        {order.checkoutDetails.paymentMethod === "Paypal" ? (
          <div>
            {paypalResult && (
              <div>
                <p className="py-2 tracking-wider ">
                  <span className="font-semibold">Tr???ng Th??i : </span>
                  <span>{`${(paypalResult.status = "COMPLETED"
                    ? "B???n ???? Thanh To??n Th??nh C??ng"
                    : "Thanh To??n Th???t B???i")}`}</span>
                </p>
                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">
                      T??i kho???n thanh to??n :{" "}
                    </span>{" "}
                    <span>{paypalResult.payer.email_address}</span>
                  </p>
                )}

                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">Ng?????i Thanh To??n: </span>{" "}
                    <span>
                      {paypalResult.payer.name.given_name}{" "}
                      {paypalResult.payer.name.surname}
                    </span>
                  </p>
                )}

                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">Qu???c Gia: </span>{" "}
                    <span>{paypalResult.payer.address.country_code}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        {order.checkoutDetails.paymentMethod === "Thanh To??n Qua VNPAY" ? (
          <div className=" text-left">
            <p className="text-lg tracking-wider font-semibold p-1">
              Thanh to??n{" "}
              {`${vnp_ResponseCode === "00" ? "Th??nh C??ng" : "Th???t B???i"}`}
            </p>
            <p className="text-lg tracking-wider p-1">
              <span className="font-semibold">H??nh th???c thanh to??n: </span>{" "}
              <span>Qua {vnp_CardType}</span>{" "}
            </p>
            <p className="text-lg tracking-wider p-1">
              <span className="font-semibold">Ng??n h??ng: </span>{" "}
              <span>{vnp_BankCode} Bank</span>{" "}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default OrderComplete;
