import { PortTemplate, GraphBaseComponent } from "@/free-lib";
import { IStencilData, TPorts } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import { ReactNode } from "react";

const PlaceholderThumnail = (content: string) => (
  <div
    style={{
      width: "100px",
      height: "100px",
      background: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#333",
    }}
  >
    {content}
  </div>
);

class Transformer extends GraphBaseComponent {
  static shape: string = "transformer";
  static size: [number, number] = [200, 200];
  static thumnail: ReactNode = PlaceholderThumnail("转换器");
  static executor?: ((input: any) => Promise<any>) | undefined = (input) => {
    return Promise.resolve(JSON.stringify(input) + "xxx");
  };
  static ports?: TPorts = PortTemplate.full;

  componentDidMount(): void {}
  render() {
    const { node, graph } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status}>
        <div
          style={{
            padding: "8px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          输入：{JSON.stringify(data.input)}
          输出：{JSON.stringify(data.output)}
        </div>
      </StatusWrapper>
    );
  }
}

export default Transformer;
