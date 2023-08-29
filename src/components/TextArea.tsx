import { Input, Typography } from "antd";
import { TextAreaProps } from "antd/es/input";

const { TextArea: AntTextArea } = Input;
const { Text } = Typography;

interface Props extends TextAreaProps {
  title?: string;
}

export const TextArea = ({ title = "", className = "", ...rest }: Props) => {
  return (
    <div className="flex flex-col grow">
      <Text className="whitespace-pre-wrap">{title}</Text>
      <div className="flex grow">
        <AntTextArea
          {...rest}
          className={`self-stretch grow h-full ${className}`}
        />
      </div>
    </div>
  );
};
