// Import React hooks for loading and storing wellness checks.
import { useEffect, useState } from "react";

function WellnessCheckList() {
  // Store wellness checks returned from the backend.
  const [checks, setChecks] = useState([]);

  // Store the text used to search wellness history.
  const [searchTerm, setSearchTerm] = useState("");

  // Store the selected history date filter.
  const [dateFilter, setDateFilter] = useState("");

  // Store the selected check round filter.
  const [roundFilter, setRoundFilter] = useState("");

  // Store the staff name filter.
  const [staffFilter, setStaffFilter] = useState("");

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

  // Format the backend-recorded date and time
  // into an easy-to-read local format.
  function formatCheckDateTime(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    return date.toLocaleString();
  }

  // Convert the recorded date into YYYY-MM-DD format
  // so it can be compared with the date input.
  function formatDateForFilter(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Filter wellness history by:
  // unit/resident search,
  // date,
  // check round,
  // and staff name.
  const filteredChecks = checks.filter((check) => {
    const search =
      searchTerm.toLowerCase().trim();

    const staffSearch =
      staffFilter.toLowerCase().trim();

    const unitNumber =
      check.resident?.unitNumber
        ?.toString()
        .toLowerCase() || "";

    const residentName =
      check.resident?.clientName
        ?.toLowerCase() || "";

    const staffName =
      check.staffName
        ?.toLowerCase() || "";

    const matchesSearch =
      unitNumber.includes(search) ||
      residentName.includes(search);

    const matchesDate =
      !dateFilter ||
      formatDateForFilter(
        check.checkDateTime
      ) === dateFilter;

    const matchesRound =
      !roundFilter ||
      check.checkRound === roundFilter;

    const matchesStaff =
      !staffFilter ||
      staffName.includes(staffSearch);

    return (
      matchesSearch &&
      matchesDate &&
      matchesRound &&
      matchesStaff
    );
  });

  // Clear all history filters.
  function handleClearFilters() {
    setSearchTerm("");
    setDateFilter("");
    setRoundFilter("");
    setStaffFilter("");
  }

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

      <div>
        <label htmlFor="historySearch">
          Search History:
        </label>

        <input
          id="historySearch"
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search by unit number or resident name"
        />
      </div>

      <div>
        <label htmlFor="historyDate">
          Date:
        </label>

        <input
          id="historyDate"
          type="date"
          value={dateFilter}
          onChange={(event) =>
            setDateFilter(event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="historyRound">
          Check Round:
        </label>

        <select
          id="historyRound"
          value={roundFilter}
          onChange={(event) =>
            setRoundFilter(event.target.value)
          }
        >
          <option value="">
            All Check Rounds
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

          <option value="Not Recorded">
            Not Recorded
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="historyStaff">
          Staff:
        </label>

        <input
          id="historyStaff"
          type="text"
          value={staffFilter}
          onChange={(event) =>
            setStaffFilter(event.target.value)
          }
          placeholder="Search by staff name"
        />
      </div>

      <button
        type="button"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>

      <p>
        Showing {filteredChecks.length} of{" "}
        {checks.length} wellness check(s).
      </p>

      {checks.length === 0 ? (
        <p>No wellness checks found.</p>
      ) : filteredChecks.length === 0 ? (
        <p>
          No wellness checks match the selected filters.
        </p>
      ) : (
        <ul>
          {filteredChecks.map((check) => (
            <li key={check._id}>
              <strong>
                Unit {check.resident?.unitNumber || "N/A"}
              </strong>

              {" - "}

              {check.resident?.clientName ||
                "Unknown Resident"}

              {" - "}

              Check Round:{" "}
              {check.checkRound || "Not Recorded"}

              {" - "}

              Wellness Status: {check.status}

              {" - "}

              NSR:{" "}
              {check.nsrPresence || "Not Recorded"}

              {" - "}

              Adults: {check.adultsPresent}

              {" - "}

              Children: {check.childrenPresent}

              {" - "}

              Staff: {check.staffName}

              {" - "}

              Recorded:{" "}
              {formatCheckDateTime(
                check.checkDateTime
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WellnessCheckList;