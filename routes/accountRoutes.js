const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountcontroller'); // ตรวจสอบเส้นทางไฟล์นี้

router.get('/aclist', accountController.showForm);
router.get('/account', accountController.addForm);
router.post('/aclist', accountController.add);
router.get('/aclist/delete/:id', accountController.showDeleteForm);
router.post('/aclist/delete/:id', accountController.deleteAccount);
router.get('/aclist/edit/:id', accountController.edit);
router.post('/aclist/edit/:id', accountController.update);
// router.put('/aclist/edit/:id', accountController.update);


module.exports = router;
