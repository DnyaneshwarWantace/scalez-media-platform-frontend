import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProjectCollaborators, selectProjectUsers } from "../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { useEffect } from "react";

function Members() {
  const me = JSON.parse(localStorage.getItem("user", ""));
  const projectUsers = useSelector(selectProjectUsers);
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
          <p>MEMBERS</p>
        </div>
      </div>

      {projectUsers.length === 0 && (
        <div className="d-flex align-items-center justify-content-center flex-column pt-3 pb-3">
          <img src="/static/illustrations/invite-users.svg" alt="" />
          <p className="body1 text-center regular-weight text-secondary mt-3">
            Invite users, clients
            <br /> to get feedback
          </p>
        </div>
      )}

      {projectUsers.length !== 0 &&
        projectUsers.map((member) => {
          return (
            <div className="border-bottom d-flex align-items-center p-1">
              <img src={`${backendServerBaseURL}/${member.avatar}`} className="avatar2" alt="" style={{ marginRight: "0.5rem" }} />

              <div>
                <p className="mb-0">
                  {member.firstName} {member.lastName}
                </p>
                <p className="mb-0">{member?.role?.name}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Members;
