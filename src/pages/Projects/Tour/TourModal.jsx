import React, { useState } from "react";
import { useDispatch } from "react-redux";

function TourModal() {
  const dispatch = useDispatch();
  const [selectedMenu, setselectedMenu] = useState("Goals");
  const ProjectsMenus = [
    {
      name: "Goals",
    },
    {
      name: "Ideas",
    },
    {
      name: "Tests",
    },
    {
      name: "Learnings",
    },
    {
      name: "Insights",
    },
  ];

  const RightProjectsMenus = [];

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

  const previous = () => {
    const currentIndex = ProjectsMenus.map((a) => a.name).indexOf(selectedMenu);
    if (currentIndex != 0) {
      setselectedMenu(ProjectsMenus[currentIndex - 1].name);
    }
  };

  const next = () => {
    const currentIndex = ProjectsMenus.map((a) => a.name).indexOf(selectedMenu);
    if (currentIndex != ProjectsMenus.length - 1) {
      setselectedMenu(ProjectsMenus[currentIndex + 1].name);
    }
  };

  return (
    <>
      <div className="modal fade" id="tourModal" tabIndex={-1} aria-labelledby="deleteProjectDialogLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ minWidth: "40rem" }}>
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="text-primary semi-bold-weight">Scalez Process</h6>
              <h2>A 5-Step Formula that drives results</h2>
              <p className="text-secondary" style={{ marginBottom: "16px" }}>
                A quick guide of how a project process takes place at Pulse!
              </p>

              <div className="border-bottom mt-4 mb-3">
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

              {selectedMenu == "Goals" && (
                <>
                  <img src="/static/images/tour/goals.svg" alt="" style={{ maxWidth: "100%", marginBottom: "1rem" }} />

                  {Note("A goal can be any form of improvment you want to accomplish, ex : Increase ad clicks.")}
                  {Note("Each goal consist of Key metrics that you’re trying to improve. ex : Weekly Sales, MRR, etc.")}
                  {Note("Goals are set on a specific timeline/duration.")}
                  {Note("Goals can be assigned to multiple members.")}
                </>
              )}

              {selectedMenu == "Ideas" && (
                <>
                  <img src="/static/images/tour/ideas.svg" alt="" style={{ maxWidth: "100%", marginBottom: "1rem" }} />

                  {Note("For each goal, all the members added will be able to ideate together!")}
                  {Note("Each Idea is calculated based on I.C.E Score")}
                  {Note("Ideas also consist of Levers, to show what impact they’ll make")}
                  {Note("Ideas can also be nominated to see which ones are being liked the most!")}
                </>
              )}

              {selectedMenu == "Tests" && (
                <>
                  <img src="/static/images/tour/tests.svg" alt="" style={{ maxWidth: "100%", marginBottom: "1rem" }} />

                  {Note("The highest I.C.E score or nominated Ideas are usually tested first")}
                  {Note("Tests consist of assigned members & tasks to do")}
                  {Note("Once tests are ready to analyze, they can be sent to learnings")}
                  {Note("Tests can also be sent back to ideas incase there is any change in mind")}
                </>
              )}

              {selectedMenu == "Learnings" && (
                <>
                  <img src="/static/images/tour/learnings.svg" alt="" style={{ maxWidth: "100%", marginBottom: "1rem" }} />

                  {Note("Learnings is basically conclusion to an idea")}
                  {Note("Learnings consist of : Worked, Din’t worked and Inconclusive")}
                  {Note("Great learnings can also be used on other projects as it’s a good data")}
                  {Note("You can also add screenshots or any other media in learnings")}
                </>
              )}

              {selectedMenu == "Insights" && (
                <>
                  <img src="/static/images/tour/insights.svg" alt="" style={{ maxWidth: "100%", marginBottom: "1rem" }} />

                  {Note("Track your team’s contribution towards the organization’s growth")}
                  {Note("Other Insights consist of graphs, charts and statistics")}
                  {Note("Graphs can also be exported (Coming soon)")}
                  {Note("Teammates are also rewarded points based on contribution (Coming soon)")}
                </>
              )}

              <div className="hstack gap-2 d-flex border-top pt-3">
                <div className="flex-fill">
                  <button type="button" class="btn btn-lg btn-text-primary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>

                <div className="hstack gap-2 d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-lg btn-outline-primary"
                    onClick={() => {
                      previous();
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    class="btn btn-lg btn-primary"
                    onClick={() => {
                      next();
                    }}
                  >
                    Next
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

export default TourModal;
