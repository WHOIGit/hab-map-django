import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Divider,
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import { ArrowForward, ArrowBack, Restore } from '@material-ui/icons';
import './ControlPanel.css';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
  checkBoxes: {
    ...theme.typography.body2,
  },
  toggleArrow: {
    color: theme.palette.primary.main,
    position: 'fixed',
    right: theme.spacing(1),
    zIndex: 90,
  },
  resetBtn: {
    position: 'absolute',
    top: '-3px',
    right: '15px',
    zIndex: 100,
  }
}))

const ControlPanel = ({
  mapLayers,
  habSpecies,
  yAxisScale,
  onLayerVisibilityChange,
  onSpeciesVisibilityChange,
  onDateRangeChange,
  onYAxisChange,
}) =>  {
  // Set const variables
  const classes = useStyles();
  const defaultStartDate = new Date('2017-01-01T21:11:54');
  // Set local state
  const [showControls, setShowControls] = useState(true);
  const [selectedStartDate, setSelectedStartDate] = useState(defaultStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [yAxisValue, setYAxisValue] = useState(yAxisScale);

  const onStartDateChange = (date) => {
    setSelectedStartDate(date);
    if (date instanceof Date && !isNaN(date)) {
      onDateRangeChange(date, selectedEndDate);
    }
  };

  const onEndDateChange = (date) => {
    setSelectedEndDate(date);
    if (date instanceof Date && !isNaN(date)) {
      onDateRangeChange(selectedStartDate, date);
    }
  };

  const onDateRangeReset = () => {
    setSelectedStartDate(defaultStartDate);
    setSelectedEndDate(new Date());
    onDateRangeChange(defaultStartDate, new Date());
  };

  const handleYAxisChange = (event) => {
    setYAxisValue(event.target.value);
    onYAxisChange(event);
  };

  const renderLayerControl = (mapLayer) => {
    return (
      <FormControlLabel
        className={classes.checkBoxes}
        key={mapLayer.id}
        control={
          <Checkbox
            color="primary"
            checked={mapLayer.visibility}
            onChange={(event) => onLayerVisibilityChange(event, mapLayer.id)}
            name={mapLayer.name} />
        }
        label={<Typography variant="body2" color="textSecondary">{mapLayer.name}</Typography>}
      />
    );
  }

  const renderColorChips = (color, index) => {
    const xValue = index * 20;
    return (
      <rect width="20" height="20" fill={color} x={xValue} key={index}></rect>
    )
  }

  const renderSpeciesControl = (species) => {
    return (
      <React.Fragment>
        <FormControlLabel
          key={species.id}
          control={
            <Checkbox
              color="primary"
              checked={species.visibility}
              onChange={(event) => onSpeciesVisibilityChange(event, species.id)}
              name={species.speciesName} />
          }
          label={
            <Typography variant="body2" color="textSecondary">{`${species.speciesName} / ${species.syndrome}`}</Typography>
          }
        />
        <Box>
          <svg width="100" height="20">
            {species.colorGradient.map((item, index) => renderColorChips(item, index))}
          </svg>
        </Box>
      </React.Fragment>

    );
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={`control-panel ${showControls ? "active" : "collapse"} ${classes.root}`}>
        <IconButton
          className={classes.toggleArrow}
          onClick={() => setShowControls(!showControls)}
          aria-label="Open/Close Filter Pane" >
          {showControls ? <ArrowForward /> :  <ArrowBack />}
        </IconButton>

        <List className={classes.root}>
          <ListItem>
            <FormControl component="fieldset" >
              <FormLabel component="legend">Data Layers</FormLabel>
              <FormGroup>
                  {mapLayers.map(layer => renderLayerControl(layer))}
              </FormGroup>
            </FormControl>
          </ListItem>
          <Divider variant="middle" component="li" className={classes.divider} />
          <ListItem>
            <FormControl component="fieldset" >
              <FormLabel component="legend">HAB Species/Syndromes</FormLabel>
              <FormGroup>
                {habSpecies.map(species => renderSpeciesControl(species))}
              </FormGroup>
            </FormControl>
          </ListItem>
          <Divider variant="middle" component="li" className={classes.divider} />
          <ListItem>
            <IconButton onClick={() => onDateRangeReset()} aria-label="expand" className={classes.resetBtn}>
               <Restore />
            </IconButton>
            <FormControl component="fieldset" >
              <FormLabel component="legend">Date Range</FormLabel>
              <FormGroup>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="start-date"
                  label="Start Date"
                  value={selectedStartDate}
                  onChange={onStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormGroup>
              <FormGroup>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="end-date"
                  label="End Date"
                  value={selectedEndDate}
                  onChange={onEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormGroup>
            </FormControl>

          </ListItem>
          {/*
          <Divider variant="middle" component="li" className={classes.divider} />
          <ListItem>
            <FormControl component="fieldset">
              <FormLabel component="legend">Y-Axis Scale</FormLabel>
              <RadioGroup aria-label="y-axis scale" name="gender1" value={yAxisValue} onChange={handleYAxisChange}>
                <FormControlLabel value="linear" control={<Radio color="primary" />} label="Linear" />
                <FormControlLabel value="logarithmic" control={<Radio color="primary" />} label="Logarithmic" />
              </RadioGroup>
            </FormControl>
          </ListItem>
          */}

        </List>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default ControlPanel;