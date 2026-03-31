import { fetchData } from './fetch';

// 1. hae data
// 2. muotoile data
// 3. anna muotoiltu data graafikirjastolle

// Function to test and get user info from kubios API
const getUserInfo = async () => {
  console.log('Käyttäjän INFO Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-info';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
};

// Function to get more actual data from Kubios API
const getUserData = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-data';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);

  // Draw chart with chart.js
  // drawChart(formattedData);
  // Draw chart with amcharts
  // drawAMChart(formattedData);
};

// You need to formulate data into correct structure in the BE
// OR you can extract the data here in FE from one or multiple sources
// Extract data: https://www.w3schools.com/jsref/jsref_map.asp

const formatKubiosResults = (userData) => {};

// Let us try these together
const drawChart = () => {
  // Create the chart
  // https://www.chartjs.org/docs/latest/charts/line.html
  // https://www.chartjs.org/docs/latest/samples/line/line.html
};

const drawAMChart = () => {
  // Lets look at a example from
  // https://www.amcharts.com/demos/line-graph/
  // Documentation
  // https://www.amcharts.com/docs/v5/getting-started/
};

export { getUserData, getUserInfo };