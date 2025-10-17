import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { readTasks, updatepopupMessage } from "./dashboardSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { uniqueId } from "lodash";

const initialState = {
  projects: [],
  users: [],
  registeredUsers: [],
  projectUsers: [],
  projectSearch: "",
  projectSelectedTab: "All",
  selectedProject: null,
  projectCollaboratos: [],

  goals: [],
  selectedGoal: null,
  singleGoalInfo: null,
  selectedKeyMetric: null,

  ideas: [],
  selectedIdea: null,
  singleIdeaInfo: null,
  singleIdeaInfoPublic: null,

  tests: [],
  selectedTest: null,
  singleTestInfo: null,
  showSendBackToIdeasDialog: false,

  learnings: [],
  selectedLearning: null,
  singleLearningInfo: null,
  showSendBackToTestsDialog: false,
  showDeleteGoalDialog: false,
  showDeleteIdeaDialog: false,  ideasCreatedAndTestStartedGraphData: null,
  learningsAcquiredGraphData: null,
  learningsByGrowthLeverGraphData: null,
  WeeklyTeamPartcipationGraphData: null,
  insightsSpan: 4,
  growthData: null,
  growthSpan: 1,

  integrations: [],
  selectedIntegration: null,
};

let projectNameData;


// Projects
export const getAllProjects = createAsyncThunk("project/getAllProjects", async (_, thunkAPI) => {
  try {
    let config = {
      params: {
        search: thunkAPI.getState().project.projectSearch,
        status: thunkAPI.getState().project.projectSelectedTab,
      },
    };

    let response = await axios.get(`${backendServerBaseURL}/api/v1/project/read`, config);
    // console.log("response --",response.data)

    if (response.status === 200 && response.data.message === "Projects retrieved successfully") {
      thunkAPI.dispatch(updateProjects(response.data.projects));
      localStorage.setItem("projectsData", JSON.stringify(response.data.projects));
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllUsers = createAsyncThunk("project/getAllUsers", async (_, thunkAPI) => {
  try {
    let response = await axios.get(`${backendServerBaseURL}/api/v1/management/readUsers`);

    if (response.status === 200 && response.data.message === "Users retrieved successfully") {
      thunkAPI.dispatch(updateUsers(response.data.users));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllRegisteredUsers = createAsyncThunk("project/getAllRegisteredUsers", async (_, thunkAPI) => {
  try {
    let response = await axios.get(`${backendServerBaseURL}/api/v1/management/readRegisteredUsers`);

    if (response.status === 200 && response.data.message === "Users retrieved successfully") {
      thunkAPI.dispatch(updateRegisteredUsers(response.data.users));
    }
  } catch (error) {
    console.error("Error fetching registered users:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllArchievedProjects = createAsyncThunk("project/getAllArchievedProjects", async (_, thunkAPI) => {
  let config = {
    params: {
      search: thunkAPI.getState().project.projectSearch,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/project/readArchived`, config);

  if (response.status === 200 && response.data.message === "Projects retrieved successfully") {
    thunkAPI.dispatch(updateProjects(response.data.projects));
  }
});

export const createProject = createAsyncThunk("project/createProject", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/project/create`, payload);

  if (response.status === 201 && response.data.message === "Project created successfully") {
    thunkAPI.dispatch(getAllProjects());
    thunkAPI.dispatch(createGoal({projectId: payload.projectId}));
    payload.closeModal();
  }
});

export const createMultipleProjects = createAsyncThunk("project/createMultipleProjects", async (payload, thunkAPI) => {
  try {
    console.log('Creating multiple projects with payload:', payload);
    let response = await axios.post(`${backendServerBaseURL}/api/v1/project/createProjects`, payload.projects || payload);

    console.log('Project creation response:', response.data);

    // Check if response has the expected structure
    if (response.status === 201 && response.data.message === "Projects created successfully" && response.data.projects) {
      let sampleProjectIds = response.data.projects.map((x) => x._id);
      let sampleProjectName = response.data.projects.map((x) => x.name);
      projectNameData = sampleProjectName;
      console.log('Project IDs:', sampleProjectIds);
      console.log('Project names:', sampleProjectName);

      thunkAPI.dispatch(getAllProjects());
      thunkAPI.dispatch(updatepopupMessage("Sample data added"));
      setTimeout(() => {
        thunkAPI.dispatch(updatepopupMessage(null));
      }, 1000);

      // Continue with goal creation logic
      let userInfo = localStorage.getItem("userData", "");
      let userDetails = JSON.parse(userInfo);

      let goalSampleData = [];
        // for (let i = 0; i < 3; i++) {  

          let obj1 = {
            name: `Increase hair fall treatment bookings by 20% within 3 months.`,
            description: "Increase the number of hair fall treatment bookings by 20% within the next three months, positioning RichFeel as the go-to destination for individuals seeking trusted and effective solutions to their hair fall concerns. By leveraging data-driven strategies, targeted marketing campaigns, and seamless customer experiences, we aim to enhance brand awareness, attract a larger customer base, and drive significant growth in hair fall treatment bookings.",
            startDate: new Date(),
            endDate: "2023-07-14",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId: sampleProjectIds[0],
            keymetric: [
              {
                name: "Conversion Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }

          let obj2 = {
            name: `Decrease the website bounce rate, increase click-through rate (CTR), and boost monthly recurring revenue (MRR) for RichFeel's online booking platform by implementing targeted optimizations and improving the user experience.`,
            description: "Decrease the website bounce rate, increase click-through rate (CTR), and boost monthly recurring revenue (MRR) for RichFeel's online booking platform by implementing targeted optimizations and improving the user experience.",
            startDate: new Date(),
            endDate: "2023-07-14",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[0],
            keymetric: [
              {
                name: "Conversion Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }
          let obj3 = {
            name: `Enhance brand awareness and reach by expanding social media presence, increasing follower count by 50% across all platforms within six months.`,
            description: "Enhance brand awareness and reach by expanding social media presence, increasing follower count by 50% across all platforms within six months.",
            startDate: new Date(),
            endDate: "2023-07-25",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[0],
            keymetric: [
              {
                name: "Conversion Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }
          let obj4 = {
            name: `Boost customer satisfaction by implementing a feedback system and achieving an average rating of 4.5 out of 5 for hair damage treatment services.`,
            description: "Boost customer satisfaction by implementing a feedback system and achieving an average rating of 4.5 out of 5 for hair damage treatment services.",
            startDate: new Date(),
            endDate: "2023-07-30",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[0],
            keymetric: [
              {
                name: "Click Through Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }
          let obj5 = {
            name: `Expand market share by targeting new geographic regions and achieving a 15% increase in sales outside of current operating areas within one year.`,
            description: "Expand market share by targeting new geographic regions and achieving a 15% increase in sales outside of current operating areas within one year.",
            startDate: new Date(),
            endDate: "2023-07-30",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[0],
            keymetric: [
              {
                name: "Monthly Revenue Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }
          let obj6 = {
            name: `Increase the number of creators hosting live workshops on TagMango by 50% within three months.`,
            description: "Increase the number of creators hosting live workshops on TagMango by 50% within three months.",
            startDate: new Date(),
            endDate: "2023-07-14",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[1],
            keymetric: [
              {
                name: "Conversion Rate",
                startValue: "20",
                targetValue: "30"
              }
            ],
            confidence: "Achievable"
          }
          let obj7 = {
            name: `Increase user engagement with live workshops on TagMango.`,
            description: "Increase user engagement with live workshops on TagMango.",
            startDate: new Date(),
            endDate: "2023-07-30",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[1],
            keymetric: [
              {
                name: "Bounce Rate",
                startValue: "30",
                targetValue: "100"
              }
            ],
            confidence: "Achievable"
          }
          let obj8 = {
            name: `Increase user engagement and satisfaction with personalized dietary and workout plans on Fitnesstalks.`,
            description: "Increase user engagement and satisfaction with personalized dietary and workout plans on Fitnesstalks.",
            startDate: new Date(),
            endDate: "2023-07-30",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[2],
            keymetric: [
              {
                name: "Conversion Rate",
                startValue: "0",
                targetValue: "2.5"
              }
            ],
            confidence: "Achievable"
          }
          let obj9 = {
            name: `Increase customer trust and loyalty for NutriHerbs' natural health and well-being products.`,
            description: "Increase customer trust and loyalty for NutriHerbs' natural health and well-being products.",
            startDate: new Date(),
            endDate: "2023-07-30",
            members: [
              {
                notificationSettings: userDetails.notificationSettings,
                widgets: userDetails.widgets,
                quickstart: userDetails.quickstart,
                ideaTest: userDetails.ideaTest,
                _id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                resetPasswordRequested: userDetails.resetPasswordRequested,
                resetPasswordTokenUsed: userDetails.resetPasswordTokenUsed,
                role: userDetails.role._id,
                ideaNominations: userDetails.ideaNominations,
                avatar: userDetails.avatar,
                owner: userDetails.owner,
                status: userDetails.status,
                limit: userDetails.limit,
                token: userDetails.token,
                organization: userDetails.organization,
                type: userDetails.type,
                fevicon: userDetails.fevicon,
                logo: userDetails.logo,
                createdAt: userDetails.createdAt,
                updatedAt: userDetails.updatedAt,
                // __v: 0,
                company:userDetails.company,
                employees: userDetails.employees,
                industry: userDetails.industry,
                joined: userDetails.joined,
                phone: userDetails.phone,
                lastLogin: userDetails.lastLogin,
                domain: userDetails.domain,
                ideaCount: userDetails.ideaCount,
                ideaNominate: userDetails.ideaNominate
              }
            ],
            projectId:  sampleProjectIds[3],
            keymetric: [
              {
                name: "Monthly Revenue Rate",
                startValue: "0",
                targetValue: "200000"
              }
            ],
            confidence: "Very Confident"
          }
          // for (let i = 0; i < 3; i++) {  
            if(sampleProjectName[0] === "Richfeel"){
              goalSampleData.push(obj1, obj2,obj3, obj4, obj5);
            }
           if (sampleProjectName[1] === "Tagmango"){
              goalSampleData.push(obj6, obj7);
            }
            if (sampleProjectName[2] === "FitnessTalks"){
              goalSampleData.push(obj8);
            }
            if (sampleProjectName[3] === "Nutriherbs"){
              goalSampleData.push(obj9);
            }
          // }
        // }
  
      thunkAPI.dispatch(createMultipleGoals(goalSampleData));
      if (payload.closeModal) {
        payload.closeModal();
      }
    } else {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error("Error creating multiple projects:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const editProject = createAsyncThunk("project/editProject", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/project/update/${payload.projectId}`, {
    name: payload.name,
    description: payload.description,
    team: payload.selectedTeamMembers.map((member) => member._id),
  });

  if (response.status === 200 && response.data.message === "Project updated successfully") {
    thunkAPI.dispatch(getAllProjects());
    payload.closeModal();
  }
});

export const deleteProject = createAsyncThunk("project/deleteProject", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/project/delete/${payload.projectId}`);

  if (response.status === 200 && response.data.message === "Project deleted successfully") {
    thunkAPI.dispatch(getAllProjects());
    payload.closeModal();
  }
});

export const deleteMultipleProjects = createAsyncThunk("project/deleteMultipleProjects", async (payload, thunkAPI) => {
  console.log('payload deleteMultipleProjects:>> ', payload);

  let response = await axios.post(`${backendServerBaseURL}/api/v1/project/deleteMultiple`, payload);
  if (response.status === 200 && response.data.message === "Data deleted successfully") {
    thunkAPI.dispatch(updatepopupMessage("Sample data removed"));
    thunkAPI.dispatch(getAllProjects());
    payload.closeModal();
    setTimeout(() => {
      window.location.reload();}, 1000);
    console.log('response deleteMultipleProjects:>> ', response);
   }
});

export const updateProjectStatus = createAsyncThunk("project/updateProjectStatus", async (payload, thunkAPI) => {
  let response = await axios.patch(`${backendServerBaseURL}/api/v1/project/status/${payload.projectId}`, {
    status: payload.status,
  });

  if (response.status === 200 && response.data.message === "Project status updated successfully") {
    thunkAPI.dispatch(getAllProjects());
  }
});

export const archiveProject = createAsyncThunk("project/archiveProject", async (payload, thunkAPI) => {
  let response = await axios.patch(`${backendServerBaseURL}/api/v1/project/archive/${payload.projectId}`);

  if (response.status === 200 && response.data.message === "Project archived successfully") {
    thunkAPI.dispatch(getAllProjects());
  }
});

export const unarchiveProject = createAsyncThunk("project/unarchiveProject", async (payload, thunkAPI) => {
  let response = await axios.patch(`${backendServerBaseURL}/api/v1/project/unarchive/${payload.projectId}`);

  if (response.status === 200 && response.data.message === "Project unarchived successfully") {
    thunkAPI.dispatch(getAllProjects());
  }
});

export const getProjectUsers = createAsyncThunk("project/getProjectUsers", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/project/readUsers/${payload.projectId}`);

  if (response.status === 200 && response.data.message === "Project users retrieved successfully") {
    thunkAPI.dispatch(updateprojectUsers(response.data.users));
  }
});

export const getProjectCollaborators = createAsyncThunk("setting/getProjectCollaborators", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/project/readCollaborators/${payload.projectId}`);

  if (response.status === 200 && response.data.message === "Collaborators retrieved successfully") {
    thunkAPI.dispatch(updateprojectCollaboratos(response.data.collaborators));
    payload.closeDialog();
  }
});

export const inviteProjectCollaborators = createAsyncThunk("setting/inviteProjectCollaborators", async (payload, thunkAPI) => {
  payload.seterror(null);

  try {
    let response = await axios.post(`${backendServerBaseURL}/api/v1/management/inviteCollaborator`, {
      emails: payload.emails,
      project: payload.projectId,
    });

    if (response.status === 201 && response.data.message === "Collaborators invited") {
      thunkAPI.dispatch(getProjectCollaborators({ projectId: payload.projectId }));
      payload.closeDialog();
    }
  } catch (e) {
    payload.seterror(e.response.data.message);
  }
});

// Goals
export const getAllGoals = createAsyncThunk("project/getAllGoals", async (payload, thunkAPI) => {
  
  let config = {
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/goal/read/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Goals retrieved successfully") {
    thunkAPI.dispatch(updateGoals(response.data.goals));
  }
});

// Goals
export const readAllGoals = createAsyncThunk("project/readAllGoals", async (payload, thunkAPI) => {
  console.log('after call payload :>> ', payload);
  
  let config = {
    params: {},
  };

  let response = await axios.post(`${backendServerBaseURL}/api/v1/goal/readAll`, payload, config);

  if (response.status === 200 && response.data.message === "Goals retrieved successfully") {
    thunkAPI.dispatch(updateGoals(response.data.goals));
    console.log('response.data.goals :>> ', response.data.goals);
  }
});

export const createGoal = createAsyncThunk("project/createGoal", async (payload, thunkAPI) => {
  try {
    console.log('createGoal payload :>> ', payload);
    const processedKeyMetrics = payload.keymetric ? payload.keymetric.map(
      (km) =>
        (km = {
          name: km.name,
          startValue: km.startValue,
          targetValue: km.targetValue,
        })
    ) : payload.keyMetrics.map(
      (km) =>
        (km = {
          name: km.keyMetric,
          startValue: km.startValue,
          targetValue: km.targetValue,
        })
    );
    

    let response = await axios.post(`${backendServerBaseURL}/api/v1/goal/create`, {
      name: payload.name,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      members: payload.members,
      projectId: payload.projectId,
      keymetric: processedKeyMetrics,
      confidence: payload.confidence,
    });


    console.log('response createGoal:>> ', response.data);
    if (response.status === 201 && response.data.message === "Goal created successfully") {

      thunkAPI.dispatch(getAllGoals({ projectId: payload.projectId }));
      payload.closeModal();
      // payload.reset();
      thunkAPI.dispatch(updateSelectedGoal(response.data.goal));
      
    
      setTimeout(() => {
        payload.openRequestIdeaDialog();
      }, 1000);
    }
  } catch (error) {
    console.error("Error creating goal:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});


export const createMultipleGoals = createAsyncThunk("project/createMultipleGoals", async (payload, thunkAPI) => {
  try {
    let response = await axios.post(`${backendServerBaseURL}/api/v1/goal/createMultiple`, payload);
    if (response.status === 201 && response.data.message === "Goal created successfully") {
  console.log('payload 111:>> ', payload);
      console.log('getAllGoals response :>> ', response.data.goal);
      thunkAPI.dispatch(readAllGoals({ projectId: response.data.goal }))
      // payload.reset();
      thunkAPI.dispatch(updateSelectedGoal(response.data.goal));
    }
      let sampleGoalIds = response.data.goal.map((x) => x._id);
      let projectId = response.data.goal.map((x) => x.project);
      let goalName = response.data.goal.map((x) => x.name);
      console.log('projectId We:>> ', projectId);
      console.log('projectId goalName:>> ', goalName);

  
      console.log('selectProjects We:>> ', selectProjects);
  
      let ideaSampleData = [];
    

  
      // sampleGoalIds.forEach((goalId, index) => {
        let obj1 = {
          name: "Launch targeted digital marketing campaigns to reach individuals experiencing hair fall issues.",
          description: "Launch targeted digital marketing campaigns to reach individuals experiencing hair fall issues.",
          goal: sampleGoalIds[0],
          lever: "Referral",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[0],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "3",
          confidence: "4",
          ease: "7",
          score: "4"
        }
        let obj2 = {
          name: "Collaborate with influencers and bloggers in the beauty and wellness niche to promote RichFeel's hair fall treatment.",
          description: "Collaborate with influencers and bloggers in the beauty and wellness niche to promote RichFeel's hair fall treatment.",
          goal: sampleGoalIds[0],
          lever: "Activation",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[0],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "3",
          confidence: "4",
          ease: "7",
          score: "4"
        }
        let obj3 = {
          name: "Implement personalized content recommendations based on user preferences and browsing behavior to increase engagement and reduce bounce rates. ",
          description: "Implement personalized content recommendations based on user preferences and browsing behavior to increase engagement and reduce bounce rates.",
          goal: sampleGoalIds[1],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[0],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "10",
          confidence: "8",
          ease: "3",
          score: "7"
        }
       let obj4 = {
          name: "Develop a personalized hair fall treatment recommendation tool on the website, where users can input their specific hair concerns and receive customized treatment suggestions based on their individual needs.",
          description: "Develop a personalized hair fall treatment recommendation tool on the website, where users can input their specific hair concerns and receive customized treatment suggestions based on their individual needs.",
          goal: sampleGoalIds[1],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[2],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "7",
          ease: "8",
          score: "7"
        }
        let obj5 = {
          name: "Launch a referral program, incentivizing existing customers to refer friends and family to RichFeel for hair fall treatment. Offer rewards such as discounts on future treatments or exclusive perks for successful referrals.",
          description: "Launch a referral program, incentivizing existing customers to refer friends and family to RichFeel for hair fall treatment. Offer rewards such as discounts on future treatments or exclusive perks for successful referrals.",
          goal: sampleGoalIds[1],
          lever: "Referral",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[2],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "9",
          ease: "9",
          score: "8"
        }
        let obj6 = {
          name: "Incorporate breakout sessions or group activities to encourage active participation and collaboration.",
          description: "Incorporate breakout sessions or group activities to encourage active participation and collaboration.",
          goal: sampleGoalIds[6],
          lever: "Activation",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "7",
          ease: "4",
          score: "6"
        }
        let obj7 = {
          name: "Implement a rating system for workshops, allowing participants to provide feedback and rate the overall experience.",
          description: "Implement a rating system for workshops, allowing participants to provide feedback and rate the overall experience.",
          goal: sampleGoalIds[6],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "7",
          confidence: "6",
          ease: "9",
          score: "7"
        }
        let obj8 = {
          name: "Offer post-workshop follow-up resources and materials to further engage participants and support their learning journey.",
          description: "Offer post-workshop follow-up resources and materials to further engage participants and support their learning journey.",
          goal: sampleGoalIds[6],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "10",
          ease: "12",
          score: "6"
        }
        let obj9 = {
          name: "Partner with renowned experts in various fields to offer exclusive workshops or courses, leveraging their expertise and reputation to attract a larger audience.",
          description: "Partner with renowned experts in various fields to offer exclusive workshops or courses, leveraging their expertise and reputation to attract a larger audience.",
          goal: sampleGoalIds[6],
          lever: "Referral",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "7",
          confidence: "7",
          ease: "9",
          score: "7"
        }
        let obj10 = {
          name: "Allow creators and participants to create comprehensive profiles highlighting their skills, expertise, and interests to facilitate better networking and targeted recommendations.",
          description: "Allow creators and participants to create comprehensive profiles highlighting their skills, expertise, and interests to facilitate better networking and targeted recommendations.",
          goal: sampleGoalIds[5],
          lever: "Activation",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "9",
          confidence: "8",
          ease: "5",
          score: "7"
        }
        let obj11 = {
          name: "Enable users to rate and review workshops, courses, and creators, providing valuable feedback and helping others make informed decisions.",
          description: "Enable users to rate and review workshops, courses, and creators, providing valuable feedback and helping others make informed decisions.",
          goal: sampleGoalIds[5],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "6",
          ease: "9",
          score: "7"
        }
        let obj12 = {
          name: "Utilize machine learning algorithms to analyze user preferences, behavior, and past interactions to provide tailored workshop and course recommendations, increasing engagement and satisfaction.",
          description: "Utilize machine learning algorithms to analyze user preferences, behavior, and past interactions to provide tailored workshop and course recommendations, increasing engagement and satisfaction.",
          goal: sampleGoalIds[5],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[5],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "7",
          confidence: "8",
          ease: "2",
          score: "5"
        }
                // 3

        let obj13 = {
          name: "Offer regular progress tracking and monitoring tools, such as weight and measurement logs, to help users stay accountable and motivated.",
          description: "Offer regular progress tracking and monitoring tools, such as weight and measurement logs, to help users stay accountable and motivated.",
          goal: sampleGoalIds[7],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[7],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "5",
          confidence: "7",
          ease: "9",
          score: "7"
        }
        let obj14 = {
          name: "Provide a library of educational content, including articles, videos, and tips, to educate users about healthy lifestyle choices, nutrition, and fitness.",
          description: "Provide a library of educational content, including articles, videos, and tips, to educate users about healthy lifestyle choices, nutrition, and fitness.",
          goal: sampleGoalIds[7],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[7],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "10",
          ease: "6",
          score: "8"
        }
        let obj15 = {
          name: "Offer virtual consultations with certified nutritionists and personal trainers to provide personalized guidance and address any concerns or questions users may have.",
          description: "Offer virtual consultations with certified nutritionists and personal trainers to provide personalized guidance and address any concerns or questions users may have.",
          goal: sampleGoalIds[7],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[7],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "10",
          confidence: "8",
          ease: "3",
          score: "7"
        }
        let obj16 = {
          name: "Implement gamification elements, such as challenges, badges, and rewards, to make the fitness journey more interactive and enjoyable.",
          description: "Implement gamification elements, such as challenges, badges, and rewards, to make the fitness journey more interactive and enjoyable.",
          goal: sampleGoalIds[7],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[7],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "7",
          confidence: "6",
          ease: "3",
          score: "5"
        }
        let obj17 = {
          name: "Offer seamless integration with popular fitness tracking devices and apps to automatically sync user data and provide a holistic view of their progress.",
          description: "Offer seamless integration with popular fitness tracking devices and apps to automatically sync user data and provide a holistic view of their progress.",
          goal: sampleGoalIds[7],
          lever: "Activation",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[7],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "5",
          confidence: "5",
          ease: "3",
          score: "4"
        }
                // 4

        let obj18 = {
          name: "Provide detailed product descriptions and ingredient profiles on the website to educate customers about the benefits and properties of each product.",
          description: "Provide detailed product descriptions and ingredient profiles on the website to educate customers about the benefits and properties of each product.",
          goal: sampleGoalIds[8],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[8],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "4",
          confidence: "6",
          ease: "10",
          score: "6"
        }
        let obj19 = {
          name: "Implement a customer feedback system to gather testimonials, reviews, and suggestions for product improvement.",
          description: "Implement a customer feedback system to gather testimonials, reviews, and suggestions for product improvement.",
          goal: sampleGoalIds[8],
          lever: "Acquisition",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[8],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "8",
          confidence: "8",
          ease: "9",
          score: "8"
        }
        let obj20 = {
          name: "Conduct regular quality assurance checks and certifications to ensure the purity, potency, and effectiveness of NutriHerbs' natural products.",
          description: "Conduct regular quality assurance checks and certifications to ensure the purity, potency, and effectiveness of NutriHerbs' natural products.",
          goal: sampleGoalIds[8],
          lever: "Retention",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[8],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "5",
          confidence: "7",
          ease: "3",
          score: "5"
        }
        let obj21 = {
          name: "Establish partnerships with health and wellness practitioners, spas, and wellness centers to feature and promote NutriHerbs' products as part of holistic wellness solutions.",
          description: "Establish partnerships with health and wellness practitioners, spas, and wellness centers to feature and promote NutriHerbs' products as part of holistic wellness solutions.",
          goal: sampleGoalIds[8],
          lever: "Referral",
          keymetric: "64a53d6d95bf297b4bb4a803",
          projectId: projectId[8],
          files: ["uploads/1688550849945-653839718.jpeg"],
          impact: "6",
          confidence: "6",
          ease: "7",
          score: "6"
        }
          ideaSampleData.push(obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12, obj13, obj14, obj15, obj16, obj17, obj18, obj19, obj20, obj21);

        // }
        // if(goalName[2] === "Tagmango") {
          // ideaSampleData.push(obj2);
        // }
      // })
        // for (let i = 0; i < 3; i++) { 
          
        // })
     thunkAPI.dispatch(createMultipleIdeas(ideaSampleData));


      if (payload.closeModal) {
        payload.closeModal();
      }
  } catch (error) {
    console.error("Error creating multiple goals:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateGoal = createAsyncThunk("project/updateGoal", async (payload, thunkAPI) => {
  const processedKeyMetrics = payload.keyMetrics.map(
    (km) =>
      (km = {
        name: km.keyMetric,
        startValue: parseInt(km.startValue),
        targetValue: parseInt(km.targetValue),
        metrics: km.metrics
      })
  );
  // console.log("processedKeyMetrics",processedKeyMetrics);


  const processedMembers = payload.members.map((member) => member._id);

  let response = await axios.put(`${backendServerBaseURL}/api/v1/goal/update/${thunkAPI.getState().project.selectedGoal._id}`, {
    name: payload.name,
    description: payload.description,
    startDate: payload.startDate,
    endDate: payload.endDate,
    members: processedMembers,
    projectId: payload.projectId,
    keymetric: processedKeyMetrics,
    confidence: payload.confidence,
  });
  if (response.status === 200) {
    thunkAPI.dispatch(readSingleGoal({ goalId: thunkAPI.getState().project.selectedGoal._id }));
  //   if(payload._id){
  //   thunkAPI.dispatch(readSingleGoal( {goalId: payload._id}));
  // }
    // window.location.reload();
    thunkAPI.dispatch(getAllGoals({ projectId: payload.projectId }));
    payload.closeModal();
    // payload.reset();
  }
});

export const requestIdea = createAsyncThunk("project/requestIdea", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/goal/requestIdeas/${thunkAPI.getState().project.selectedGoal}`, {
    members: payload.members.map((member) => member._id),
    message: payload.message,
  });

  if (response.status === 200 && response.data.message === "Ideas requested successfully") {
    payload.closeDialog();
  }
});

export const readSingleGoal = createAsyncThunk("project/readSingleGoal", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/goal/readOne/${payload.goalId}`);
// console.log("response --",response.data.goal)
  if (response.status === 200 && response.data.message === "Goal retrieved successfully") {
    thunkAPI.dispatch(updateSingleInfoGoal(response.data.goal));
  }
});

export const updateKeyMetric = createAsyncThunk("project/updateKeyMetric", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/goal/updateValue/${payload.goalId}`, {
    keymetricId: payload.keymetricId,
    value: payload.value,
    date: payload.date,
  });

  if (response.status === 200 && response.data.message === "Metric updated successfully") {
    if(payload.goalId){
      thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
      payload.closeDialog();
    }  
  }
});

export const updateKeyMetricValue = createAsyncThunk("project/updateKeyMetricValue", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/goal/update-metric/${payload.keymetricId}`, {
    value: payload.value,
  });

  if (response.status === 200 && response.data.message === "Metric edited successfully") {
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    window.location.reload();
    payload.closeModal();
  }
  }
});

export const deleteKeyMetricValue = createAsyncThunk("project/deleteKeyMetricValue", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/goal/delete-metric/${payload.keymetricId}`);

  if (response.status === 200 && response.data.message === "Metric deleted successfully") {
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    window.location.reload();
    payload.closeDialog();
    }
  }
});

export const updateKeyMetricStatus = createAsyncThunk("project/updateKeyMetricStatus", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/goal/updateStatus/${payload.goalId}`, {
    keymetricId: payload.keymetricId,
    status: payload.status,
  });

  if (response.status === 200 && response.data.message === "Metric status updated successfully") {
    // thunkAPI.dispatch(updateProjects(response.data.projects));
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    }
  }
});

export const addGoalComment = createAsyncThunk("project/addGoalComment", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/goal/addComment/${payload.goalId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment added successfully") {
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    }
  }
});

export const updateGoalComment = createAsyncThunk("project/updateGoalComment", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/goal/updateComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment edited successfully") {
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    }
  }
});

export const deleteGoalComment = createAsyncThunk("project/deleteGoalComment", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/goal/deleteComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment deleted successfully") {
    if(payload.goalId){
    thunkAPI.dispatch(readSingleGoal({ goalId: payload.goalId }));
    }
  }
});

export const deleteGoal = createAsyncThunk("project/deleteGoal", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/goal/delete/${thunkAPI.getState().project.selectedGoal._id}`);

  if (response.status === 200 && response.data.message === "Goal deleted successfully") {
    thunkAPI.dispatch(getAllGoals({ projectId: payload.projectId }));
    payload.closeDialgo();
  }
});

// Ideas
export const getAllIdeas = createAsyncThunk("project/getAllIdeas", async (payload, thunkAPI) => {
  console.log('payload getAllIdeas:>> ', payload.projectId);
  let config = {
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/idea/read/${payload.projectId}`, config);
  console.log('response.data.ideas 1:>> ', response.data);

  if (response.status === 200 && response.data.message === "All ideas fetched successfully") {
    console.log('response.data.ideas :>> ', response.data);
    thunkAPI.dispatch(updateIdeas(response.data.ideas));
  }
});

export const getMultipleIdeas = createAsyncThunk("project/getMultipleIdeas", async (payload, thunkAPI) => {
  console.log('payload getMultipleIdeas:>> ', payload);
  let config = {
    params: {},
  };

  let response = await axios.post(`${backendServerBaseURL}/api/v1/idea/readAllIdeas`, payload, config);
  console.log('response.data.ideas 1:>> ', response.data);

  if (response.status === 200 && response.data.message === "Multiple ideas fetched successfully") {
    console.log('response.data.ideas :>> ', response.data);
    thunkAPI.dispatch(updateIdeas(response.data.ideas));
  }
});

export const getAllIdeasByGoal = createAsyncThunk("project/getAllIdeasByGoal", async (payload, thunkAPI) => {
  let config = {
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/idea/readByGoals/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Ideas fetched successfully") {
    thunkAPI.dispatch(updateIdeas(response.data.goals));
  }
});

export const readSingleIdea = createAsyncThunk("project/readSingleIdea", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/idea/readOne/${payload.ideaId}`);

  if (response.status === 200 && response.data.message === "Idea fetched successfully") {
    // thunkAPI.dispatch(updateSelectedIdea(response.data.idea));
    thunkAPI.dispatch(updateSingleIdeaInfo(response.data.idea));
  }
});

export const readSingleIdeaPublic = createAsyncThunk("project/readSingleIdeaPublic", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/idea/read/public/${payload.ideaId}`);

  if (response.status === 200 && response.data.message === "Idea found") {
    // thunkAPI.dispatch(updateSelectedIdea(response.data.idea));
    thunkAPI.dispatch(updatesingleIdeaInfoPublic(response.data.idea));
  }
});

export const createIdea = createAsyncThunk("project/createIdea", async (payload, thunkAPI) => {
  var bodyFormData = new FormData();

  bodyFormData.append("userName", "Fred");

  bodyFormData.append("name", payload.name);
  bodyFormData.append("description", payload.description);
  bodyFormData.append("goal", payload.goal);
  bodyFormData.append("lever", payload.lever);
  bodyFormData.append("keymetric", payload.keyMetric);
  bodyFormData.append("projectId", payload.projectId);
  for (let i = 0; i < payload.files.length; i++) {
    bodyFormData.append(`files`, payload.files[i]);
  }

  bodyFormData.append("impact", parseInt(payload.impact));
  bodyFormData.append("confidence", parseInt(payload.confidence));
  bodyFormData.append("ease", parseInt(payload.ease));
  bodyFormData.append("score", parseInt(payload.score));

  // console.log('payload createIdea :>> ', payload);
  //   const formData = new FormData();

  //   payload.forEach((idea, index) => {
  //   Object.entries(idea).forEach(([key, value]) => {
  //     formData.append(`ideas[${index}][${key}]`, value);
  //   });
  // });

  let response = await axios.post(`${backendServerBaseURL}/api/v1/idea/create`, bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.status === 201 && response.data.message === "Idea created successfully") {
    // console.log('response createIdea :>> ', response);
    thunkAPI.dispatch(getAllIdeas({ projectId: payload.projectId }));
    // payload.closeDialog();
    window.location.reload();

  }

});
export const createMultipleIdeas = createAsyncThunk("project/createMultipleIdeas", async (payload, thunkAPI) => {
 
  let response = await axios.post(`${backendServerBaseURL}/api/v1/idea/createMultipleIdeas`, payload);
  if (response.status === 201 && response.data.message === "Ideas created successfully") {
    thunkAPI.dispatch(getMultipleIdeas({projectId: response.data.ideas}));
    thunkAPI.dispatch(updateIdeas(response.data.ideas));
    let sampleIdeas = response.data.ideas;
    console.log('sampleIdeas :>> ', sampleIdeas);
    let sampleIdeasIds = response.data.ideas.map((x) => x._id);
    let sampleProjIds = response.data.ideas.map((x) => x.project);
    console.log('sampleProjIds :>> ', sampleProjIds);
    let ideaNames = response.data.ideas.map((x) => x.name); 
    let ideaDesp = response.data.ideas.map((x) => x.description); 
    let ideasOwner = response.data.ideas.map((x) => x.owner); 
    let ideaKeymetrics = response.data.ideas.map((x) => x.keymetric);
    let ideaGoals = response.data.ideas.map((x) => x.goal);
    let ideaLevers = response.data.ideas.map((x) => x.lever);
    let ideaImpacts = response.data.ideas.map((x) => x.impact);
    let ideaConfidence = response.data.ideas.map((x) => x.confidence);
    let ideaEase = response.data.ideas.map((x) => x.ease);
    let ideaScore = response.data.ideas.map((x) => x.score);
    let ideaCreatedBy = response.data.ideas.map((x) => x.createdBy);
    console.log('ideaNames :>> ', ideaNames);

    console.log('sampleIdeasIds :>> ', sampleIdeasIds);
    let userInfo = localStorage.getItem("userData", "");
    let userDetails = JSON.parse(userInfo);

    let testIdeaData = [
      {
        id: sampleIdeasIds[0],
        name:"Enhance the website design and user interface to provide a more visually appealing and intuitive experience for visitors.",
        description: "Enhance the website design and user interface to provide a more visually appealing and intuitive experience for visitors.",
        project: sampleProjIds[0],
        goal: ideaGoals[0],
        createdBy: ideaCreatedBy[0],
        owner: ideasOwner[0],
        keymetric: ideaKeymetrics[0],
        lever: ideaLevers[0],
        media: [],
        impact: ideaImpacts[0],
        confidence: ideaConfidence[0],
        ease:ideaEase[0],
        score: ideaScore[0],
        dueDate: "2023-07-28",
        tasks: [
        {name: "Create new website design", status: false},
        {name: "Make variations for headings and A/B Test", status: false}
      ],
        status: "Up Next",
        nominations: [],
        assignedTo: [userDetails._id],
      },
      
        {
          id: sampleIdeasIds[2],
          name: "Offer exclusive promotions and discounts for online bookings to incentivize users and drive increased MRR.",
          description: "Offer exclusive promotions and discounts for online bookings to incentivize users and drive increased MRR.",
          project: sampleProjIds[2],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "GHHDHDBH", status: false}],
          status: "Up Next",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[2],
          name: "Implement an automated email marketing campaign targeting potential customers who have shown interest in hair care treatments.",
          description: "Implement an automated email marketing campaign targeting potential customers who have shown interest in hair care treatments.",
          project: sampleProjIds[2],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "GHHDHDBH", status: false}],
          status: "In Progress",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[2],
          name: "Optimize landing page copy and call-to-action buttons to improve click-through rates and encourage users to explore treatment options.",
          description: "Optimize landing page copy and call-to-action buttons to improve click-through rates and encourage users to explore treatment options.",
          project: sampleProjIds[2],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "GHHDHDBH", status: false}],
          status: "Ready to analyze",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Implement a live chat feature for real-time interaction between creators and participants during workshops.",
          description: "Implement a live chat feature for real-time interaction between creators and participants during workshops.",
          project: sampleProjIds[7],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "SERRTGFDFD", status: false}],
          status: "Up Next",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Implement a live chat feature for real-time interaction between creators and participants during workshops.",
          description: "Implement a live chat feature for real-time interaction between creators and participants during workshops.",
          project: sampleProjIds[7],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "SERRTGFDFD", status: false}],
          status: "Up Next",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Introduce gamification elements, such as quizzes and challenges, to keep participants engaged throughout the workshop.",
          description: "Introduce gamification elements, such as quizzes and challenges, to keep participants engaged throughout the workshop.",
          project: sampleProjIds[7],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "Organize a workshop with gamification elements and measure participant interaction and retention.", status: false}],
          status: "In Progress",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Enable social sharing options to allow participants to share their workshop experience with others.",
          description: "Enable social sharing options to allow participants to share their workshop experience with others.",
          project: sampleProjIds[7],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "Implement social sharing options and monitor the reach and engagement of shared workshop content.", status: false}],
          status: "Ready to analyze",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Implement a machine learning algorithm to analyze user data and generate personalized dietary and workout plans tailored to their specific needs and goals.",
          description: "Implement a machine learning algorithm to analyze user data and generate personalized dietary and workout plans tailored to their specific needs and goals.",
          project: sampleProjIds[14],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "Analyze data inside ChatGPT", status: false},
          {name: "Generate Personalized workouts", status: false}],
          status: "Up Next",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Collaborate with fitness influencers or experts to provide exclusive content, live Q&A sessions, and workshops for users to gain additional insights and inspiration.",
          description: "Collaborate with fitness influencers or experts to provide exclusive content, live Q&A sessions, and workshops for users to gain additional insights and inspiration.",
          project: sampleProjIds[14],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "Analyze data inside ChatGPT", status: false},
          {name: "Generate Personalized workouts", status: false}],
          status: "In Progress",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Develop a comprehensive questionnaire to gather detailed information about users' fitness goals, health conditions, dietary preferences, and workout preferences.",
          description: "Develop a comprehensive questionnaire to gather detailed information about users' fitness goals, health conditions, dietary preferences, and workout preferences.",
          project: sampleProjIds[14],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-30",
          tasks: [{name: "Interview 20 people", status: false},
          {name: "develop a questionnaire", status: false}],
          status: "Ready to analyze",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Collaborate with influencers and experts in the health and wellness industry to endorse NutriHerbs' products and share their experiences with natural and organic living.",
          description: "Collaborate with influencers and experts in the health and wellness industry to endorse NutriHerbs' products and share their experiences with natural and organic living.",
          project: sampleProjIds[19],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "send cold emails to influencers", status: false},
          {name: "Connect with influencers and share the script", status: false}],
          status: "Up Next",
          nominations: [],
          assignedTo: [userDetails._id],
        },
       
        {
          id: sampleIdeasIds[5],
          name: "Launch a customer loyalty program to reward repeat purchases and incentivize customer referrals.",
          description: "Launch a customer loyalty program to reward repeat purchases and incentivize customer referrals.",
          project: sampleProjIds[19],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-28",
          tasks: [{name: "create emailers", status: false},
          {name: "Setup offer emailers after user purchases product", status: false}],
          status: "In Progress",
          nominations: [],
          assignedTo: [userDetails._id],
        },
        {
          id: sampleIdeasIds[5],
          name: "Offer personalized product recommendations based on customers' specific needs, preferences, and health goals.",
          description: "Collaborate with influencers and experts in the health and wellness industry to endorse NutriHerbs' products and share their experiences with natural and organic living.",
          project: sampleProjIds[19],
          goal: ideaGoals[5],
          createdBy: ideaCreatedBy[5],
          owner: ideasOwner[5],
          keymetric: ideaKeymetrics[5],
          lever: ideaLevers[5],
          media: [],
          impact: ideaImpacts[5],
          confidence: ideaConfidence[5],
          ease:ideaEase[5],
          score: ideaScore[5],
          dueDate: "2023-07-30",
          tasks: [
          {name: "create an algorithm for users", status: false}, 
          {name: "track the new data out of the algorithm", status: false}],
          status: "Ready to analyze",
          nominations: [],
          assignedTo: [userDetails._id],
        },
    ]

    thunkAPI.dispatch(multipletestIdea(testIdeaData));
    payload.closeDialog();
    window.location.reload();

  }

});
export const updateIdeaInTest = createAsyncThunk("project/updateIdeaInTest", async (payload, thunkAPI) => {
  var bodyFormData = new FormData();
  bodyFormData.append("name", payload.name);
  bodyFormData.append("description", payload.description);
  bodyFormData.append("goal", payload.goal);
  bodyFormData.append("lever", payload.lever);
  bodyFormData.append("keymetric", payload.keyMetric);
  bodyFormData.append("projectId", payload.projectId);
  for (let i = 0; i < payload.files.length; i++) {
    bodyFormData.append(`files`, payload.files[i]);
  }

  bodyFormData.append("impact", parseInt(payload.impact));
  bodyFormData.append("confidence", parseInt(payload.confidence));
  bodyFormData.append("ease", parseInt(payload.ease));
  bodyFormData.append("score", parseInt(payload.score));

  let response = await axios.put(`${backendServerBaseURL}/api/v1/test/updateIdea/${payload.testId}`, bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status === 200 && response.data.message === "Test idea updated successfully") {
    thunkAPI.dispatch(getAllIdeas({ projectId: payload.projectId }));
    thunkAPI.dispatch(readSingleTest({ testId: payload.testId }));
    payload.closeDialog();
  }
});

export const updateIdea = createAsyncThunk("project/updateIdea", async (payload, thunkAPI) => {
  console.log('payload updateIdea', payload)
  var bodyFormData = new FormData();
  bodyFormData.append("name", payload.name);
  bodyFormData.append("description", payload.description);
  bodyFormData.append("goal", payload.goal);
  bodyFormData.append("lever", payload.lever);
  bodyFormData.append("keymetric", payload.keyMetric);
  bodyFormData.append("projectId", payload.projectId);
  bodyFormData.append("deletedMedia", JSON.stringify(payload.deletedMedia));
  for (let i = 0; i < payload.files.length; i++) {
    bodyFormData.append(`files`, payload.files[i]);
  }

  bodyFormData.append("impact", parseInt(payload.impact));
  bodyFormData.append("confidence", parseInt(payload.confidence));
  bodyFormData.append("ease", parseInt(payload.ease));
  bodyFormData.append("score", parseInt(payload.score));

  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/update/${payload.ideaId}`, bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status === 200 && response.data.message === "Idea updated successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
    thunkAPI.dispatch(getAllIdeas({ projectId: payload.projectId }));
    // window.location.reload(false);
    payload.setmediaDocuments([]);
    payload.closeDialog();
  }
});

export const nominateIdea = createAsyncThunk("project/nominateIdea", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/nominate/${payload.ideaId}`);

  if (response.status === 200 && response.data.message === "Idea nominated successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
  }
});

export const unnominateIdea = createAsyncThunk("project/unnominateIdea", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/unnominate/${payload.ideaId}`);

  if (response.status === 200 && response.data.message === "Idea unnominated successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
  }
});

export const testIdea = createAsyncThunk("project/testIdea", async (payload, thunkAPI) => {
  console.log('payload testIdea :>> ', payload);
  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/test/${payload.ideaId}`, {
    assignedTo: payload.selectedTeamMembers.map((teamMember) => teamMember._id),
    dueDate: payload.dueDate,
    tasks: payload.tasksList.map((task) => {
      return {
        name: task,
        status: false,
      };
    }),
  });

  if (response.status === 200 && response.data.message === "Idea assigned as test") {
    payload.closeDialog();
    window.open(`/projects/${payload.projectId}/tests`, "_self");
  }
});

export const multipletestIdea = createAsyncThunk("project/multipletestIdea", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/multipleTestIdeas`, 
   payload
  );
  // let id = window.location.pathname.split('/').reverse()[1];
  // const location = useLocation();
  // console.log('projectSlice location :>> ', location);
  console.log("multipletestIdea", payload)
  // let idData  = response.data.test.map((x) => x.project);
  // let projectId = idData[0]
  if (response.status === 200 && response.data.message === "Multiple Ideas assigned as tests") {
    // thunkAPI.dispatch(getAllTests({projectId}));
    let userInfo = localStorage.getItem("userData", "");
    let userDetails = JSON.parse(userInfo);
    let sampleLearnings = response.data.test;
    console.log('sampleLearnings :>> ', sampleLearnings);
    let sampleIdeasIds = response.data.test.map((x) => x._id);
    let sampleProjIds = response.data.test.map((x) => x.project);
    console.log('sampleProjIds 111:>> ', sampleProjIds);
    let ideaNames = response.data.test.map((x) => x.name); 
    console.log('ideaNames 111 :>> ', ideaNames);
    let ideaDesp = response.data.test.map((x) => x.description); 
    let ideasOwner = response.data.test.map((x) => x.owner); 
    let ideaKeymetrics = response.data.test.map((x) => x.keymetric);
    let ideaGoals = response.data.test.map((x) => x.goal);
    console.log('ideaGoals 111 :>> ', ideaGoals);
    let ideaLevers = response.data.test.map((x) => x.lever);
    let ideaImpacts = response.data.test.map((x) => x.impact);
    let ideaConfidence = response.data.test.map((x) => x.confidence);
    let ideaEase = response.data.test.map((x) => x.ease);
    let ideaScore = response.data.test.map((x) => x.score);
    let ideaCreatedBy = response.data.test.map((x) => x.createdBy);

    let learningsSampleData = [
      
        {
          id: sampleIdeasIds[0],
          name: "Enhance the online booking process for hair fall treatment appointments to improve user experience.",
          description: "Enhance the online booking process for hair fall treatment appointments to improve user experience.",
          project: sampleProjIds[0],
          goal: ideaGoals[0],
          createdBy: ideaCreatedBy[0],
          owner: ideasOwner[0],
          keymetric: ideaKeymetrics[0],
          lever: ideaLevers[0],
          media: [],
          impact: ideaImpacts[0],
          confidence: ideaConfidence[0],
          ease:ideaEase[0],
          score: ideaScore[0],
          dueDate: "2023-07-28",
          tasks: [{name: "GHHDHDBH", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Inconclusive",
          conclusion: "rdffggfgfdfdsd"
        },
        {
          id: sampleIdeasIds[0],
          name: "Offer limited-time discounts or packages for hair fall treatment to attract new customers.",
          description: "Offer limited-time discounts or packages for hair fall treatment to attract new customers.",
          project: sampleProjIds[0],
          goal: ideaGoals[0],
          createdBy: ideaCreatedBy[0],
          owner: ideasOwner[0],
          keymetric: ideaKeymetrics[0],
          lever: ideaLevers[0],
          media: [],
          impact: ideaImpacts[0],
          confidence: ideaConfidence[0],
          ease:ideaEase[0],
          score: ideaScore[0],
          dueDate: "2023-07-28",
          tasks: [{name: "GHHDHDBH", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Inconclusive",
          conclusion: "rdffggfgfdfdsd"
        },
        {
          id: sampleIdeasIds[2],
          name: "Introduce a community forum or social platform where users can connect, share their fitness journeys, and provide support and encouragement to one another.",
          description: "Introduce a community forum or social platform where users can connect, share their fitness journeys, and provide support and encouragement to one another.",
          project: sampleProjIds[4],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "SERRTGFDFD", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Inconclusive",
          conclusion: "rdffggfgfdfdsd"
        },
        {
          id: sampleIdeasIds[2],
          name: ideaNames[2],
          description: ideaDesp[2],
          project: sampleProjIds[8],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "SERRTGFDFD", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Successful",
          conclusion: "rdffggfgfdfdsd"
        },
        {
          id: sampleIdeasIds[2],
          name: "Enhance product labeling and packaging to clearly communicate the natural and organic ingredients used, emphasizing transparency and authenticity.",
          description: "Enhance product labeling and packaging to clearly communicate the natural and organic ingredients used, emphasizing transparency and authenticity.",
          project: sampleProjIds[11],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "Research competitors", status: false},
          {name: "Come up with wireframes", status: false},
        {name: "Design variations", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Inconclusive",
          conclusion: "rdffggfgfdfdsd"
        },
        {
          id: sampleIdeasIds[2],
          name: "Develop an educational content platform, such as a blog or resource center, to provide valuable information about the benefits of natural ingredients and their impact on health and well-being.",
          description: "Develop an educational content platform, such as a blog or resource center, to provide valuable information about the benefits of natural ingredients and their impact on health and well-being.",
          project: sampleProjIds[11],
          goal: ideaGoals[2],
          createdBy: ideaCreatedBy[2],
          owner: ideasOwner[2],
          keymetric: ideaKeymetrics[2],
          lever: ideaLevers[2],
          media: [],
          impact: ideaImpacts[2],
          confidence: ideaConfidence[2],
          ease:ideaEase[2],
          score: ideaScore[2],
          dueDate: "2023-07-28",
          tasks: [{name: "Research competitors", status: false},
          {name: "Come up with wireframes", status: false},
        {name: "Design variations", status: false}],
          nominations: [],
          assignedTo: [userDetails._id],
          result: "Inconclusive",
          conclusion: "rdffggfgfdfdsd"
        },
    ]
    thunkAPI.dispatch(createMultipleLearnings(learningsSampleData));
    payload.closeDialog();

  }
});

export const addComment = createAsyncThunk("project/addComment", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/idea/addComment/${payload.ideaId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment added successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
  }
});

export const updateComment = createAsyncThunk("project/updateComment", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/idea/updateComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment edited successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
  }
});

export const deleteComment = createAsyncThunk("project/deleteComment", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/idea/deleteComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment deleted successfully") {
    thunkAPI.dispatch(readSingleIdea({ ideaId: payload.ideaId }));
  }
});

export const deleteIdea = createAsyncThunk("project/deleteIdea", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/idea/delete/${thunkAPI.getState().project.selectedIdea._id}`);

  if (response.status === 200 && response.data.message === "Idea deleted successfully") {
    thunkAPI.dispatch(getAllIdeas({ projectId: payload.projectId }));
    payload.closeDialgo();
  }
});

// Tests
export const getAllTests = createAsyncThunk("project/getAllTests", async (payload, thunkAPI) => {
  console.log('getAllTests :>> ', typeof(payload.projectId), payload.projectId);

  let config = {
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/test/read/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Tests found successfully") {
    thunkAPI.dispatch(updatetests(response.data.tests));
  }
});

export const readSingleTest = createAsyncThunk("project/readSingleTest", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/test/readOne/${payload.testId}`);

  if (response.status === 200 && response.data.message === "Test found successfully") {
    thunkAPI.dispatch(updatesingleTestInfo(response.data.test));
  }
});

export const readMultipleTests = createAsyncThunk("project/readMultipleTests", async (payload, thunkAPI) => {
  console.log('readMultipleTests :>> ', typeof(payload.projectId), payload.projectId);
  let config = {
    params: {},
  };
  let response = await axios.get(`${backendServerBaseURL}/api/v1/test/readAllTests/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Multiple test ideas fetched successfully") {
    thunkAPI.dispatch(updatesingleTestInfo(response.data.test));
  }
});

export const updateTest = createAsyncThunk("project/updateTest", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/test/updateTest/${payload.testId}`, {
    assignedTo: payload.selectedTeamMembers.map((teamMember) => teamMember._id),
    dueDate: payload.values.dueDate,
    tasks: payload.tasksList.map((task) => {
      return {
        name: task,
        status: false,
      };
      
    }),
  });

  if (response.status === 200 && response.data.message === "Test updated successfully") {
    thunkAPI.dispatch(readSingleTest({ testId: payload.testId }));
    payload.closeDialog();
  }
});

export const updateTestStatus = createAsyncThunk("project/updateTestStatus", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/test/updateStatus/${payload.testId}`, {
    status: payload.status,
  });

  console.log('payload.projectId :>> ', payload.projectId, typeof(payload.projectId));

  if (response.status === 200 && response.data.message === "Test status updated successfully") {
    // window.location.reload();
    thunkAPI.dispatch(getAllTests({ projectId: payload.projectId }));
  }
});

export const updateTestTaskStatus = createAsyncThunk("project/updateTestTaskStatus", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/test/updateTestStatus/${payload.taskId}`, {
    status: payload.status,
  });

  if (response.status === 200 && response.data.message === "Status updated successfully") {
    thunkAPI.dispatch(readTasks());
  }
});

export const moveToLearning = createAsyncThunk("project/moveToLearning", async (payload, thunkAPI) => {
  var bodyFormData = new FormData();
  bodyFormData.append("result", payload.result);
  bodyFormData.append("conclusion", payload.description);
  for (let i = 0; i < payload.files.length; i++) {
    bodyFormData.append(`files`, payload.files[i]);
  }

  let response = await axios.post(
    `${backendServerBaseURL}/api/v1/test/movetolearning/${thunkAPI.getState().project.selectedTest._id}`,
    bodyFormData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  console.log('projectId: payload.projectId :>> ', payload.projectId, typeof(payload.projectId));
  if (response.status === 200 && response.data.message === "Test moved to learning successfully") {
    thunkAPI.dispatch(getAllTests({ projectId: payload.projectId }));
    payload.closeDialog();
  }
});

export const createMultipleLearnings = createAsyncThunk("project/createMultipleLearnings", async (payload, thunkAPI) => {
  
  let response = await axios.post(
    `${backendServerBaseURL}/api/v1/test/createLearnings`, payload);

    console.log('createMultipleLearnings :>> ', response.data.test);

    // let idData  = response.data.test.map((x) => x.project);
    // let projectId = idData[0]

  if (response.status === 200 && response.data.message === "Multiple Tests moved to learning successfully") {
    // thunkAPI.dispatch(getAllTests({ projectId }));
    payload.closeDialog();
  }
});

export const sendTestBackToIdeas = createAsyncThunk("project/sendTestBackToIdeas", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/test/sendback/${payload.testId}`);

  if (response.status === 200 && response.data.message === "Test sent back to idea successfully") {
    window.open(`/projects/${payload.projectId}/ideas`, "_self");
  }
});

export const addTestComment = createAsyncThunk("project/addGoalComment", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/test/addComment/${payload.testId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment added successfully") {
    thunkAPI.dispatch(readSingleTest({ testId: payload.testId }));
  }
});

export const updateTestComment = createAsyncThunk("project/updateGoalComment", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/test/updateComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment edited successfully") {
    thunkAPI.dispatch(readSingleTest({ testId: payload.testId }));
  }
});

export const deleteTestComment = createAsyncThunk("project/deleteGoalComment", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/test/deleteComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment deleted successfully") {
    thunkAPI.dispatch(readSingleTest({ testId: payload.testId }));
  }
});

// Learnings
export const getAllLearnings = createAsyncThunk("project/getAllLearnings", async (payload, thunkAPI) => {
  let config = {
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/learning/read/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Successfully read all learnings") {
    thunkAPI.dispatch(updatelearnings(response.data.learnings));
  }
});

export const readSingleLearning = createAsyncThunk("project/readSingleLearning", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/learning/readOne/${payload.learningId}`);

  if (response.status === 200 && response.data.message === "Successfully read learning") {
    thunkAPI.dispatch(updatesingleLearningInfo(response.data.learning));
  }
});

export const updateLearning = createAsyncThunk("project/updateLearning", async (payload, thunkAPI) => {
  var bodyFormData = new FormData();
  bodyFormData.append("result", payload.result);
  bodyFormData.append("conclusion", payload.description);
  bodyFormData.append("deletedMedia", JSON.stringify(payload.deletedMedia));
  for (let i = 0; i < payload.files.length; i++) {
    bodyFormData.append(`files`, payload.files[i]);
  }

  let response = await axios.put(`${backendServerBaseURL}/api/v1/learning/update/${payload.learningId}`, bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status === 200 && response.data.message === "Learning updated") {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
    payload.setmediaDocuments([]);
    payload.closeDialog();
  }
});


export const updateLearningTasks = createAsyncThunk("project/updateLearningTasks", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/learning/updateLearningTask/${payload.learningId}`, {
    assignedTo: payload.selectedTeamMembers.map((teamMember) => teamMember._id),
    dueDate: payload.dueDate,
    tasks: payload.tasksList.map((task) => {
      return {
        name: task,
        status: false,
      };
      
    }),
  });

  if (response.status === 200 && response.data.message === "Learning updated successfully") {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
    payload.closeDialog();
  }
});

export const sendLearningBackToTests = createAsyncThunk("project/sendLearningBackToTests", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/learning/sendBackToTest/${thunkAPI.getState().project.selectedLearning._id}`, {});

  if (response.status === 200 && response.data.message === "Learning sent back to test") {
    payload.navigate(`/projects/${payload.projectId}/tests`);
    window.location.reload();
    thunkAPI.dispatch(getAllLearnings({ projectId: payload.projectId }));
    payload.closeDialog();
  }
    // console.log('thunkAPI.getState().project.selectedLearning._id :>> ', thunkAPI.getState().project.selectedLearning._id);
    // console.log('thunkAPI.getState().project.singleLearningInfo._id :>> ', thunkAPI.getState().project.singleLearningInfo._id);
    // if (thunkAPI.getState().project.selectedLearning._id === thunkAPI.getState().project.singleLearningInfo._id) {
      // window.location.reload();
    // }
});

export const addLearningComment = createAsyncThunk("project/addLearningComment", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/learning/addComment/${payload.learningId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment added successfully") {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
  }
});

export const updateLearningComment = createAsyncThunk("project/updateLearningComment", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/learning/updateComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment edited successfully") {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
  }
});

