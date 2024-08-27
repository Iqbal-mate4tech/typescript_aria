import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface SingleSelectProps {
  disabled?: boolean;
  name: string;
  value: string | number;
  options: Array<{ [key: string]: string | number }>;
  optionValue: string;
  optionName: string;
  onChange: (name: string, value: string | number) => void;
}

export const SingleSelect: React.FC<SingleSelectProps> = (props) => {
  const { disabled, name, value, options, optionValue, optionName, onChange } = props;

  return (
    <FormControl fullWidth variant="outlined" disabled={disabled}>
      <InputLabel>{name}</InputLabel>
      <Select
        label={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value as string | number)}
      >
        {options && options.map((itemValue, index) => (
          <MenuItem key={index} value={itemValue[optionValue]}>
            {itemValue[optionName]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SingleSelect;
