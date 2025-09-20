const controller = {};
const moment = require('moment')

controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id AND status_id = 1 ORDER BY us.village_id', (err, users) => {
                conn.query('SELECT * FROM sex', (err, sex) => {
                    conn.query('SELECT * FROM village', (err, village) => {
                        if (err) {
                            console.log(err);
                        }
                        res.render('users/list', { users: users, sex: sex, village: village, session: req.session });
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

// controller.save = (req, res) => {
//     if (req.session.idadmins) {
//         const data = req.body;
//         let birthday_us = req.body.birthday_us;
//         if (birthday_us == '') {
//             birthday_us = "0000-00-00"
//         }
//         console.log(birthday_us);
//         req.getConnection((err, conn) => {
//             conn.query('INSERT INTO users set fname_us = ? , lname_us = ?, birthday_us = ? , phone_us = ? , idcard_us = ? , sex_us = ? ,address_us = ?, status_id = 1 ,village_id = ?,age = ?'
//                 , [data.fname_us, data.lname_us, birthday_us, data.phone_us, data.idcard_us, data.sex_us, data.address_us, data.village_id], (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         setTimeout(() => {
//                             res.redirect('/users',);
//                         }, 1000)
//                     }
//                 });
//         });
//     } else {
//         res.redirect('/');
//     }
// };


controller.save = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        let birthday_us = req.body.birthday_us;
        if (birthday_us == '') {
            birthday_us = "0000-00-00"
        }
        console.log(birthday_us);
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO users set fname_us = ? , lname_us = ?, birthday_us = ? , phone_us = ? , idcard_us = ? , sex_us = ? ,address_us = ?, status_id = 1 ,village_id = ?,age = ?'
                , [data.fname_us, data.lname_us, birthday_us, data.phone_us, data.idcard_us, data.sex_us, data.address_us, data.village_id,data.age], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/users',);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
};



controller.edit = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.id
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE idusers = ?;', [id], (err, users) => {
                conn.query('SELECT * FROM sex', (err, sex) => {
                    conn.query('SELECT * FROM village', (err, village) => {
                        const birthday_us = moment(users[0].birthday_us).format('yyyy-MM-DD')
                        res.json({
                            editusers: users[0], sex: sex, village: village, birthday_us, session: req.session
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

// controller.update = (req, res) => {
//     if (req.session.idadmins) {
//         const data = req.body;
//         let birthday_us = req.body.birthday_us;
//         if (birthday_us == '') {
//             birthday_us = "0000-00-00"
//         }
//         req.session.success = true;
//         req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
//         req.getConnection((err, conn) => {
//             conn.query('UPDATE users set fname_us = ? , lname_us = ? , phone_us = ? , idcard_us = ?, birthday_us = ? , sex_us = ? ,address_us = ?, village_id = ?, age = ? where idusers = ?',
//                 [data.fname_us, data.lname_us, data.phone_us, data.idcard_us, birthday_us, data.sex_us, data.address_us, data.village_id ,data.age, data.idusers], (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     setTimeout(() => {
//                         res.redirect('/users');
//                     }, 1000)
//                 });
//         });
//     } else {
//         res.redirect('/');
//     }
// }



controller.update = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        let birthday_us = req.body.birthday_us;
        if (birthday_us == '') {
            birthday_us = "0000-00-00";
        }
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE users SET fname_us = ?, lname_us = ?, phone_us = ?, idcard_us = ?, birthday_us = ?, sex_us = ?, address_us = ?, village_id = ?, age = ? WHERE idusers = ?',
                [data.fname_us, data.lname_us, data.phone_us, data.idcard_us, birthday_us, data.sex_us, data.address_us, data.village_id,data.age_us, data.idusers], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data); // Log the form data that was updated
                    }
                    setTimeout(() => {
                        res.redirect('/users');
                    }, 1000);
                });
        });
    } else {
        res.redirect('/');
    }
}





controller.checkdelete = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.id
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE idusers = ?;', [id], (err, users) => {
                conn.query('SELECT * FROM sex', (err, sex) => {
                    conn.query('SELECT * FROM village', (err, village) => {
                        const birthday_us = moment(users[0].birthday_us).format('yyyy-MM-DD')
                        res.json({
                            editusers: users[0], sex: sex, village: village, birthday_us, session: req.session
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.idusers;
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM users WHERE idusers = ?', [id], (err, admins) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/users');
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};

//-------------------------------------------นับจำนวนคนลงทะเบียน------แยกชายหญิง-------------
controller.listpeople = (req, res) => {
    if (req.session.idadmins) {
        var branch = req.session.branch;
        req.getConnection((err, conn) => {
            //------------------------------ค้นหาเฉพาะวัน-----------------
            conn.query('SELECT DATE_FORMAT(CURDATE(), "%Y-%m-%d") as datetime_al;', (err, date) => {
                conn.query("select * from users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson where  dateusers >=? AND dateusers <=?;", [date[0].date], (err, LatexReport) => {
                    conn.query("select * from users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson where  dateusers >=? AND dateusers <=?; ", [date[0].date], (err, LatexReportnomember) => {

                        //----------------
                        conn.query('SELECT * FROM users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson  AND status_id = 1 ORDER BY idusers desc;', (err, users) => {
                            conn.query('SELECT * FROM sex', (err, sex) => {
                                conn.query('SELECT * FROM village', (err, village) => {
                                    //-----------------------------------------นับจำนวนประชาชน--------------------------
                                    conn.query('SELECT COUNT(idusers)count FROM users where sex_us = 3 ', (err, count1) => { //--ชาย
                                        conn.query('SELECT COUNT(idusers)count FROM users where sex_us = 4 ', (err, count2) => { //--หญิง
                                            conn.query('SELECT COUNT(idusers)count FROM users where status_id = 1 ', (err, count3) => { //--อนุมัติ
                                                conn.query('SELECT COUNT(idusers)count FROM users where status_id = 2 ', (err, count4) => { //--รออนุมัติ
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    res.render('users/peoplecount', { users: users, sex: sex, village: village, count1: count1, count2: count2, count3: count3, count4: count4, session: req.session, data: LatexReport, data1: date[0], data2: LatexReportnomember });
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

//-------------------------------------------นับจำนวนคนลงทะเบียน------แยกชายหญิง-------------ค้นหาวันที่
controller.listpeopleseach = (req, res) => {
    if (req.session.idadmins) {
        const dateseach = req.body;
        var datey = dateseach.dateA;
        var datex = dateseach.dateB;
        var branch = req.session.branch;

        req.getConnection((err, conn) => {
            //------------------------------ค้นหาเฉพาะวัน-----------------
            conn.query('SELECT DATE_FORMAT(CURDATE(), "%Y-%m-%d") as datetime_al;', (err, date) => {
                conn.query("select * from users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson where  dateusers >=? AND dateusers <=?;", [dateseach.dateA, dateseach.dateB], (err, LatexReport) => {
                    conn.query("select * from users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson where  dateusers >=? AND dateusers <=?; ", [dateseach.dateA, dateseach.dateB], (err, LatexReportnomember) => {

                        //----------------
                        conn.query('SELECT * FROM users us JOIN sex ON us.sex_us = sex.idsex JOIN village vl ON vl.idvillage = us.village_id JOIN statusperson ss ON us.status_id = ss.idstatusperson  AND status_id = 1 ORDER BY idusers desc;', (err, users) => {
                            conn.query('SELECT * FROM sex', (err, sex) => {
                                conn.query('SELECT * FROM village', (err, village) => {
                                    //-----------------------------------------นับจำนวนประชาชน--------------------------
                                    conn.query('SELECT COUNT(idusers)count FROM users where sex_us = 3 ', (err, count1) => { //--ชาย
                                        conn.query('SELECT COUNT(idusers)count FROM users where sex_us = 4 ', (err, count2) => { //--หญิง
                                            conn.query('SELECT COUNT(idusers)count FROM users where status_id = 1 ', (err, count3) => { //--อนุมัติ
                                                conn.query('SELECT COUNT(idusers)count FROM users where status_id = 2 ', (err, count4) => { //--รออนุมัติ
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    res.render('users/peoplecountseach', { users: users, sex: sex, village: village, count1: count1, count2: count2, count3: count3, count4: count4, session: req.session, data: LatexReport, data1: date[0], data2: LatexReportnomember, datax: datex, datay: datey });
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

module.exports = controller;