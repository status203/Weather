import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WeatherStore from '../store/weather';

// At runtime, Redux will merge together...
type WeatherProps =
  WeatherStore.WeatherState // ... state we've requested from the Redux store
  & typeof WeatherStore.actionCreators; // ... plus action creators we've requested


class WeatherReport extends React.PureComponent<WeatherProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Weather Report for Belfast</h1>
        {this.renderForecastsTable()}
        {this.renderRefresh()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    this.props.requestWeatherForecasts();
  }

  private renderForecastsTable() {
    let body;
    if (this.props._meta && this.props._meta.isLoaded) {
      body = (
        <tbody>
          {this.props.consolidated_weather.map(
            (forecast: WeatherStore.Forecast) => this.renderForecast(forecast)
          )}
        </tbody>
      )
    } else {
      body = (
        <tbody>
          <tr><td>Loading forecast...</td></tr>
        </tbody>
      )
    }

    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Forecast</th>
          </tr>
        </thead>
        {body}
      </table>
    );
  }

  private renderForecast(forecast: WeatherStore.Forecast) {
    const stateUrl = `https://www.metaweather.com/static/img/weather/png/${forecast.weather_state_abbr}.png`;
    return (
      <tr className='forecast' key={forecast.applicable_date.toString()}>
      <td>{forecast.applicable_date.toLocaleDateString('en-GB')}</td>
      <td><img src={stateUrl} />&nbsp;{forecast.weather_state_name}</td>
    </tr>

    )
  }

  private renderRefresh() {
    const canRefresh = this.props._meta.isLoaded || this.props._meta.isErrored;

    return (
      <div className='refresh'>
        <button disabled={!canRefresh} onClick={this.props.requestWeatherForecasts}>Refresh</button>
      </div>
    )
  }

}

export default connect(
  (state: ApplicationState) => state.weather, // Selects which state properties are merged into the component's props
  WeatherStore.actionCreators // Selects which action creators are merged into the component's props
)(WeatherReport as any);
