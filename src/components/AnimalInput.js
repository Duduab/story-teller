// AnimalInput.js
import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



const AnimalInput = ({ onChange }) => {
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (
     <Box sx={{ minWidth: 400 }} padding={'25px'}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Please, Select Your Character</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="animal"
          label="Please, Select Your Character"
          name="animal"
          onChange={handleInputChange}
        >
          <MenuItem value={'dog'}>Dog</MenuItem>
          <MenuItem value={'cat'}>Cat</MenuItem>
          <MenuItem value={'lion'}>Lion</MenuItem>
          <MenuItem value={'elephant'}>Elephant</MenuItem>
          <MenuItem value={'tiger'}>Tiger</MenuItem>
          <MenuItem value={'bear'}>Bear</MenuItem>
        </Select>
      </FormControl>
    </Box>


  );
};

export default AnimalInput;
