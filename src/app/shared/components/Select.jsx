import { Select } from 'antd';

export function CsSelect({options,defaultValue,width,handleChange,mode}){
  const innerOption = options ? [...options] : [{ value: '', label: 'Please Select', disabled: true }]
  const innerDfv = defaultValue || null;

  return (
   <Select
      mode={mode || undefined}
      allowClear
      defaultValue={innerDfv}
      style={{ width: width || '100%' }}
      onChange={handleChange}
      options={innerOption}
    />
  )
}