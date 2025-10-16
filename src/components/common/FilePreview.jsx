import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function FilePreview({ url, loading = false, overwiteIsImage = undefined }) {
  const [fileUrl, setfileUrl] = useState(url);
  const [fileExtension, setfileExtension] = useState("Other");
  const [fileName, setfileName] = useState("File Name");
  const [showOverlay, setshowOverlay] = useState(false);
  const dialogId = "_" + uuidv4().slice(0, 4);

  useEffect(() => {
    const urlSplit = fileUrl.split("/");
    if (urlSplit.length > 1) {
      const tempFileName = urlSplit[urlSplit.length - 1];
      setfileName(tempFileName);
      const fileNameSplit = tempFileName.split(".");
      setfileExtension(fileNameSplit[fileNameSplit.length - 1]);
    }
  }, [url]);

  const isImage = (ext) => {
    return overwiteIsImage == undefined ? ["png", "jpg", "jpeg", "gif", "svg"].includes(ext.toLowerCase()) : overwiteIsImage;
  };

  return (
    <>
      <div
        className="card cp col"
        style={{ minHeight: "7rem", maxHeight: "7rem", minWidth: "7rem", maxWidth: "7rem" }}
        onMouseEnter={() => {
          setshowOverlay(true);
        }}
        onMouseLeave={() => {
          setshowOverlay(false);
        }}
      >
        {isImage(fileExtension) ? (
          <img src={fileUrl} alt="file preview" download/>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "7rem" }}>
            <p className="body3">{fileName.length < 7 ? fileName : fileName.slice(0, 6) + "..."}</p>
            <p className="text-secondary mb-0">{fileExtension.toUpperCase()}</p>
          </div>
        )}

        {(showOverlay || loading === true) && (
          <div
            className="p-2 d-flex align-items-center justify-content-center"
            style={{ position: "absolute", left: "0rem", bottom: "0px", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            {loading === true ? (
              <>
                <div class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </>
            ) : (
              <>
                <i class="bi bi-eye cp text-white" style={{ fontSize: "1rem" }} data-bs-toggle="modal" data-bs-target={`#${dialogId}`}></i>
                {/* <i class="bi bi-trash3-fill cp text-danger" style={{ fontSize: "1rem", marginLeft: "1rem" }}></i> */}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <div className="modal fade" id={dialogId} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ width: "60%",height:"150px", margin: "0 auto" }}>
            
              <img src={isImage(fileExtension) ? fileUrl : "/static/icons/file_pdf.png"} alt="file preview" style={{width:"100px", height: "100px", margin: "0 auto"}} />
              <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "6rem" }}>
              <p className="body3">{isImage(fileExtension) ? "" : fileName}</p>
              <p className="text-secondary mb-0">{isImage(fileExtension) ? "" : fileExtension.toUpperCase()}</p>
            </div>
           
            <div
              className="p-2 d-flex align-items-center justify-content-center"
              style={{ position: "absolute", bottom: "0px", width: "100%", backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              <a href={fileUrl} download>
              <i class="bi bi-download cp text-white" style={{ fontSize: "1.2rem" }}></i>
               </a>

              {/* {loading !== true && <i class="bi bi-trash3-fill cp text-danger" style={{ fontSize: "1.2rem", marginLeft: "1.4rem" }}></i>} */}
              {loading === true && (
                <div class="spinner-border spinner-border-sm text-light" role="status" style={{ marginLeft: "1.4rem" }}>
                  <span class="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilePreview;
