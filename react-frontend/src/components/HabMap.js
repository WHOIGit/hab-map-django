import React, { useState, useEffect, useRef } from "react"
import MapGL, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl'
import { differenceInDays } from 'date-fns'
// Material UI imports
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
// Import our stuff
import SidePane from './SidePane'
import ControlPanel from './ControlPanel'
import DataPanel from './DataPanel'
import StationsGraph from './StationsGraph'
import StationsMarkers from './StationsMarkers'
import IfcbMarkers from './IfcbMarkers'
import { layers } from '../map-layers'
import { species } from '../hab-species'
import './HabMap.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFuZHJld3MiLCJhIjoiY2p6c2xxOWx4MDJudDNjbjIyNTdzNWxqaCJ9.Ayp0hdQGjUayka8dJFwSug';
const popupFromZoom = 6;
const defaultStartDate = new Date('2017-01-01T21:11:54');

const navStyle = {
  position: 'absolute',
  bottom: 36,
  right: 0,
  padding: '10px'
};

const scaleControlStyle = {
  position: 'absolute',
  bottom: 36,
  left: 0,
  padding: '10px'
};

export default function HabMap() {
  const [viewport, setViewport] = useState({
    latitude: 42.89,
    longitude: -69.75,
    width: "100%",
    height: "100vh",
    zoom: 6.7
  });

  const [features, setFeatures] = useState([]);
  const [mapLayers, setMapLayers] = useState(layers);
  const [habSpecies, setHabSpecies] = useState(species);
  const [dateFilter, setDateFilter] = useState([defaultStartDate, new Date()]);
  const [smoothingFactor, setSmoothingFactor] = useState(4);
  const [yAxisScale, setYAxisScale] = useState('linear');

  const mapRef = useRef();

  const interactiveLayerIds = layers.map(item => item.id);

  function renderMarkerLayer(layer) {
    if (layer.visibility && layer.id === 'stations-layer') {
      return (
        <StationsMarkers
          habSpecies={habSpecies}
          onMarkerClick={onMarkerClick}
          dateFilter={dateFilter}
          smoothingFactor={smoothingFactor}
          key={layer.id} />
      );
    } else if (layer.visibility && layer.id === 'ifcb-layer') {
      return (
        <IfcbMarkers
          habSpecies={habSpecies}
          onMarkerClick={onMarkerClick}
          dateFilter={dateFilter}
          smoothingFactor={smoothingFactor}
          key={layer.id} />
      );
    } else {
      return;
    }
  }

  function onMapClick(event) {
    const mapObj = mapRef.current.getMap();
    return
  }

  function onMarkerClick(event, feature, layerID) {
    const mapObj = mapRef.current.getMap();
    console.log(event);
    console.log(feature);
    feature.layer = layerID;
    setFeatures([feature, ...features]);
    console.log(features);
  }

  function onPaneClose(featureID) {
    const newFeatures = features.filter(feature => feature.id !== featureID)
    setFeatures(newFeatures);
  }

  function onLayerVisibilityChange(event, layerID) {
    const mapObj = mapRef.current.getMap();
    // set the mapLayers state
    const newVisibility = mapLayers.map(item => {
      if (item.id === layerID) {
        item.visibility = event.target.checked;
      }
      return item;
    })
    setMapLayers(newVisibility);
    // set the features state
    const newFeatures = features.filter(feature => feature.layer.id !== layerID)
    setFeatures(newFeatures);
  }

  function onSpeciesVisibilityChange(event, speciesID) {
    const mapObj = mapRef.current.getMap();
    const newVisibility = habSpecies.map(item => {
      if (item.id == speciesID) {
        item.visibility = event.target.checked;
      }
      return item;
    })
    setHabSpecies(newVisibility);
  }

  function onDateRangeChange(startDate, endDate) {
    setDateFilter([startDate, endDate]);
    // calculate the date range length to determine a smoothing factor to pass API
    const dateRange = differenceInDays(endDate, startDate);
    let newFactor = 4;

    if (dateRange < 90) {
      newFactor = 1;
    }
    else if (dateRange < 180) {
      newFactor = 2;
    }
    else if (dateRange < 240) {
      newFactor = 3;
    }
    setSmoothingFactor(newFactor);
  }

  function onYAxisChange(event) {
    console.log(event.target.value);
    setYAxisScale(event.target.value);
  };

  return (
    <div>
      {features && (
        <div className="side-panes-container">
          {features.map(feature => (
            <DataPanel
              key={feature.id}
              featureID={feature.id}
              dataLayer={feature.layer}
              dateFilter={dateFilter}
              smoothingFactor={smoothingFactor}
              yAxisScale={yAxisScale}
              onPaneClose={onPaneClose}
            />
          ))}
        </div>
      )}
      <div>
        <MapGL
          {...viewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v10"
          onViewportChange={viewport => {
            setViewport(viewport)
          }}
          onClick={event => onMapClick(event)}
          ref={mapRef}
        >

          <React.Fragment>
            {mapLayers.map(layer => renderMarkerLayer(layer))}
          </React.Fragment>

          <div style={navStyle}>
            <NavigationControl />
          </div>
          <div style={scaleControlStyle}>
            <ScaleControl />
          </div>
        </MapGL>
      </div>
      <div>
        <ControlPanel
          mapLayers={mapLayers}
          habSpecies={habSpecies}
          yAxisScale={yAxisScale}
          onLayerVisibilityChange={onLayerVisibilityChange}
          onSpeciesVisibilityChange={onSpeciesVisibilityChange}
          onDateRangeChange={onDateRangeChange}
          onYAxisChange={onYAxisChange}
        />
      </div>
    </div>
  );
}
