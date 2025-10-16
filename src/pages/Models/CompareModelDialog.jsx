import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectmodels } from "../../redux/slices/modelSlice";
import { useNavigate } from "react-router-dom";

function CompareModelDialog() {
  const allModels = useSelector(selectmodels);
  const navigate = useNavigate();
  const closeDialogRef = useRef();

  const closeDialog = () => {
    closeDialogRef.current.click();
  };

  const NewProjectSchema = Yup.object().shape({
    modelA: Yup.string().required("Model A is required"),
    modelB: Yup.string().required("Model B is required"),
  });

  const formik = useFormik({
    initialValues: {
      modelA: "",
      modelB: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
      window.open(`/models/compare/${values.modelA}/${values.modelB}`, "_self");
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  return (
    <>
      <div>
        {/* Modal */}
        <div className="modal fade" id="compareModelDialog" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <h2 style={{ marginBottom: "24px" }}>Compare Models</h2>

                    <div className="form-field">
                      <label className="form-label">Model A</label>
                      <select className="form-select" aria-label="Default select example" {...getFieldProps("modelA")}>
                        <option selected>Select a model</option>
                        {allModels.map((model) => {
                          return <option value={model._id}>{model.name}</option>;
                        })}
                      </select>
                      <span className="invalid-feedback" style={{ display: Boolean(touched.modelA && errors.modelA) ? "block" : "none" }}>
                        {errors.modelA}
                      </span>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Model B</label>
                      <select className="form-select" aria-label="Default select example" {...getFieldProps("modelB")}>
                        <option selected>Select a model</option>
                        {allModels.map((model) => {
                          return <option value={model._id}>{model.name}</option>;
                        })}
                      </select>
                      <span className="invalid-feedback" style={{ display: Boolean(touched.modelB && errors.modelB) ? "block" : "none" }}>
                        {errors.modelB}
                      </span>
                    </div>

                    <div className="hstack gap-2 d-flex justify-content-end">
                      <button type="button" className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal" ref={closeDialogRef}>
                        Close
                      </button>
                      <button type="submit" className="btn btn-lg btn-primary">
                        Compare Models
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

export default CompareModelDialog;
