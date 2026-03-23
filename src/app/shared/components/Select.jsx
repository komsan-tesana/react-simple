import { Select } from "antd";
import { Controller } from "react-hook-form";

export function FormSelect({ name, control,options,defaultValue,width,handleChange,mode }) {
  const innerOption = options ? [...options] : [{ value: '', label: 'Please Select', disabled: true }]
  const innerDfv = defaultValue || null;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          mode={mode || undefined}
          allowClear
          defaultValue={innerDfv}
          style={{ width: width || '100%' }}
          options={innerOption}
          onChange={(v) => {        
            if(handleChange) {
               return handleChange(v)
            }            
            field.onChange(v)}}
        />
      )}
    />
  );
}