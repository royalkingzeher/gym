import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/users/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="user-details">
          <h1>Welcome to the Dashboard</h1>
          {userData && (
            <div className="user-info">
              <p>Username: {userData.username}</p>
              <p>Type: {userData.type}</p>
              {/* Display other user details here if needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;