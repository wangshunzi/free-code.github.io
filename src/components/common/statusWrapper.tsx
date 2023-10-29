import { Graph, Node } from "@antv/x6";
import { IStencilData, IStencilStatus } from "../../free-lib/type";
import { Switch } from "antd";

interface IStatusWrapper {
  children?: React.ReactNode;
  status: IStencilStatus;
  node: Node;
  graph: Graph;
}

const _styleMap: {
  [key in IStencilStatus]: React.CSSProperties;
} = {
  pending: {
    border: "2px solid grey",
    boxShadow: "0 0 12px 0 grey",
  },
  processing: {
    border: "2px solid cyan",
    boxShadow: "0 0 12px 0  cyan",
  },
  success: {
    border: "2px solid green",
    boxShadow: "0 0 12px 0  green",
  },
  failed: {
    border: "2px solid red",
    boxShadow: "0 0 12px 0  red",
  },
};

const StatusWrapper: React.FC<IStatusWrapper> = ({
  children,
  status,
  node,
  graph,
}) => {
  const data = node.getData() as IStencilData<any, any>;
  const hasInput = (node as any).port.ports.some((p) => p.group == "input");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        ..._styleMap[status],
      }}
    >
      {hasInput ? (
        <Switch
          size="small"
          checked={data.overwriteInput}
          onChange={(c) => {
            node.setData({
              overwriteInput: c,
            });
          }}
          checkedChildren="覆盖"
          unCheckedChildren="合并"
          style={{
            zIndex: 999,
            position: "absolute",
            top: "4px",
            right: "4px",
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

export default StatusWrapper;
