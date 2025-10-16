import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeResult from "../../components/NodeTypes/NodeResult";
import NodeModal from "./NodeModal";
import { createPortal } from "react-dom";

function WaitNode({ data, isConnectable, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ marginTop: "0.4rem" }}
      />
      <div
        onDoubleClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div>
          <p
            className="mb-0 text-white text-center"
            style={{
              fontSize: "0.3rem",
              fontWeight: 700,
              position: "relative",
              right: "0rem",
              bottom: "-1.5rem",
            }}
          >
            {data.waitDuration} <br />{" "}
            {data.waitDuration == 1
              ? data.waitType.replace("s", "")
              : data.waitType}
          </p>
        </div>

        <img
          src="/static/icons/sidebar/blue/objects-wait.png"
          alt=""
          style={{ maxHeight: "2rem", minHeight: "2rem" }}
        />

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
        style={{
          background: "green",
          marginTop: "0.4rem",
        }}
      />
    </div>
  );
}

export default WaitNode;
