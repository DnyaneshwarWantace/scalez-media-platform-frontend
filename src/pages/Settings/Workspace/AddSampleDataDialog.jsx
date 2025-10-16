import { React, useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createMultipleProjects, selectProjects, selectGoals, selectIdeas, deleteMultipleProjects } from "../../../redux/slices/projectSlice"
import { selectpopupMessage, updatepopupMessage } from "../../../redux/slices/dashboardSlice";

function AddSampleDataDialog() {
    const dispatch = useDispatch();
    const params = useParams();
    const projectId = params.projectId;
    const closeDialogRef = useRef();
    const navigate = useNavigate();
    const projects = useSelector(selectProjects);
    const goals = useSelector(selectGoals);
    const ideas = useSelector(selectIdeas);

    let projectData = [{
        name: "Richfeel",
        description: "Richfeel",
        selectedTeamMembers: [],
        dataType: "SAMPLE"
    },
    {
        name: "Tagmango",
        description: "Tagmango",
        selectedTeamMembers: [],
        dataType: "SAMPLE"
    },
    {
        name: "FitnessTalks",
        description: "FitnessTalks",
        selectedTeamMembers: [],
        dataType: "SAMPLE"
    },
    {
        name: "Nutriherbs",
        description: "Nutriherbs",
        selectedTeamMembers: [],
        dataType: "SAMPLE"
    },
];

    const [sampleDataBtn, setsampleDataBtn] = useState();
   
    useEffect(() => {
        let res = localStorage.getItem('sampleDataBtn');
        if(res) {
            setsampleDataBtn(res);
        }
    },[]);
    // useEffect(() => {
    //     let res = localStorage.getItem('sampleDataBtn');
    //     console.log('res :>> ', res);
    //     if(res == null) {
    //         setsampleDataBtn(null);
    //     }
    // }, [sampleDataBtn])
    const closeModal = () => {
        closeDialogRef.current.click();
    };

    const removeSampleData =  () => {
        let sampleProjects = projects.filter((x) => x.dataType === "SAMPLE");
        console.log('sampleProjects :>> ', sampleProjects);
        let sampleProjectId = sampleProjects.map((x) => x._id);
        console.log('sampleProjectId :>> ', sampleProjectId);
        dispatch(deleteMultipleProjects({projectIds : sampleProjectId , closeModal}));
        // closeModal();
        localStorage.removeItem("sampleDataBtn");
            setsampleDataBtn(false);
        console.log('sampleDataBtn :>> ', sampleDataBtn);
        dispatch(updatepopupMessage(null));

        // window.location.reload();

    }
    const addSampleData = () => {
        dispatch(createMultipleProjects(projectData, closeModal, navigate));
        setTimeout(() => {navigate("/projects");}, 1000);
        closeModal();
        localStorage.setItem('sampleDataBtn', true)
        setsampleDataBtn(true);
    }

    return (
        <>
            <div>
                <div className="modal fade" id="AddSampleDataDialog" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div style={{ marginBottom: "24px" }}>
                                {sampleDataBtn ? <h2>Remove Sample Data</h2> : <h2>Add Sample Data</h2>}
                                    {sampleDataBtn ? <p>The sample data added will be removed, all the changes made to it will be removed. You can always add sample data again in Workspace.</p> :
                                        <p>This step will add some projects to your dashboard, which will be reflected on everyone who is in your workspace. This can be reverted by deleting sample data under “workspace”</p>}
                                </div>

                                <div className="hstack gap-2 d-flex justify-content-end">
                                    <button type="button" class="btn btn-lg btn-outline-danger" data-bs-dismiss="modal" ref={closeDialogRef}>
                                        Cancel
                                    </button>
                                    {sampleDataBtn ?                                    
                                    <button
                                        id="liveToastBtn"
                                        type="submit"
                                        class="btn btn-lg btn-primary"
                                        onClick={() => {
                                            removeSampleData()

                                        }}
                                    >
                                        Remove Sample Data
                                    </button>                               
                                    : <button
                                        type="submit"
                                        class="btn btn-lg btn-primary"
                                        onClick={() => {
                                            addSampleData()

                                        }}
                                    >
                                        Add Sample Data
                                    </button>
                                    }
                                   
                                     {/* <button
                                        type="submit"
                                        class="btn btn-lg btn-primary"
                                        onClick={(e) => {
                                            addSampleData(e)

                                        }}
                                    >
                                       {sampleDataBtn ? 'Remove Sample Data' : 'Add Sample Data' } 
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddSampleDataDialog;
