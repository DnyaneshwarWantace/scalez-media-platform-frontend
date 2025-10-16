import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeModal from "./NodeModal";
import { createPortal } from "react-dom";

function camelToSentence(camelCase) {
  // Use a regular expression to split camelCase string into words
  const wordsArray = camelCase.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join with spaces
  const sentence = wordsArray
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return sentence;
}

const getIconName = (socialName) => {
  console.log(socialName);
  switch (socialName) {
    case "Facebook":
      return "facebook.svg";
    case "Google":
      return "google.svg";
    case "Bing":
      return "bing.svg";
    default:
      return "facebook.svg";
  }
};

function TrafficEntry({ data, isConnectable, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div
        onDoubleClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div style={{ position: "relative", left: 10, bottom: "3px" }}>
          <div className="flex items-center border ps-1">
            <i
              className="fa-solid fa-user"
              style={{
                maxWidth: "0.3rem",
                width: "0.1rem",
                fontSize: "0.5rem",
                marginRight: "0.5rem",
                marginTop: "0.2rem",
                marginBottom: "0.2rem",
              }}
            ></i>

            <p className="mb-0" style={{ fontSize: "0.3rem" }}>
              {data.traffic}
            </p>
          </div>
        </div>

        <div className="p-1 ps-2 pe-2 border rounded flex items-center justify-center">
          {data?.trafficSources?.map((singleSouce, idx) => {
            return (
              <div key={idx}>
                <img
                  src={`/static/socialIcons/${getIconName(
                    singleSouce.trafficSource
                  )}`}
                  alt=""
                  style={{
                    maxHeight: "1rem",
                    minHeight: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
              </div>
            );
          })}

          {data?.trafficSources?.length == 0 && (
            <p style={{ fontSize: "8px" }} className="text-gray-500 mb-0">
              No Traffic Sources
            </p>
          )}
        </div>

        {createPortal(
          <NodeModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            data={data}
            nodeId={id}
          />,
          document.body
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="yes_handle"
        isConnectable={isConnectable}
        style={{ background: "green" }}
      />
    </div>
  );
}

export default TrafficEntry;
