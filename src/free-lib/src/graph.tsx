import { Graph } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { Clipboard } from "@antv/x6-plugin-clipboard";
import { Selection } from "@antv/x6-plugin-selection";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { Transform } from "@antv/x6-plugin-transform";
import { History } from "@antv/x6-plugin-history";

const __bindKeys = (graph: Graph) => {
  graph.bindKey("ctrl+c", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
    return false;
  });

  graph.bindKey("ctrl+x", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.cut(cells);
    }
    return false;
  });

  graph.bindKey("delete", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
    return false;
  });
  graph.bindKey("backspace", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
    return false;
  });

  graph.bindKey("ctrl+v", () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
    return false;
  });
};

const __bindEvent = (graph: Graph) => {
  graph.on("cell:added", ({ cell }) => {
    if (cell.shape === "group") {
      cell.toBack();
    }
  });
  graph.on("cell:click", ({ cell }) => {
    if (cell.isNode() && cell.shape !== "group") {
      cell.toFront();
    }
    if (cell.shape === "group") {
      cell.toFront();
      cell.children?.forEach((c) => {
        c.toFront();
      });
    }
  });

  graph.on("cell:mouseenter", ({ cell }) => {
    if (cell.isEdge()) {
      cell.addTools(["vertices", "segments"]);
    }
  });

  graph.on("cell:mouseleave", ({ cell }) => {
    if (cell.isEdge()) {
      cell.removeTools();
    }
  });

  graph.on("node:change:data", ({ node }) => {
    const edges = graph.getIncomingEdges(node);
    const { status } = node.getData();
    edges?.forEach((edge) => {
      if (status === "processing") {
        edge.attr("line/strokeDasharray", 5);
        edge.attr("line/style/animation", "running-line 30s infinite linear");
      } else {
        edge.attr("line/strokeDasharray", "");
        edge.attr("line/style/animation", "");
      }
    });
  });
};

const _initGraph = (graph: Graph) => {
  graph.use(
    new Snapline({
      enabled: true,
      sharp: true,
    })
  );
  graph.use(
    new Clipboard({
      enabled: true,
    })
  );
  graph.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      rubberEdge: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true,
      strict: true,
      pointerEvents: "none",
      modifiers: ["alt"],
    })
  );
  graph.use(
    new Keyboard({
      enabled: true,
      global: true,
    })
  );
  graph.use(
    new Transform({
      resizing: {
        enabled: true,
        minWidth: 200,
        minHeight: 100,
        maxWidth: 2000,
        maxHeight: 2000,
        orthogonal: false,
        restrict: false,
        preserveAspectRatio: false,
      },
      rotating: {
        enabled: true,
        grid() {
          return 30;
        },
      },
    })
  );
  graph.use(
    new History({
      enabled: true,
    })
  );
  __bindKeys(graph);
  __bindEvent(graph);
};

export const createGraph = (container: HTMLDivElement) => {
  const graph = new Graph({
    container,
    autoResize: true,
    connecting: {
      allowBlank: false,
      allowLoop: false,
      allowNode: false,
      allowEdge: false,
      allowMulti: false,
      highlight: true,
      router: "orth",
      connector: "rounded",
      snap: true,
      createEdge() {
        return this.createEdge({
          attrs: {
            line: {
              stroke: "#8f8f8f",
              strokeWidth: 1,
            },
          },
        });
      },
      validateMagnet({ magnet }) {
        // 输入节点无法创建连线
        return magnet.getAttribute("port-group") !== "input";
      },
      validateConnection({
        sourceCell,
        targetCell,
        sourceMagnet,
        targetMagnet,
      }) {
        // 不能连接自身
        if (sourceCell === targetCell) {
          return false;
        }

        // 只能从 output 连接桩开始连接，连接到 input 连接桩
        if (
          !sourceMagnet ||
          sourceMagnet.getAttribute("port-group") === "input"
        ) {
          return false;
        }
        if (
          !targetMagnet ||
          targetMagnet.getAttribute("port-group") !== "input"
        ) {
          return false;
        }

        return true;
      },
    },
    embedding: {
      enabled: true,
      findParent({ node }) {
        if (node.shape == "group") return [];
        const bbox = node.getBBox();
        return this.getNodes().filter((node) => {
          const data = node.getData<any>();
          if (data && data.parent) {
            const targetBBox = node.getBBox();
            return targetBBox.containsRect(bbox);
            // return bbox.isIntersectWithRect(targetBBox);
          }
          return false;
        });
      },
    },
    highlighting: {
      embedding: {
        name: "stroke",
        args: {
          padding: -1,
          attrs: {
            stroke: "#73d13d",
          },
        },
      },
      // 连接桩可以被连接时在连接桩外围围渲染一个包围框
      magnetAvailable: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#fff",
            stroke: "#A4DEB1",
            strokeWidth: 4,
          },
        },
      },
      // 连接桩吸附连线时在连接桩外围围渲染一个包围框
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#fff",
            stroke: "#31d0c6",
            strokeWidth: 4,
          },
        },
      },
    },
    panning: {
      enabled: true,
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl"],
    },
    background: {
      color: "#F2F7FA",
    },
    grid: {
      visible: true,
      type: "doubleMesh",
      args: [
        {
          color: "#eee", // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: "#ddd", // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
  });

  _initGraph(graph);
  return graph;
};
