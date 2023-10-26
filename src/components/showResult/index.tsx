import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";

const ShowResult: TComponent<any, any> = ({ node, graph }) => {
  // console.log("----", node, graph);
  const data = node.getData() as IStencilData<any, any>;
  return (
    <StatusWrapper status={data.status}>
      <div className={style.login}>
        接收到的结果：{JSON.stringify(data.output)}
      </div>
    </StatusWrapper>
  );
};

ShowResult.shape = "result";
ShowResult.size = [200, 200];

ShowResult.thumnail = <div className={style.thumnail}>展示结果</div>;

ShowResult.data = {
  status: "pending",
};

ShowResult.ports = PortTemplate.onlyInput;

export default ShowResult;
