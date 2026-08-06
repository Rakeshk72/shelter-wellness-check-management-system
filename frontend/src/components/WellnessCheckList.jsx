// Import React hooks for loading and storing wellness checks.
import { useEffect, useState } from "react";

function WellnessCheckList() {
  // Store wellness checks returned from the backend.
  const [checks, setChecks] = useState([]);

  // Store loading state while waiting for the API.
  const [loading, setLoading] = useState(true);

  // Store an error message if the request fails.
  const [error, setError] = useState("");

  // Fetch wellness checks when the component first loads.
  useEffect(() => {
    async function fetchWellnessChecks() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/wellness-checks"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to retrieve wellness checks."
          );
        }

        const data = await response.json();

        setChecks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWellnessChecks();
  }, []);

  // Show a loading message while waiting for the API.
  if (loading) {
    return <p>Loading wellness checks...</p>;
  }

  // Show an error message if the API request fails.
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Wellness Check History</h2>

      {checks.length === 0 ? (
        <p>No wellness checks found.</p>
      ) : (
        <ul>
          {checks.map((check) => (
            <li key={check._id}>
              <strong>
                Unit {check.resident?.unitNumber || "N/A"}
              </strong>

              {" - "}

              {check.resident?.clientName ||
                "Unknown Resident"}

              {" - "}

              Wellness Status: {check.status}

              {" - "}

              NSR: {check.nsrPresence || "Not Recorded"}

              {" - "}

              Adults: {check.adultsPresent}

              {" - "}

              Children: {check.childrenPresent}

              {" - "}

              Staff: {check.staffName}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WellnessCheckList;