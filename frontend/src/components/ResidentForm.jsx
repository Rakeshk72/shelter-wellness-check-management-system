// Import useState to store the form input values.
import { useState } from "react";

function ResidentForm() {
  // Store the resident form data.
  const [formData, setFormData] = useState({
    unitNumber: "",
    clientName: "",
    caresNumber: "",
    familySize: 1,
    isActive: true,
  });

  // Store a message to show after submitting the form.
  const [message, setMessage] = useState("");

  // Update formData whenever the user types in an input.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Send the new resident to the backend.
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/residents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            familySize: Number(formData.familySize),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to create resident.");
      }

      await response.json();

      setMessage("Resident added successfully.");

      // Clear the form after successful submission.
      setFormData({
        unitNumber: "",
        clientName: "",
        caresNumber: "",
        familySize: 1,
        isActive: true,
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <h2>Add Resident</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="unitNumber">Unit Number:</label>
          <input
            id="unitNumber"
            name="unitNumber"
            type="text"
            value={formData.unitNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="clientName">Client Name:</label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="caresNumber">CARES Number:</label>
          <input
            id="caresNumber"
            name="caresNumber"
            type="text"
            value={formData.caresNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="familySize">Family Size:</label>
          <input
            id="familySize"
            name="familySize"
            type="number"
            min="1"
            value={formData.familySize}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add Resident</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

export default ResidentForm;