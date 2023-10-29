import style from "./index.less";
import StatusWrapper from "../common/statusWrapper";
import { PortTemplate } from "@/free-lib";
import { IStencilData, TComponent } from "@/free-lib/type";
import { Input, InputNumber, Typography } from "antd";
const { Paragraph } = Typography;
const Timer: TComponent<any, any> = ({ node, graph }) => {
  const data = node.getData() as IStencilData<any, any>;
  let time = data.extra?.time;
  if (!time) {
    data.extra = {
      time: 3,
    };
    time = 3;
  }
  return (
    <StatusWrapper status={data.status} node={node} graph={graph}>
      <div className={style.container}>
        <InputNumber
          min={1}
          max={10}
          value={time}
          onChange={(v) => {
            node.setData({
              extra: { time: v },
            });
          }}
        />
      </div>
    </StatusWrapper>
  );
};

Timer.shape = "timer";
Timer.group = "通用组件";
Timer.size = [200, 200];
Timer.executor = (input, extra) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(input);
    }, (extra?.time || 0) * 1000);
  });
};
Timer.thumnail = <div className={style.thumnail}>定时器</div>;

Timer.data = {
  status: "pending",
  overwriteInput: true,
};

Timer.ports = PortTemplate.full;

export default Timer;
