import React, { useState } from "react";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";




function ImageComponent({image,handleImage,handleDelete}) {

  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleImageChange = (event) => {
          if (event.target.files.length !== 0) {
            handleImage(event.target.files[0]);
          }
        setShowModal(false);

  };

  const handleDeleteImage = () => {
    handleDelete()
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }         

  return (
    <div>
      <img
        style={{ cursor: "pointer" }}
        src={image}
        onClick={handleImageClick}
        alt="logo"
        width={"85px"}
        height={"90px"}
        className="rounded-circle"
      />
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <input type="file" onChange={handleImageChange} />
              </div>
              <div className="modal-footer">
                <button
                  style={{ cursor: "pointer" }}
                  type="button"
                  className="btn btn-danger"
                  disabled={image == " /static/icons/logo.svg"}
                  onClick={handleDeleteImage}
                >
                  Delete Image
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageComponent;
