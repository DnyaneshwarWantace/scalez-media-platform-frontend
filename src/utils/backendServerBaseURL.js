let tempbackendServerBaseURL = "http://localhost:7400";
let tempsocketURL = "http://localhost:7400";
let tempFrontEndURL = "http://localhost:3005";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("dev - using localhost URLs");
  tempbackendServerBaseURL = "http://localhost:7400";
  tempsocketURL = "http://localhost:7400";
  tempFrontEndURL = "http://localhost:3005";
} else {
  tempbackendServerBaseURL = "https://api.scalez.in";
  tempsocketURL = "https://api.scalez.in";
  tempFrontEndURL = "https://app.scalez.in";
}

export let backendServerBaseURL = tempbackendServerBaseURL;
export let socketURL = tempsocketURL;
export let frontURL = tempFrontEndURL;
