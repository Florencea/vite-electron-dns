import { Input as AntInput, Typography } from "antd";
import { InputProps } from "antd/es/input";

const { Text } = Typography;

interface Props extends InputProps {
  title?: string;
}

export const Input = ({ title = "", className = "", ...rest }: Props) => {
  return (
    <div className="flex flex-col">
      <Text className="whitespace-pre-wrap">{title}</Text>
      <div className="flex">
        <AntInput {...rest} className={`grow h-full ${className}`} />
      </div>
    </div>
  );
};
