import React from 'react';
import { Container, Box } from '@mui/material';
import BoundaryScopeForm from '../../components/User/platformconfig/BoundaryScopeForm';
import ProcessFlowChart from '../../components/User/platformconfig/ProcessFlow';
const PlatformConfig = () => {
  return (
  
    <Box display="flex" flexDirection="row" padding={5} gap={5} >
      <BoundaryScopeForm/>
      <ProcessFlowChart />
    </Box>

  )
}

export default PlatformConfig
