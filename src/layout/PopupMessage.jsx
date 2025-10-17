import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectpopupMessage, updatepopupMessage } from "../redux/slices/dashboardSlice";

function PopupMessage() {
  const popupMessage = useSelector(selectpopupMessage);
  const dispatch = useDispatch();

  return (
    <>
      {popupMessage ? (
        <div className="d-flex justify-content-center w-100" style={{backgroundColor: "#57C84D !important", fontWeight: "bolder"}}>
          <div className="green-outline-chip p-2" style={{ position: "fixed", top: 100, right: "auto", left: "auto", backgroundColor: "#57C84D !important" }}>
            <img src="/static/CheckIcon.svg" alt="" style={{ marginRight: "0.5rem" }} />
            {/* Feedback submitted, Our team will get in touch with you via mail */}
            {popupMessage}
            <i
              style={{ marginLeft: "0.4rem", cursor: "pointer" }}
              className="bi bi-x-lg text-dark"
              onClick={() => {
                dispatch(updatepopupMessage(null));
              }}
            ></i>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default PopupMessage;
