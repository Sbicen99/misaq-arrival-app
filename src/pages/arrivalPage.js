// src/pages/Arrival.js
import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig"; // Import Firestore configuration
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import logo from "../assets/Misaq_logo.png";
import "../styles/arrivalPage.css";

const Arrival = () => {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });
  const [fullName, setFullName] = useState(""); // Track full name input
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isWednesday, setIsWednesday] = useState(false); // Track if today is Wednesday

  // Get current date and time and format them
  const getDateTime = () => {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    setDateTime({
      date: formattedDate,
      time: formattedTime,
    });

    // Check if today is Wednesday (0 = Sunday, 6 = Saturday)
    setIsWednesday(currentDate.getDay() === 3);
  };

  useEffect(() => {
    getDateTime();
    const interval = setInterval(() => {
      getDateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name!");
      return;
    }

    const arrivalData = {
      fullName,
      arrivalTime: `${dateTime.date} - ${dateTime.time}`,
    };

    try {
      // Add data to Firestore
      const docRef = await addDoc(collection(db, "arrivals"), arrivalData);
      console.log("Document written with ID: ", docRef.id);

      // Show success toast
      setToast({
        show: true,
        message: "Deltagelse bekræftet!",
        type: "success",
      });

      // Optionally, clear input after submission
      setFullName(""); // Reset the name input field
    } catch (e) {
      console.error("Error adding document: ", e);

      // Show error toast
      setToast({
        show: true,
        message: "Fejl ved bekræftelse af deltagelse!",
        type: "error",
      });
    }
  };

  // Prevent numbers from being entered in the fullName input field
  const handleNameChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[0-9]/g, ""); // Remove digits
    setFullName(filteredValue);
  };

  return (
    <div className="bg-gray-100 font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <p>{toast.message}</p>
          <button
            className="absolute top-2 right-2 text-white"
            onClick={() => setToast({ show: false, message: "", type: "" })}
          >
            ✖
          </button>
        </div>
      )}

      <header className="bg-stone-500 text-white relative">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">VELKOMMEN TIL KURSET</h1>
          <p className="text-lg">
            Lad os sammen arbejde for at styrke vores deen, udbrede godhed og
            følge vejen mod Allahs (SWT) tilfredshed!
          </p>
        </div>

        <img
          src={logo}
          alt="Misaq logo"
          className="logo-img absolute top-4 right-4 w-16 h-16"
        />
      </header>

      <section className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg mt-8 w-full max-w-full overflow-x-auto">
        {" "}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              KURSUSDETALJER
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-6">
              <li className="flex items-center whitespace-nowrap">
                <strong className="mr-2">KURSUSNAVN:</strong> Grundlæggende
                islamiske studier
              </li>
              <li className="flex items-center whitespace-nowrap">
                <strong className="mr-2">DATO:</strong> {dateTime.date} -{" "}
                {dateTime.time}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <strong className="mr-2">LOKATION:</strong> Retortvej 38, 2500
                Valby
              </li>
              <li className="flex items-center whitespace-nowrap">
                <strong className="mr-2">TIDSPUNKT:</strong> 18:30 - 21:00
              </li>
            </ul>
            <p className="mt-4 text-gray-600">Husk re-eksamen d. 22. januar</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Er du klar til at melde din ankomst?
        </h2>
        <p className="text-gray-600 mb-6">
          Indtast dit fulde navn for at bekræfte din deltagelse
        </p>

        <form
          className="flex items-center space-x-4 justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Indtast fulde navn"
            value={fullName} // Bind the input value to the state
            onChange={handleNameChange} // Use custom handler to filter numbers
            className="p-3 border border-gray-300 rounded w-96"
            required
          />

          <button
            type="submit"
            className="bg-stone-400 text-white py-3 px-6 rounded-lg shadow-md hover:bg-stone-600 transition"
            //disabled={!isWednesday} // Disable the button if today is not Wednesday
          >
            Bekræft
          </button>
        </form>
      </section>
    </div>
  );
};

export default Arrival;
