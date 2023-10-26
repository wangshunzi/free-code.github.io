import React from "react";
import { IStencilData, TComponentProps, TPorts } from "../type";
import { PortTemplate } from "..";

export class GraphBaseComponent extends React.Component<TComponentProps, any> {
  public static shape: string; // 形状标识
  public static size: [number, number] = [200, 200]; // 添加到graph上的组件尺寸
  public static thumnail: React.ReactNode; // stencil 中的缩略视图
  public static executor?: (input: any) => Promise<any | null>; // 任务执行器
  public static data?: IStencilData<any, any> = {
    status: "pending",
    input: {},
    output: {},
  }; // 任务初始数据
  public static ports?: TPorts = PortTemplate.empty; // 组件连接桩
}
