// Import React hooks for storing form data and loading residents.
import { useEffect, useState } from "react";

function WellnessCheckForm() {
  // Store residents so staff can select a resident from the list.
  const [residents, setResidents] = useState([]);

  // Store the wellness check form values.
  const [formData, setFormData] = useState({
    resident: "",
    status: "Present",
    adultsPresent: 0,
    childrenPresent: 0,
    comments: "",
    staffName: "",
  });

  // Store a success or error message.
  const [message, setMessage] = useState("");

  // Get residents from the backend when the component loads.
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
        setMessage(error.message);
      }
    }

    fetchResidents();
  }, []);

  // Update the form when the user changes an input.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Send the wellness check to the backend.
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/wellness-checks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            adultsPresent: Number(formData.adultsPresent),
            childrenPresent: Number(formData.childrenPresent),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to create wellness check.");
      }

      await response.json();

      setMessage("Wellness check recorded successfully.");

      // Clear the form after successful submission.
      setFormData({
        resident: "",
        status: "Present",
        adultsPresent: 0,
        childrenPresent: 0,
        comments: "",
        staffName: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <h2>Record Wellness Check</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resident">Resident:</label>

          <select
            id="resident"
            name="resident"
            value={formData.resident}
            onChange={handleChange}
            required
          >
            <option value="">Select Resident</option>

            {residents.map((resident) => (
              <option key={resident._id} value={resident._id}>
                Unit {resident.unitNumber} - {resident.clientName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status">Status:</label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        <div>
          <label htmlFor="adultsPresent">Adults Present:</label>

          <input
            id="adultsPresent"
            name="adultsPresent"
            type="number"
            min="0"
            value={formData.adultsPresent}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="childrenPresent">Children Present:</label>

          <input
            id="childrenPresent"
            name="childrenPresent"
            type="number"
            min="0"
            value={formData.childrenPresent}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="comments">Comments:</label>

          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="staffName">Staff Name:</label>

          <input
            id="staffName"
            name="staffName"
            type="text"
            value={formData.staffName}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Record Wellness Check</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

export default WellnessCheckForm;