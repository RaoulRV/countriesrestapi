import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import axios from 'axios';
import './App.css';

function App() {
  const [countryInfo, setCountryInfo] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const response = await axios.get('${apiUrl}/api/countries/all');
        setAllCountries(response.data);
      } catch (error) {
        console.error('Failed to fetch all countries:', error);
        setError('Failed to load country data. Please try again later.');
      }
    };

    fetchAllCountries();
  }, []);

  const searchCountry = async (countryName) => {
    setLoading(true);
    setError(''); // Resetting error state on new search
    setShowAllCountries(false);
    try {
      const response = await axios.get(`${apiUrl}/api/countries/${countryName}`);
      if (response.data && response.data.length > 0) {
        setCountryInfo(response.data[0]);
      } else {
        setError("Country not found. Please try a different name.");
        setCountryInfo(null);
      }
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx and possibly 404.
        setError(err.response.status === 404 ? "Country not found. Please try a different name." : "An error occurred on the server. Please try again later.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("The request was made but no response was received. Check your network connection.");
      } else {
        // Something else caused the error
        setError("An error occurred while searching. Please try again.");
      }
      setCountryInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const displayRandomCountry = () => {
    setError(null);
    if (allCountries.length > 0) {
      const randomIndex = Math.floor(Math.random() * allCountries.length);
      setCountryInfo(allCountries[randomIndex]);
      setShowAllCountries(false); // Hide all countries grid when showing random country
    }
  };

  const toggleAllCountries = () => {
    setError(null);
    setShowAllCountries(!showAllCountries);
    setCountryInfo(null); // Hide specific country info when showing all countries
  };

  return (
    <div className="App">
      <h1>Country Database</h1>
      <SearchBar onSearch={searchCountry} />
      <button onClick={displayRandomCountry}>Random Country</button>
      <button onClick={toggleAllCountries}>{showAllCountries ? "Hide All Countries" : "Display All Countries"}</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {countryInfo && !showAllCountries && (
        <div>
          <h2>{countryInfo.name.common}</h2>
          <p>Capital: {countryInfo.capital && countryInfo.capital[0]}</p>
          <p>Population: {countryInfo.population.toLocaleString()}</p>
          <p>Timezone: {countryInfo.timezones}</p>
          <img src={countryInfo.flags.png} alt={`Flag of ${countryInfo.name.common}`} />
        </div>
      )}

      {showAllCountries && (
        <div className="country-grid">
          {allCountries.map((country, index) => (
            <div key={index} className="country-card">
              <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
              <h3>{country.name.common}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;