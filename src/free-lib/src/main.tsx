import { Cell, Graph } from "@antv/x6";
import { createGraph } from "./graph";
import { createStencilPane } from "./stencil";
import { executeTaskWithGraph } from "./task";
import { register } from "@antv/x6-react-shape";
import { TComponent, TStencilRegister } from "../type";
import { PortsGroupConfig } from "./commonPorts";

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
  execute() {
    const lib = this.stencilRegister?.lib;
    if (!lib) return;
    executeTaskWithGraph(this.graph, lib);
  }
}
