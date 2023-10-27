import { useEffect, useRef, useState } from "react";
import style from "./index.less";

import { Button } from "antd";
import { FreeClient } from "@/free-lib";
import Login from "@/components/login";
import PassThrough from "@/components/passThrough";
import Transformer from "@/components/transformer";
import Args from "@/components/args";
import Api from "@/components/api";
import ImageShow from "@/components/imageShow";

export default function Playground() {
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const freeClientRef = useRef<FreeClient>();

  useEffect(() => {
    if (!stencilContainerRef.current || !graphContainerRef.current) return;
    freeClientRef.current = new FreeClient(
      stencilContainerRef.current,
      graphContainerRef.current
    );

    // 注册组件
    freeClientRef.current.registerComponents([
      Login,
      PassThrough,
      Transformer,
      Args,
      Api,
      ImageShow,
    ]);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.left} ref={stencilContainerRef}></div>
      <div className={style.right}>
        <div className={style.bar}>
          <Button
            type="primary"
            onClick={async () => {
              freeClientRef.current?.execute();
            }}
          >
            执行
          </Button>
        </div>
        <div
          style={{ width: "100%", height: "100%" }}
          ref={graphContainerRef}
        />
      </div>
    </div>
  );
}
