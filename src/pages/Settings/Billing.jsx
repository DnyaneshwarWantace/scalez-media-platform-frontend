import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCollaborators, getAllUsers, makeAdmin, makeUser, selectAllCollaborators, selectAllUsers } from "../../redux/slices/settingSlice";
import InviteCollaboratorsDialog from "./InviteCollaboratorsDialog";
import InviteTeamMemberDialog from "./InviteTeamMemberDialog";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../utils/formatTime";

function Billing() {
  const [selectedMenu, setselectedMenu] = useState("Team");
  const ideas = [1, 2, 3];
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const collaborators = useSelector(selectAllCollaborators);
  const team = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const ProjectsMenus = [
    {
      name: "Team",
    },
    {
      name: "Collaborators",
    },
  ];

  const RightProjectsMenus = [];

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllCollaborators());
  }, [selectedMenu]);

  return (
    <div>
      <div className="d-flex">
        <div>
          <h1 className="mb-1">Users</h1>
          <p className="text-secondary">Manage teammates & Collaborators</p>
        </div>

        <div className="flex-fill d-flex flex-row-reverse">
          <div className="hstack gap-3" style={{ padding: 0 }}>
            {selectedMenu === "Team" && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
                data-bs-toggle="modal"
                data-bs-target="#inviteUsers"
              >
                Add Member
              </button>
            )}

            {/* {selectedMenu === "Collaborators" && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
                data-bs-toggle="modal"
                data-bs-target="#inviteCollaborators"
              >
                Add Collaborator
              </button>
            )} */}
          </div>
        </div>
      </div>

      <div className="border-bottom mt-3">
        <div className="flex-fill d-flex align-items-center">
          {ProjectsMenus.map((menu) => {
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

      {selectedMenu === "Team" && team.length === 0 && (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <div className="vstack gap-3 text-center">
            <img src="/static/illustrations/empty-list.svg" alt="" height="200px" />
            <h2 className="body1">List is empty!</h2>
            <p>
              Collaborators are added directly <br /> from projects section!
            </p>
          </div>
        </div>
      )}

      {selectedMenu === "Collaborators" && collaborators.length === 0 && (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <div className="vstack gap-3 text-center">
            <img src="/static/illustrations/empty-list.svg" alt="" height="200px" />
            <h2 className="body1">List is empty!</h2>
            <p>
              Collaborators are added directly <br /> from projects section!
            </p>
          </div>
        </div>
      )}

      {team.length !== 0 && selectedMenu === "Team" && (
        <table className="table table-borderless mt-2 custom-table-sm">
          <thead className="border-none">
            <tr>
              <td scope="col" className="text-secondary body3 regular-weight">
                Name
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Joined
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Role
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Email
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Permission
              </td>

              <td scope="col" className="text-secondary body3 regular-weight"></td>
              <td scope="col" className="text-secondary body3 regular-weight"></td>
            </tr>
          </thead>
          <tbody>
            {team.map((teamMember) => {
              return (
                <tr className="border bg-white">
                  <td className="body3 regular-weight">
                    {teamMember.firstName} {teamMember.lastName}
                  </td>
                  <td className="body3 regular-weight">{formatTime(teamMember.createdAt)}</td>
                  <td className="body3 regular-weight">{teamMember.designation}</td>
                  <td className="body3 regular-weight">{teamMember.email}</td>
                  <td className="body3 regular-weight" style={{ textTransform: "capitalize" }}>
                    {teamMember.role}
                  </td>
                  <td className="body3 regular-weight">
                    {teamMember.token !== "" && (
                      <>
                        <span className="gray-chip">Waiting</span>
                      </>
                    )}
                  </td>

                  <td className="body3 regular-weight">
                    <div className="dropdown">
                      <div
                        className=" d-flex justify-content-between align-items-center rounded"
                        data-bs-toggle="dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-three-dots-vertical cp custom-more-icon-hover-effect" style={{ padding: "0.5rem" }}></i>
                      </div>

                      <ul className="dropdown-menu">
                        <li
                          className="border-bottom"
                          onClick={() => {
                            teamMember.role === "user"
                              ? dispatch(makeAdmin({ userId: teamMember._id }))
                              : dispatch(makeUser({ userId: teamMember._id }));
                          }}
                        >
                          <a className="dropdown-item body3 regular-weight">{teamMember.role === "user" ? "Make Admin" : "Make User"}</a>
                        </li>
                        {/* <li className="border-bottom">
                          <a className="dropdown-item body3 regular-weight" href="#">
                            Disable Member
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {collaborators.length !== 0 && selectedMenu === "Collaborators" && (
        <table className="table table-borderless mt-2">
          <thead className="border-none">
            <tr>
              <td scope="col" className="text-secondary body3 regular-weight">
                Name
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Joined
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Organization
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Email
              </td>
              <td scope="col" className="text-secondary body3 regular-weight">
                Project
              </td>
              <td scope="col" className="text-secondary body3 regular-weight"></td>
              <td scope="col" className="text-secondary body3 regular-weight"></td>
            </tr>
          </thead>
          <tbody>
            {collaborators.map((teamMember) => {
              return (
                <tr className="border bg-white">
                  <td className="body3 regular-weight">
                    {teamMember.firstName} {teamMember.lastName}
                  </td>
                  <td className="body3 regular-weight">{formatTime(teamMember.createdAt)}</td>
                  <td className="body3 regular-weight">{teamMember.owner?.organization}</td>
                  <td className="body3 regular-weight">{teamMember.email}</td>
                  <td className="body3 regular-weight">{teamMember.project?.name}</td>
                  <td className="body3 regular-weight">
                    {teamMember.token !== "" && (
                      <>
                        <span className="gray-chip">Waiting</span>
                      </>
                    )}
                  </td>
                  <td className="body3 regular-weight">
                    <div className="dropdown">
                      {/* <div
                        className=" d-flex justify-content-between align-items-center rounded"
                        data-bs-toggle="dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-three-dots-vertical cp"></i>
                      </div> */}

                      <ul className="dropdown-menu">
                        <li className="border-bottom">
                          <a className="dropdown-item body3 regular-weight">Make Admin</a>
                        </li>
                        <li className="border-bottom">
                          <a className="dropdown-item body3 regular-weight" href="#">
                            Disable Member
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <InviteTeamMemberDialog />
      <InviteCollaboratorsDialog />
    </div>
  );
}

export default Billing;
