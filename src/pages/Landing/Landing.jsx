import React from "react";

function Landing() {
  return (
    <>
      <div className="page-body-widthout-sidebar">
        <div className="container">
          <div style={{ minHeight: "70vh" }} className="d-flex align-items-center justify-content-center flex-column">
            <p className="semi-bold-weight body1 text-primary" style={{ marginBottom: "1rem" }}>
              tryignite.io
            </p>
            <h1 style={{ fontSize: "48px", lineHeight: "56px", marginBottom: "1rem" }} className="text-center">
              Make data-driven
              <br />
              decisions, everytime.
            </h1>
            <div style={{ maxWidth: "30vw", marginBottom: "1.3rem" }}>
              <p className="text-center">
                Ignite is a platform that enables data-driven decisions, helping marketers & product managers understand what's working and what isn't
                to further fuel organisational growth
              </p>
            </div>

            <div>
              <div className="hstack gap-2">
                <button className="btn btn-lg btn-primary">Get Started with Ignite</button>
                <button className="btn btn-lg btn-outline-primary">Already a member? Log In</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
