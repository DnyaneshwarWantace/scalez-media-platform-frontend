import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createMultipleProjects, selectProjects, selectGoals, selectIdeas, deleteMultipleProjects } from "../../../redux/slices/projectSlice"
import { selectpopupMessage, updatepopupMessage } from "../../../redux/slices/dashboardSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

function AddSampleDataDialog() {
    const dispatch = useDispatch();
    const params = useParams();
    const projectId = params.projectId;
    const navigate = useNavigate();
    const projects = useSelector(selectProjects);
    const goals = useSelector(selectGoals);
    const ideas = useSelector(selectIdeas);
    const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
    };

    // Listen for custom event to open dialog
    useEffect(() => {
        const handleOpenDialog = () => {
            setIsOpen(true);
        };

        window.addEventListener('openAddSampleDataDialog', handleOpenDialog);
        
        return () => {
            window.removeEventListener('openAddSampleDataDialog', handleOpenDialog);
        };
    }, []);

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
        dispatch(createMultipleProjects({
            projects: projectData,
            closeModal: closeModal,
            navigate: navigate
        }));
        setTimeout(() => {navigate("/projects");}, 1000);
        closeModal();
        localStorage.setItem('sampleDataBtn', true)
        setsampleDataBtn(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {sampleDataBtn ? 'Remove Sample Data' : 'Add Sample Data'}
                    </DialogTitle>
                    <DialogDescription>
                        {sampleDataBtn 
                            ? 'The sample data added will be removed, all the changes made to it will be removed. You can always add sample data again in Workspace.'
                            : 'This step will add some projects to your dashboard, which will be reflected on everyone who is in your workspace. This can be reverted by deleting sample data under "workspace".'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    {sampleDataBtn ? (
                        <Button
                            variant="destructive"
                            onClick={() => {
                                removeSampleData();
                            }}
                        >
                            Remove Sample Data
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                addSampleData();
                            }}
                        >
                            Add Sample Data
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddSampleDataDialog;
