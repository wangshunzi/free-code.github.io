import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import { Image } from "antd";

const ImageShow: TComponent<string[], any> = ({ node, graph }) => {
  // console.log("----", node, graph);
  const data = node.getData() as IStencilData<string[], any>;
  return (
    <StatusWrapper status={data.status}>
      <div className={style.container}>
        <Image.PreviewGroup items={data.input}>
          <Image
            width={"100%"}
            height={"100%"}
            style={{ objectFit: "contain" }}
            src={data.input?.[0]}
          />
        </Image.PreviewGroup>
      </div>
    </StatusWrapper>
  );
};

ImageShow.group = "展示组件";
ImageShow.shape = "image_show";

ImageShow.size = [300, 300];

ImageShow.thumnail = <div className={style.thumnail}>图片组件</div>;

ImageShow.data = {
  status: "pending",
  overwriteInput: true,
  input: [],
};

ImageShow.ports = PortTemplate.onlyInput;

export default ImageShow;
