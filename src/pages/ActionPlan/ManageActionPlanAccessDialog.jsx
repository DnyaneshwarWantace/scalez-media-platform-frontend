import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUsersToActionPlan, selectSelectedActionPlan } from "../../redux/slices/actionPlanSlice";
import { getAllRegisteredUsers, selectRegisteredUsers } from "../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ChevronDown, X, Users } from "lucide-react";

function ManageActionPlanAccessDialog() {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(3);
  const dispatch = useDispatch();
  const users = useSelector(selectRegisteredUsers);
  const [copyTextAllowed, setcopyTextAllowed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const NewProjectSchema = Yup.object().shape({});
  const selectedActionPlan = useSelector(selectSelectedActionPlan);

  const closeModal = () => {
    setIsOpen(false);
  };

  // Listen for custom event to open dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener('openManageAccessDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openManageAccessDialog', handleOpenDialog);
    };
  }, []);

  const formik = useFormik({
    initialValues: {},
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);

      dispatch(addUsersToActionPlan({ ...values, closeModal, users: selectedTeamMembers, copyTextAllowed }));

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
    dispatch(getAllRegisteredUsers());
  }, []);

  useEffect(() => {
    setselectedTeamMembers(selectedActionPlan?.users ? selectedActionPlan?.users : []);
  }, [selectedActionPlan]);

  return (
    <>
      {/* Hidden Bootstrap modal for compatibility */}
      <div className="modal fade" id="ManageActionPlanAccessDialog" tabIndex={-1} style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered" style={{ minWidth: "45rem" }}>
          <div className="modal-content">
            <div className="modal-body">
              <button style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* shadcn/ui Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Manage Access
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Control who can access and view this action plan.
            </DialogDescription>
          </DialogHeader>
          
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Team Members</Label>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto min-h-[40px] p-2"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedTeamMembers.length === 0 ? (
                          <span className="text-muted-foreground">Select team members</span>
                        ) : (
                          <>
                            {selectedTeamMembers.slice(0, numberOfTeamMembersToShowInSelect).map((teamMember, index) => (
                              <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={`${backendServerBaseURL}/${teamMember.avatar}`} />
                                  <AvatarFallback className="text-xs">
                                    {teamMember.firstName?.[0]}{teamMember.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">
                                  {teamMember.firstName} {teamMember.lastName}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSelectedTeamMember(teamMember);
                                  }}
                                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            {selectedTeamMembers.length > numberOfTeamMembersToShowInSelect && (
                              <span className="text-xs text-muted-foreground">
                                +{selectedTeamMembers.length - numberOfTeamMembersToShowInSelect} others
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-full max-h-[200px] overflow-y-auto">
                    <DropdownMenuItem
                      onClick={() => setselectedTeamMembers(users)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
                        <Users className="h-3 w-3" />
                      </div>
                      <span className="text-sm">Everyone in your team ({users?.length})</span>
                    </DropdownMenuItem>
                    
                    {users?.map((teamMember) => (
                      <DropdownMenuItem
                        key={teamMember.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (selectedTeamMembers.includes(teamMember)) {
                            removeSelectedTeamMember(teamMember);
                          } else {
                            addTeamMember(teamMember);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`${backendServerBaseURL}/${teamMember.avatar}`} />
                          <AvatarFallback className="text-xs">
                            {teamMember.firstName?.[0]}{teamMember.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm flex-1">
                          {teamMember.firstName} {teamMember.lastName}
                        </span>
                        {selectedTeamMembers.includes(teamMember) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeSelectedTeamMember(teamMember);
                            }}
                            className="hover:bg-gray-200 rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <p className="text-xs text-muted-foreground">
                  Users/Clients who you want to share with
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyTextAllowed"
                  checked={copyTextAllowed}
                  onCheckedChange={setcopyTextAllowed}
                />
                <Label htmlFor="copyTextAllowed" className="text-sm">
                  Viewers and commenters can see the option to copy the text.
                </Label>
              </div>

              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-black hover:bg-black/90 text-white"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </Form>
          </FormikProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ManageActionPlanAccessDialog;
