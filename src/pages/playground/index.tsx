import { useEffect, useRef, useState } from "react";
import style from "./index.less";

import { Button, FloatButton, message } from "antd";
import { FreeClient } from "@/free-lib";
import Login from "@/components/login";
import PassThrough from "@/components/passThrough";
import Transformer from "@/components/transformer";
import Args from "@/components/args";
import Api from "@/components/api";
import ImageShow from "@/components/imageShow";
import { CloudDownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Group from "@/components/group";
import Timer from "@/components/timer";
import demo from "./demo.json";

function saveTextAsFile(textToSave: string, fileName: string) {
  // 创建一个 Blob 对象，将文本内容放入其中
  const textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });

  // 创建一个虚拟链接，并指定下载的文件名
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.innerHTML = "Download File";

  // 将 Blob 对象链接到虚拟链接
  if (window.webkitURL != null) {
    // Chrome 浏览器
    downloadLink.href = window.webkitURL.createObjectURL(textToSaveAsBlob);
  } else {
    // 其他浏览器
    downloadLink.href = window.URL.createObjectURL(textToSaveAsBlob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  // 触发点击事件，开始下载
  downloadLink.click();
}

function selectFile(callback: (content: string) => void) {
  // 创建一个隐藏的文件输入框
  var input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";

  // 添加文件选择事件监听器
  input.addEventListener("change", function (e: any) {
    var file = e.target.files[0];

    // 创建 FileReader 对象
    var reader = new FileReader();

    // 当读取完成时触发该事件
    reader.onload = function (e: any) {
      var content = e.target.result;

      // 调用回调函数，将文件内容作为参数返回
      callback(content);
    };

    // 开始读取文件
    reader.readAsText(file);
  });

  // 触发点击事件，打开文件选择对话框
  input.click();
}

export default function Playground() {
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const freeClientRef = useRef<FreeClient>();
  const [toolStatus, setToolStatus] = useState<{
    canRedo?: boolean;
    canUndo?: boolean;
  }>({});

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
      Group,
      Timer,
    ]);

    freeClientRef.current.onHistoryChange((canRedo, canUndo) => {
      setToolStatus({
        canRedo,
        canUndo,
      });
    });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.left} ref={stencilContainerRef}></div>
      <div className={style.right}>
        <div className={style.bar}>
          <Button
            disabled={!toolStatus.canUndo}
            type="dashed"
            onClick={async () => {
              freeClientRef.current?.undo();
            }}
          >
            撤销
          </Button>
          <Button
            disabled={!toolStatus.canRedo}
            type="dashed"
            onClick={async () => {
              freeClientRef.current?.redo();
            }}
          >
            重做
          </Button>
          <Button
            type="dashed"
            onClick={async () => {
              try {
                freeClientRef.current?.fromJSON(demo);
              } catch {
                message.error("加载失败，请检查内容格式");
              }
            }}
          >
            DEMO
          </Button>
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

        <FloatButton.Group shape="circle" style={{ right: 24 }}>
          <FloatButton
            icon={<CloudDownloadOutlined />}
            onClick={() => {
              saveTextAsFile(
                JSON.stringify(
                  freeClientRef.current?.toJSON() ?? { cells: [] },
                  null,
                  4
                ),
                `${Date.now()}.json`
              );
            }}
          />
          <FloatButton
            icon={<CloudUploadOutlined />}
            onClick={() => {
              selectFile((content) => {
                try {
                  freeClientRef.current?.fromJSON(JSON.parse(content));
                } catch {
                  message.error("加载失败，请检查内容格式");
                }
              });
            }}
          />

          <FloatButton.BackTop visibilityHeight={0} />
        </FloatButton.Group>
      </div>
    </div>
  );
}