export const deleteLearningComment = createAsyncThunk("project/deleteLearningComment", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/learning/deleteComment/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200 && response.data.message === "Comment deleted successfully") {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
  }
});

// Insights
export const getIdeasAndTestChartData = createAsyncThunk("project/getIdeasAndTestChartData", async (payload, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().project.insightsSpan,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/insight/getIdeasAndTests/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Ideas and tests fetched successfully") {
    thunkAPI.dispatch(
      updateideasCreatedAndTestStartedGraphData({
        ideasData: response.data.ideasData,
        testsData: response.data.testsData,
      })
    );
  }
});

export const getlearningsAcquiredGraphData = createAsyncThunk("project/getlearningsAcquiredGraphData", async (payload, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().project.insightsSpan,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/insight/getLearningsChart/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Learnings fetched successfully") {
    thunkAPI.dispatch(updatelearningsAcquiredGraphData({ labels: response.data.labels, data: response.data.data }));
  }
});

export const getlearningsByGrowthLeverGraphData = createAsyncThunk("project/getlearningsByGrowthLeverGraphData", async (payload, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().project.insightsSpan,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/insight/getLearningslever/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Learnings fetched successfully") {
    thunkAPI.dispatch(updatelearningsByGrowthLeverGraphData(response.data.payload));
  }
});

