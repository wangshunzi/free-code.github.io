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
  state = {
    content: "",
    check: true,
  };
  componentDidMount(): void {
    const { node } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    const code = data.extra?.code;
    this.setState({
      content: code,
    });
    try {
      const f = new Function("input", code);
      node.setData({
        extra: {
          handler: f,
          code: code,
        },
      });
    } catch {
      message.error("函数实现语法有误，请检查");
    }
  }
  render() {
    const { node, graph } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status} node={node} graph={graph}>
        <div className={style.code}>
          <div className={style.fixed}>{"(input: any) => {"}</div>
          <Input.TextArea
            onBlur={(e) => {
              const value = this.state.content;
              const _b_code = js_beautify(value, {
                indent_size: 2,
                space_in_empty_paren: true,
                // 其他配置项...
              });
              this.setState({
                content: _b_code,
              });
              if (value && value.trim().length > 0) {
                try {
                  const f = new Function("input", value);
                  node.setData({
                    extra: {
                      handler: f,
                      code: _b_code,
                    },
                  });
                } catch {
                  message.error("函数实现语法有误，请检查");
                }
              }
            }}
            onChange={(e) => {
              const code = e.target.value;

              this.setState({
                content: code,
              });
              try {
                const f = new Function("input", code);
                if (f) {
                  this.setState({
                    check: true,
                  });
                }
              } catch {
                this.setState({
                  check: false,
                });
              }
            }}
            value={this.state.content}
            className={style.ta}
            style={
              this.state.check ? { color: "limegreen" } : { color: "tomato" }
            }
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
