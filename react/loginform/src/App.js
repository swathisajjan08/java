import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/loginpage", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.error}`);
      } else {
        alert("Login successful!, after");
        window.location.href = "http://localhost:4000/plantid";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-header text-center fw-bold">Login</div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
