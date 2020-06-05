## TODO
* Add another action so that weather forecast is cached for at least a minute (as requested by api) Request (Check caching) -> (Optionally) Fetch -> (Only if Fetched) Received
* helper fns to handle common Meta scenarios
* Remove the "Use another service" from login page
* Move Meta out of weather.ts as (in an app with more state) it would be generally applicable across slices. Set up generic state slice type that includes Meta.
* Implement the error handling that Meta is clearly set up to allow!
* Some refactoring of the auth js file locations needs to be done due to the 
combination of 'react' and 'reactredux' templates. In 'react' the data
fetching is done in the component so all the auth functionality being
under compontents is reasonable. When fetching is moved to the Redux layer
this is no longer ideal.
* Better type usage - for example, separate the API response where applicable_date is a string (but TS is unaware) from state storage where it is a Date (as specified)
* Single conditional template syntax - currently (deliberately) using more than one technique to decide what React template to return, in a non-tech-test app would prefer it all in renderXXX() fns (if you can name it, make it a function ;) )