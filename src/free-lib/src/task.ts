import { Cell, Graph } from "@antv/x6";
import { TComponent } from "../type";
import { message } from "antd";

// const doNode_bak = (
//   node: Cell.Properties,
//   graph: Graph,
//   lib: TComponent<any, any>[]
// ) => {
//   // 修改为运行态
//   const cell = graph.getCellById(node.id!);
//   cell.setData({ status: "processing" });
//   const _info = lib.find((c) => c.shape == node.shape);
//   if (!_info) {
//     console.warn("未找到注册组件: ", node.shape);
//     return;
//   }
//   if (_info.executor) {
//     _info
//       .executor(cell.data.input, cell.data.extra)
//       .then((res: any) => {
//         cell.setData({ status: "success", output: res });
//         // 将结果，塞入next的input, 并执行下个后续节点
//         if (node.next && node.next.length > 0) {
//           node.next.forEach((n: Cell.Properties) => {
//             const nc = graph.getCellById(n.id!);
//             // 防止循环执行
//             const nextData = nc.getData();
//             if (nextData.status !== "pending") return;
//             // 重写 还是 merge
//             if (nextData.overwriteInput) {
//               nc.setData({ ...nextData, input: res }, { overwrite: true });
//             } else {
//               nc.setData({ input: res });
//             }
//             doNode(n, graph, lib);
//           });
//         }
//       })
//       .catch(() => {
//         // 节点运行失败，停止
//         cell.setData({ status: "failed", output: {} });
//       });
//   } else {
//     cell.setData({ status: "success", output: cell.data.input });
//   }
// };

// const executeTaskWithGraph_bak = (
//   graph?: Graph,
//   lib?: TComponent<any, any>[]
// ) => {
//   if (!graph || !lib) return;
//   const cells = graph.toJSON().cells;
//   const _targetIDs: string[] = [];
//   cells
//     .filter((c) => c.shape == "edge")
//     .forEach((c) => {
//       const sourceID = c.source.cell;
//       const targetID = c.target.cell;
//       const source = cells.find((c) => c.id == sourceID);
//       const target = cells.find((c) => c.id == targetID);
//       if (!source || !target) return;
//       _targetIDs.push(targetID);
//       if (!source.next) {
//         source.next = [target];
//       } else {
//         source.next.push(target);
//       }
//     });

//   // 重置节点运行状态
//   cells
//     .filter((c) => c.shape !== "edge")
//     .forEach((c) => {
//       const cell = graph.getCellById(c.id!);
//       cell.setData({ status: "pending" });
//     });
//   // 找到所有的起始点，开始执行
//   const startNodes = cells.filter(
//     (c) => c.shape !== "edge" && !_targetIDs.includes(c.id!)
//   );

//   startNodes.forEach((n) => doNode(n, graph, lib));
// };

const doNode = (
  node: Cell.Properties,
  graph: Graph,
  lib: TComponent<any, any>[]
) => {
  // 修改为运行态
  const cell = graph.getCellById(node.id!);
  cell.setData({ status: "processing" });
  const _info = lib.find((c) => c.shape == node.shape);
  if (!_info) {
    console.warn("未找到注册组件: ", node.shape);
    return;
  }
  // 没有入边, 或者 入边对应的节点都为 success 状态, 才执行当前节点

  if (_info.executor) {
    _info
      .executor(cell.data.input, cell.data.extra)
      .then((res: any) => {
        cell.setData({ status: "success", output: res });
        const nextCells = graph.getOutgoingEdges(cell)?.map((c) => c.target);
        if (!nextCells) return;

        // 将结果,塞入所有下一个cells
        nextCells.forEach((_nc: any) => {
          const nc = graph.getCellById(_nc.cell);
          const nextData = nc.getData();

          if (["processing"].includes(nextData.status)) return;
          // 重写 还是 merge
          if (nextData.overwriteInput) {
            nc.setData({ ...nextData, input: res }, { overwrite: true });
          } else {
            nc.setData({ input: res });
          }
          // 停止态，不执行，但接收前置数据
          if (["stop"].includes(nextData.status)) return;

          // 判断下个cell 是否需要执行(前置节点必须全部success)
          if (
            graph.getIncomingEdges(nc)?.every((edge: any) => {
              const sid = edge.source.cell;
              const _cell = graph.getCellById(sid);
              const scellData = _cell.getData();
              return scellData.status === "success" || _cell.shape === "timer";
            })
          ) {
            try {
              doNode(nc.toJSON(), graph, lib);
            } catch {
              nc.setData({ status: "failed", output: {} });
            }
          }
        });
      })
      .catch(() => {
        // 节点运行失败，停止
        cell.setData({ status: "failed", output: {} });
      });
  } else {
    cell.setData({ status: "success", output: cell.data.input });
  }
};

export const executeTaskWithGraph = (
  graph?: Graph,
  lib?: TComponent<any, any>[]
) => {
  if (!graph || !lib) return;
  if (graph.getNodes().some((n) => n.getData().status == "processing")) {
    message.warning("当前任务正在执行, 请停止后执行");
    return;
  }
  const cells = graph.toJSON().cells;

  const startNodes: Cell.Properties[] = cells.filter((c) => {
    if (c.shape === "edge" || c.shape === "group") return false;
    const cell = graph.getCellById(c.id || "");
    const _info = lib.find((lc) => lc.shape == c.shape);
    if (!_info) {
      console.warn("未找到注册组件: ", c.shape);
      return false;
    }
    const data = _info.data || { status: "pending" };
    const cdata = cell.getData();
    cell.setData(
      {
        ...data,
        input: cdata.input,
        overwriteInput: cdata.overwriteInput,
        extra: cdata.extra,
      },
      { overwrite: true }
    );
    return !graph.getIncomingEdges(c.id || "");
  });

  startNodes.forEach((n) => doNode(n, graph, lib));
};
