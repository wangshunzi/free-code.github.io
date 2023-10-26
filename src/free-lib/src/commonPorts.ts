import { TPortTemplateKey, TPorts } from "../type";

export const PortsGroupConfig: TPorts = {
  groups: {
    input: {
      position: "left",
      attrs: {
        circle: {
          magnet: true,
          stroke: "#d9d9d9",
          r: 8,
        },
        text: {
          fontSize: 12,
          fill: "#888",
        },
      },
    },
    output: {
      position: "right",
      attrs: {
        circle: {
          magnet: true,
          stroke: "#595959",
          r: 8,
        },
        text: {
          fontSize: 12,
          fill: "#888",
        },
      },
    },
    refresh: {
      position: "top",
      attrs: {
        circle: {
          magnet: true,
          stroke: "#8f8f8f",
          r: 5,
        },
        text: {
          fontSize: 12,
          fill: "#888",
        },
      },
    },
  },
};

export const PortTemplate: { [key in TPortTemplateKey]: TPorts } = {
  empty: {
    items: [],
  },
  full: {
    items: [
      {
        id: "ip-1",
        group: "input",
      },
      {
        id: "op-1",
        group: "output",
      },
    ],
  },
  onlyInput: {
    items: [
      {
        id: "ip-1",
        group: "input",
      },
    ],
  },
  onlyOutput: {
    items: [
      {
        id: "op-1",
        group: "output",
      },
    ],
  },
};
