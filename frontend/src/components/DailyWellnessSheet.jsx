// Import React hooks for storing residents and loading
// resident information when the component first appears.
import { useEffect, useState } from "react";

function DailyWellnessSheet() {
  // Store all residents retrieved from MongoDB.
  const [residents, setResidents] = useState([]);

  // Store the daily wellness values for each resident.
  const [dailyChecks, setDailyChecks] = useState({});

  // Store the staff member completing the wellness sheet.
  const [staffName, setStaffName] = useState("");

  // Store a success or error message.
  const [message, setMessage] = useState("");

  // Track whether the daily sheet is currently being saved.
  const [saving, setSaving] = useState(false);

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

        // Create one wellness-check entry for every resident.
        const initialChecks = {};

        data.forEach((resident) => {
          initialChecks[resident._id] = {
            status: "Present",
            adultsPresent: 0,
            childrenPresent: 0,
            comments: "",
          };
        });

        setDailyChecks(initialChecks);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchResidents();
  }, []);

  // Update one field for one resident row.
  function handleRowChange(residentId, field, value) {
    setDailyChecks((currentChecks) => ({
      ...currentChecks,
      [residentId]: {
        ...currentChecks[residentId],
        [field]: value,
      },
    }));
  }

  // Save all resident wellness checks to the backend.
  async function handleSaveDailyChecks() {
    // Staff name is required by the WellnessCheck model.
    if (!staffName.trim()) {
      setMessage("Please enter the staff name before saving.");
      return;
    }

    // Make sure there are residents to save.
    if (residents.length === 0) {
      setMessage("There are no resident wellness checks to save.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      // Create one POST request for each resident.
      const requests = residents.map((resident) => {
        const check = dailyChecks[resident._id];

        return fetch(
          "http://localhost:5000/api/wellness-checks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resident: resident._id,
              status: check.status,
              adultsPresent: Number(check.adultsPresent),
              childrenPresent: Number(check.childrenPresent),
              comments: check.comments,
              staffName: staffName.trim(),
            }),
          }
        );
      });

      // Wait for every resident wellness check to save.
      const responses = await Promise.all(requests);

      // Check whether any request failed.
      const failedResponse = responses.find(
        (response) => !response.ok
      );

      if (failedResponse) {
        throw new Error(
          "One or more wellness checks could not be saved."
        );
      }

      setMessage(
        `${residents.length} wellness check(s) saved successfully.`
      );

      // Reset all rows after successful saving.
      const resetChecks = {};

      residents.forEach((resident) => {
        resetChecks[resident._id] = {
          status: "Present",
          adultsPresent: 0,
          childrenPresent: 0,
          comments: "",
        };
      });

      setDailyChecks(resetChecks);
      setStaffName("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Daily Wellness Check Sheet</h2>

      <div>
        <label htmlFor="dailyStaffName">
          Staff Name:
        </label>

        <input
          id="dailyStaffName"
          type="text"
          value={staffName}
          onChange={(event) =>
            setStaffName(event.target.value)
          }
          placeholder="Enter staff name"
        />
      </div>

      {error && <p>{error}</p>}

      {residents.length === 0 && !error ? (
        <p>No residents available.</p>
      ) : (
        <>
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
              {residents.map((resident) => {
                const check = dailyChecks[resident._id];

                if (!check) {
                  return null;
                }

                return (
                  <tr key={resident._id}>
                    <td>{resident.unitNumber}</td>

                    <td>{resident.clientName}</td>

                    <td>{resident.familySize}</td>

                    <td>
                      <select
                        value={check.status}
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "status",
                            event.target.value
                          )
                        }
                      >
                        <option value="Present">
                          Present
                        </option>

                        <option value="Absent">
                          Absent
                        </option>

                        <option value="Partial">
                          Partial
                        </option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        value={check.adultsPresent}
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "adultsPresent",
                            Number(event.target.value)
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        value={check.childrenPresent}
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "childrenPresent",
                            Number(event.target.value)
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        placeholder="Optional comments"
                        value={check.comments}
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "comments",
                            event.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleSaveDailyChecks}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Daily Wellness Checks"}
          </button>

          {message && <p>{message}</p>}
        </>
      )}
    </section>
  );
}

export default DailyWellnessSheet;