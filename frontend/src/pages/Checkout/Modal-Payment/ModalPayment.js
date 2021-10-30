/** @format */

import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { paymentWithVNPAY } from "../../../actions/orderActions";
import Loading from "../../../components/Loading/Loading";
import { formatPrice } from "../../../utils/helper";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    borderRadius: 0,
    transform: "translate(-50%, -50%)",
  },
};

function ModalPayment({ modalIsOpen, closeModal, totalOrder }) {
  let subtitle;
  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }
  const orderType = "Thanh Toan Hoa Don";
  const amount = totalOrder;
  const [orderDescription, setOrderDescription] = useState(
    "Thanh toán hóa đơn thời trang "
  );
  const [language, setLanguage] = useState("");
  const [bankCode, setBankCode] = useState("");

  const dispatch = useDispatch();
  const { vnpay } = useSelector((state) => state.orderPaymentVNPAY);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      paymentWithVNPAY(amount, bankCode, orderDescription, orderType, language)
    );
  };
  const redirectVNPAY = () => {
    if (vnpay) {
      window.location.replace(vnpay);
    } else {
      return <Loading />;
    }
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="flex justify-between items-center">
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          className="text-xl font-semibold uppercase"
        >
          Thanh Toán Qua VNPAY
        </h2>
        <button onClick={closeModal}>
          <i className="material-icons">close</i>
        </button>
      </div>
      <form action="" onSubmit={submitHandler} className="block w-96 mt-6">
        <div className="mb-5 mx-3 ">
          <p>
            Số Tiền Cần Thanh Toán:{" "}
            <span className="font-semibold"> {formatPrice(totalOrder)}</span>
          </p>
        </div>

        <div className="mb-5 mx-3">
          <label className="block text-left">
            <p className="text-gray-700">
              Ngân Hàng <span className="text-red-600">*</span>
            </p>
            <select
              className=" block w-full border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
              onClick={(e) => setBankCode(e.target.value)}
            >
              <option value=""> Không chọn </option>
              <option value="VNPAYQR"> Ngân hàng VNPAYQR </option>
              <option value="NCB"> Ngân hàng NCB </option>
              <option value="SCB">Ngân hàng SCB</option>
              <option value="SACOMBANK"> Ngân hàng SACOMBANK</option>
              <option value="EXIMBANK"> Ngân hàng EXIMBANK </option>
              <option value="MSBANK"> Ngân hàng MSBANK</option>
              <option value="NAMABANK"> Ngân hàng NAMABANK</option>
              <option value="VISA"> Ngân hàng VISA</option>
              <option value="VNMART"> Ngân hàng VNMART</option>
              <option value="VIETINBANK"> Ngân hàng VIETINBANK</option>
              <option value="VIETCOMBANK"> Ngân hàng VIETCOMBANK</option>
              <option value="HDBANK"> Ngân hàng HDBANK</option>
              <option value="DONGABANK"> Ngân hàng Dong A</option>
              <option value="TPBANK"> Ngân hàng Tp Bank</option>
              <option value="OJB"> Ngân hàng OceanBank</option>
              <option value="BIDV"> Ngân hàng BIDV</option>
              <option value="TECHCOMBANK"> Ngân hàng Techcombank</option>
              <option value="VPBANK"> Ngân hàng VPBank</option>
              <option value="AGRIBANK"> Ngân hàng AGRIBANK</option>
              <option value="MBBANK"> Ngân hàng MBBank</option>
              <option value="ACB"> Ngân hàng ACB</option>
              <option value="OCB"> Ngân hàng OCB</option>
              <option value="SHB"> Ngân hàng SHB</option>
              <option value="IVB"> Ngân hàng IVB</option>
            </select>
          </label>
        </div>

        <div className="mb-5 mx-3">
          <label htmlFor="orderDescription" className="mb-2 block">
            Mô tả
          </label>
          <input
            type="text"
            name="orderDescription"
            id="orderDescription"
            placeholder="Mô tả"
            value={orderDescription}
            onChange={(e) => setOrderDescription(e.target.value)}
            className="block w-full border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
          />
        </div>

        <div className="mb-5 mx-3">
          <label className="block text-left">
            <p className="text-gray-700">
              Ngôn Ngữ <span className="text-red-600">*</span>
            </p>
            <select
              className=" block w-full border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
              onClick={(e) => setLanguage(e.target.value)}
            >
              <option value="vn">Tiếng Việt </option>
              <option value="en"> English </option>
            </select>
          </label>
        </div>
        <div className="mb-5 mx-3">
          <button
            type="submit"
            className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
            onClick={redirectVNPAY}
          >
            Xác Nhận Thanh Toán
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalPayment;
