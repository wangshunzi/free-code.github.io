import { Graph } from "@antv/x6";
import { Dnd } from "@antv/x6-plugin-dnd";
import { useRef, useState } from "react";

import ReactDOM from "react-dom/client";
import { IDndPane, TComponent, TDndPaneCallback } from "../type";

let _globalRoot: ReactDOM.Root;

const DndPane: React.FC<IDndPane> = ({ graph, callback }) => {
  if (!graph) return null;
  const dndRef = useRef<Dnd>();
  const [components, setComponents] = useState<TComponent<any, any>[]>([]);
  const register = (component: TComponent<any, any>) => {
    setComponents((oldComponents) => {
      if (components.includes(component)) return oldComponents;
      return [...oldComponents, component];
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

  return (
    <div
      ref={(dom) => {
        dndRef.current = new Dnd({
          target: graph,
          scaled: false,
          dndContainer: dom as any,
        });
      }}
      style={{
        position: "absolute",
        left: 0,
        top: "0",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        userSelect: "none",
      }}
    >
      {components.map((c) => {
        return (
          <div
            key={c.shape}
            data-type={c.shape}
            onMouseDown={startDrag}
            style={{
              width: "100px",
              height: "100px",
              cursor: "move",
            }}
          >
            {c.thumnail}
          </div>
        );
      })}
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
