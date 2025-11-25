import { createContext, useState, useEffect } from "react";
import "./App.css";

import Nav from "./components/navigation/nav";
import Router from "./Router";
import Footer from "./components/footer/footer";

import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const MyContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [detoken, setDetoken] = useState(null);

  const [search, setSearch] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [darkMode, setDarkMode] = useState(false);

  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const [isLoader, setIsLoader] = useState(false);
  const [loaderType, setLoaderType] = useState("");

  // -----------------------------
  // 🔔 Snackbar
  // -----------------------------
  const snackbar = (text, type = "") => {
    setSnackbarText(text);
    setSnackbarType(type);
    setIsSnackbar(true);
    setTimeout(() => setIsSnackbar(false), 3000);
  };

  // -----------------------------
  // 🔐 Logout (central function)
  // -----------------------------
  const forceLogout = (msg = "נותקת עקב בעיית אימות") => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setToken(null);
    setDetoken(null);

    snackbar(msg, "info");
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
  }, [darkMode]);


  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const storedToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!storedToken || !refreshToken) return;

      try {
        const decoded = jwtDecode(storedToken);
        const now = Date.now() / 1000;

        if (decoded.exp - now < 120) {
          // Expiring in <2 min → refresh
          const res = await fetch("http://localhost:3000/users/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!res.ok) return forceLogout("תוקף ההתחברות פג");

          const data = await res.json();
          localStorage.setItem("token", data.token);
          setToken(data.token);
        }
      } catch {
        forceLogout("שגיאת אימות");
      }
    }, 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // -----------------------------
  // 💤 Auto-logout after 4 hours inactivity
  // -----------------------------
  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        forceLogout("נותקת עקב חוסר פעילות במשך 4 שעות");
      }, 4 * 60 * 60 * 1000);
    };

    ["mousemove", "keydown", "scroll", "click"].forEach((evt) =>
      window.addEventListener(evt, resetTimer)
    );

    resetTimer();

    return () => {
      ["mousemove", "keydown", "scroll", "click"].forEach((evt) =>
        window.removeEventListener(evt, resetTimer)
      );
      clearTimeout(inactivityTimer);
    };
  }, []);

  // -----------------------------
  // 🔍 Load user if token exists
  // -----------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode(storedToken);

      setDetoken({
        _id: decoded._id,
        isJobSeeker: decoded.isJobSeeker,
        isJobPoster: decoded.isJobPoster,
        isAdmin: decoded.isAdmin,
      });

      setToken(storedToken);

      (async () => {
        const res = await fetch(`http://localhost:3000/users/${decoded._id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.status === 401) return forceLogout("התחברות לא תקפה");

        if (!res.ok) {
          snackbar("שגיאה בטעינת המשתמש", "error");
          return;
        }

        const data = await res.json();
        setUser(data);
      })();
    } catch {
      forceLogout();
    }
  }, []);

  // -----------------------------
  // 🌐 CONTEXT + RENDER
  // -----------------------------
  return (
    <MyContext.Provider
      value={{
        snackbar,
        setIsLoader,
        user,
        setUser,
        darkMode,
        setDarkMode,
        viewMode,
        setViewMode,
        search,
        setSearch,
        token,
        setToken,
        detoken,
        setDetoken,
      }}
    >
      <div className="page-container">
        <div className="content-wrap">
          <Nav />
          <Router />

          {isLoader && (
            <div className="loaderFrame">
              <div className={`loader ${loaderType}`}></div>
            </div>
          )}

          {isSnackbar && (
            <div className={`snackbar ${snackbarType}`}>{snackbarText}</div>
          )}
        </div>

        <Footer />
      </div>
    </MyContext.Provider>
  );
}

export default App;
