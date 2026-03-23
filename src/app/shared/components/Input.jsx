import { Input } from "antd";
import { Controller } from "react-hook-form";

export function FormInput({ name, control }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          onChange={(v) => field.onChange(v)}
        />
      )}
    />
  );
}