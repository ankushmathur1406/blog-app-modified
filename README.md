event-portal-backend/
├── uploads/                         # Temporary file uploads
├── routes/
│   └── process.js                   # API route to handle file processing
├── controllers/
│   └── assignmentController.js      # Core logic to match events to employees
├── utils/
│   └── excelParser.js               # Helper functions for parsing Excel files
├── server.js                        # App entry point
├── package.json                     # Node dependencies

%%%%%

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const processRoute = require('./routes/process');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/process', upload.fields([
  { name: 'events', maxCount: 1 },
  { name: 'employees', maxCount: 1 }
]), processRoute);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});




%%%%
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/', assignmentController.processAssignments);

module.exports = router;

%%%%
const fs = require('fs');
const moment = require('moment');
const { parseEvents, parseEmployees } = require('../utils/excelParser');

exports.processAssignments = (req, res) => {
  try {
    const eventsFile = req.files['events'][0].path;
    const employeesFile = req.files['employees'][0].path;

    const events = parseEvents(eventsFile);
    const employees = parseEmployees(employeesFile);

    let assignments = [];

    events.forEach(event => {
      const eventDay = moment(event.Date).format('dddd');
      const start = moment(event['Start Time'], 'HH:mm');
      const end = moment(event['End Time'], 'HH:mm');

      let assigned = false;

      for (let emp of employees) {
        const availability = emp[eventDay] || 'N';
        if (availability === 'A') {
          assignments.push({
            Event: event['Event Name'],
            Date: eventDay,
            Start: start.format('HH:mm'),
            End: end.format('HH:mm'),
            AssignedTo: emp.Name
          });
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        assignments.push({
          Event: event['Event Name'],
          Date: eventDay,
          Start: start.format('HH:mm'),
          End: end.format('HH:mm'),
          AssignedTo: '❌ No Available Employee'
        });
      }
    });

    fs.unlinkSync(eventsFile);
    fs.unlinkSync(employeesFile);

    res.json({ results: assignments });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


%%%
const xlsx = require('xlsx');

exports.parseEvents = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
};

exports.parseEmployees = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
};


%%%
