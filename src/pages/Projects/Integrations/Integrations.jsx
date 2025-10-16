import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllGoals, getAllIntegrations, getProjectUsers, selectGoals, selectintegrations } from "../../../redux/slices/projectSlice";
import { getAllkeyMetrics } from "../../../redux/slices/settingSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatTime } from "../../../utils/formatTime";
import TourModal from "../Tour/TourModal";
import CreateGoogleIntegrationDialog from "./CreateGoogleIntegrationDialog";

function Integrations() {
  const [selectedMenu, setselectedMenu] = useState("All Goals");
  const [arrowStateUpdater, setArrowStateUpdater] = useState("AS@#SADX");
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const dispatch = useDispatch();
  const requestIdeaDialogRef = useRef();
  const goals = useSelector(selectGoals);
  const [filteredGoals, setfilteredGoals] = useState([]);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const ProjectsMenus = [];
  const [showGoogleSheetIntegration, setshowGoogleSheetIntegration] = useState(false);
  const integrateBtn = useRef();
  const allIntegrations = useSelector(selectintegrations);
  const [goalId, setgoalId] = useState("");
  const [keyMetricId, setkeymetricId] = useState("");

  const RightProjectsMenus = [];

  const openRequestIdeaDialog = () => {
    requestIdeaDialogRef.current.click();
  };

  const tabSwitch = async () => {
    if (selectedMenu === "Completed") {
      setfilteredGoals(
        goals?.filter((goal) => {
          if (
            Math.round(
              goal.keymetric.reduce(
                (partialSum, a) => (partialSum + a?.metrics?.length === 0 ? 0 : (a?.metrics[a?.metrics?.length - 1]?.value / a?.targetValue) * 100),
                0
              )
            ) >= 100
          ) {
            return goal;
          }
        })
      );
    }

    if (selectedMenu === "Active") {
      setfilteredGoals(
        goals.filter((goal) => {
          if (
            Math.round(
              goal.keymetric.reduce(
                (partialSum, a) => (partialSum + a.metrics.length === 0 ? 0 : (a.metrics[a.metrics.length - 1].value / a.targetValue) * 100),
                0
              )
            ) < 100
          ) {
            return goal;
          }
        })
      );
    }

    if (selectedMenu === "All Goals") {
      setfilteredGoals(goals);
    }
  };

  useEffect(tabSwitch, [selectedMenu, goals]);

  useEffect(() => {
    dispatch(getAllGoals({ projectId }));
    dispatch(getProjectUsers({ projectId }));
    dispatch(getAllkeyMetrics());
    dispatch(getAllIntegrations({ projectId }));
  }, []);

  return (
    <div>
      {!showGoogleSheetIntegration && (
        <>
          <div className="d-flex">
            <div>
              <p className="text-secondary mb-1">{openedProject.name}</p>
              <h1 className="mb-1">Integrations</h1>
              <p className="text-secondary">1 Integration</p>
            </div>

            <div className="flex-fill d-flex flex-row-reverse">
              <div className="hstack gap-3" style={{ padding: 0 }}></div>
            </div>
          </div>

          <div className="border-bottom mt-1 mb-3">
            <div className="flex-fill d-flex align-items-center">
              {ProjectsMenus.map((menu) => {
                return (
                  <div
                    style={{ textDecoration: "none" }}
                    className="text-dark body3 regular-weight cp "
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
                  </div>
                );
              })}

              <div className="flex-fill ml-auto"></div>

              {RightProjectsMenus.map((menu) => {
                return (
                  <div
                    style={{ textDecoration: "none" }}
                    className="text-dark body3 regular-weight cp"
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <div
                className="border bg-white vstack gap-2  rounded p-3"
                onClick={() => {
                  setshowGoogleSheetIntegration(true);
                }}
              >
                <div>
                  <img src="/static/icons/google_sheet_icon.svg" alt="" />
                </div>

                <p className="body2 semi-bold-weight">Google Sheets</p>
                <p className="body2 regular-weight">Use Google Sheets to keep your Key Metrics synchronized.</p>

                <div className="hstack gap-2 mt-3">
                  <div className="red-outline-chip">
                    <p className="mb-0">Pull</p>
                  </div>
                  <div className="green-chip">
                    <p className="mb-0">Installed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showGoogleSheetIntegration && (
        <>
          <>
            <div className="d-flex">
              <div>
                <p className="text-secondary mb-1">{openedProject.name}</p>

                <h1 className="mb-1">Google Sheets</h1>
                <p className="text-secondary">{allIntegrations?.length} Key metric integrated</p>
              </div>

              <div className="flex-fill d-flex flex-row-reverse">
                <div className="hstack gap-3" style={{ padding: 0 }}>
                  <button
                    onClick={() => {
                      setgoalId("");
                      setkeymetricId("");
                    }}
                    ref={integrateBtn}
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#CreateGoogleIntegrationDialog"
                  >
                    Integrate a metric
                  </button>
                </div>
              </div>
            </div>

            <div className="border-bottom mt-1 mb-3"></div>

            {allIntegrations?.length != 0 && (
              <table className="table table-borderless mt-2 custom-table-sm">
                <thead className="border-none">
                  <tr>
                    <td scope="col" className="text-secondary body3 regular-weight">
                      Goal
                    </td>
                    <td scope="col" className="text-secondary body3 regular-weight">
                      Key Metric
                    </td>
                    <td scope="col" className="text-secondary body3 regular-weight">
                      Created By
                    </td>
                    <td scope="col" className="text-secondary body3 regular-weight">
                      Created At
                    </td>
                    <td scope="col" className="text-secondary body3 regular-weight">
                      Actions
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {allIntegrations?.map((integration) => {
                    return (
                      <tr className="border bg-white" style={{ cursor: "pointer" }}>
                        <td className="body3 regular-weight align-middle">{integration?.goal?.name}</td>
                        <td className="body3 regular-weight align-middle">{integration?.keymetric?.name}</td>

                        <td className="body3 regular-weight align-middle">
                          <img
                            src={`${backendServerBaseURL}/${integration.createdBy?.avatar}`}
                            className="avatar3"
                            alt=""
                            style={{ marginRight: "0.3rem" }}
                          />
                          {integration.createdBy?.firstName} {integration.createdBy?.lastName}
                        </td>
                        <td className="body3 regular-weight align-middle">{formatTime(integration.createdAt)}</td>
                        <td className="body3 regular-weight align-middle">
                          <div class="dropdown">
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="d-flex justify-content-between align-items-center rounded"
                              data-bs-toggle="dropdown"
                              style={{ maxWidth: "6.3rem", cursor: "pointer" }}
                            >
                              <i class="bi bi-three-dots-vertical custom-more-icon-hover-effect" style={{ padding: "0.5rem" }}></i>
                            </div>

                            <ul
                              className="dropdown-menu"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <li>
                                <a
                                  className="dropdown-item body3 regular-weight"
                                  data-bs-toggle="modal"
                                  data-bs-target="#CreateGoogleIntegrationDialog"
                                  onClick={() => {
                                    setgoalId(integration.goal?._id);
                                    setkeymetricId(integration.keymetric?._id);
                                  }}
                                >
                                  Refresh
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {allIntegrations?.length == 0 && (
              <div className="row">
                <div className="col-12 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
                  <div className="mb-4">
                    <div className="hstack gap-3">
                      <img src="/static/icons/logo.svg" alt="" style={{ minWidth: "4rem" }} />
                      <i class="bi bi-x" style={{ fontSize: "2rem" }}></i>
                      <img src="/static/icons/google_sheet_icon.svg" alt="" style={{ minWidth: "4rem" }} />
                    </div>
                  </div>

                  <div className="d-flex align-items-center flex-column">
                    <p className="mb-2">No Key metric integrated yet</p>
                    <button
                      onClick={() => {
                        setgoalId("");
                        setkeymetricId("");
                      }}
                      ref={integrateBtn}
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#CreateGoogleIntegrationDialog"
                    >
                      Integrate a metric
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        </>
      )}

      <TourModal />
      <CreateGoogleIntegrationDialog integrateBtn={integrateBtn} goalId={goalId} keyMetricId={keyMetricId} />
    </div>
  );
}

export default Integrations;
