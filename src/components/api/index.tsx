import { PortTemplate, GraphBaseComponent } from "@/free-lib";
import { IStencilData, TPorts } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import { ReactNode } from "react";
import style from "./index.less";
import { Button, Form, Input, Radio, Select, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const PlaceholderThumnail = (content: string) => (
  <div className={style.thumnail}>{content}</div>
);

class Api extends GraphBaseComponent {
  static group: string = "通用组件";
  static shape: string = "api";
  static size: [number, number] = [400, 400];
  static thumnail: ReactNode = PlaceholderThumnail("接口组件");
  static executor?:
    | ((input: any, extra?: { [key: string]: any }) => Promise<any>)
    | undefined = (input, extra) => {
    // if (extra?.handler) {
    //   return Promise.resolve(extra.handler(input));
    // }
    // return Promise.resolve(input);
    return Promise.resolve();
  };
  static ports?: TPorts = PortTemplate.full;
  static data?: IStencilData<any, any> | undefined = {
    status: "pending",
    input: {
      url: "http://pre-api.welltop.cn",
      method: "get",
      header: [
        {
          key: "token",
          value: "123123",
        },
      ],
      param: "{}",
    },
    output: {},
  };

  componentDidMount(): void {}
  render() {
    const { node, graph } = this.props;
    const data = node.getData() as IStencilData<any, any>;
    return (
      <StatusWrapper status={data.status}>
        <div className={style.container}>
          <Form
            key={JSON.stringify(data.input)}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onValuesChange={(_, values) => {
              console.log("values", values);
            }}
            name=""
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={data.input}
          >
            <Form.Item label="URL" name={"url"}>
              <Input placeholder="请输入请求地址" />
            </Form.Item>

            <Form.Item label="方法" name={"method"}>
              <Radio.Group>
                <Space size={16}>
                  <Radio value="get">GET</Radio>
                  <Radio value="post">POST</Radio>
                  <Radio value="delete">DELETE</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="请求头">
              <Form.List name={["header"]}>
                {(subFields, subOpt) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 16,
                    }}
                  >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item noStyle name={[subField.name, "key"]}>
                          <Input placeholder="key" style={{ width: "80px" }} />
                        </Form.Item>
                        <Form.Item noStyle name={[subField.name, "value"]}>
                          <Input placeholder="value" className={"header-v"} />
                        </Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => subOpt.add()} block>
                      添加请求头
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item label="数据" name={"param"}>
              <Input.TextArea
                placeholder="请输入请求参数"
                autoSize={{ minRows: 6, maxRows: 6 }}
              />
            </Form.Item>
          </Form>
        </div>
      </StatusWrapper>
    );
  }
}

export default Api;
