const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for patient profiles
const patientProfiles = {};

app.post('/api/patient-profile', (req, res) => {
  const { hhNumber, profile } = req.body;
  if (!hhNumber || !profile) {
    return res.status(400).json({ error: 'hhNumber and profile required' });
  }
  patientProfiles[hhNumber] = profile;
  res.json({ message: 'Profile stored successfully' });
});

app.get('/api/patient-profile/:hhNumber', (req, res) => {
  const { hhNumber } = req.params;
  const profile = patientProfiles[hhNumber];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
