// Import useState so React can track the currently selected page.
import { useState } from "react";

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
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <main>
      {/* Main application title. */}
      <h1>Shelter Wellness Check Management System</h1>

      {/* Main application navigation. */}
      <nav className="main-navigation">
        <button
          type="button"
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("daily")}
        >
          Daily Check
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("record")}
        >
          Record Check
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("history")}
        >
          History
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("residents")}
        >
          Residents
        </button>
      </nav>

      {/* Display the dashboard when Dashboard is selected. */}
      {activeSection === "dashboard" && (
        <section>
          <h2>Dashboard</h2>

          <p>
            Welcome to the Shelter Wellness Check Management
            System.
          </p>

          <p>
            Use the navigation above to manage residents and
            wellness checks.
          </p>
        </section>
      )}

      {/* Display the daily wellness sheet. */}
      {activeSection === "daily" && <DailyWellnessSheet />}

      {/* Display the individual wellness check form. */}
      {activeSection === "record" && <WellnessCheckForm />}

      {/* Display wellness check history. */}
      {activeSection === "history" && <WellnessCheckList />}

      {/* 
        Resident management contains both the form for adding
        residents and the existing resident list.
      */}
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