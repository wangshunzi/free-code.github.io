import { PortTemplate, GraphBaseComponent } from "@/free-lib";
import { IStencilData, TPorts } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import { ReactNode } from "react";
import style from "./index.less";
import { Input } from "antd";

const PlaceholderThumnail = (content: string) => (
  <div className={style.thumnail}>{content}</div>
);

class Args extends GraphBaseComponent {
  static group: string = "通用组件";
  static shape: string = "args";
  static size: [number, number] = [300, 300];
  static thumnail: ReactNode = PlaceholderThumnail("参数组件");
  static executor?:
    | ((input: any, extra?: { [key: string]: any }) => Promise<any>)
    | undefined = (input, extra) => {
    return Promise.resolve(input);
  };
  static ports?: TPorts = PortTemplate.onlyOutput;

  componentDidMount(): void {}
  render() {
    const { node } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status}>
        <div className={style.code}>
          <Input.TextArea
            onBlur={(e) => {
              const value = e.target.value;
              let d;
              try {
                d = JSON.parse(value);
              } catch (e) {
                d = value;
              }
              node.setData({
                input: d,
              });
            }}
            className={style.ta}
            bordered={false}
            placeholder="请输入流转参数..."
          />
        </div>
      </StatusWrapper>
    );
  }
}

export default Args;
