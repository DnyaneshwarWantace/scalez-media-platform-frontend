import React, { useState } from "react";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectreportsSelectedTab,
  selectselectedSidebarTab,
  updatereportsSelectedTab,
  updateselectedSidebarTab,
} from "../redux/slices/funnelProjectSlice";

export default () => {
  const selectedTab = useSelector(selectselectedSidebarTab);
  const dispatch = useDispatch();
  const reportsSelectedTab = useSelector(selectreportsSelectedTab);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className="sidebar_padding"
      style={{
        minWidth: "100%",
        maxHeight: "calc(100vh - 4.25rem)",
      }}
    >
      <div className="row g-md-2 mb-3">
        <div className="col-6">
          <div
            className={`border rounded d-flex flex-column align-items-center justify-content-center p-3 ${
              selectedTab === "canvas" ? "border-dark" : ""
            }`}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(updateselectedSidebarTab("canvas"));
            }}
          >
            <i className="fa-solid fa-table-cells fa-2xl"></i>
            <p className="fw-bold mb-0 sidebar_tab_fontSize mt-1">Canvas</p>
          </div>
        </div>

        <div className="col-6">
          <div
            className={`border rounded d-flex flex-column align-items-center justify-content-center p-3 ${
              selectedTab === "reports" ? "border-dark" : ""
            }`}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(updateselectedSidebarTab("reports"));
            }}
          >
            <i className="fa-solid fa-chart-simple fa-2xl"></i>
            <p className="fw-bold mb-0 sidebar_tab_fontSize mt-1">Reports</p>
          </div>
        </div>
      </div>

      {selectedTab == "canvas" && (
        <div className="row g-3">
          {/* Traffic */}
          <div className="col-6">
            <div
              className="d-flex align-items-center justify-content-center"
              onDragStart={(event) => onDragStart(event, "TrafficEntry")}
              draggable
            >
              <div
                style={{
                  backgroundColor: "#a4a4a4",
                  borderRadius: "50%",
                  minHeight: "4rem",
                  minWidth: "4rem",
                  maxHeight: "4rem",
                  maxWidth: "4rem",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <span
                  className="text-white"
                  style={{ fontSize: "2rem", fontWeight: 700 }}
                >
                  1
                </span>
              </div>
              {/* <img
                src="/static/icons/sidebar/icon-thank-you.png"
                alt=""
                className="menuImg"
              /> */}
            </div>

            <p className="text-center menuText mb-0">Input Traffic</p>
          </div>

          <div className="col-6">
            <div
              className="d-flex align-items-center justify-content-center"
              onDragStart={(event) => onDragStart(event, "WaitNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-wait.png"
                alt=""
                className="menuImg"
                style={{
                  minHeight: "4rem",
                  minWidth: "4rem",
                  maxHeight: "4rem",
                  maxWidth: "4rem",
                }}
              />
            </div>

            <p className="text-center menuText mb-0">Wait</p>
          </div>

          {/* Email */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "EmailNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-email.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Email</p>
          </div>

          {/* Opt in page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "OptInNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-opt-in.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Opt-In Page</p>
          </div>

          {/* Thank you */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "ThankYouNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-thank-you.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Thank You</p>
          </div>

          {/* Sales Page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "SalesPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-sales.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Sales Page</p>
          </div>

          {/* Order form */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "OrderFormPage")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-order-form-page.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Order Form</p>
          </div>

          {/* Upsell page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "UpsellPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-upsell.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Upsell Page</p>
          </div>

          {/* Downsell page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "DownsellPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-downsell.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Downsell Page</p>
          </div>

          {/* Content page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "ContentPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-content.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Content Page</p>
          </div>

          {/* Survey */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "SurveyNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-survey.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Survey</p>
          </div>

          {/* Webinar register */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "WebinarRegisterNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-webinar-registration.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Webinar register</p>
          </div>

          {/* Webinar live */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "WebinarLiveNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-webinar-live.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Webinar Live</p>
          </div>

          {/* Webinar replay */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "WebinarReplayNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-webinar-replay.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Webinar Replay</p>
          </div>

          {/* Webinar sales */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "WebinarSalesNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-webinar-sales.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Webinar Sales</p>
          </div>

          {/* Application page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "ApplicationPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-application.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Application Page</p>
          </div>

          {/* calendar */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "CalendarNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-calendar.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">calendar</p>
          </div>

          {/* Custom page */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "CustomPageNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-custom.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Custom</p>
          </div>

          {/* pop up */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "PopUpNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-pop-up.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Pop-up</p>
          </div>

          {/* Phone */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "PhoneNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-phone.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Phone</p>
          </div>

          {/* Phone order */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "PhoneOrderNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-phone-sales.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Phone Order</p>
          </div>

          {/* SMS */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "SMSNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-sms.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">SMS</p>
          </div>

          {/* Chatbot Opt-In */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "ChatbotOptInNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-chatbot-optin.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Chatbot Opt-In</p>
          </div>

          {/* Chatbot */}
          <div className="col-6">
            <div
              onDragStart={(event) => onDragStart(event, "ChatbotNode")}
              draggable
            >
              <img
                src="/static/icons/sidebar/icon-chatbot.png"
                alt=""
                className="menuImg"
              />
            </div>

            <p className="text-center menuText mb-0">Chatbot</p>
          </div>
        </div>
      )}

      {selectedTab == "reports" && (
        <div>
          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "projectSummary" ? "#e3e3e3" : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("projectSummary"));
            }}
          >
            <div className="me-2">
              <i className="fa-solid fa-folder"></i>
            </div>

            <p className="mb-0">Project Summary</p>
          </div>

          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "trafficReinvestment"
                  ? "#e3e3e3"
                  : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("trafficReinvestment"));
            }}
          >
            <div className="me-2">
              <i
                className="fa-solid fa-users"
                style={{
                  maxWidth: "0.3rem",
                  width: "0.1rem",
                  fontSize: "0.5rem",
                  marginRight: "0.3rem",
                  marginTop: "0.2rem",
                  marginBottom: "0.2rem",
                }}
              ></i>
            </div>

            <p className="mb-0">Traffic Reinvestment</p>
          </div>

          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "scenarioComparison"
                  ? "#e3e3e3"
                  : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("scenarioComparison"));
            }}
          >
            <div className="me-2">
              <i className="fa-solid fa-code-compare"></i>
            </div>

            <p className="mb-0">Scenario Comparison</p>
          </div>

          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "dreamProfitGoal" ? "#e3e3e3" : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("dreamProfitGoal"));
            }}
          >
            <div className="me-2">
              <i className="fa-solid fa-chart-simple"></i>
            </div>

            <p className="mb-0">Dream Profit Goal</p>
          </div>

          {/* <div
            className="p-2"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "publishedStatus" ? "#e3e3e3" : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("publishedStatus"));
            }}
          >
            <p className="mb-0">Published Status</p>
          </div> */}

          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "mrrCost" ? "#e3e3e3" : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("mrrCost"));
            }}
          >
            <div className="me-2">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>

            <p className="mb-0">MRR Cost</p>
          </div>

          <div
            className="p-2 d-flex align-items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                reportsSelectedTab == "listView" ? "#e3e3e3" : "white",
            }}
            onClick={() => {
              dispatch(updatereportsSelectedTab("listView"));
            }}
          >
            <div className="me-2">
              <i className="fa-solid fa-list"></i>
            </div>
            <p className="mb-0">List View</p>
          </div>
        </div>
      )}
    </aside>
  );
};
