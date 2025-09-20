const express = require('express');
const router = express.Router();

const villageViews = require('../controllers/villageControllers');

//!---------------------------------------------ADMIN จัดการข้อมูลหมู่บ้าน---------------------------------------------------------
router.get('/village',villageViews.list); //เข้าหน้ารายชื่อหหมูบ้าน
router.post('/village/save',villageViews.save); //เพิ่มรายชื่อหหมูบ้าน
router.post('/village/update',villageViews.update); //แก้ไขรายชื่อหหมูบ้าน
router.post('/village/delete',villageViews.delete); //ลบรายชื่อหหมูบ้าน

//!---------------------------------------------ADMIN จัดการข้อมูลประชาชนในหมู่บ้าน---------------------------------------------------------
router.get('/village/name:id',villageViews.list_users); //เข้าหน้ารายชื่อเจ้าหน้าที่ที่อยู่ในหน่วยงาน
router.post('/village/savename',villageViews.save_users); //เพิ่มรายชื่อประชาชนที่อยู่ในหมู่บ้าน
router.post('/village/updatename',villageViews.update_users); //แก้ไขรายชื่อประชาชนที่อยู่ในหมู่บ้าน
router.post('/village/deletename',villageViews.delete_users); //ลบรายชื่อประชาชนที่อยู่ในหมู่บ้าน

module.exports = router;