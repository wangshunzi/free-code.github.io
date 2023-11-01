import { Node, Graph } from "@antv/x6";
import { PortManager } from "@antv/x6/lib/model/port";

type IStencilStatus = "pending" | "stop" | "processing" | "success" | "failed";

interface IStencilData<I, O> {
  status: IStencilStatus; // 状态
  input?: I; // 输入数据
  output?: O; // 输出数据
  extra?: {
    // 额外数据（组件内提供，供executor消费）
    [key: string]: any;
  };
  overwriteInput?: boolean; // 节点输入数据是否被覆写
  parent?: boolean; // 组标识
}
type TPorts = Partial<PortManager.Metadata> | PortManager.PortMetadata[];

type TComponentExtra<I, O> = {
  group?: string; // 分组
  shape: string; // 形状标识
  size: [number, number]; // 添加到graph上的组件尺寸
  thumnail: React.ReactNode; // stencil 中的缩略视图
  executor?: (input: I, extra?: { [key: string]: any }) => Promise<O | null>; // 任务执行器
  data?: IStencilData<I, O>; // 任务初始数据
  ports?: TPorts; // 组件连接桩
  hidden?: boolean; // 是否在stencil面板隐藏
};

type TComponentProps = {
  node: Node;
  graph: Graph;
};
type TComponent<I, O> = React.ComponentType<TComponentProps> &
  TComponentExtra<I, O>;

// stencil

type TStencilRegister = {
  (component: TComponent<any, any>): void;
  lib: TComponent<any, any>[];
};
type TDndPaneCallback = ({ register: TStencilRegister }) => void;
interface IDndPane {
  graph?: Graph;
  callback?: TDndPaneCallback;
}

type TPortTemplateKey = "empty" | "full" | "onlyInput" | "onlyOutput";
