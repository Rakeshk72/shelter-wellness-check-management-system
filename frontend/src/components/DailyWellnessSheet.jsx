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

  // Store the text used to search residents by
  // unit number or resident name.
  const [searchTerm, setSearchTerm] = useState("");

  // Store the date for this wellness check sheet.
  // Default to today's date.
  const [checkDate, setCheckDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  // Filter residents by unit number or resident name,
  // then sort the filtered results by unit number.
  const filteredResidents = residents
    .filter((resident) => {
      const search = searchTerm.toLowerCase().trim();

      const unitNumber = resident.unitNumber
        .toString()
        .toLowerCase();

      const residentName = resident.clientName
        .toLowerCase();

      return (
        unitNumber.includes(search) ||
        residentName.includes(search)
      );
    })
    .sort((residentA, residentB) =>
      residentA.unitNumber.localeCompare(
        residentB.unitNumber,
        undefined,
        { numeric: true }
      )
    );

  // Calculate the current daily wellness summary.
  // These values automatically change when a resident's
  // status is changed in the table.
  const dailySummary = residents.reduce(
    (summary, resident) => {
      const check = dailyChecks[resident._id];

      summary.total += 1;

      if (check?.status === "Present") {
        summary.present += 1;
      }

      if (check?.status === "Absent") {
        summary.absent += 1;
      }

      if (check?.status === "Partial") {
        summary.partial += 1;
      }

      return summary;
    },
    {
      total: 0,
      present: 0,
      absent: 0,
      partial: 0,
    }
  );

  // Save all resident wellness checks to the backend.
  async function handleSaveDailyChecks() {
    // Staff name is required.
    if (!staffName.trim()) {
      setMessage("Please enter the staff name before saving.");
      return;
    }

    // Wellness check date is required.
    if (!checkDate) {
      setMessage("Please select a wellness check date.");
      return;
    }

    // Make sure there are residents to save.
    if (residents.length === 0) {
      setMessage(
        "There are no resident wellness checks to save."
      );
      return;
    }

    // Validate each resident's attendance numbers before
    // sending any wellness checks to the backend.
    for (const resident of residents) {
      const check = dailyChecks[resident._id];

      // Make sure this resident has a daily check row.
      if (!check) {
        setMessage(
          `Wellness information is missing for Unit ${resident.unitNumber}.`
        );
        return;
      }

      const adultsPresent = Number(check.adultsPresent);
      const childrenPresent = Number(check.childrenPresent);

      // Attendance values cannot be negative.
      if (
        adultsPresent < 0 ||
        childrenPresent < 0
      ) {
        setMessage(
          `Present counts cannot be negative for Unit ${resident.unitNumber}.`
        );
        return;
      }

      // Calculate the total number of people marked present.
      const totalPresent =
        adultsPresent + childrenPresent;

      // Present household members cannot be greater
      // than the resident's recorded family size.
      if (totalPresent > resident.familySize) {
        setMessage(
          `Unit ${resident.unitNumber}: Adults and children present cannot exceed family size ${resident.familySize}.`
        );
        return;
      }
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
              adultsPresent: Number(
                check.adultsPresent
              ),
              childrenPresent: Number(
                check.childrenPresent
              ),
              comments: check.comments,
              staffName: staffName.trim(),
              checkDateTime: new Date(
                `${checkDate}T12:00:00`
              ),
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
      setSearchTerm("");
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
        <label htmlFor="residentSearch">
          Search Resident:
        </label>

        <input
          id="residentSearch"
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search by unit number or resident name"
        />
      </div>

      <div>
        <label htmlFor="dailyCheckDate">
          Wellness Check Date:
        </label>

        <input
          id="dailyCheckDate"
          type="date"
          value={checkDate}
          onChange={(event) =>
            setCheckDate(event.target.value)
          }
        />
      </div>

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

      {/* Display a live summary of the daily wellness statuses. */}
      <div className="daily-summary">
        <div>
          <strong>Total Residents</strong>
          <span>{dailySummary.total}</span>
        </div>

        <div>
          <strong>Present</strong>
          <span>{dailySummary.present}</span>
        </div>

        <div>
          <strong>Absent</strong>
          <span>{dailySummary.absent}</span>
        </div>

        <div>
          <strong>Partial</strong>
          <span>{dailySummary.partial}</span>
        </div>
      </div>

      {error && <p>{error}</p>}

      {residents.length === 0 && !error ? (
        <p>No residents available.</p>
      ) : filteredResidents.length === 0 ? (
        <p>No residents match your search.</p>
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
              {filteredResidents.map((resident) => {
                const check =
                  dailyChecks[resident._id];

                if (!check) {
                  return null;
                }

                return (
                  <tr key={resident._id}>
                    <td>
                      {resident.unitNumber}
                    </td>

                    <td>
                      {resident.clientName}
                    </td>

                    <td>
                      {resident.familySize}
                    </td>

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
                        value={
                          check.adultsPresent
                        }
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "adultsPresent",
                            Number(
                              event.target.value
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        value={
                          check.childrenPresent
                        }
                        onChange={(event) =>
                          handleRowChange(
                            resident._id,
                            "childrenPresent",
                            Number(
                              event.target.value
                            )
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