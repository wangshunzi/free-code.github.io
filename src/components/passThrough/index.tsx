import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import { js_beautify } from "js-beautify";

const printInput = (data: any) => {
  switch (typeof data) {
    case "number":
    case "bigint":
    case "boolean":
    case "undefined":
      return `${data}`;
    case "string":
      return `"${data}"`;
    case "object": {
      const kv_list = Object.entries(data);
      const kv_str: string = kv_list
        .map(([key, value]) => {
          return `${key}: ${printInput(value)}`;
        })
        .join(",\n");
      const str = `{
 ${kv_str}
}`;
      return str;
    }
    case "function":
      return data.toString();
    case "symbol":
      return "syambol";
  }
};

const PassThrough: TComponent<any, any> = ({ node, graph }) => {
  const data = node.getData() as IStencilData<any, any>;

  return (
    <StatusWrapper status={data.status} node={node} graph={graph}>
      <div className={style.container}>
        {data.input != undefined ? (
          <div className={style.container}>
            <div className={style.item}>
              数据类型: <span className={style.value}>{typeof data.input}</span>
            </div>
            <div className={style.item}>
              数据内容:
              <div className={style.value}>
                {js_beautify(printInput(data.input), {
                  indent_size: 2,
                  space_in_empty_paren: true,
                  // 其他配置项...
                })}
              </div>
            </div>
          </div>
        ) : (
          <span className={style.empty}>暂无内容</span>
        )}
      </div>
    </StatusWrapper>
  );
};

PassThrough.shape = "pass";
PassThrough.group = "通用工具";
PassThrough.size = [200, 180];
PassThrough.executor = (input) => Promise.resolve(input);
PassThrough.thumnail = <div className={style.thumnail}>透传组件</div>;

PassThrough.data = {
  status: "pending",
  overwriteInput: true,
};

PassThrough.ports = PortTemplate.full;

export default PassThrough;
