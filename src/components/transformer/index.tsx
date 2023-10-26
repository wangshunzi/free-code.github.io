import { PortTemplate, GraphBaseComponent } from "@/free-lib";
import { IStencilData, TPorts } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import { ReactNode } from "react";
import style from "./index.less";
import { Input } from "antd";

const PlaceholderThumnail = (content: string) => (
  <div className={style.thumnail}>{content}</div>
);

class Transformer extends GraphBaseComponent {
  static group: string = "通用组件";
  static shape: string = "transformer";
  static size: [number, number] = [300, 300];
  static thumnail: ReactNode = PlaceholderThumnail("转换器");
  static executor?:
    | ((input: any, extra?: { [key: string]: any }) => Promise<any>)
    | undefined = (input, extra) => {
    if (extra?.handler) {
      return Promise.resolve(extra.handler(input));
    }
    return Promise.resolve(input);
  };
  static ports?: TPorts = PortTemplate.full;

  componentDidMount(): void {}
  render() {
    const { node, graph } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status}>
        <div className={style.code}>
          <div className={style.fixed}>{"(input: any) => {"}</div>
          <Input.TextArea
            onBlur={(e) => {
              const value = e.target.value;
              if (value && value.trim().length > 0) {
                node.setData({
                  extra: {
                    handler: new Function("input", value),
                  },
                });
              }
            }}
            className={style.ta}
            bordered={false}
            placeholder="请输入转换逻辑..."
          />
          <div className={style.fixed}>{"}"}</div>
        </div>
      </StatusWrapper>
    );
  }
}

export default Transformer;
