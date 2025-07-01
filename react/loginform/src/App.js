import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("login"); 
  const [plantId, setPlantId] = useState("");
  const [plantData, setPlantData] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://loginbackend-2uec.onrender.com/loginpage", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.error}`);
      } else {
        alert("Login successful!");
        setPage("plant"); // go to plant fetch page
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFetchPlant = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`https://loginbackend-2uec.onrender.com/plantid?id=${plantId}`);
      const data = await response.json();

      if (!response.ok) {
        alert("plant not found");
        setPlantData(null);
      } else {
        setPlantData(data);
      }
    } catch (error) {
      console.error("Fetch error", error);

      setPlantData(null);
    }
  };

  if (page === "plant") {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header text-center fw-bold">Fetch Plant Info</div>
                <div className="card-body">
                  <form onSubmit={handleFetchPlant}>
                    <div className="mb-3">
                      <label className="form-label">Enter Plant ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={plantId}
                        onChange={(event) => setPlantId(event.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-info w-100">Fetch</button>
                  </form>

                  {plantData && (
                    <div className="mt-4">
                      <h5>Plant Info:</h5>
                      <pre className="bg-white p-3 border rounded">{JSON.stringify(plantData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login page
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