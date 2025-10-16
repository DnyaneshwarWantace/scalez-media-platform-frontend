import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LandingToolbar() {
  const [selectedMenu, setselectedMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    // {
    //   name: "Dashboard",
    //   link: "/dashboard",
    // },
  ];

  return (
    <div className="toolbar border-bottom d-flex align-items-center" style={{ zIndex: 999 }}>
      <img
        src="/static/icons/logo.svg"
        alt=""
        style={{ height: '28px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
        // onClick={() => {
        //   navigate("/dashboard");
        // }}
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

      <div className="hstack"></div>
    </div>
  );
}

export default LandingToolbar;
