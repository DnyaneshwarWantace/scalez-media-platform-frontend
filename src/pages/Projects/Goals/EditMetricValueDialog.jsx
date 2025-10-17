import { Form, FormikProvider, useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { selectSelectedKeyMetric, selectSingleGoalInfo, updateKeyMetric, updateKeyMetricValue } from "../../../redux/slices/projectSlice";

function EditMetricValueDialog() {
  const selectedKeyMetric = useSelector(selectSelectedKeyMetric);
  const dispatch = useDispatch();
  const closeModalRef = useRef();
  const  closeModal  = () => {
    closeModalRef.current.click();
  };
  const params = useParams();
  const projectId = params.projectId;
  const goalId = params.goalId;

  const NewProjectSchema = Yup.object().shape({
    value: Yup.number().required("Value is required"),
  });

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
      dispatch(updateKeyMetricValue({ ...values, keymetricId: selectedKeyMetric?._id, goalId, closeModal,
      }));
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  useEffect(() => {
    formik.setValues({
      value: selectedKeyMetric?.value,
    });
  }, [selectedKeyMetric]);



  return (
    <>
      {/* Create new Project Dialog */}
      <div>
        {/* Modal */}
        <div className="modal fade" id="EditMetricValueDialog" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "24px" }}>
                      <h2>Update Metric Value</h2>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Value</label>
                      <input type={"number"} {...getFieldProps("value")} className="form-control form-control-lg" placeholder="Enter Value" />
                      <span className="invalid-feedback" style={{ display: Boolean(touched.value && errors.value) ? "block" : "none" }}>
                        {errors.value}
                      </span>
                    </div>

                    <div className="hstack gap-2 d-flex justify-content-end">
                      <button type="button" className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal" ref={closeModalRef}>
                        Close
                      </button>
                      <button type="submit" className="btn btn-lg btn-primary" data-bs-dismiss="modal" ref={closeModalRef}>
                        Update Value
                      </button>
                    </div>
                  </Form>
                </FormikProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMetricValueDialog;
