import { IStencilStatus } from "../../free-lib/type";

interface IStatusWrapper {
  children?: React.ReactNode;
  status: IStencilStatus;
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

const StatusWrapper: React.FC<IStatusWrapper> = ({ children, status }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        ..._styleMap[status],
      }}
    >
      {children}
    </div>
  );
};

export default StatusWrapper;
