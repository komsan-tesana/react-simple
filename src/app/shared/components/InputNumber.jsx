import { InputNumber } from "antd";
import { Controller } from "react-hook-form";

export function FormInputNumber({ name, control }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputNumber
          {...field}
          onChange={(v) => field.onChange(v)}
        />
      )}
    />
  );
}