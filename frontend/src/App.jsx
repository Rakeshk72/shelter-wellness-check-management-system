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
  return (
    <main>
      {/* Main application title. */}
      <h1>Shelter Wellness Check Management System</h1>

      {/* 
        Main navigation.
        For this commit, the buttons only display the navigation UI.
        In the next step, we will connect them to different sections.
      */}
      <nav className="main-navigation">
        <button type="button">Dashboard</button>

        <button type="button">Daily Check</button>

        <button type="button">Record Check</button>

        <button type="button">History</button>

        <button type="button">Residents</button>
      </nav>

      {/* Form used to add a new resident. */}
      <ResidentForm />

      {/* Daily sheet used for recording multiple wellness checks. */}
      <DailyWellnessSheet />

      {/* Form used to record an individual wellness check. */}
      <WellnessCheckForm />

      {/* Displays previously recorded wellness checks. */}
      <WellnessCheckList />

      {/* Displays the current resident list. */}
      <ResidentList />
    </main>
  );
}

export default App;