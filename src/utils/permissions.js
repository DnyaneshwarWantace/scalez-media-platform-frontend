const user = JSON.parse(localStorage.getItem("user", null));

// General
export const hasPermission_company_access = () => {
  if (user === null) return false;
  if (user.role?.permissions?.company_access === true) return true;
  return false;
};
export const hasPermission_create_workspace = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_workspace === true) return true;
  return false;
};
export const hasPermission_create_actionPlans = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_actionPlans === true) return true;
  return false;
};
export const hasPermission_share_ideas = () => {
  if (user === null) return false;
  if (user.role?.permissions?.share_ideas === true) return true;
  return false;
};
export const hasPermission_add_teammates = () => {
  if (user === null) return false;
  if (user.role?.permissions?.add_user === true) return true;
  return false;
};
export const hasPermission_remove_teammates = () => {
  if (user === null) return false;
  if (user.role?.permissions?.remove_user=== true) return true;
  return false;
};
export const hasPermission_add_models = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_models === true) return true;
  return false;
};
export const hasPermission_add_roles = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_roles === true) return true;
  return false;
};

// Project Permissions
export const hasPermission_create_project = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_project === true) return true;
  return false;
};
export const hasPermission_delete_project = () => {
  if (user === null) return false;
  if (user.role?.permissions?.delete_project === true) return true;
  return false;
};

// Goals Permissions
export const hasPermission_create_goals = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_goals === true) return true;
  return false;
};

// Ideas Permissions
export const hasPermission_create_ideas = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_ideas === true) return true;
  return false;
};
// Ideas Nominate
export const hasPermission_nominate_ideas = () => {
  if (user === null) return false;
  if (user.role?.permissions?.nominate_ideas === true) return true;
  return false;
};

// Tests Permissions
export const hasPermission_create_tests = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_tests === true) return true;
  return false;
};

// Learnings Permissions
export const hasPermission_create_learnings = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_learnings === true) return true;
  return false;
};

// Comments
export const hasPermission_create_comments = () => {
  if (user === null) return false;
  if (user.role?.permissions?.create_comments === true) return true;
  return false;
};
export const hasPermission_mention_everyone = () => {
  if (user === null) return false;
  if (user.role?.permissions?.mention_everyone === true) return true;
  return false;
};

// Type
export const isTypeOwner = () => {
  if (user === null) return false;
  if (user.role?.name === "Owner") return true;
  return false;
};

export const isTypeUser = () => {
  if (user === null) return false;
  if (user.type?.name === "user") return true;
  return false;
};

export const isRoleAdmin = () => {
  if (user === null) return false;
  if (user.role?.name === "Admin") return true;
  return false;
};

export const isRoleMember = () => {
  if (user === null) return false;
  if (user.role?.name === "Member") return true;
  return false;
};

export const isRoleViewer = () => {
  if (user === null) return false;
  if (user.role?.name === "Viewer") return true;
  return false;
};

