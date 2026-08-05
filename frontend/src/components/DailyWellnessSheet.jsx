// Import React hooks for storing residents and loading
// resident information when the component first appears.
import { useEffect, useState } from "react";

function DailyWellnessSheet() {
  // Store all residents retrieved from MongoDB.
  const [residents, setResidents] = useState([]);

  // Store an error message if residents cannot be loaded.
  const [error, setError] = useState("");

  // Retrieve the existing residents from the backend.
  useEffect(() => {
    async function fetchResidents() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/residents"
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve residents.");
        }

        const data = await response.json();

        setResidents(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchResidents();
  }, []);

  return (
    <section>
      <h2>Daily Wellness Check Sheet</h2>

      {error && <p>{error}</p>}

      {residents.length === 0 && !error ? (
        <p>No residents available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Unit</th>
              <th>Resident</th>
              <th>Family Size</th>
              <th>Status</th>
              <th>Adults Present</th>
              <th>Children Present</th>
              <th>Comments</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident._id}>
                <td>{resident.unitNumber}</td>
                <td>{resident.clientName}</td>
                <td>{resident.familySize}</td>

                <td>
                  <select defaultValue="Present">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Partial">Partial</option>
                  </select>
                </td>

                <td>
                  <input type="number" min="0" defaultValue="0" />
                </td>

                <td>
                  <input type="number" min="0" defaultValue="0" />
                </td>

                <td>
                  <input
                    type="text"
                    placeholder="Optional comments"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default DailyWellnessSheet;