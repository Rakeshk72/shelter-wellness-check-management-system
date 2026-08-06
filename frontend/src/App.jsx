// Import React hooks so the application can track
// the selected page and load dashboard information.
import { useEffect, useState } from "react";

// Import the ResidentForm component.
import ResidentForm from "./components/ResidentForm.jsx";

// Import the DailyWellnessSheet component.
import DailyWellnessSheet from "./components/DailyWellnessSheet.jsx";

// Import the WellnessCheckForm component.
import WellnessCheckForm from "./components/WellnessCheckForm.jsx";

// Import the WellnessCheckList component.
import WellnessCheckList from "./components/WellnessCheckList.jsx";

// Import the ResidentList component.
import ResidentList from "./components/ResidentList.jsx";

// Import application styles.
import "./App.css";

function App() {
  // Store which section of the application is currently selected.
  // Dashboard is displayed when the application first loads.
  const [activeSection, setActiveSection] =
    useState("dashboard");

  // Store residents for dashboard totals.
  const [residents, setResidents] = useState([]);

  // Store wellness checks for dashboard totals.
  const [wellnessChecks, setWellnessChecks] =
    useState([]);

  // Store dashboard loading/error information.
  const [dashboardError, setDashboardError] =
    useState("");

  // Load residents and wellness checks when the
  // application first starts.
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          residentResponse,
          wellnessResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/residents"
          ),
          fetch(
            "http://localhost:5000/api/wellness-checks"
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
  }, []);

  // Count wellness checks by status.
  const presentChecks =
    wellnessChecks.filter(
      (check) => check.status === "Present"
    ).length;

  const absentChecks =
    wellnessChecks.filter(
      (check) => check.status === "Absent"
    ).length;

  const partialChecks =
    wellnessChecks.filter(
      (check) => check.status === "Partial"
    ).length;

  // Wellness checks are returned newest first,
  // so the first item is the latest recorded check.
  const latestCheck = wellnessChecks[0];

  // Format the latest recorded date and time.
  function formatDateTime(dateValue) {
    if (!dateValue) {
      return "No checks recorded yet";
    }

    return new Date(
      dateValue
    ).toLocaleString();
  }

  return (
    <main>
      {/* Main application title. */}
      <h1>
        Shelter Wellness Check Management System
      </h1>

      {/* Main application navigation. */}
      <nav className="main-navigation">
        <button
          type="button"
          onClick={() =>
            setActiveSection("dashboard")
          }
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveSection("daily")
          }
        >
          Daily Check
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveSection("record")
          }
        >
          Record Check
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveSection("history")
          }
        >
          History
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveSection("residents")
          }
        >
          Residents
        </button>
      </nav>

      {/* Display the dashboard when Dashboard is selected. */}
      {activeSection === "dashboard" && (
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
              {/* Main dashboard totals. */}
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

              {/* Display information from the latest
                  wellness check stored in MongoDB. */}
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
                      <strong>Status:</strong>{" "}
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
      )}

      {/* Display the daily wellness sheet. */}
      {activeSection === "daily" && (
        <DailyWellnessSheet />
      )}

      {/* Display the individual wellness check form. */}
      {activeSection === "record" && (
        <WellnessCheckForm />
      )}

      {/* Display wellness check history. */}
      {activeSection === "history" && (
        <WellnessCheckList />
      )}

      {/* Resident management contains both the
          form for adding residents and the
          existing resident list. */}
      {activeSection === "residents" && (
        <>
          <ResidentForm />
          <ResidentList />
        </>
      )}
    </main>
  );
}

export default App;