import { PortTemplate, GraphBaseComponent } from "@/free-lib";
import { IStencilData, TPorts } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import { ReactNode } from "react";
import style from "./index.less";
import { Input, message } from "antd";
import { js_beautify } from "js-beautify";

const PlaceholderThumnail = (content: string) => (
  <div className={style.thumnail}>{content}</div>
);

class Args extends GraphBaseComponent {
  static group: string = "通用工具";
  static shape: string = "args";
  static size: [number, number] = [300, 300];
  static thumnail: ReactNode = PlaceholderThumnail("参数组件");
  static executor?:
    | ((input: any, extra?: { [key: string]: any }) => Promise<any>)
    | undefined = (input, extra) => {
    return Promise.resolve(input);
  };
  static ports?: TPorts = PortTemplate.onlyOutput;
  state = {
    content: "",
  };
  componentDidMount(): void {
    const { node } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    const code = data.extra?.code;
    this.setState({
      content: code,
    });
    let d;
    try {
      d = eval(`
      (function () {
        return ${code}
      })()
      `);
    } catch (e) {
      d = code;
    }
    node.setData({
      input: d,
    });
  }
  render() {
    const { node, graph } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status} node={node} graph={graph}>
        <div className={style.code}>
          <Input.TextArea
            onBlur={(e) => {
              let value = e.target.value;
              value = js_beautify(value, {
                indent_size: 2,
                space_in_empty_paren: true,
                // 其他配置项...
              });
              this.setState({
                content: value,
              });
              let d;
              try {
                d = eval(`
                (function () {
                  return ${value}
                })()
                `);
              } catch (e) {
                d = value;
              }
              node.setData(
                {
                  ...data,
                  input: d,
                  extra: {
                    code: value,
                  },
                  output: undefined,
                },
                { overwrite: true }
              );
            }}
            className={style.ta}
            bordered={false}
            placeholder="请输入流转参数..."
            value={this.state.content}
            onChange={(e) => {
              this.setState({
                content: e.target.value,
              });
            }}
          />
        </div>
      </StatusWrapper>
    );
  }
}

export default Args;
