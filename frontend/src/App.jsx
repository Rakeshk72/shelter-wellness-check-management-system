// Import React hooks for application state and API loading.
import { useEffect, useState } from "react";

// Import React Router tools for page navigation.
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Import application components.
import ResidentForm from "./components/ResidentForm.jsx";
import DailyWellnessSheet from "./components/DailyWellnessSheet.jsx";
import WellnessCheckForm from "./components/WellnessCheckForm.jsx";
import WellnessCheckList from "./components/WellnessCheckList.jsx";
import ResidentList from "./components/ResidentList.jsx";

// Import application styles.
import "./App.css";

function App() {
  // React Router navigation function.
  const navigate = useNavigate();

  // Read any existing authentication token from localStorage.
  const [token, setToken] = useState(
    localStorage.getItem("swcmsToken") || ""
  );

  // Login form state.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] =
    useState("");

  // Dashboard data.
  const [residents, setResidents] = useState([]);
  const [wellnessChecks, setWellnessChecks] =
    useState([]);

  // Dashboard error message.
  const [dashboardError, setDashboardError] =
    useState("");

  // Handle staff login.
  async function handleLogin(event) {
    event.preventDefault();

    setLoginMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // Save the JWT token so the user remains
      // authenticated while using the application.
      localStorage.setItem(
        "swcmsToken",
        data.token
      );

      setToken(data.token);

      // Clear the password after successful login.
      setPassword("");

      // Navigate to the dashboard.
      navigate("/");
    } catch (error) {
      setLoginMessage(error.message);
    }
  }

  // Log the current staff user out.
  function handleLogout() {
    localStorage.removeItem("swcmsToken");

    setToken("");
    setUsername("");
    setPassword("");
    setResidents([]);
    setWellnessChecks([]);

    navigate("/login");
  }

  // Load dashboard information only after login.
  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadDashboardData() {
      try {
        const [
          residentResponse,
          wellnessResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/residents",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            "http://localhost:5000/api/wellness-checks",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (
          !residentResponse.ok ||
          !wellnessResponse.ok
        ) {
          throw new Error(
            "Unable to load dashboard information."
          );
        }

        const residentData =
          await residentResponse.json();

        const wellnessData =
          await wellnessResponse.json();

        setResidents(residentData);
        setWellnessChecks(wellnessData);
      } catch (error) {
        setDashboardError(error.message);
      }
    }

    loadDashboardData();
  }, [token]);

  // Count wellness checks by status.
  const presentChecks = wellnessChecks.filter(
    (check) => check.status === "Present"
  ).length;

  const absentChecks = wellnessChecks.filter(
    (check) => check.status === "Absent"
  ).length;

  const partialChecks = wellnessChecks.filter(
    (check) => check.status === "Partial"
  ).length;

  // The first wellness check is the latest one
  // when records are returned newest first.
  const latestCheck = wellnessChecks[0];

  // Format a stored date and time for display.
  function formatDateTime(dateValue) {
    if (!dateValue) {
      return "No checks recorded yet";
    }

    return new Date(dateValue).toLocaleString();
  }

  // Login page.
  function LoginPage() {
    return (
      <main>
        <h1>
          Shelter Wellness Check Management System
        </h1>

        <section>
          <h2>Staff Login</h2>

          <p>
            Authorized shelter staff must sign in
            before accessing wellness records.
          </p>

          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">
                Username:
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />
            </div>

            <div>
              <label htmlFor="password">
                Password:
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </div>

            <button type="submit">
              Login
            </button>

            {loginMessage && (
              <p>{loginMessage}</p>
            )}
          </form>
        </section>
      </main>
    );
  }

  // Dashboard page.
  function Dashboard() {
    return (
      <section>
        <h2>Dashboard</h2>

        <p>
          Welcome to the Shelter Wellness Check
          Management System.
        </p>

        <p>
          Use the navigation above to manage
          residents and wellness checks.
        </p>

        {dashboardError ? (
          <p>{dashboardError}</p>
        ) : (
          <>
            <div className="daily-summary">
              <div>
                <strong>
                  Total Residents
                </strong>

                <span>
                  {residents.length}
                </span>
              </div>

              <div>
                <strong>
                  Total Checks
                </strong>

                <span>
                  {wellnessChecks.length}
                </span>
              </div>

              <div>
                <strong>Present</strong>

                <span>
                  {presentChecks}
                </span>
              </div>

              <div>
                <strong>Absent</strong>

                <span>
                  {absentChecks}
                </span>
              </div>

              <div>
                <strong>Partial</strong>

                <span>
                  {partialChecks}
                </span>
              </div>
            </div>

            <div>
              <h3>
                Latest Wellness Check
              </h3>

              {latestCheck ? (
                <>
                  <p>
                    <strong>Unit:</strong>{" "}
                    {latestCheck.resident
                      ?.unitNumber || "N/A"}
                  </p>

                  <p>
                    <strong>
                      Resident:
                    </strong>{" "}
                    {latestCheck.resident
                      ?.clientName ||
                      "Unknown Resident"}
                  </p>

                  <p>
                    <strong>
                      Check Round:
                    </strong>{" "}
                    {latestCheck.checkRound ||
                      "Not Recorded"}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {latestCheck.status}
                  </p>

                  <p>
                    <strong>
                      Checked By:
                    </strong>{" "}
                    {latestCheck.staffName ||
                      "Not Recorded"}
                  </p>

                  <p>
                    <strong>
                      Recorded:
                    </strong>{" "}
                    {formatDateTime(
                      latestCheck.checkDateTime
                    )}
                  </p>
                </>
              ) : (
                <p>
                  No wellness checks recorded yet.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    );
  }

  // If no JWT token exists, only allow the login page.
  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    );
  }

  // Authenticated application.
  return (
    <main>
      <h1>
        Shelter Wellness Check Management System
      </h1>

      {/* Navigation uses React Router. */}
      <nav className="main-navigation">
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigate("/daily")}
        >
          Daily Check
        </button>

        <button
          type="button"
          onClick={() => navigate("/record")}
        >
          Record Check
        </button>

        <button
          type="button"
          onClick={() => navigate("/history")}
        >
          History
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/residents")
          }
        >
          Residents
        </button>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* React Router renders each view. */}
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/daily"
          element={<DailyWellnessSheet />}
        />

        <Route
          path="/record"
          element={<WellnessCheckForm />}
        />

        <Route
          path="/history"
          element={<WellnessCheckList />}
        />

        <Route
          path="/residents"
          element={
            <>
              <ResidentForm />
              <ResidentList />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <Navigate to="/" replace />
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </main>
  );
}

export default App;