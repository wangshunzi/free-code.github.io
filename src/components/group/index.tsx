import { Button, Input } from "antd";
import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import { useEffect, useRef, useState } from "react";

const Group: TComponent<any, any> = ({ node, graph }) => {
  const [open, setOpen] = useState(true);
  const originSizeRef = useRef(node.getSize());
  const rememberRef = useRef(open);

  useEffect(() => {
    graph.on("node:change:size", () => {
      if (rememberRef.current) {
        originSizeRef.current = node.getSize();
      }
    });
    return () => {
      graph.off("node:change:size");
    };
  }, []);

  const data = node.getData() as IStencilData<any, any>;
  if (!open) {
    const cells = node.getChildren();
    cells?.forEach((c) => c.hide());
    node.resize(200, 50);
  } else {
    const cells = node.getChildren();
    cells?.forEach((c) => c.show());
    const { width, height } = originSizeRef.current;
    node.resize(width, height);
  }
  return (
    <div className={style.container}>
      {data.input.title}
      <Button
        onClick={() => {
          rememberRef.current = !open;
          setOpen(!open);
        }}
      >
        {open ? "收起" : "展开"}
      </Button>
    </div>
  );
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
