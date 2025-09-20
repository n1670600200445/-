const controller = {};

//!---------------------------------------------ADMIN จัดการข้อมูลหมู่บ้าน---------------------------------------------------------
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM village', (err, village) => {
                let idvillage = []
                let name_village = []
                for (i in village) {
                    idvillage.push(village[i].idvillage)
                    name_village.push(village[i].name_village)
                }
                if (err) {
                    console.log(err);
                }
                res.render('village/list', {
                    village: village,
                    idvillage,
                    name_village,
                    session: req.session
                });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO village set name_village = ?'
                , [data.name_village], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/village',);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
}

controller.update = (req, res) => {
    if (req.session.idadmins) {
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการหมู่บ้านเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE village set name_village = ? where idvillage = ?',
                [req.body.name_village, req.body.idvillage], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/village');
                    }, 1000)
                });
        });
    } else {
        res.redirect('/');
    }
}

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM village WHERE idvillage = ?', [req.body.idvillage], (err, admins) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/village');
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};

//!---------------------------------------------ADMIN จัดการข้อมูลประชาชนในหมู่บ้าน---------------------------------------------------------
controller.list_users = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM village vl JOIN users us ON vl.idvillage = us.village_id JOIN sex s ON us.sex_us = s.idsex WHERE village_id = ? AND status_id =1 ORDER BY idusers', [id], (err, village) => {
                conn.query('SELECT * FROM sex', (err1, sex) => {
                    conn.query('SELECT * FROM village WHERE idvillage = ?', [id], (err1, villagetype) => {


                        if (err) {
                            console.log(err);
                        }
                        res.render('village/list_users', { village: village, sex: sex, villagetype: villagetype, session: req.session });
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save_users = (req, res) => {
    if (req.session.idadmins) {
        const fname_us = req.body.fname_us;
        const lname_us = req.body.lname_us;
        const phone_us = req.body.phone_us;
        const idcard_us = req.body.idcard_us;
        const sex_us = req.body.sex_us;
        const address_us = req.body.address_us;
        const village_id = req.body.village_id;
        let birthday_us = req.body.birthday_us;
        if (birthday_us == '') {
            birthday_us = '0000-00-00'
        }
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO users set  fname_us = ? , lname_us = ? , phone_us = ? , idcard_us = ? , sex_us = ? ,address_us = ?, status_id = 1 ,village_id = ?, birthday_us=?'
                , [fname_us, lname_us, phone_us, idcard_us, sex_us, address_us, village_id,birthday_us], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/village/name' + village_id);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
}

controller.delete_users = (req, res) => {
    if (req.session.idadmins) {
        const idusers = req.body.idusers;
        const village_id = req.body.idvillage;
        console.log(village_id);
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM users WHERE idusers = ?', [idusers], (err, admins) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/village/name' + village_id);
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};

controller.edit_users = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        const { idusers } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE idusers = ?;', [idusers], (err, users) => {
                conn.query('SELECT * FROM village ', (err1, village) => {
                    conn.query('SELECT * FROM sex ', (err1, sex) => {
                        res.render('village/edit_users', {
                            editusers: users[0], sex: sex, village: village, id, session: req.session
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

controller.update_users = (req, res) => {
    if (req.session.idadmins) {
        const idusers = req.body.idusers;
        const fname_us = req.body.fname_us;
        const lname_us = req.body.lname_us;
        const phone_us = req.body.phone_us;
        const idcard_us = req.body.idcard_us;
        const sex_us = req.body.sex_us;
        const address_us = req.body.address_us;
        const village_id = req.body.village_id;
        let birthday_us = req.body.birthday_us;
        if (birthday_us == '') {
            birthday_us = '0000-00-00'
        }
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการหมู่บ้านเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE users set fname_us = ? , lname_us = ? , phone_us = ? , idcard_us = ? , sex_us = ? ,address_us = ?,village_id = ?,birthday_us = ? WHERE idusers = ?',
                [fname_us, lname_us, phone_us, idcard_us, sex_us, address_us, village_id,birthday_us, idusers], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/village/name' + village_id);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
}
module.exports = controller;