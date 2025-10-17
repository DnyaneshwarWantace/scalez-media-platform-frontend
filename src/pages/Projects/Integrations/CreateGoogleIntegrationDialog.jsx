import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  createIntegration,
  getAllGoals,
  readSingleGoal,
  selectGoals,
  selectProjectUsers,
  selectSelectedGoal,
  selectSingleGoalInfo,
  updateKeyMetric,
} from "../../../redux/slices/projectSlice";
import { selectkeyMetrics } from "../../../redux/slices/settingSlice";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const responseGoogle = (response) => {
  console.log(response);
};

function CreateGoogleIntegrationDialog({ integrateBtn, goalId, keyMetricId }) {
  const [selectedMenu, setselectedMenu] = useState("Select Metric");
  const dispatch = useDispatch();
  const closeModalRef = useRef();
  const params = useParams();
  const projectId = params.projectId;
  const allKeyMetrics = useSelector(selectkeyMetrics);
  const goalInfo = useSelector(selectSingleGoalInfo);
  const goals = useSelector(selectGoals);
  const [keyMetric, setkeyMetric] = useState(keyMetricId);
  const [sheetUrl, setsheetUrl] = useState("");
  const [sheet, setsheet] = useState("");
  const [dateCol, setdateCol] = useState("");
  const [valueCol, setvalueCol] = useState("");
  const [Cols, setCols] = useState([]);
  const [ValuesFromSheet, setValuesFromSheet] = useState([]);
  const [dateValues, setdateValues] = useState([]);
  const [valueValues, setvalueValues] = useState([]);
  const [Goal, setGoal] = useState(goalId);

  useState(() => {
    setGoal(goalId);
    setkeyMetric(keyMetricId);
  }, [goals]);

  const ProjectsMenus = [
    {
      name: "Select Metric",
    },
    {
      name: "Select File",
    },
    {
      name: "Configure",
    },
    {
      name: "Preview",
    },
    {
      name: "Complete",
    },
  ];

  const RightProjectsMenus = [];

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: "575611219896-qprf6tiiuicdi46ftcm1l9tgiv9tuaer.apps.googleusercontent.com" });
    });

    dispatch(getAllGoals({ projectId }));
  }, []);

  window.pickerCallback = async (data) => {
    console.log("ZZZZZZZZZZZZZ");
    console.log(data);
    integrateBtn.current.click();
    // var ss = SpreadsheetApp.openById(data["docs"][0]._id);
    // console.log(ss);

    if (data.action === window.google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
      const document = data[window.google.picker.Response.DOCUMENTS][0];
      const fileId = document[window.google.picker.Document.ID];
      console.log(fileId);
      const res = await gapi.client.drive.files.get({
        fileId: fileId,
        fields: "*",
      });
      text += `Drive API response for first document: \n${JSON.stringify(res.result, null, 2)}\n`;
      console.log(text);

      console.log(fileId);
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range: "A:C",
      });
      console.log(response);
      setsheetUrl(res.result.name);
      const cols = response.result.values[0];
      const values = [...response.result.values];
      setCols(cols);
      setValuesFromSheet(values);
      console.log(cols);
      console.log(values);
      // window.document.getElementById("content").innerText = text;
    }
  };

  useEffect(() => {
    console.log(`Date col: ${dateCol}`);
    console.log(`Date col: ${valueCol}`);
    console.log(`ValuesFromSheet: ${ValuesFromSheet}`);

    if (dateCol && dateCol != "") {
      let tempDateValues = [];

      for (let i = 1; i < ValuesFromSheet.length; i++) {
        tempDateValues.push(ValuesFromSheet[i][Cols.indexOf(dateCol)]);
      }

      console.log(tempDateValues);
      setdateValues(tempDateValues);
    }

    if (valueCol && valueCol != "") {
      let tempValueValues = [];

      for (let i = 1; i < ValuesFromSheet.length; i++) {
        tempValueValues.push(ValuesFromSheet[i][Cols.indexOf(valueCol)]);
      }

      console.log(tempValueValues);
      setvalueValues(tempValueValues);
    }
  }, [dateCol, valueCol]);

  const saveMetricData = () => {
    console.log(keyMetric);
    console.log(dateValues);
    console.log(valueValues);
    console.log(Goal);

    dateValues.map((date, index) => {
      dispatch(updateKeyMetric({ date, value: valueValues[index], keymetricId: keyMetric, goalId: Goal }));
    });
    dispatch(createIntegration({ projectId, keymetricId: keyMetric, goalId: Goal }));
  };

  return (
    <>
      <div>
        <div className="modal fade" id="CreateGoogleIntegrationDialog" tabIndex={-1} aria-labelledby="createNewGoalDialogLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ minWidth: "40rem" }}>
            <div className="modal-content">
              <div className="modal-body">
                <div className="border-bottom mt-1 mb-3">
                  <h2 style={{ marginBottom: "24px" }}>Metric Integration with Google Sheets</h2>

                  {/* Tabs */}
                  <div className="flex-fill d-flex align-items-center">
                    {ProjectsMenus.map((menu) => {
                      return (
                        <div
                          style={{ textDecoration: "none" }}
                          className="text-dark body3 regular-weight cp flex-fill"
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

                {/* Close btn hidden */}
                <div data-bs-dismiss="modal" ref={closeModalRef}></div>

                {selectedMenu === "Select Metric" && (
                  <>
                    <div className="mb-2">
                      <label htmlFor="" className="body2 mb-1">
                        Connect a Goal
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setGoal(e.target.value);
                          dispatch(readSingleGoal({ goalId: e.target.value }));
                        }}
                      >
                        <option value="">Select a goal</option>
                        {goals.map((singleGoal) => {
                          return <option key={singleGoal._id} value={singleGoal._id}>{singleGoal.name}</option>;
                        })}
                      </select>
                      <label htmlFor="" className="text-secondary">
                        Select a goal you want to connect
                      </label>
                    </div>

                    <label htmlFor="" className="body2 mb-1">
                      Connect a Metric
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        setkeyMetric(e.target.value);
                      }}
                    >
                      <option value="">Select a metric</option>
                      {goalInfo?.keymetric?.map((keyMetric) => {
                        return <option value={keyMetric._id}>{keyMetric.name}</option>;
                      })}
                    </select>
                    <label htmlFor="" className="text-secondary">
                      Select a keymetric you want to connect
                    </label>

                    <div className="d-flex justify-content-end mt-3">
                      <div className="hstack gap-2">
                        <button className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          disabled={!keyMetric || keyMetric?.length == 0}
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            setselectedMenu("Select File");
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedMenu === "Select File" && (
                  <>
                    {/* <p>Picker API API Quickstart</p>
                    <button
                      id="authorize_button"
                      onClick={() => {
                        window.handleAuthClick();
                      }}
                    >
                      Authorize
                    </button> */}
                    <button
                      id="signout_button"
                      className="d-none"
                      onClick={() => {
                        window.handleSignoutClick();
                      }}
                    >
                      Sign Out
                    </button>
                    {/* <pre id="content" style="white-space: pre-wrap"></pre> */}

                    <>
                      <label htmlFor="" className="body2 mb-1">
                        Link Google Spreadsheet
                      </label>
                      <input
                        id="authorize_button"
                        className="form-control"
                        type="text"
                        placeholder="Select a Google Spreadsheet"
                        onClick={() => {
                          window.handleAuthClick();
                        }}
                        value={sheetUrl}
                      />
                      <p>You will be directed to google, make sure to select files with valid fields</p>
                    </>

                    <div className="d-flex justify-content-end mt-3">
                      <div className="hstack gap-2">
                        <button className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          disabled={!sheetUrl || sheetUrl?.length == 0}
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            setselectedMenu("Configure");
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedMenu === "Configure" && (
                  <>
                    {/* <div className="mb-2">
                      <label htmlFor="" className="body2 mb-1">
                        Sheet
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setsheet(e.target.value);
                        }}
                      >
                        <option value="">Select a sheet</option>
                        {allKeyMetrics.map((keyMetric) => {
                          return <option value={keyMetric._id}>{keyMetric.name}</option>;
                        })}
                      </select>
                      <label htmlFor="">Select a sheet in your Google Sheet document.</label>
                    </div> */}

                    <div className="mb-2">
                      <label htmlFor="" className="body2 mb-1">
                        Date Column
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setdateCol(e.target.value);
                        }}
                      >
                        <option value="">Select a Date Column</option>
                        {Cols.map((colName) => {
                          return <option value={colName}>{colName}</option>;
                        })}
                      </select>
                      <label htmlFor="">
                        Date column that will be used to record the Metric measurement and to look for new data. The date column should be formatted
                        as a “Date” or “Date Time”.
                      </label>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="" className="body2 mb-1">
                        Value Column
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setvalueCol(e.target.value);
                        }}
                      >
                        <option value="">Select Value Column</option>
                        {Cols.map((colName) => {
                          return <option value={colName}>{colName}</option>;
                        })}
                      </select>
                      <label htmlFor="">A numerical value column for the value of your metric.</label>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <div className="hstack gap-2">
                        <button className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          disabled={!sheet || sheet?.length == 0 || !dateCol || dateCol?.length == 0 || !valueCol || valueCol?.length == 0}
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            setselectedMenu("Preview");
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedMenu === "Preview" && (
                  <>
                    <div>
                      <p>
                        Here is a preview of what your Metric data will look like, Click finish if this is highlighting the right value, or feel free
                        to change the file settings
                      </p>
                    </div>
                    <div>
                      <table className="table table-borderless mt-2 custom-table-sm">
                        <thead className="border-none">
                          <tr style={{ backgroundColor: "#F3F3F3" }}>
                            <td scope="col" className="text-secondary body semi-bold-weight border">
                              Date
                            </td>
                            <td scope="col" className="text-secondary body3 semi-bold-weight border">
                              Value
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {dateValues.map((date, index) => {
                            return (
                              <tr className="border bg-white">
                                <td className="body3 regular-weight align-middle border">{date}</td>
                                <td className="body3 regular-weight align-middle border">{valueValues[index]}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <div className="hstack gap-2">
                        <button className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            setselectedMenu("Complete");
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedMenu === "Complete" && (
                  <>
                    <h2 className="mb-2">Integration Successful!</h2>
                    <p className="mb-3">
                      Every evening, We will look for new values by looking at your date column and looking for dates that are newer. Please note we
                      will not sync values with older dates if we have synced a newer data; trigger a full resync if you want all date and values to
                      be erased and resynced from your Google Sheet.
                    </p>
                    <div className="alert alert-warning" role="alert">
                      DO NOT rename column names in your sheet or change the column data types once the sync is created. You will need to recreate
                      this link if you need to rename a column.
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <div className="hstack gap-2">
                        <button className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          className="btn btn-lg btn-primary"
                          data-bs-dismiss="modal"
                          onClick={() => {
                            saveMetricData();
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGoogleIntegrationDialog;
