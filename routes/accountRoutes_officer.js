const express = require('express');
const router = express.Router();
const accountController_officer = require('../controllers/accountController_officer'); // ตรวจสอบเส้นทางไฟล์นี้

router.get('/aclist_officer', accountController_officer.showForm);

router.get('/account_officer', accountController_officer.addForm);
router.post('/aclist_officer', accountController_officer.add);
router.get('/aclist/delete_officer/:id', accountController_officer.showDeleteForm);
router.post('/aclist/delete_officer/:id', accountController_officer.deleteAccount);
router.get('/aclist/edit_officer/:id', accountController_officer.edit);
router.post('/aclist/edit_officer/:id', accountController_officer.update);
// router.put('/aclist/edit/:id', accountController_officer.update);



module.exports = router;
