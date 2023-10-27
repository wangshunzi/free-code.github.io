import { Cell, Graph } from "@antv/x6";
import { TComponent } from "../type";

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
  if (_info.executor) {
    _info
      .executor(cell.data.input, cell.data.extra)
      .then((res: any) => {
        cell.setData({ status: "success", output: res });
        // 将结果，塞入next的input, 并执行下个后续节点
        if (node.next && node.next.length > 0) {
          node.next.forEach((n: Cell.Properties) => {
            const nc = graph.getCellById(n.id!);
            // 防止循环执行
            const nextData = nc.getData();
            if (nextData.status !== "pending") return;
            // 重写 还是 merge
            if (nextData.overwriteInput) {
              nc.setData({ ...nextData, input: res }, { overwrite: true });
            } else {
              nc.setData({ input: res });
            }
            doNode(n, graph, lib);
          });
        }
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
  const cells = graph.toJSON().cells;
  const _targetIDs: string[] = [];
  cells
    .filter((c) => c.shape == "edge")
    .forEach((c) => {
      const sourceID = c.source.cell;
      const targetID = c.target.cell;
      const source = cells.find((c) => c.id == sourceID);
      const target = cells.find((c) => c.id == targetID);
      if (!source || !target) return;
      _targetIDs.push(targetID);
      if (!source.next) {
        source.next = [target];
      } else {
        source.next.push(target);
      }
    });

  // 重置节点运行状态
  cells
    .filter((c) => c.shape !== "edge")
    .forEach((c) => {
      const cell = graph.getCellById(c.id!);
      cell.setData({ status: "pending" });
    });
  // 找到所有的起始点，开始执行
  const startNodes = cells.filter(
    (c) => c.shape !== "edge" && !_targetIDs.includes(c.id!)
  );

  startNodes.forEach((n) => doNode(n, graph, lib));
};
