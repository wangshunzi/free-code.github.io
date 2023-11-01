import { Cell, Graph } from "@antv/x6";
import { createGraph } from "./graph";
import { createStencilPane } from "./stencil";
import { executeTaskWithGraph } from "./task";
import { register } from "@antv/x6-react-shape";
import { TComponent, TStencilRegister } from "../type";
import { PortsGroupConfig } from "./commonPorts";
import Group from "@/components/group";

export class FreeClient {
  private graph: Graph;
  private stencilRegister?: TStencilRegister;

  constructor(
    stencilContainer: HTMLDivElement,
    graphContainer: HTMLDivElement
  ) {
    this.graph = createGraph(graphContainer);
    createStencilPane(
      stencilContainer,
      this.graph,
      ({ register }) => (this.stencilRegister = register)
    );
  }

  toJSON(): {
    cells: Cell.Properties[];
  } {
    return this.graph.toJSON();
  }
  fromJSON(data: { cells: Cell.Properties[] }) {
    this.graph.fromJSON(data);
  }

  redo() {
    this.graph.redo();
  }
  undo() {
    this.graph.undo();
  }

  center() {
    this.graph.center();
  }

  run() {
    const lib = this.stencilRegister?.lib;
    if (!lib) return;
    
    executeTaskWithGraph(this.graph, lib);
  }

  stop() {
    // 所有执行状态的直属后续节点，改为停止态
    this.graph.getNodes().forEach((n) => {
      const data = n.getData();
      if (data.status === "processing") {
        const outEdges = this.graph.getOutgoingEdges(n);
        outEdges?.forEach((edge) => {
          this.graph.getCellById((edge.target as any).cell).setData({
            status: "stop",
          });
        });
      }
    });
  }

  private _getCellsGroupRect = (cells: Cell[]) => {
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0;
    const padding = 16;
    cells.forEach((c) => {
      if (c.isNode() && c.shape !== "group") {
        let bbox = c.getBBox();
        if (minX == 0 || minX > bbox.x) {
          minX = bbox.x;
        }
        if (maxX == 0 || maxX < bbox.right) {
          maxX = bbox.right;
        }
        if (minY == 0 || minY > bbox.top) {
          minY = bbox.top;
        }
        if (maxY == 0 || maxY < bbox.bottom) {
          maxY = bbox.bottom;
        }
      }
    });
    return {
      position: { x: minX - padding, y: minY - 50 - padding },
      size: {
        width: maxX - minX + 2 * padding,
        height: maxY - minY + 2 * padding + 50,
      },
    };
  };

  addSelectToGroup() {
    if (this.graph.isSelectionEmpty()) {
      return;
    }

    let cells: Cell[] = this.graph.getSelectedCells().filter((c) => {
      return c.isNode() && c.shape !== "group";
    });
    const rect = this._getCellsGroupRect(cells);
    if (cells.length == 0) return;
    const groupNode = this.graph.addNode({
      shape: "group",
      data: Group.data,
      x: rect.position.x,
      y: rect.position.y,
      width: rect.size.width,
      height: rect.size.height,
    });
    groupNode.toFront();
    cells.forEach((c) => {
      c.toFront();
      groupNode.addChild(c);
    });
    this.graph.cleanSelection();
    this.graph.getNodes().forEach((n) => {
      if (n.shape === "group" && (!n.children || n.children.length == 0)) {
        this.graph.removeNode(n);
      }
      if (n.shape === "group" && n.children && n.children.length > 0) {
        n.prop(this._getCellsGroupRect(n.children));
      }
    });
  }

  onHistoryChange(cb?: (canRedo: boolean, canUndo: boolean) => void) {
    this.graph.on("history:change", () => {
      cb?.(this.graph.canRedo(), this.graph.canUndo());
    });
  }

  registerComponent(component: TComponent<any, any>) {
    const {
      shape,
      size: [width, height],
    } = component;
    register({
      shape,
      width,
      height,
      component,
      ports: PortsGroupConfig,
    });

    const stencilCheck = (_c: TComponent<any, any>) => {
      if (this.stencilRegister) {
        this.stencilRegister(_c);
      } else {
        setTimeout(() => {
          stencilCheck(_c);
        }, 100);
      }
    };
    stencilCheck(component);
  }
  registerComponents(components: TComponent<any, any>[]) {
    components.forEach((c) => {
      this.registerComponent(c);
    });
  }
}
