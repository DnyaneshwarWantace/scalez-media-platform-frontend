import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import {
  editpointer,
  readPointer,
  selectsinglePointerInfo,
  getAllActionPlans,
} from "../../redux/slices/actionPlanSlice";
import { hasPermission_create_actionPlans } from "../../utils/permissions";

function SingleActionPlan() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contentId = params.contentId;
  const singlePointerInfo = useSelector(selectsinglePointerInfo);
  const [value, setvalue] = useState(null);

  useEffect(() => {
    dispatch(
      readPointer({
        pointerId: contentId,
      })
    );
    dispatch(getAllActionPlans());
  }, [readPointer]);

  return (
    <div className="page-body-widthout-sidebar">
      <div className="container">
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <div
                className="d-flex align-items-center align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/action-plans");
                }}
              >
                <i
                  class="bi bi-arrow-left"
                  style={{ marginRight: "0.3rem" }}
                ></i>
                <p className="text-secondary mb-0 ml-1">All Action Plans</p>
              </div>

              <h1 className="mb-1 noselect">Content</h1>
              <p className="text-secondary">All your process at one place</p>
            </div>

            {
              <>
                <div className="hstack gap-2">
                  <button
                    className="btn btn-lg btn-outline-primary"
                    onClick={() => {
                      navigate("/action-plans");
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-lg btn-primary"
                    disabled={value == null}
                    onClick={() => {
                      dispatch(
                        editpointer({
                          navigate,
                          pointerId: contentId,
                          data: value,
                          name: localStorage.getItem(
                            "selected-content-name",
                            "Pointer 1"
                          ),
                        })
                      );
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            }
          </div>

          {((singlePointerInfo &&
            contentId &&
            singlePointerInfo._id === contentId) ||
            hasPermission_create_actionPlans()) && (
            <SunEditor
              height="30rem"
              style={{ minWidth: "100%" }}
              // onChange={(value) => { console.log(value) }}
              defaultValue={singlePointerInfo?.data}
              value={singlePointerInfo?.data}
              setDefaultStyle="font-family: Public Sans, sans-serif; font-size: 16px;"
              onChange={(value) => {
                setvalue(value);
              }}
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["fontSize", "formatBlock"],
                  ["paragraphStyle", "blockquote"],
                  ["bold", "underline", "italic", "link"],
                  ["fontColor", "hiliteColor"],
                  ["image", "video"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["fullScreen", "showBlocks", "codeView"],
                ],
              }}
            />
          )}

          {singlePointerInfo && singlePointerInfo._id === contentId && (
            <div
              dangerouslySetInnerHTML={{ __html: singlePointerInfo?.data }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleActionPlan;
