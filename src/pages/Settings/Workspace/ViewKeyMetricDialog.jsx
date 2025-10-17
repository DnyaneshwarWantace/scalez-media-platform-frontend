import React from "react";
import { useSelector } from "react-redux";
import { selectselectedKeymetric } from "../../../redux/slices/settingSlice";

function ViewKeyMetricDialog() {
  const selectedKeyMetric = useSelector(selectselectedKeymetric);

  return (
    <>
      <div>
        <div className="modal fade" id="viewKeyMetricModal" tabIndex={-1} aria-labelledby="viewKeyMetricModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mt-3">
                  {/* <span className="text-success">{JSON.stringify(aboutKeyMetricFormik.errors)}</span>
                  <span className="text-warning">{JSON.stringify(metricTypeFormik.errors)}</span> */}

                  <h2 className="mb-3">Key Metric</h2>

                  <div className="border-bottom pt-2">
                    <p className="form-label text-secondary">Short Name</p>
                    <p>{selectedKeyMetric?.shortName}</p>
                  </div>

                  <div className="border-bottom pt-2">
                    <p className="form-label text-secondary">Name</p>
                    <p>{selectedKeyMetric?.name}</p>
                  </div>

                  <div className="border-bottom pt-2">
                    <p className="form-label text-secondary">Metric Type</p>
                    <p>{selectedKeyMetric?.metricType}</p>
                  </div>

                  <div className="border-bottom pt-2">
                    <p className="form-label text-secondary">Currency</p>
                    <p>{selectedKeyMetric?.type}</p>
                  </div>

                  <div className="border-bottom pt-2">
                    <p className="form-label text-secondary">Metric Time period</p>
                    <p>{selectedKeyMetric?.metricTime}</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewKeyMetricDialog;
