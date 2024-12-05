import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import BoundaryAndScopeForm from './BoundaryScopeForm'; 

const BoundaryscopeDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <>
      {/* Trigger Button */}
      <Button sx={{width:300 ,height:40}} variant="contained" color="primary" onClick={handleClickOpen}>
        Edit
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Boundary and Scope Setup</DialogTitle>
        <DialogContent>
          <BoundaryAndScopeForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoundaryscopeDialog;
