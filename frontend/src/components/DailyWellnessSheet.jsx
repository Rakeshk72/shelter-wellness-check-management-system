// Import React hooks for storing residents and loading
// resident information when the component first appears.
import { useEffect, useState } from "react";

import WellnessSummary from "./dailyWellness/WellnessSummary.jsx";

function DailyWellnessSheet() {
  // Store all residents retrieved from MongoDB.
  const [residents, setResidents] = useState([]);

  // Store the daily wellness values for each resident.
  const [dailyChecks, setDailyChecks] = useState({});

  // Store a default staff name that can be applied
  // to all currently assigned resident rows.
  const [defaultStaffName, setDefaultStaffName] = useState("");

  // Store text used to search residents.
  const [searchTerm, setSearchTerm] = useState("");

  // Store the beginning and ending unit numbers
  // assigned to the current staff member.
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");

  // Store wellness check date.
  const [checkDate, setCheckDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Store which scheduled wellness-check round is being completed.
  const [checkRound, setCheckRound] = useState("");

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

        // Create one daily wellness row for every resident.
        const initialChecks = {};

        data.forEach((resident) => {
          initialChecks[resident._id] = {
            status: "Present",
            nsrPresence: "Not Recorded",
            adultsPresent: 0,
            childrenPresent: 0,
            comments: "",
            staffName: "",
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

  // Filter residents by search text and assigned unit range,
  // then sort the results by unit number.
  const filteredResidents = residents
    .filter((resident) => {
      const search =
        searchTerm.toLowerCase().trim();

      const unitNumberText =
        resident.unitNumber
          .toString()
          .toLowerCase();

      const residentName =
        resident.clientName.toLowerCase();

      // Check the normal search box.
      const matchesSearch =
        unitNumberText.includes(search) ||
        residentName.includes(search);

      // Convert the unit number to a number
      // so numeric ranges can be compared.
      const residentUnitNumber =
        Number(resident.unitNumber);

      const startingUnit =
        fromUnit === ""
          ? null
          : Number(fromUnit);

      const endingUnit =
        toUnit === ""
          ? null
          : Number(toUnit);

      // If no From Unit is entered,
      // there is no lower limit.
      const matchesFromUnit =
        startingUnit === null ||
        residentUnitNumber >= startingUnit;

      // If no To Unit is entered,
      // there is no upper limit.
      const matchesToUnit =
        endingUnit === null ||
        residentUnitNumber <= endingUnit;

      return (
        matchesSearch &&
        matchesFromUnit &&
        matchesToUnit
      );
    })
    .sort((residentA, residentB) =>
      residentA.unitNumber.localeCompare(
        residentB.unitNumber,
        undefined,
        { numeric: true }
      )
    );

  // Apply the default staff name to every resident
  // currently displayed in the assigned unit range.
  function handleApplyDefaultStaff() {
    if (!defaultStaffName.trim()) {
      setMessage(
        "Please enter a default staff name first."
      );
      return;
    }

    if (filteredResidents.length === 0) {
      setMessage(
        "There are no assigned residents to apply the staff name to."
      );
      return;
    }

    setDailyChecks((currentChecks) => {
      const updatedChecks = {
        ...currentChecks,
      };

      filteredResidents.forEach((resident) => {
        updatedChecks[resident._id] = {
          ...updatedChecks[resident._id],
          staffName: defaultStaffName.trim(),
        };
      });

      return updatedChecks;
    });

    setMessage(
      `Staff name applied to ${filteredResidents.length} assigned resident(s).`
    );
  }

  // Mark all currently displayed residents as Present.
  function handleMarkAllPresent() {
    if (filteredResidents.length === 0) {
      setMessage(
        "There are no assigned residents to mark as Present."
      );
      return;
    }

    setDailyChecks((currentChecks) => {
      const updatedChecks = {
        ...currentChecks,
      };

      filteredResidents.forEach((resident) => {
        updatedChecks[resident._id] = {
          ...updatedChecks[resident._id],
          status: "Present",
        };
      });

      return updatedChecks;
    });

    setMessage(
      `${filteredResidents.length} assigned resident(s) marked as Present.`
    );
  }

  // Reset all currently displayed resident rows
  // back to their default unsaved values.
  function handleResetAssignedRows() {
    if (filteredResidents.length === 0) {
      setMessage(
        "There are no assigned residents to reset."
      );
      return;
    }

    setDailyChecks((currentChecks) => {
      const updatedChecks = {
        ...currentChecks,
      };

      filteredResidents.forEach((resident) => {
        updatedChecks[resident._id] = {
          status: "Present",
          nsrPresence: "Not Recorded",
          adultsPresent: 0,
          childrenPresent: 0,
          comments: "",
          staffName: "",
        };
      });

      return updatedChecks;
    });

    setDefaultStaffName("");

    setMessage(
      `${filteredResidents.length} assigned resident row(s) reset.`
    );
  }

  // Calculate the live summary only for the
  // residents currently displayed/assigned.
  const dailySummary = filteredResidents.reduce(
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

  // Save only the wellness-check rows currently displayed.
  async function handleSaveDailyChecks() {
    // Require a wellness check date.
    if (!checkDate) {
      setMessage(
        "Please select a wellness check date."
      );
      return;
    }

    // Require the scheduled wellness-check round.
    if (!checkRound) {
      setMessage(
        "Please select a check round before saving."
      );
      return;
    }

    // Prevent an invalid unit range.
    if (
      fromUnit !== "" &&
      toUnit !== "" &&
      Number(fromUnit) > Number(toUnit)
    ) {
      setMessage(
        "From Unit cannot be greater than To Unit."
      );
      return;
    }

    // Make sure at least one resident is displayed.
    if (filteredResidents.length === 0) {
      setMessage(
        "There are no residents in the selected unit range."
      );
      return;
    }

    // Validate attendance and staff information
    // only for the assigned residents.
    for (const resident of filteredResidents) {
      const check =
        dailyChecks[resident._id];

      if (!check) {
        setMessage(
          `Wellness information is missing for Unit ${resident.unitNumber}.`
        );
        return;
      }

      // Each saved resident row must identify
      // which staff member completed the check.
      const rowStaffName =
        check.staffName?.trim() ||
        defaultStaffName.trim();

      if (!rowStaffName) {
        setMessage(
          `Please enter Checked By for Unit ${resident.unitNumber}.`
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

      // Present household members cannot exceed family size.
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

      // Create one POST request only for the
      // residents currently displayed.
      const requests = filteredResidents.map(
        (resident) => {
          const check =
            dailyChecks[resident._id];

          const rowStaffName =
            check.staffName.trim() ||
            defaultStaffName.trim();

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

                checkRound,

                status: check.status,

                nsrPresence:
                  check.nsrPresence,

                adultsPresent: Number(
                  check.adultsPresent
                ),

                childrenPresent: Number(
                  check.childrenPresent
                ),

                comments: check.comments,

                // Save the staff member responsible
                // for this individual resident row.
                staffName:
                  rowStaffName,

                checkDateTime: new Date(
                  `${checkDate}T12:00:00`
                ),
              }),
            }
          );
        }
      );

      // Wait for all assigned resident checks to save.
      const responses =
        await Promise.all(requests);

      // Find any failed request.
      const failedResponse =
        responses.find(
          (response) => !response.ok
        );

      // If a request failed, read the backend response
      // so staff can see the exact reason.
      if (failedResponse) {
        let errorMessage =
          "One or more wellness checks could not be saved.";

        try {
          const errorData =
            await failedResponse.json();

          if (errorData.message) {
            errorMessage =
              errorData.message;
          }
        } catch {
          // Keep the general error message if the
          // backend response cannot be read.
        }

        throw new Error(errorMessage);
      }

      setMessage(
        `${filteredResidents.length} wellness check(s) saved successfully for ${checkRound}.`
      );

      // Reset only the rows that were just saved.
      setDailyChecks((currentChecks) => {
        const updatedChecks = {
          ...currentChecks,
        };

        filteredResidents.forEach(
          (resident) => {
            updatedChecks[resident._id] = {
              status: "Present",
              nsrPresence: "Not Recorded",
              adultsPresent: 0,
              childrenPresent: 0,
              comments: "",
              staffName: "",
            };
          }
        );

        return updatedChecks;
      });

      // Clear assignment information after saving.
      setDefaultStaffName("");
      setSearchTerm("");
      setFromUnit("");
      setToUnit("");
      setCheckRound("");
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

      {/* Search by unit number or resident name. */}
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

      {/* Staff can select only their assigned unit range. */}
      <div className="unit-range-filter">
        <div>
          <label htmlFor="fromUnit">
            From Unit:
          </label>

          <input
            id="fromUnit"
            type="number"
            min="0"
            value={fromUnit}
            onChange={(event) =>
              setFromUnit(
                event.target.value
              )
            }
            placeholder="Example: 201"
          />
        </div>

        <div>
          <label htmlFor="toUnit">
            To Unit:
          </label>

          <input
            id="toUnit"
            type="number"
            min="0"
            value={toUnit}
            onChange={(event) =>
              setToUnit(
                event.target.value
              )
            }
            placeholder="Example: 220"
          />
        </div>
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
        <label htmlFor="checkRound">
          Check Round:
        </label>

        <select
          id="checkRound"
          value={checkRound}
          onChange={(event) =>
            setCheckRound(
              event.target.value
            )
          }
          required
        >
          <option value="">
            Select Check Round
          </option>

          <option value="Overnight Check">
            Overnight Check
          </option>

          <option value="8AM-4PM Round 1">
            8AM-4PM — Round 1
          </option>

          <option value="8AM-4PM Round 2">
            8AM-4PM — Round 2
          </option>

          <option value="8AM-4PM Round 3">
            8AM-4PM — Round 3
          </option>

          <option value="4PM-12AM Round 1">
            4PM-12AM — Round 1
          </option>

          <option value="4PM-12AM Round 2">
            4PM-12AM — Round 2
          </option>

          <option value="4PM-12AM Round 3">
            4PM-12AM — Round 3
          </option>
        </select>
      </div>

      {/* Default staff name can be copied to all assigned rows. */}
      <div>
        <label htmlFor="defaultStaffName">
          Default Staff Name:
        </label>

        <input
          id="defaultStaffName"
          type="text"
          value={defaultStaffName}
          onChange={(event) =>
            setDefaultStaffName(
              event.target.value
            )
          }
          placeholder="Enter staff name"
        />

        <button
          type="button"
          onClick={handleApplyDefaultStaff}
        >
          Apply Staff to Assigned Units
        </button>

        <button
          type="button"
          onClick={handleMarkAllPresent}
        >
          Mark All Present
        </button>

        <button
          type="button"
          onClick={handleResetAssignedRows}
        >
          Reset Assigned Rows
        </button>
      </div>

      {/* Live status summary for currently displayed residents. */}
      <WellnessSummary summary={dailySummary} />

      {error && <p>{error}</p>}

      {residents.length === 0 &&
      !error ? (
        <p>No residents available.</p>
      ) : filteredResidents.length ===
        0 ? (
        <p>
          No residents match your search or unit range.
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

                <th>
                  Checked By
                </th>
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

                      <td>
                        <input
                          type="text"
                          value={
                            check.staffName
                          }
                          onChange={(
                            event
                          ) =>
                            handleRowChange(
                              resident._id,
                              "staffName",
                              event.target
                                .value
                            )
                          }
                          placeholder="Staff name"
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
              : `Save ${filteredResidents.length} Assigned Wellness Check(s)`}
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