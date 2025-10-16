import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeResult from "../../components/NodeTypes/NodeResult";
import NodeModal from "./NodeModal";
import { createPortal } from "react-dom";

function OrderFormPage({ data, isConnectable, id, type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
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
          src="/static/icons/sidebar/blue/objects-order-form-page.png"
          alt=""
          style={{ maxHeight: "6rem", minHeight: "6rem" }}
        />
        {createPortal(
          <NodeModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            data={data}
            nodeId={id}
            type={type}
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

export default OrderFormPage;
