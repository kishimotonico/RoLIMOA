import React, { FC } from 'react';
import { Button, ButtonGroup, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
  buttonContainer: {
    padding: '.5em 0 0',
  },
  buttonGroup: {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    fontSize: '0',
    verticalAlign: 'baseline',
    margin: '0 .25em 0 0',
  },
  innnerButton: {
    width: '50%',
  },
}));

interface TaskObjectComponentProps {
  description: string;
  currentValue: number;
  min?: number;
  max?: number;
  increment?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  decrement?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const TaskObjectComponent: FC<TaskObjectComponentProps> = ({
  description,
  currentValue,
  min = 0,
  max = 524,
  increment = () => {},
  decrement = () => {},
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper className={classes.root}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="h5" component="p">
          {currentValue}
        </Typography>

        <Container className={classes.buttonContainer}>
          <ButtonGroup className={classes.buttonGroup} color="primary" aria-label="outlined primary button group">
            <Button className={classes.innnerButton} variant="outlined" onClick={decrement} disabled={currentValue === min}>
              -1
            </Button>
            <Button className={classes.innnerButton} variant="contained" onClick={increment} disabled={currentValue === max}>
              +1
            </Button>
          </ButtonGroup>
        </Container>
      </Paper>
    </Grid>
  );
};