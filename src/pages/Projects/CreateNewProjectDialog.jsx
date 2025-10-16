import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createProject, editProject, getAllRegisteredUsers, selectRegisteredUsers, selectSelectedProject } from "../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { X, ChevronDown, Users } from "lucide-react";

function CreateNewProjectDialog({ isOpen = false, onClose }) {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(3);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector(selectRegisteredUsers);
  const selectedProject = useSelector(selectSelectedProject);

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required("Project Name is required"),
    description: Yup.string().required("Project description is required"),
  });

  const closeModal = () => {
    onClose && onClose();
    resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);
      if (selectedProject) {
        dispatch(editProject({ ...values, closeModal, projectId: selectedProject._id, selectedTeamMembers }));
      } else {
        dispatch(createProject({ ...values, closeModal, selectedTeamMembers }));
      }
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;

  const addTeamMember = (teamMember) => {
    console.log(selectedTeamMembers);
    let uniqueItems = [...new Set(selectedTeamMembers.concat([teamMember]))];
    setselectedTeamMembers(uniqueItems);
  };

  const removeSelectedTeamMember = (data) => {
    let tempTM = [];
    selectedTeamMembers.map((tm, index) => {
      if (tm.id != data.id) {
        tempTM.push(tm);
      }
    });
    console.log(tempTM);
    setselectedTeamMembers(tempTM);
  };


  useEffect(() => {
    if (selectedProject) {
      formik.setValues({
        name: selectedProject.name,
        description: selectedProject.description,
      });
      setselectedTeamMembers(selectedProject.team);
    } else {
      formik.setValues({
        name: "",
        description: "",
      });
    }
  }, [selectedProject]);

  useEffect(() => {
    dispatch(getAllRegisteredUsers());
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {selectedProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <div className="space-y-6">

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...getFieldProps("name")}
                  placeholder="Enter Project Name"
                />
                {touched.name && errors.name && (
                  <span className="text-sm text-red-600">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...getFieldProps("description")}
                  placeholder="Enter Description"
                />
                {touched.description && errors.description && (
                  <span className="text-sm text-red-600">
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <Label>Team Members</Label>
                
                {/* Selected Team Members Display */}
                <div className="border rounded-md p-3 min-h-[60px]">
                  {selectedTeamMembers?.length === 0 ? (
                    <p className="text-sm text-muted-foreground m-0">Select team members</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMembers?.slice(0, numberOfTeamMembersToShowInSelect).map((teamMember) => (
                        <Badge key={teamMember.id} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                          <img
                            src={`${backendServerBaseURL}/${teamMember.avatar}`}
                            alt=""
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-xs">
                            {teamMember.firstName} {teamMember.lastName}
                          </span>
                          <button
                            type="button"
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedTeamMember(teamMember);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {selectedTeamMembers.length > numberOfTeamMembersToShowInSelect && (
                        <Badge variant="outline" className="px-3 py-1">
                          +{selectedTeamMembers.length - numberOfTeamMembersToShowInSelect} Others
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Member Selection */}
                <Select open={isTeamDropdownOpen} onOpenChange={setIsTeamDropdownOpen}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add team members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="everyone"
                      onClick={() => {
                        setselectedTeamMembers(users);
                        setIsTeamDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-3 w-3" />
                        </div>
                        <span>Everyone in your team ({users?.length})</span>
                      </div>
                    </SelectItem>
                    {users?.map((teamMember) => (
                      <SelectItem
                        key={teamMember.id}
                        value={teamMember.id}
                        onClick={() => {
                          addTeamMember(teamMember);
                          setIsTeamDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`${backendServerBaseURL}/${teamMember.avatar}`}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{teamMember?.firstName} {teamMember?.lastName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onClose && onClose();
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (selectedProject ? "Updating..." : "Creating...") 
                    : (selectedProject ? "Update Project" : "Create Project")
                  }
                </Button>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewProjectDialog;