export const getTeamPartitionGraphData = createAsyncThunk("project/getTeamPartitionGraphData", async (payload, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().project.insightsSpan,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/insight/teamparticipation/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Team participation fetched successfully") {
    thunkAPI.dispatch(updateWeeklyTeamPartcipationGraphData(response.data.payload));
  }
});

export const getGrowthData = createAsyncThunk("project/getGrowthData", async (payload, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().project.insightsSpan,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/insight/getGrowth/${payload.projectId}`, config);

  if (response.status === 200 && response.data.message === "Growth Health fetched successfully") {
    thunkAPI.dispatch(updategrowthData(response.data.payload));
  }
});

// Support
export const createFeedback = createAsyncThunk("project/createFeedback", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/feedback/create`, {
    category: payload.category,
    description: payload.title,
    title: payload.description,
  });

  if (response.status === 200) {
    thunkAPI.dispatch(updatepopupMessage("Feedback submitted, Our team will get in touch with you via mail"));
    payload.closeModal();
  }
});

// Integration
export const getAllIntegrations = createAsyncThunk("project/getAllIntegrations", async (payload, thunkAPI) => {
  let config = {
    params: {
      projectId: payload.projectId,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/integration/read`, config);

  if (response.status === 200) {
    thunkAPI.dispatch(updateintegrations(response.data.allIntegrations));
  }
});

export const createIntegration = createAsyncThunk("project/createIntegration", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/integration/create`, {
    projectId: payload.projectId,
    goalId: payload.goalId,
    keymetricId: payload.keymetricId,
  });

  if (response.status === 200) {
    thunkAPI.dispatch(getAllIntegrations({ projectId: payload.projectId }));
  }
});

export const deleteIntegration = createAsyncThunk("project/deleteIntegration", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/integration/delete/${payload.commentId}`, {
    comment: payload.comment,
  });

  if (response.status === 200) {
    thunkAPI.dispatch(readSingleLearning({ learningId: payload.learningId }));
  }
});

export const removeUser = createAsyncThunk("project/removeUser", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/project/deleteUserId/${payload.userId}`);

  if (response.status === 200 && response.data.message === "User deleted successfully") {
    thunkAPI.dispatch(getAllUsers());
  }
});

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    updateProjects: (state, action) => {
      state.projects = action.payload;
    },
    updateProjectSearch: (state, action) => {
      state.projectSearch = action.payload;
    },
    updateProjectSelectedTab: (state, action) => {
      state.projectSelectedTab = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
    updateRegisteredUsers: (state, action) => {
      state.registeredUsers = action.payload;
    },
    updateprojectUsers: (state, action) => {
      state.projectUsers = action.payload;
    },
    updateSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    updateprojectCollaboratos: (state, action) => {
      state.projectCollaboratos = action.payload;
    },

    updateGoals: (state, action) => {
      state.goals = action.payload;
    },
    updateSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
    updateSingleInfoGoal: (state, action) => {
      state.singleGoalInfo = action.payload;
    },
    updateSelectedKeyMetric: (state, action) => {
      state.selectedKeyMetric = action.payload;
    },

    updateIdeas: (state, action) => {
      state.ideas = action.payload;
    },
    updateSelectedIdea: (state, action) => {
      state.selectedIdea = action.payload;
    },
    updateSingleIdeaInfo: (state, action) => {
      state.singleIdeaInfo = action.payload;
    },
    updatesingleIdeaInfoPublic: (state, action) => {
      state.singleIdeaInfoPublic = action.payload;
    },

    updatetests: (state, action) => {
      state.tests = action.payload;
    },
    updateselectedTest: (state, action) => {
      state.selectedTest = action.payload;
    },
    updatesingleTestInfo: (state, action) => {
      state.singleTestInfo = action.payload;
    },
    updateShowSendBackToIdeasDialog: (state, action) => {
      state.showSendBackToIdeasDialog = action.payload;
    },
    updateShowSendBackToTestsDialog: (state, action) => {
      state.showSendBackToTestsDialog = action.payload;
    },
    updateShowDeleteGoalDialog: (state, action) => {
      state.showDeleteGoalDialog = action.payload;
    },
    updateShowDeleteIdeaDialog: (state, action) => {
      state.showDeleteIdeaDialog = action.payload;
    },
    updatelearnings: (state, action) => {
      state.learnings = action.payload;
    },
    updateselectedLearning: (state, action) => {
      state.selectedLearning = action.payload;
    },
    updatesingleLearningInfo: (state, action) => {
      state.singleLearningInfo = action.payload;
    },

    updateideasCreatedAndTestStartedGraphData: (state, action) => {
      state.ideasCreatedAndTestStartedGraphData = action.payload;
    },
    updatelearningsAcquiredGraphData: (state, action) => {
      state.learningsAcquiredGraphData = action.payload;
    },
    updatelearningsByGrowthLeverGraphData: (state, action) => {
      state.learningsByGrowthLeverGraphData = action.payload;
    },
    updateWeeklyTeamPartcipationGraphData: (state, action) => {
      state.WeeklyTeamPartcipationGraphData = action.payload;
    },
    updateinsightsSpan: (state, action) => {
      state.insightsSpan = action.payload;
    },
    updategrowthData: (state, action) => {
      state.growthData = action.payload;
    },
    updategrowthSpan: (state, action) => {
      state.growthSpan = action.payload;
    },

    updateintegrations: (state, action) => {
      state.integrations = action.payload;
    },
    updateselectedIntegration: (state, action) => {
      state.selectedIntegration = action.payload;
    },
  },
});

