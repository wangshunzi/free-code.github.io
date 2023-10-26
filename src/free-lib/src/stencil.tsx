import { Graph } from "@antv/x6";
import { Dnd } from "@antv/x6-plugin-dnd";
import { useRef, useState } from "react";
import style from "./style/stencil.less";
import ReactDOM from "react-dom/client";
import { IDndPane, TComponent, TDndPaneCallback } from "../type";
import { Collapse, CollapseProps, Empty, Input } from "antd";

let _globalRoot: ReactDOM.Root;

const DndPane: React.FC<IDndPane> = ({ graph, callback }) => {
  if (!graph) return null;
  const dndRef = useRef<Dnd>();
  const [components, setComponents] = useState<TComponent<any, any>[]>([]);
  const allComponentsRef = useRef<TComponent<any, any>[]>([]);
  const register = (component: TComponent<any, any>) => {
    setComponents((oldComponents) => {
      if (components.includes(component)) return oldComponents;
      const tmp = [...oldComponents, component];
      allComponentsRef.current = tmp;
      return [...tmp];
    });
  };
  register.lib = components;
  callback?.({ register });

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const type = target.getAttribute("data-type");
    if (!graph || !dndRef.current || !type) return;
    const nodeInfo = components.find((c) => c.shape === type);
    if (!nodeInfo) {
      console.warn("未找到该类型对应组件信息");
      return;
    }
    const node = graph.createNode({
      shape: type,
      width: nodeInfo.size[0],
      height: nodeInfo.size[1],
      data: nodeInfo.data,
      ports: nodeInfo.ports,
    });
    dndRef.current.start(node, e.nativeEvent as any);
  };

  const groups = [
    ...new Set(
      components.map((i) => {
        if (!i.group) {
          i.group = "其他";
        }
        return i.group;
      })
    ),
  ];
  const items: CollapseProps["items"] = groups.map((g) => ({
    key: g,
    label: g,
    children: (
      <div className={style.section}>
        {components
          .filter((c) => c.group == g)
          .map((c) => {
            return (
              <div
                key={c.shape}
                data-type={c.shape}
                onMouseDown={startDrag}
                className={style.box}
              >
                {c.thumnail}
              </div>
            );
          })}
      </div>
    ),
  }));
  return (
    <div
      className={style.container}
      ref={(dom) => {
        dndRef.current = new Dnd({
          target: graph,
          scaled: false,
          dndContainer: dom as any,
        });
      }}
    >
      <Input.Search
        placeholder="input shape keywords..."
        allowClear
        onChange={(e) => {
          const key = e.target.value;
          const allComponent = allComponentsRef.current;
          if (!key || key.length == 0) {
          }
          setComponents(allComponent.filter((c) => c.shape.includes(key)));
        }}
        style={{
          width: "calc(100% - 32px)",
          margin: "0 16px 16px 16px",
        }}
      />
      {!components || components.length == 0 ? (
        <Empty description="暂无组件" style={{ marginTop: "48px" }} />
      ) : (
        <Collapse
          items={items}
          bordered={false}
          defaultActiveKey={groups}
          key={groups.join("_")}
        />
      )}
    </div>
  );
};

export const createStencilPane = (
  container: HTMLDivElement,
  graph: Graph,
  callback?: TDndPaneCallback
) => {
  if (!_globalRoot) {
    _globalRoot = ReactDOM.createRoot(container);
  }
  _globalRoot.render(<DndPane graph={graph} callback={callback} />);
};
