const express = require('express');
const router = express.Router();
const RightsControllers = require('../controllers/RightsControllers'); // Ensure this path is correct

// Ensure the controller functions are correctly mapped
router.get('/Rights', RightsControllers.show);
router.post('/Rights/save', RightsControllers.save);
router.post('/Rights/delete', RightsControllers.delete);
router.post('/Rights/edit', RightsControllers.edit);
router.post('/Rights/update', RightsControllers.update);
router.post('/Rights/checkdelete', RightsControllers.checkdelete);

module.exports = router;
