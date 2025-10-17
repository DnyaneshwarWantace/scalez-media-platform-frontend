import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectnotifications } from "../redux/slices/dashboardSlice";

function PublicToolbar() {
  const [selectedMenu, setselectedMenu] = useState("Project");
  const navigate = useNavigate();
  const me = JSON.parse(localStorage.getItem("user", ""));
  const dispatch = useDispatch();
  const notifications = useSelector(selectnotifications);
  const location = useLocation();

  const menus = [
    {
      name: "Project",
      link: "#",
    },
  ];

  return (
    <div className="toolbar border-bottom d-flex align-items-center" style={{ zIndex: 999 }}>
      <img
        src="/static/icons/logo.svg"
        alt=""
        style={{ height: '28px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
        onClick={() => {
          navigate("/dashboard");
        }}
      />

      <div className="flex-fill d-flex justify-content-center align-items-center">
        {menus.map((menu) => {
          return (
            <Link
              to={menu.link}
              style={{ textDecoration: "none" }}
              className="text-dark body2"
              onClick={() => {
                setselectedMenu(menu.name);
              }}
            >
              <div
                className={selectedMenu === menu.name ? "text-center border-bottom border-primary border-3" : "text-center pb-1"}
                style={{ minWidth: "7rem" }}
              >
                <p className="mb-1">{menu.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="hstack">
        <div className="dropdown"></div>
      </div>
    </div>
  );
}

export default PublicToolbar;
