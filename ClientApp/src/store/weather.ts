import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";

import authService from "../components/api-authorization/AuthorizeService";

import { dateCompare } from "../helpers";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface Meta {
  isLoading: boolean;
  isLoaded: boolean;
  isErrored: boolean;
  cachedAt: Date | undefined;
}

export interface Forecast {
  applicable_date: Date;
  weather_state_name: string;
  weather_state_abbr: string;
}

export interface WeatherState {
  consolidated_weather: Array<Forecast>;
  _meta: Meta;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestWeatherForecastsAction {
  type: "REQUEST_WEATHER_FORECASTS";
}

interface ReceiveWeatherForecastsAction {
  type: "RECEIVE_WEATHER_FORECASTS";
  weather: WeatherState;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  | RequestWeatherForecastsAction
  | ReceiveWeatherForecastsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  requestWeatherForecasts: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    // Only load data if it's something we don't already have (and are not already loading)
    const appState = getState();
    if (appState && appState.weather && !appState.weather._meta.isLoading) {
      authService.getAccessToken().then((token) => {
        fetch(`weatherforecast`, {
          headers: !token ? {} : { Authorization: `Bearer ${token}` },
        })
          .then((response) => response.json() as Promise<WeatherState>)
          .then((data) => {
            dispatch({
              type: "RECEIVE_WEATHER_FORECASTS",
              weather: data,
            });
          });

        dispatch({
          type: "REQUEST_WEATHER_FORECASTS",
        });
      });
    }
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: WeatherState = {
  consolidated_weather: [],
  _meta: {
    isLoading: false,
    isLoaded: false,
    isErrored: false,
    cachedAt: undefined,
  },
};

const loadingState: WeatherState = {
  consolidated_weather: [],
  _meta: {
    isLoading: true,
    isLoaded: false,
    isErrored: false,
    cachedAt: undefined,
  }
}

export const reducer: Reducer<WeatherState> = (
  state: WeatherState | undefined,
  incomingAction: Action
): WeatherState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "REQUEST_WEATHER_FORECASTS":
      return unloadedState;
    case "RECEIVE_WEATHER_FORECASTS":
      let forecasts = action.weather.consolidated_weather.map((f: Forecast): Forecast => {
        return Object.assign({}, f, {applicable_date: new Date(f.applicable_date)})
      });

      // The API makes no promises about ordering or number of entries.
      let today = new Date().setHours(0,0,0,0);
      forecasts = forecasts
        .filter(
          (f: Forecast): boolean => f.applicable_date.setHours(0,0,0,0) > today
        )
        .sort((a, b) => dateCompare(a.applicable_date, b.applicable_date))
        .slice(0, 5);

      return Object.assign(
        {},
        { consolidated_weather: forecasts },
        { _meta: { isLoading: false, isLoaded: true, isErrored: false, cachedAt: new Date() }}
      );

  }

  return state;
};
