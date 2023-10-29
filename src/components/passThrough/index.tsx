import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import { Typography } from "antd";
const { Paragraph } = Typography;
const PassThrough: TComponent<any, any> = ({ node, graph }) => {
  const data = node.getData() as IStencilData<any, any>;
  return (
    <StatusWrapper status={data.status} node={node} graph={graph}>
      <div className={style.container}>
        {data.input != undefined ? (
          <Paragraph copyable>{JSON.stringify(data.input, null, 4)}</Paragraph>
        ) : (
          <span>暂无内容</span>
        )}
      </div>
    </StatusWrapper>
  );
};

PassThrough.shape = "pass";
PassThrough.group = "通用组件";
PassThrough.size = [200, 180];
PassThrough.executor = (input) => Promise.resolve(input);
PassThrough.thumnail = <div className={style.thumnail}>透传组件</div>;

PassThrough.data = {
  status: "pending",
  overwriteInput: true,
};

PassThrough.ports = PortTemplate.full;

export default PassThrough;
