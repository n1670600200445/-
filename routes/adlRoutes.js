// adlRoutes.js
const express=require('express');
const router=express.Router();
const adlController=require('../controllers/adlController');

// แสดงแบบฟอร์ม ADL
router.get('/adl', adlController.showForm);

// ประมวลผลคะแนน
router.post('/adl', adlController.calculateScore);



//----------------------------ประเมิน
// แสดงแบบฟอร์ม ADL
router.get('/adl3', adlController.showForm3);

// ประมวลผลคะแนน
router.post('/adl3', adlController.calculateScore3);



//---------------------เพิ่มใหม่----------------

router.get('/adl2', adlController.showForm2);

// ประมวลผลคะแนน
router.post('/adl2', adlController.calculateScore2);

module.exports = router;
