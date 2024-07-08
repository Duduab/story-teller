import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const AgeInput = ({ onChange }) => {
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 400 }} padding={'25px'}>
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Please, Select your Kid Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="age"
        label="Please, Select your Kid Age"
        name="age"
        onChange={handleInputChange}
      >
        <MenuItem value={'0-2'}>0-2</MenuItem>
        <MenuItem value={'2-4'}>2-4</MenuItem>
        <MenuItem value={'4-7'}>4-7</MenuItem>
        <MenuItem value={'8-12'}>8-12</MenuItem>
        <MenuItem value={'12-15'}>12-15</MenuItem>

      </Select>
    </FormControl>
  </Box>

  );
};

export default AgeInput;
