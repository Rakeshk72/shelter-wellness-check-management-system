// Import React hooks for storing data and running code
// when the component first loads.
import { useEffect, useState } from "react";

function ResidentList() {
  // Store the residents returned from the backend.
  const [residents, setResidents] = useState([]);

  // Store loading state while waiting for the API.
  const [loading, setLoading] = useState(true);

  // Store an error message if the request fails.
  const [error, setError] = useState("");

  // Fetch residents when this component first loads.
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
      } finally {
        setLoading(false);
      }
    }

    fetchResidents();
  }, []);

  // Delete a resident from the backend and remove it
  // from the list shown on the page.
  async function handleDelete(residentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/residents/${residentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete resident.");
      }

      // Remove the deleted resident from React state.
      setResidents((currentResidents) =>
        currentResidents.filter(
          (resident) => resident._id !== residentId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Show a message while the request is loading.
  if (loading) {
    return <p>Loading residents...</p>;
  }

  // Show an error if the backend request fails.
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Residents</h2>

      {residents.length === 0 ? (
        <p>No residents found.</p>
      ) : (
        <ul>
          {residents.map((resident) => (
            <li key={resident._id}>
              <strong>Unit {resident.unitNumber}</strong>
              {" - "}
              {resident.clientName}
              {" - "}
              Family Size: {resident.familySize}
              {" "}
              <button
                type="button"
                onClick={() => handleDelete(resident._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ResidentList;