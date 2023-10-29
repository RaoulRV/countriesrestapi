const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, 'frontend/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/frontend/dist/index.html'));
// });

app.get('/api/countries/all', async (req, res) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/all/`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching all countries');
    }
});

// Endpoint to handle country requests
app.get('/api/countries/:name', async (req, res) => {
  const countryName = req.params.name;

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).send({ message: "No response received from REST Countries API" });
    } else {
      // Something happened in setting up the request that triggered an Error
      
      res.status(500).send({ message: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});