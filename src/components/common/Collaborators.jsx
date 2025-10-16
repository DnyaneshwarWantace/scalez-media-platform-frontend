import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InviteCollaboratorsDialog from "../../pages/Settings/InviteCollaboratorsDialog";
import { getProjectCollaborators, selectProjectCollaboratos } from "../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

function Collaborators() {
  const me = JSON.parse(localStorage.getItem("user", ""));
  const projectCollaborators = useSelector(selectProjectCollaboratos);
  const params = useParams();
  const projectId = params.projectId;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProjectCollaborators({ projectId }));
  }, []);

  return (
    <div className="mb-4">
      <div className="d-flex">
        <div className="flex-fill">
          <p>COLLABORATORS</p>
        </div>

        <div data-bs-toggle="modal" data-bs-target="#inviteCollaborators" style={{ cursor: "pointer" }}>
          <p>+</p>
        </div>
      </div>

      {projectCollaborators?.filter((member) => member.status !== "invited").length === 0 && (
        <div className="d-flex align-items-center justify-content-center flex-column pt-3 pb-3">
          <img src="/static/illustrations/invite-users.svg" alt="" />
          <p className="body1 text-center regular-weight text-secondary mt-3">
            Invite users, clients
            <br /> to get feedback
          </p>
        </div>
      )}

      {projectCollaborators?.length !== 0 &&
        projectCollaborators
          ?.filter((member) => member.status !== "invited")
          .map((member) => {
            return (
              <div className="border-bottom d-flex align-items-center p-1">
                <img src={`${backendServerBaseURL}/${member.avatar}`} className="avatar2" alt="" style={{ marginRight: "0.5rem" }} />

                <div>
                  <p className="mb-0">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="mb-0">{member.role}</p>
                </div>
              </div>
            );
          })}

      <InviteCollaboratorsDialog />
    </div>
  );
}

export default Collaborators;
