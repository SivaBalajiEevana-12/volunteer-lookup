import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { Route, Routes } from 'react-router-dom';
import PhoneAttendanceForm from './PhoneAttendanceForm';
import VolunteerLookup from './VolunteerLookup';
import PhoneAttendenceFlc from './PhoneAttendenceFlc';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
          <Route path='/attendence' element={<PhoneAttendanceForm/>}/>
          <Route path='/flc/attendence' element={<PhoneAttendenceFlc/>}/>

          <Route path='/volunteer-lookup-details' element={<VolunteerLookup/>}/>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
