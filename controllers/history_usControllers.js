const { login } = require("./loginusersControllers");

const controller = {};

controller.list = (req, res) => {
    const id = req.cookies.idusers;
    const phone_us_nm = req.cookies.phone_us
    const login_status = req.cookies.login_status;
    req.getConnection((err, conn) => {
        if(login_status == 1){
            conn.query('SELECT * FROM value_res WHERE user_id = ? GROUP BY count_res', [id], (err, hl) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ hl, session: req.session ,cookies: req.cookies })
                }
            });
        }else{
            conn.query('SELECT * FROM value_res WHERE phone_al = ? GROUP BY count_res', [phone_us_nm], (err, hl) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ hl, session: req.session,cookies: req.cookies })
                }
            });
        }
    });
};

controller.history_name_mm = (req, res) => {
    const id = req.body.idmenufind;
    const date_res = req.body.date_res;
    const idres = req.body.idres;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main WHERE idmenu_main = ?', [id], (err, mm) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ date_res, idres, name_mm: mm[0].name_mm, session: req.session,cookies: req.cookies })
            }
        });
    });
};

controller.history_name_ms = (req, res) => {
    const id = req.body.idmenufind;
    const date_res = req.body.date_res;
    const idres = req.body.idres;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub WHERE idmenu_sub = ?', [id], (err, ms) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ date_res, idres, name_ms: ms[0].name_ms, session: req.session,cookies: req.cookies })
            }
        });
    });
};

controller.list_all = (req, res) => {
    if (req.cookies.idusers) {
        const id = req.cookies.idusers;
        const phone_us_nm = req.cookies.phone_us;
        const login_status = req.cookies.login_status;
        req.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                // ทำตามที่คุณต้องการในกรณีเกิดข้อผิดพลาด
                res.redirect('/error');
                return;
            }

            let query, params;

            if (login_status == 1) {
                query = 'SELECT * FROM value_res where user_id = ? group by count_res;';
                params = [id];
            } else {
                query = 'SELECT * FROM value_res where phone_al = ? group by count_res;';
                params = [phone_us_nm];
            }

            conn.query(query, params, (err, num_hl) => {
                if (err) {
                    console.error(err);
                    // ทำตามที่คุณต้องการในกรณีเกิดข้อผิดพลาด
                    res.redirect('/error');
                    return;
                }

                const list_hl = [];

                // สร้าง promises สำหรับทุก query
                const promises = num_hl.map(num => {
                    return new Promise((resolve, reject) => {
                        const subQuery = 'SELECT * FROM  value_res where count_res = ?';
                        conn.query(subQuery, [num.count_res], (err, push_list_hl) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(push_list_hl);
                            }
                        });
                    });
                });

                // รอให้ทุก promises เสร็จสิ้นและเพิ่มข้อมูลลงใน list_hl
                Promise.all(promises)
                    .then(result => {
                        list_hl.push(...result);

                        const finalQuery = login_status == 1 ? 'SELECT * FROM value_res WHERE user_id = ? group by count_res' : 'SELECT * FROM value_res WHERE phone_al = ? group by count_res';
                        conn.query(finalQuery, [login_status == 1 ? id : phone_us_nm], (err, hl) => {
                            if (err) {
                                console.log(err);
                                // ทำตามที่คุณต้องการในกรณีเกิดข้อผิดพลาด
                                res.redirect('/error');
                                return;
                            }

                            res.render('history_us/history_list', { hl, num_hl, list_hl, session: req.session,cookies: req.cookies });
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        // ทำตามที่คุณต้องการในกรณีเกิดข้อผิดพลาด
                        res.redirect('/error');
                    });
            });
        });
    } else {
        res.redirect('/loginusers');
    }
};

controller.list_all1 = (req, res) => {
    const id = req.cookies.idusers;
    const phone_us_nm = req.cookies.phone_us;
    const login_status = req.cookies.login_status;
    req.getConnection((err, conn) => {
        if(login_status == 1){
            conn.query('SELECT * FROM value_res WHERE user_id = ? group by count_res', [id], (err, hl) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ hl, session: req.session,cookies: req.cookies })
                }
            });
        }else{
            conn.query('SELECT * FROM value_res WHERE phone_al = ? group by count_res', [phone_us_nm], (err, hl) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ hl, session: req.session,cookies: req.cookies })
                }
            });
        }
    });
};


controller.history_allname_mm = (req, res) => {
    const id = req.body.idmenufind;
    const date_res = req.body.date_res;
    const idres = req.body.idres;
    const status_al = req.body.status_al;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main WHERE idmenu_main = ?', [id], (err, mm) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ status_al, date_res, idres, name_mm: mm[0].name_mm, session: req.session,cookies: req.cookies })
            }
        });
    });
};

controller.history_allname_ms = (req, res) => {
    const id = req.body.idmenufind;
    const date_res = req.body.date_res;
    const idres = req.body.idres;
    const status_al = req.body.status_al;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub WHERE idmenu_sub = ?', [id], (err, ms) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ status_al, date_res, idres, name_ms: ms[0].name_ms, session: req.session ,cookies: req.cookies})
            }
        });
    });
};

controller.detail_hl = (req, res) => {
    if (req.cookies.idusers) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM value_res where idres = ?;', [id], (err, num_hl) => {
                conn.query('select * from forms_field ff join value_res vr on vr.field_id = ff.idfield WHERE forms_id = ? and count_res = ?', [num_hl[0].form_id,num_hl[0].count_res], (err, forms_field) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('history_us/detail_hl', { num_hl, forms_field, session: req.session,cookies: req.cookies });
                    }
                });
            });
        });
    } else {
        res.redirect('/loginusers');
    }
};










module.exports = controller;