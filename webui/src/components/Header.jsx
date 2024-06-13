import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1>GMS</h1>
        </div>
        <nav>
          {!localStorage.getItem("token") && (
            <button className="btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
          {!localStorage.getItem("token") && (
            <button className="btn">Signup</button>
          )}
          {localStorage.getItem("token") && (
            <button
              className="btn"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
