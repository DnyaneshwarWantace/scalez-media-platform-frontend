import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { updateWidgets } from "../../redux/slices/dashboardSlice";

function AddWidgetDialog() {
  const dispatch = useDispatch();
  const closeBtnRef = useRef();
  const [selectedMenu, setselectedMenu] = useState("Tutorials");
  const me = JSON.parse(localStorage.getItem("user", ""));
  const ProjectsMenus = [
    {
      name: "Tutorials",
    },
    {
      name: "Feedback",
    },
  ];

  const RightProjectsMenus = [];

  const closeModal = () => {
    closeBtnRef.current.click();
  };

  const NewProjectSchema = Yup.object().shape({
    active_goals: Yup.boolean(),
    recent_ideas: Yup.boolean(),
    active_tests: Yup.boolean(),
    key_metrics: Yup.boolean(),
    recent_learnings: Yup.boolean(),
    activity: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      active_goals: me?.widgets?.activeGoals,
      recent_ideas: me?.widgets?.recentIdeas,
      active_tests: me?.widgets?.activeTests,
      key_metrics: me?.widgets?.keyMetrics,
      recent_learnings: me?.widgets?.recentLearnings,
      activity: me?.widgets?.activity,
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);
      dispatch(updateWidgets({ ...values, closeModal }));

      // if (selectedProject) {
      //   dispatch(editProject({ ...values, closeModal, projectId: selectedProject._id, selectedTeamMembers }));
      // } else {
      //   dispatch(createProject({ ...values, closeModal, selectedTeamMembers }));
      // }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    formik.setValues({
      active_goals: me?.widgets?.activeGoals,
      recent_ideas: me?.widgets?.recentIdeas,
      active_tests: me?.widgets?.activeTests,
      key_metrics: me?.widgets?.keyMetrics,
      recent_learnings: me?.widgets?.recentLearnings,
      activity: me?.widgets?.activity,
    });
  }, []);

  const Note = (note) => {
    return (
      <div className="border p-2 rounded mb-2" style={{ backgroundColor: "#F5F8FF" }}>
        <span style={{ marginRight: "0.45rem", position: "relative", top: "-3px" }}>
          <img src="/static/images/tour/star.svg" alt="" />
        </span>
        <span className="body3 semi-bold-weight">{note}</span>
      </div>
    );
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;

  return (
    <>
      {/* Trigger Button */}
      <button 
        type="button" 
        className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 flex items-center"
        data-bs-toggle="modal" 
        data-bs-target="#AddWidgetDialog"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Widget</span>
      </button>

      {/* Modal */}
      <div className="modal fade" id="AddWidgetDialog" tabIndex={-1} aria-labelledby="deleteProjectDialogLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="mb-3">
                <h2>Add a Widget</h2>
                <p className="mb-0 text-secondary">Customize your dashboard</p>
              </div>

              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div className="mt-2 mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" {...getFieldProps("active_goals")} checked={formik.values.active_goals} />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Active Goals
                      </label>
                    </div>

                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" {...getFieldProps("recent_ideas")} checked={formik.values.recent_ideas} />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Recent Ideas
                      </label>
                    </div>

                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" {...getFieldProps("active_tests")} checked={formik.values.active_tests} />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Active Tests
                      </label>
                    </div>

                    {/* <div className="form-check">
                      <input className="form-check-input" type="checkbox" {...getFieldProps("key_metrics")} checked={formik.values.key_metrics} />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Key Metrics
                      </label>
                    </div> */}

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        {...getFieldProps("recent_learnings")}
                        checked={formik.values.recent_learnings}
                      />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Recent Learnings
                      </label>
                    </div>

                    {/* <div className="form-check">
                      <input className="form-check-input" type="checkbox" {...getFieldProps("activity")} checked={formik.values.activity} />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Activity
                      </label>
                    </div> */}
                  </div>

                  <div className="d-flex justify-content-end">
                    <div className="hstack gap-2">
                      <button className="btn btn-outline-danger" data-bs-dismiss="modal" ref={closeBtnRef}>
                        Cancel
                      </button>
                      <button className="btn btn-primary">Save Layout</button>
                    </div>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddWidgetDialog;
