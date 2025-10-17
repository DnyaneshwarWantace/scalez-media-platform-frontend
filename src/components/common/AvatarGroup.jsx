import React, { useState } from "react";
import "../../App.css";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

function AvatarGroup({ listOfUrls, show, total, userName, owner}) {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShows = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="flex -space-x-1">
        {listOfUrls?.slice(0, show)?.map((url, index) => {
          const user = userName?.[index];
          const displayName = user ? `${user[0]} ${user[2] || ''}`.trim() : 'Unknown User';

          return (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-background overflow-hidden hover:scale-110 transition-transform relative group"
              title={displayName}
            >
              <img
                src={url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
        {total > show && (
          <div
            className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium border-2 border-background hover:scale-110 transition-transform text-gray-800"
            title={`${total - show} more member${total - show > 1 ? 's' : ''}`}
          >
            +{total - show}
          </div>
        )}
      </div>

      {userName?.length > 5 && showModal && (
        <>
          <div className="modal-backdrop show" />
          <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <h2 className="mb-3">Members</h2>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12">
                        <div className="slider-container">
                          <div className="">
                            <div >
                              <div className="d-flex align-items-center gap-2 p-1">
                                <img
                                  src={`${backendServerBaseURL}/${owner.avatar}`}
                                  width={24}
                                  height={24}
                                  alt="user"
                                />
                                <span>
                                  {owner.firstName} {owner.lastName}
                                  {/* {option[0]} {option[2]} */}
                                </span>
                              </div>
                            </div>
                            {userName?.map((option, i) => (
                              <div key={i}>
                                <div className="d-flex align-items-center gap-2 p-1">
                                  <img
                                    src={option[1]}
                                    width={24}
                                    height={24}
                                    alt="user"
                                  />
                                  <span>
                                    {option[0]} {option[2]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault()(handleModalClose());
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AvatarGroup;
