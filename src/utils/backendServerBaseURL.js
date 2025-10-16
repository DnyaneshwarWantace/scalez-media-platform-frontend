let tempbackendServerBaseURL = "http://localhost:7400";
let tempsocketURL = "http://localhost:7400";
let tempFrontEndURL = "http://localhost:3005";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("dev");
} else {
  tempbackendServerBaseURL = "http://scalez.in:8807";
  tempsocketURL = "http://scalez.in:8807";
  tempFrontEndURL = "https://app.scalez.in";
}

export let backendServerBaseURL = tempbackendServerBaseURL;
export let socketURL = tempsocketURL;
export let frontURL = tempFrontEndURL;
