import React, { Component } from 'react';

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="row">
          <div className="col-sm-6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange('lat')}
            />
          </div>
          <div className="col-sm-6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange('lon')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default {
  schema: {
    title: 'A localisation form',
    type: 'object',
    required: ['lat', 'lon'],
    properties: {
      lat: {
        type: 'number'
      },
      lon: {
        type: 'number'
      }
    }
  },
  uiSchema: {
    'ui:field': 'geo'
  },
  formData: {
    lat: 0,
    lon: 0
  },
  fields: { geo: GeoPosition }
};
