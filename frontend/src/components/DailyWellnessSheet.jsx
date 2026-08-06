// Import React hooks for storing residents and loading
// resident information when the component first appears.
import { useEffect, useState } from "react";

function DailyWellnessSheet() {
  // Store all residents retrieved from MongoDB.
  const [residents, setResidents] = useState([]);

  // Store the daily wellness values for each resident.
  const [dailyChecks, setDailyChecks] = useState({});

  // Store the staff member completing the sheet.
  const [staffName, setStaffName] = useState("");

  // Store text used to search residents.
  const [searchTerm, setSearchTerm] = useState("");

  // Store wellness check date.
  const [checkDate, setCheckDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Store success or error messages.
  const [message, setMessage] = useState("");

  // Track whether the sheet is saving.
  const [saving, setSaving] = useState(false);

  // Store resident loading errors.
  const [error, setError] = useState("");

  // Retrieve residents from the backend.
  useEffect(() => {
    async function fetchResidents() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/residents"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to retrieve residents."
          );
        }

        const data = await response.json();

        setResidents(data);

        // Create one daily wellness row for each resident.
        const initialChecks = {};

        data.forEach((resident) => {
          initialChecks[resident._id] = {
            status: "Present",

            // Default NSR to Not Recorded so staff
            // can explicitly select the NSR result.
            nsrPresence: "Not Recorded",

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

  // Update one value in one resident row.
  function handleRowChange(
    residentId,
    field,
    value
  ) {
    setDailyChecks((currentChecks) => ({
      ...currentChecks,

      [residentId]: {
        ...currentChecks[residentId],
        [field]: value,
      },
    }));
  }

  // Search residents and sort by unit number.
  const filteredResidents = residents
    .filter((resident) => {
      const search =
        searchTerm.toLowerCase().trim();

      const unitNumber =
        resident.unitNumber
          .toString()
          .toLowerCase();

      const residentName =
        resident.clientName.toLowerCase();

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

  // Calculate the live daily status summary.
  const dailySummary = residents.reduce(
    (summary, resident) => {
      const check =
        dailyChecks[resident._id];

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

  // Save all wellness-check rows.
  async function handleSaveDailyChecks() {
    // Require the staff member's name.
    if (!staffName.trim()) {
      setMessage(
        "Please enter the staff name before saving."
      );
      return;
    }

    // Require a wellness check date.
    if (!checkDate) {
      setMessage(
        "Please select a wellness check date."
      );
      return;
    }

    // Make sure residents exist before saving.
    if (residents.length === 0) {
      setMessage(
        "There are no resident wellness checks to save."
      );
      return;
    }

    // Validate attendance against family size.
    for (const resident of residents) {
      const check =
        dailyChecks[resident._id];

      if (!check) {
        setMessage(
          `Wellness information is missing for Unit ${resident.unitNumber}.`
        );
        return;
      }

      const adultsPresent = Number(
        check.adultsPresent
      );

      const childrenPresent = Number(
        check.childrenPresent
      );

      // Present counts cannot be negative.
      if (
        adultsPresent < 0 ||
        childrenPresent < 0
      ) {
        setMessage(
          `Present counts cannot be negative for Unit ${resident.unitNumber}.`
        );
        return;
      }

      const totalPresent =
        adultsPresent + childrenPresent;

      // The total present cannot exceed
      // the recorded family size.
      if (
        totalPresent >
        resident.familySize
      ) {
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
      const requests = residents.map(
        (resident) => {
          const check =
            dailyChecks[resident._id];

          return fetch(
            "http://localhost:5000/api/wellness-checks",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                resident: resident._id,

                status: check.status,

                // Save the NSR result with
                // this wellness-check record.
                nsrPresence:
                  check.nsrPresence,

                adultsPresent: Number(
                  check.adultsPresent
                ),

                childrenPresent: Number(
                  check.childrenPresent
                ),

                comments: check.comments,

                staffName:
                  staffName.trim(),

                checkDateTime: new Date(
                  `${checkDate}T12:00:00`
                ),
              }),
            }
          );
        }
      );

      // Wait for all resident checks to save.
      const responses =
        await Promise.all(requests);

      // Find any failed request.
      const failedResponse =
        responses.find(
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

      // Reset the daily sheet after saving.
      const resetChecks = {};

      residents.forEach((resident) => {
        resetChecks[resident._id] = {
          status: "Present",
          nsrPresence: "Not Recorded",
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
      <h2>
        Daily Wellness Check Sheet
      </h2>

      <div>
        <label htmlFor="residentSearch">
          Search Resident:
        </label>

        <input
          id="residentSearch"
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
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
            setCheckDate(
              event.target.value
            )
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
            setStaffName(
              event.target.value
            )
          }
          placeholder="Enter staff name"
        />
      </div>

      {/* Live wellness status summary. */}
      <div className="daily-summary">
        <div>
          <strong>
            Total Residents
          </strong>

          <span>
            {dailySummary.total}
          </span>
        </div>

        <div>
          <strong>Present</strong>

          <span>
            {dailySummary.present}
          </span>
        </div>

        <div>
          <strong>Absent</strong>

          <span>
            {dailySummary.absent}
          </span>
        </div>

        <div>
          <strong>Partial</strong>

          <span>
            {dailySummary.partial}
          </span>
        </div>
      </div>

      {error && <p>{error}</p>}

      {residents.length === 0 &&
      !error ? (
        <p>No residents available.</p>
      ) : filteredResidents.length ===
        0 ? (
        <p>
          No residents match your search.
        </p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Unit</th>

                <th>Resident</th>

                <th>Family Size</th>

                <th>
                  Family Composition
                </th>

                <th>
                  Wellness Status
                </th>

                <th>
                  NSR Presence
                </th>

                <th>
                  Adults Present
                </th>

                <th>
                  Children Present
                </th>

                <th>Comments</th>
              </tr>
            </thead>

            <tbody>
              {filteredResidents.map(
                (resident) => {
                  const check =
                    dailyChecks[
                      resident._id
                    ];

                  if (!check) {
                    return null;
                  }

                  return (
                    <tr
                      key={resident._id}
                    >
                      <td>
                        {
                          resident.unitNumber
                        }
                      </td>

                      <td>
                        {
                          resident.clientName
                        }
                      </td>

                      <td>
                        {
                          resident.familySize
                        }
                      </td>

                      <td>
                        {resident.adultsInFamily ??
                          "?"}
                        A /{" "}
                        {resident.childrenInFamily ??
                          "?"}
                        C
                      </td>

                      <td>
                        <select
                          value={
                            check.status
                          }
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "status",
                              event.target
                                .value
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
                        <select
                          value={
                            check.nsrPresence
                          }
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "nsrPresence",
                              event.target
                                .value
                            )
                          }
                        >
                          <option value="Not Recorded">
                            Not Recorded
                          </option>

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
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "adultsPresent",
                              Number(
                                event
                                  .target
                                  .value
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
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "childrenPresent",
                              Number(
                                event
                                  .target
                                  .value
                              )
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          placeholder="Optional comments"
                          value={
                            check.comments
                          }
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "comments",
                              event.target
                                .value
                            )
                          }
                        />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <button
            type="button"
            onClick={
              handleSaveDailyChecks
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Daily Wellness Checks"}
          </button>

          {message && (
            <p>{message}</p>
          )}
        </>
      )}
    </section>
  );
}

export default DailyWellnessSheet;