export const {
  updateProjects,
  updateProjectSearch,
  updateProjectSelectedTab,
  updateUsers,
  updateRegisteredUsers,
  updateprojectUsers,
  updateSelectedProject,
  updateprojectCollaboratos,

  updateGoals,
  updateSelectedGoal,
  updateSingleInfoGoal,
  updateSelectedKeyMetric,

  updateIdeas,
  updateSelectedIdea,
  updateSingleIdeaInfo,
  updatesingleIdeaInfoPublic,

  updatetests,
  updateselectedTest,
  updatesingleTestInfo,
  updateShowSendBackToIdeasDialog,
  updateShowSendBackToTestsDialog,
  updateShowDeleteGoalDialog,
  updateShowDeleteIdeaDialog,  updatelearnings,
  updateselectedLearning,
  updatesingleLearningInfo,

  updateideasCreatedAndTestStartedGraphData,
  updatelearningsAcquiredGraphData,
  updatelearningsByGrowthLeverGraphData,
  updateWeeklyTeamPartcipationGraphData,
  updateinsightsSpan,
  updategrowthData,
  updategrowthSpan,

  updateintegrations,
  updateselectedIntegration,
} = projectSlice.actions;

export const selectProjects = (state) => state.project.projects;
export const selectProjectSearch = (state) => state.project.projectSearch;
export const selectProjectSelectedTab = (state) => state.project.updateProjectSelectedTab;
export const selectUsers = (state) => state.project.users;
export const selectRegisteredUsers = (state) => state.project.registeredUsers;
export const selectProjectUsers = (state) => state.project.projectUsers;
export const selectSelectedProject = (state) => state.project.selectedProject;
export const selectProjectCollaboratos = (state) => state.project.projectCollaboratos;

