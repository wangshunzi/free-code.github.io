import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import StatusWrapper from "../common/statusWrapper";
import style from "./index.less";
import { Button, Form, Input, Radio, Space, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useRef } from "react";

const PlaceholderThumnail = (content: string) => (
  <div className={style.thumnail}>{content}</div>
);

type TApiInput = {
  url: string;
  method: "get" | "post" | "delete";
  headers: {
    [key: string]: string;
  };
  params: {
    [key: number | string]: any;
  };
};

const request = (config: TApiInput) => {
  let { method, url, headers, params } = config;
  const d = method == "get" ? { params } : { data: params };
  return axios.request({
    url,
    method,
    ...d,
    headers,
  });
};

const Api: TComponent<TApiInput, any> = ({ node, graph }) => {
  const data = node.getData() as IStencilData<TApiInput, any>;
  const [form] = Form.useForm();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let url = data.input?.url;
    let method = data.input?.method;
    let params: any = data.input?.params;
    try {
      params = JSON.stringify(params, null, 4);
    } catch {
      params = data.input?.params;
    }
    let headers: any = [];
    try {
      Object.entries(data.input?.headers || {}).forEach(([k, v]) => {
        headers.push({ key: k, value: v });
      });
    } catch {
      headers = [];
    }
    form.setFieldsValue({
      url,
      method,
      params,
      headers,
    });
  }, [data]);

  return (
    <StatusWrapper status={data.status} node={node} graph={graph}>
      <div className={style.container}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onValuesChange={(_, values) => {
            const update = () => {
              values.headers = values.headers.map((kv: any) => {
                if (!kv) {
                  return { key: "", value: "" };
                }
                return kv;
              });

              let params,
                headers: any = {};
              try {
                values.headers.forEach(({ key, value }: any) => {
                  headers[key] = value;
                });
                params = JSON.parse(values.params);
                if (params) {
                  node.setData(
                    {
                      status: data.status,
                      output: data.output,
                      input: {
                        ...values,
                        params,
                        headers,
                      },
                    },
                    {
                      overwrite: true,
                    }
                  );
                }
              } catch {}
            };
            if ("params" in _) {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              timerRef.current = setTimeout(update, 1000);
            } else {
              update();
            }
          }}
          autoComplete="off"
        >
          <Form.Item label="URL" name={"url"}>
            <Input placeholder="请输入请求地址" />
          </Form.Item>

          <Form.Item label="方法" name={"method"}>
            <Radio.Group>
              <Space size={8}>
                <Radio value="get">GET</Radio>
                <Radio value="post">POST</Radio>
                <Radio value="put">PUT</Radio>
                <Radio value="delete">DELETE</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="请求头">
            <Form.List name={["headers"]}>
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
                      <Form.Item
                        noStyle
                        name={[subField.name, "key"]}
                        initialValue={""}
                      >
                        <Input placeholder="key" style={{ width: "80px" }} />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[subField.name, "value"]}
                        initialValue={""}
                      >
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

          <Form.Item label="数据" name={"params"}>
            <Input.TextArea
              placeholder="请输入请求参数"
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </div>
    </StatusWrapper>
  );
};

Api.group = "业务组件";
Api.shape = "api";

Api.size = [420, 420];

Api.thumnail = PlaceholderThumnail("接口组件");

Api.executor = (input, extra) => {
  return new Promise((resolve, reject) => {
    request(input).then((res) => {
      if (res.status == 200) {
        resolve(res.data);
      } else {
        message.error("网络请求错误");
        reject(res.statusText);
      }
    });
  });
};

Api.data = {
  status: "pending",
  input: {
    url: "https://pre-api.welltop.tech",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    params: {},
  },
  output: {},
};

Api.ports = PortTemplate.full;

export default Api;
