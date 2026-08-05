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

  // Store the ID of the resident currently being edited.
  const [editingId, setEditingId] = useState(null);

  // Store the editable resident values.
  const [editFormData, setEditFormData] = useState({
    unitNumber: "",
    clientName: "",
    caresNumber: "",
    familySize: 1,
    isActive: true,
  });

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

  // Start editing a selected resident.
  function handleEdit(resident) {
    setEditingId(resident._id);

    setEditFormData({
      unitNumber: resident.unitNumber,
      clientName: resident.clientName,
      caresNumber: resident.caresNumber,
      familySize: resident.familySize,
      isActive: resident.isActive,
    });
  }

  // Update edit form values while typing.
  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  // Save the updated resident to the backend.
  async function handleUpdate(residentId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/residents/${residentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editFormData,
            familySize: Number(editFormData.familySize),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update resident.");
      }

      const updatedResident = await response.json();

      // Replace the old resident with the updated resident.
      setResidents((currentResidents) =>
        currentResidents.map((resident) =>
          resident._id === residentId ? updatedResident : resident
        )
      );

      // Exit edit mode.
      setEditingId(null);
    } catch (error) {
      setError(error.message);
    }
  }

  // Cancel editing without saving changes.
  function handleCancel() {
    setEditingId(null);
  }

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

      setResidents((currentResidents) =>
        currentResidents.filter(
          (resident) => resident._id !== residentId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <p>Loading residents...</p>;
  }

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
              {editingId === resident._id ? (
                <>
                  <input
                    name="unitNumber"
                    value={editFormData.unitNumber}
                    onChange={handleEditChange}
                  />

                  <input
                    name="clientName"
                    value={editFormData.clientName}
                    onChange={handleEditChange}
                  />

                  <input
                    name="caresNumber"
                    value={editFormData.caresNumber}
                    onChange={handleEditChange}
                  />

                  <input
                    name="familySize"
                    type="number"
                    min="1"
                    value={editFormData.familySize}
                    onChange={handleEditChange}
                  />

                  <button
                    type="button"
                    onClick={() => handleUpdate(resident._id)}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>Unit {resident.unitNumber}</strong>
                  {" - "}
                  {resident.clientName}
                  {" - "}
                  Family Size: {resident.familySize}
                  {" "}

                  <button
                    type="button"
                    onClick={() => handleEdit(resident)}
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() => handleDelete(resident._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ResidentList;