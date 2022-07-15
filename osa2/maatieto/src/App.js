import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({nameFilter, setNameFilter}) => {
  return (
    <div>
      Find countries 
      <input
        value={nameFilter}
        onChange={(event) => {
          setNameFilter(event.target.value)
          console.log('name filter', event.target.value)
        }}
      />
    </div>
  )
}

const Weather = ({country}) => {
  console.log('')
  const lat = country.capitalInfo.latlng[0]
  const lng = country.capitalInfo.latlng[1]
  const [weather, setWeather] = useState([])
  const hook = () => {
    console.log('effect')
    axios
      .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&windspeed_unit=ms`)
      .then(response => {
        console.log('weather promise fulfilled')
        console.log(response.data)
        setWeather(response.data)
      })
  }
  useEffect(hook, [])
  console.log('weather', weather)
  const wcodes = {
    0:'01',
    1:'01',

    2:'02',

    3:'03',

    45:'50',
    48:'50',

    51:'10',
    53:'10',
    55:'10',
    56:'10',
    57:'10',

    71:'13',
    73:'13',
    75:'13',
    77:'13',
    85:'13',
    86:'13',

    80:'09',
    81:'09',
    82:'09',
    61:'09',
    63:'09',
    65:'09',
    66:'09',
    67:'09',

    95:'11',
    96:'11',
    99:'11'
  }
  const wcode = wcodes[ weather?.current_weather?.weathercode ] 
  const w_url = `https://openweathermap.org/img/wn/${wcode}d@2x.png`
  return (
    <div>
      <h3>Weather in {country.capital}</h3>
      <p>Temperature {weather?.current_weather?.temperature} Celsius</p>
      <img src={w_url}/>
      <p>Wind {weather?.current_weather?.windspeed} m/s</p>
    </div>
  )
}

const OneCountry = ({country}) => {
  console.log('1', country.flags.png)
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.keys(country.languages).map( (key,i)=>
        <li >
          {country.languages[key]}
        </li>
        )}
      </ul>
      <img src={country.flags.png}/>
      <Weather country={country}/>
    </div>
  )
}
const CountryList = ({countries, nameFilter, setNameFilter}) => {
  countries = countries.filter( country => {
    if (country.name.common.includes(nameFilter) ) {
      return true
    }
    return false
  })
  if (countries.length === 0) {
    return <p>No match</p>
  }
  if (countries.length === 1) {
    return <OneCountry country={countries[0]}/>
  }
  else if (countries.length <= 10) {
    return (
      <div>
        {countries.map( country =>
          <div>
            {country.name.common}
            <button onClick={() => setNameFilter(country.name.common)}> show </button>
          </div>
        )}
      </div>
    )
  }
  else {
    return <p>Too many matches specify another filter</p>
  }
}

function App() {

  const [nameFilter, setNameFilter] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setCountries(response.data)
      })
  }
  
  useEffect(hook, [])

  return (
    <div>
      <Filter nameFilter= {nameFilter} setNameFilter = {setNameFilter}/> 
      <CountryList countries={countries} nameFilter={nameFilter} setNameFilter={setNameFilter}/>
    </div>
  );
}

export default App;
