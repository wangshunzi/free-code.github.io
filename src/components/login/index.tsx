import { Input } from "antd";
import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { login } from "./api";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
type TInput = {
  email: string;
  password: string;
};
type TOutput = {
  name: string;
  token: string;
  role: string;
};

const Login: TComponent<TInput, TOutput> = ({ node, graph }) => {
  // console.log("----", node, graph);
  const data = node.getData() as IStencilData<TInput, TOutput>;
  return (
    <StatusWrapper status={data.status} node={node} graph={graph}>
      <div className={style.login}>
        <div className={style.title}>登录</div>
        <Input
          placeholder="请输入账号"
          style={{ width: "100%" }}
          value={data.input?.email}
          onChange={(e) => {
            node.setData({
              input: { email: e.target.value },
            });
          }}
        />
        <Input.Password
          placeholder="请输入密码"
          style={{ width: "100%" }}
          value={data.input?.password}
          onChange={(e) => {
            node.setData({
              input: { password: e.target.value },
            });
          }}
        />
      </div>
    </StatusWrapper>
  );
};

Login.group = "业务组件";
Login.shape = "login";

Login.size = [300, 180];

Login.thumnail = <div className={style.thumnail}>登录组件</div>;

Login.executor = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    login(email, password).then((res: any) => {
      console.log("xxxx", res);
      if (res.code === 2000) {
        resolve({
          name: res.data.display_name,
          token: res.data.user_token,
          role: res.data.role,
        });
      } else {
        reject("登录失败");
      }
    });
  });
};

Login.data = {
  status: "pending",
  input: {
    email: "shunzi.wang@welltop.cn",
    password: "4UJH",
  },
};

Login.ports = PortTemplate.onlyOutput;

export default Login;
