import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeResult from "../../components/NodeTypes/NodeResult";
import NodeModal from "./NodeModal";
import { createPortal } from "react-dom";

function ChatbotNode({ data, isConnectable, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ marginTop: "1.24rem" }}
      />
      <div
        onDoubleClick={() => {
          setIsModalOpen(true);
        }}
      >
        <NodeResult
          traffic={data.traffic}
          name={data.name}
          convertedTraffic={data.convertedTraffic}
          label={data.label}
        />
        <img
          src="/static/icons/sidebar/blue/objects-chatbot.png"
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
        style={{ background: "green", marginTop: "1.24rem" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no_handle"
        isConnectable={isConnectable}
        style={{ background: "red" }}
      />
    </div>
  );
}

export default ChatbotNode;
