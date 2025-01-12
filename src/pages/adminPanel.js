import React, { useState, useEffect } from "react";
import "../styles/adminPanel.css";
import { db, collection, getDocs } from "../config/firebaseConfig";
import {
  parse,
  format,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  getISOWeek,
} from "date-fns";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Default filter
  const [selectedWeek, setSelectedWeek] = useState(""); // Custom week filter
  const [password, setPassword] = useState(""); // Password state
  const [showTable, setShowTable] = useState(false); // State to control visibility of the table
  const adminPass = process.env.REACT_APP_ADMIN_PAGE_PASSWORD;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const arrivalsRef = collection(db, "arrivals");
        const snapshot = await getDocs(arrivalsRef);
        const usersList = snapshot.docs.map((doc) => doc.data());
        setUsers(usersList);
        setFilteredUsers(usersList); // Set initial filtered users
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Parse and filter data based on the selected filter
  useEffect(() => {
    const now = new Date();
    const parsedUsers = users.map((user) => {
      const parsedDate = parse(
        user.arrivalTime,
        "dd/MM/yyyy - HH:mm",
        new Date()
      );
      return { ...user, parsedDate };
    });

    let filtered = parsedUsers;

    if (filter === "day") {
      filtered = parsedUsers.filter((user) => isSameDay(user.parsedDate, now));
    } else if (filter === "week") {
      filtered = parsedUsers.filter((user) =>
        isSameWeek(user.parsedDate, now, { weekStartsOn: 1 })
      );
    } else if (filter === "month") {
      filtered = parsedUsers.filter((user) =>
        isSameMonth(user.parsedDate, now)
      );
    } else if (filter === "year") {
      filtered = parsedUsers.filter((user) => isSameYear(user.parsedDate, now));
    } else if (filter === "customWeek" && selectedWeek) {
      filtered = parsedUsers.filter(
        (user) => getISOWeek(user.parsedDate) === parseInt(selectedWeek, 10)
      );
    }

    setFilteredUsers(filtered);
  }, [filter, users, selectedWeek]);

  const getButtonClass = (filterType) => {
    // Change color to dark gray when active, light gray by default
    return `btn btn-sm ${
      filter === filterType
        ? "btn-dark-gray text-white" // Active button styling
        : "btn-light-gray"
    }`;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Simple password check (you can modify this with your own validation)
    if (password === adminPass) {
      setShowTable(true); // Show the table if password is correct
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      {/* Password Form */}
      {!showTable && (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="col-md-6">
            <div className="card px-5 py-5" id="form1">
              <div className="form-data">
                <div className="forms-inputs mb-4">
                  <span>Password</span>
                  <input
                    autocomplete="off"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn custom-bg-stone w-100"
                    onClick={handlePasswordSubmit}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Table (Visible after password is correct) */}
      {showTable && (
        <div className="h-screen flex-grow-1 overflow-y-lg-auto">
          <header className="bg-surface-primary border-bottom pt-6">
            <div className="container-fluid">
              <div className="mb-npx">
                <div className="row align-items-center">
                  <div className="col-sm-6 col-12 mb-4 mb-sm-0">
                    <h1 className="h2 mb-5 ls-tight">ADMIN OVERBLIK</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
              <div className="card shadow border-0 mb-7">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">TILMELDTE</h5>
                  {/* Filter Buttons */}
                  <div className="btn-group">
                    <button
                      className={getButtonClass("day")}
                      onClick={() => setFilter("day")}
                    >
                      I DAG
                    </button>
                    <button
                      className={getButtonClass("week")}
                      onClick={() => setFilter("week")}
                    >
                      DENNE UGE
                    </button>
                    <button
                      className={getButtonClass("month")}
                      onClick={() => setFilter("month")}
                    >
                      DENNE MÅNED
                    </button>
                    <button
                      className={getButtonClass("year")}
                      onClick={() => setFilter("year")}
                    >
                      DETTE ÅR
                    </button>
                    <button
                      className={getButtonClass("all")}
                      onClick={() => setFilter("all")}
                    >
                      ALLE
                    </button>
                  </div>
                  {/* Custom Week Filter */}
                  <div className="custom-week-filter ms-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="INDTAST UGE NR."
                      value={selectedWeek}
                      onChange={(e) => {
                        setSelectedWeek(e.target.value);
                        setFilter("customWeek");
                      }}
                    />
                  </div>
                </div>
                <div className="table-responsive">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <table className="table table-hover table-nowrap">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">NAVN</th>
                          <th scope="col">TJEKKET IND</th>
                          <th scope="col">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={index}>
                            <td>
                              <a className="text-heading font-semibold">
                                {user.fullName || "Unknown"}
                              </a>
                            </td>
                            <td>
                              {user.parsedDate
                                ? format(user.parsedDate, "dd/MM/yyyy - HH:mm")
                                : "Not Checked In"}
                            </td>
                            <td>
                              <span className="badge badge-lg badge-dot">
                                <i className="bg-success"></i>AKTIV
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="card-footer border-0 py-5">
                  <span className="text-muted text-sm">
                    ANTAL TILMELDTE: {filteredUsers.length}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;