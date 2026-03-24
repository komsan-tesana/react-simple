import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

export function FormCheckbox({ name, control }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...field}
          onChange={(v) => field.onChange(v.target.checked)}
        />
      )}
    />
  );
}