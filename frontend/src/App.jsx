// Import the ResidentForm component.
import ResidentForm from "./components/ResidentForm.jsx";

// Import the WellnessCheckForm component.
import WellnessCheckForm from "./components/WellnessCheckForm.jsx";

// Import the ResidentList component.
import ResidentList from "./components/ResidentList.jsx";

// Import application styles.
import "./App.css";

function App() {
  return (
    <main>
      <h1>Shelter Wellness Check Management System</h1>

      <ResidentForm />

      <WellnessCheckForm />

      <ResidentList />
    </main>
  );
}

export default App;