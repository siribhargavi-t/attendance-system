// create basic express server with middleware and port 3000
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// create a GET API that returns "Attendance System API Running"
app.get('/', (req, res) => {
  res.send('Attendance System API Running');
});