import { Input } from "antd";
import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";

const Group: TComponent<any, any> = ({ node, graph }) => {
  const data = node.getData() as IStencilData<any, any>;
  return <div className={style.container}>{data.input.title}</div>;
};

Group.group = "分组组件";
Group.shape = "group";

Group.size = [300, 300];

Group.thumnail = <div className={style.thumnail}>分组组件</div>;

Group.data = {
  status: "pending",
  input: {
    title: "组1",
  },
  parent: true,
};

Group.ports = PortTemplate.empty;

export default Group;
