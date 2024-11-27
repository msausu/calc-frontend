import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

interface CalculatorHelpComponentProps {
  help: boolean;
  setHelp: (_: boolean) => void;
}

const CalculatorHelpComponent: React.FC<CalculatorHelpComponentProps> = ({
  help,
  setHelp,
}) => {
  return (
      <Dialog
        onClose={() => setHelp(false)}
        open={help}
        aria-labelledby="HELP"
        aria-describedby="Operation Cost"
      >
        <DialogTitle>Operation Costs</DialogTitle>
        <List dense={true}>
          <ListItem>√ Square Root: 0.75</ListItem>
          <ListItem>× Multiplication: 0.2</ListItem>
          <ListItem>÷ Divison: 0.5</ListItem>
          <ListItem>+ Sum:0.1</ListItem>
          <ListItem>- Subtraction: 0.1</ListItem>
          <ListItem>8 Random digits: 1.5</ListItem>
          <ListItem>☰ Record logs: 0</ListItem>
          <ListItem>⇤ Clear display: 0</ListItem>
          <ListItem>← Backspace: 0</ListItem>
        </List>
      </Dialog>
  );
};

export default CalculatorHelpComponent;