import React, { useEffect, useState } from "react";
import "./App.css";
import Router from "./routes";
import { backendServerBaseURL } from "./utils/backendServerBaseURL";
import socketHelper from "./utils/socketHelper";

let socket = new socketHelper().socket;

socket?.on("connect", () => {
  console.log("Socket connected");
});

socket?.on("disconnect", () => {
  console.log("Socket disconnected");
});

const LightTheme = React.lazy(() => import("./theme/LightTheme"));
const DarkTheme = React.lazy(() => import("./theme/DarkTheme"));
export const ThemeContext = React.createContext();

function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {
  const profileData = JSON.parse(localStorage.getItem("user", "")) || {};

  const defaultTheme = "light";
  const storedTheme = localStorage.getItem("theme", defaultTheme);
  const [selectedTheme, setselectedTheme] = useState(defaultTheme);

  const defaultFavicon = "/static/icons/logo.svg";
  const storeFavicon = profileData?.fevicon;
  const [faviconUrl, setFaviconUrl] = useState(defaultFavicon);

  useEffect(() => {
    const favicon = getFaviconEl(); // Accessing favicon element
    if (
      storeFavicon === undefined ||
      storeFavicon === "" ||
      storeFavicon === null
    ) {
      setFaviconUrl(defaultFavicon);
      // favicon.href = faviconUrl
    } else {
      setFaviconUrl(`${backendServerBaseURL}/${storeFavicon}`);
    }
    favicon.href = faviconUrl;
  }, [faviconUrl]);

  useEffect(() => {
    async function setTheme() {
      if (
        storedTheme === null ||
        storedTheme === undefined ||
        storedTheme === ""
      ) {
        await localStorage.setItem("theme", defaultTheme);
        setselectedTheme(defaultTheme);
      } else {
        setselectedTheme(storedTheme);
      }
    }
    setTheme();
  }, []);

  useEffect(() => {
    // Apply theme to body class
    if (selectedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [selectedTheme]);

  const ThemeSelector = ({ selectedThemeStr, children }) => {
    console.log(selectedThemeStr);
    // const CHOSEN_THEME = localStorage.getItem("TYPE_OF_THEME") || TYPE_OF_THEME.DEFAULT;
    return (
      <>
        <React.Suspense fallback={<></>}>
          {selectedThemeStr === "light" && <LightTheme />}
          {selectedThemeStr === "dark" && <DarkTheme />}
        </React.Suspense>
        {children}
      </>
    );
  };

  return (
    <>
      <ThemeContext.Provider value={{ selectedTheme, setselectedTheme }}>
        <ThemeSelector selectedThemeStr={selectedTheme}>
          <Router socket={socket} />
        </ThemeSelector>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