export const selectGoals = (state) => state.project.goals;
export const selectSelectedGoal = (state) => state.project.selectedGoal;
export const selectSingleGoalInfo = (state) => state.project.singleGoalInfo;
export const selectSelectedKeyMetric = (state) => state.project.selectedKeyMetric;

export const selectIdeas = (state) => state.project.ideas;
export const selectSelectedIdea = (state) => state.project.selectedIdea;
export const selectSingleIdeaInfo = (state) => state.project.singleIdeaInfo;
export const selectsingleIdeaInfoPublic = (state) => state.project.singleIdeaInfoPublic;

export const selecttests = (state) => state.project.tests;
export const selectselectedTest = (state) => state.project.selectedTest;
export const selectsingleTestInfo = (state) => state.project.singleTestInfo;
export const selectShowSendBackToIdeasDialog = (state) => state.project.showSendBackToIdeasDialog;
export const selectShowSendBackToTestsDialog = (state) => state.project.showSendBackToTestsDialog;
export const selectShowDeleteGoalDialog = (state) => state.project.showDeleteGoalDialog;
export const selectShowDeleteIdeaDialog = (state) => state.project.showDeleteIdeaDialog;export const selectlearnings = (state) => state.project.learnings;
export const selectselectedLearning = (state) => state.project.selectedLearning;
export const selectsingleLearningInfo = (state) => state.project.singleLearningInfo;

export const selectideasCreatedAndTestStartedGraphData = (state) => state.project.ideasCreatedAndTestStartedGraphData;
export const selectlearningsAcquiredGraphData = (state) => state.project.learningsAcquiredGraphData;
export const selectlearningsByGrowthLeverGraphData = (state) => state.project.learningsByGrowthLeverGraphData;
export const selectWeeklyTeamPartcipationGraphData = (state) => state.project.WeeklyTeamPartcipationGraphData;
export const selectinsightsSpan = (state) => state.project.insightsSpan;
export const selectgrowthData = (state) => state.project.growthData;
export const selectgrowthSpan = (state) => state.project.growthSpan;

export const selectintegrations = (state) => state.project.integrations;
export const selectselectedIntegration = (state) => state.project.selectedIntegration;

export default projectSlice.reducer;
