import { useCallback, useRef } from "react";
import { Handle, Position } from "reactflow";

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log("TextUpdaterNode onChange");
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          defaultValue={data.value}
          onChange={onChange}
          className="nodrag"
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes_handle"
        isConnectable={isConnectable}
        style={{ left: 10, background: "green" }}
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

export default TextUpdaterNode;
