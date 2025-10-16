import React, { useState } from "react";
import TestIdeaDialog from "./TestIdeaDialog";
import { MentionsInput, Mention } from "react-mentions";
import FilePreview from "../../../components/common/FilePreview";
import Members from "../../../components/common/Members";
import Collaborators from "../../../components/common/Collaborators";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  getProjectUsers,
  nominateIdea,
  readSingleIdea,
  readSingleIdeaPublic,
  selectProjectUsers,
  selectSelectedIdea,
  selectSingleIdeaInfo,
  selectsingleIdeaInfoPublic,
  unnominateIdea,
  updateComment,
  updateSelectedIdea,
  updateselectedTest,
} from "../../../redux/slices/projectSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { formatTime } from "../../../utils/formatTime";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import CreateNewIdeaDialog from "./CreateNewIdeaDialog";
import { swapTags } from "../../../utils/tag.js";
import moment from "moment";

function IdeaPublicView() {
  const [comment, setcomment] = useState("");
  const [comment2, setcomment2] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const ideaId = params.ideaId;
  const projectId = params.projectId;
  const selectedIdea = useSelector(selectsingleIdeaInfoPublic);
  const me = JSON.parse(localStorage.getItem("user", ""));
  const projectUsers = useSelector(selectProjectUsers);
  const [editingComment, seteditingComment] = useState(0);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));

  useEffect(() => {
    dispatch(readSingleIdeaPublic({ ideaId }));
    dispatch(getProjectUsers({ projectId }));
  }, []);

  const ProjectsMenus = [
    {
      name: "Weekly Sales",
    },
    {
      name: "Monthly Revenue",
    },
  ];

  return (
    <div>
      <div className="d-flex">
        <div className="flex-fill" style={{ marginRight: "5rem" }}>
          <div className="mb-3 d-flex">
            <div className="flex-fill">
              <p className="body3 text-secondary">{openedProject?.name} / Ideas</p>
              <h2>{selectedIdea?.name}</h2>
              <div className="hstack gap-2 mt-2"></div>
            </div>

            <div>
              <div className="p-2 rounded" style={{ backgroundColor: "var(--bs-success)" }}>
                <h2 style={{ color: "var(--bs-green)" }}>{selectedIdea?.score}</h2>
                <div className="body3 mt-2">
                  <div className="hstack mb-1">
                    <div style={{ minWidth: "7rem" }}>
                      <p className="m-0">Impact</p>
                    </div>
                    {selectedIdea?.impact}
                  </div>
                  <div className="hstack mb-1">
                    <div style={{ minWidth: "7rem" }}>
                      <p className="m-0">Confidence</p>
                    </div>
                    {selectedIdea?.confidence}
                  </div>
                  <div className="hstack">
                    <div style={{ minWidth: "7rem" }}>
                      <p className="m-0">Ease</p>
                    </div>
                    {selectedIdea?.ease}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="body3 mb-2 text-secondary">Goal</p>
            <p>{selectedIdea?.goal?.name}</p>
          </div>

          <hr />
          {/* Created On and Confidence meter */}
          <div className="row mt-3 mb-3">
            <div className="col-6">
              <div className="border-bottom h-100">
                <p className="body3 mb-2 text-secondary">Created On</p>
                <p>{formatTime(selectedIdea?.createdAt)}</p>
              </div>
            </div>

            <div className="col-6 border-bottom">
              <div className="border-bottom">
                <p className="body3 mb-2 text-secondary">Growth Lever</p>
                <div>
                  <p className="rounded p-1 text-center" style={{ maxWidth: "8rem", backgroundColor: "var(--bs-success)", color: "var(--bs-green)" }}>
                    {selectedIdea?.lever}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="body3 mb-2 text-secondary">Key Metric</p>
            <p>{selectedIdea?.keymetric?.name}</p>
          </div>
          <hr />

          <div className="mb-3">
            <p className="body3 mb-2 text-secondary">Description</p>
            <div dangerouslySetInnerHTML={{ __html: selectedIdea?.description }}></div>
          </div>
          <hr />

          <div className="mb-3">
            <p className="body3 mb-2 text-secondary">Media</p>
            <div className="row gap-2" style={{ minHeight: "4rem" }}>
              {selectedIdea?.media.map((mediaUrl) => {
                return <FilePreview url={`${backendServerBaseURL}/${mediaUrl}`} />;
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border-start p-3" style={{ minWidth: "15rem", maxHeight: "85vh" }}>
          <div className="mb-4">
            <button
              className="btn btn-outline-primary w-100"
              data-bs-toggle="modal"
              data-bs-target="#createNewIdeaDialog"
              onClick={() => {
                dispatch(updateSelectedIdea(selectedIdea));
              }}
            >
              <i class="bi bi-pencil-fill text-primary" style={{ marginRight: "0.5rem" }}></i> Edit Idea
            </button>
          </div>

          <div className="mb-4">
            <Members />
          </div>

          <div className="mb-4">
            <Collaborators />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaPublicView;
