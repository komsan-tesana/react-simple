
import { Controller } from "react-hook-form";
import { Input } from "antd";
const TextArea = Input.TextArea
export function FormTextArea({ name, control }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextArea
          {...field}
          onChange={(v) => field.onChange(v)}
        />
      )}
    />
  );
}