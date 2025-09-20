const controller = {};
const request = require('request')
const uuidv4 = require('uuid').v4;
const fs = require('fs');

//!-------------------------------------------------------------แจ้งเหตุประชาชนทั่วไป--------------------------------------------------
controller.index_users = (req, res) => {
    if (req.cookies.idusers) {
        const today = new Date();
        const suc_day = today.toISOString().split('T')[0];
        const idcard_us = req.cookies.idcard_us;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE idcard_us = ? AND status_id = 1', [idcard_us], (err, data) => {
                conn.query('SELECT * FROM users WHERE idcard_us = ?', [data[0].idusers], (err, data2) => {
                    conn.query('SELECT * FROM menu_main WHERE member_radio = 1 and del_status = 0 order by member_order', (err, menu_data) => {
                        let listmenu_us = [];
                        if(data[0].group_us){
                            const groupUsData = data[0].group_us;
                            const groupUsArray = groupUsData.split(',').map(Number);
                            for (let i = 0; i < menu_data.length; i++) {
                                if (menu_data[i].group_radio == 1) {
                                    listmenu_us.push(menu_data[i]);
                                } else {
                                    const menuGroupArray = menu_data[i].group_mm.split(',').map(Number);
                                    const commonValues = groupUsArray.filter(value => menuGroupArray.includes(value));
    
                                    if (commonValues.length > 0) {
                                        listmenu_us.push(menu_data[i]);
                                    }
                                }
                            }
                        }
                        
                        if (err) {
                            console.log(err);
                        }
                        if (data.length > 0) {
                            if (data[0].phone_us.length < 10) {
                                res.cookie('idusers', data[0].idusers);
                                // req.session.fullname_us =  data[0].fname_us + data[0].lname_us;
                                res.render('alerts/index', {
                                    session: req.session,
                                    idcard_us,
                                    data,
                                    data2,
                                    menu_data,
                                    cookies: req.cookies,
                                });
                            } else {
                                res.cookie('idusers', data[0].idusers);
                                // req.session.fullname_us =  data[0].fname_us +' '+ data[0].lname_us;
                                res.render('alerts/index', {
                                    session: req.session,
                                    idcard_us,
                                    data,
                                    data2,
                                    menu_data,
                                    cookies: req.cookies,
                                });
                                // res.redirect('/indexusers');
                            }
                            // }
                        } else if (data2.length > 0) {
                            req.session.topic = true
                            res.redirect('/loginusers')
                        } else {
                            setTimeout(() => {
                                req.session.topic = false;
                                res.redirect('/loginusers');
                            }, 1000)
                        }
                    });
                });
            });
        })
    } else {
        res.redirect('/loginusers')
    }
};

controller.menu_us = (req, res) => {
    if (req.cookies.idusers) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE mm_id = ? and del_status = 0 order by member_order;', [id], (err, menu_sub) => {
                if (err) {
                    res.json(err);
                }
                res.render('alerts/menu', { menu_sub, cookies: req.cookies });
            })
        })
    } else {
        res.redirect('/loginusers')
    }
};

controller.notify_m = (req, res) => {
    if (req.cookies.idusers) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            res.render('alerts/notify', { mn: 1, mn_id: id, cookies: req.cookies });
        });
    } else {
        res.redirect('/loginusers');
    }
};

controller.notify_s = (req, res) => {
    if (req.cookies.idusers) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            res.render('alerts/notify', { mn: 2, mn_id: id, cookies: req.cookies });
        });
    } else {
        res.redirect('/loginusers');
    }
};

controller.notify_showform = (req, res) => {
    if (req.cookies.idusers) {
        const mn = req.body.mn;
        const mn_id = req.body.mn_id;
        req.getConnection((err, conn) => {
            if (mn == 1) {
                conn.query('SELECT * FROM menu_main WHERE idmenu_main =?;', [mn_id], (err, mm) => {
                    conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_mm], (err, ff) => {
                        conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_mm], (err, f) => {
                            res.json({ mn, mm, ff, f, cookies: req.cookies });
                        });
                    });
                });
            } else {
                conn.query('SELECT * FROM menu_sub WHERE idmenu_sub =?;', [mn_id], (err, mm) => {
                    conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_ms], (err, ff) => {
                        conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_ms], (err, f) => {
                            res.json({ mn, mm, ff, f, cookies: req.cookies });
                        });
                    });
                });
            }
        });
    } else {
        res.redirect('/loginusers');
    }
};


controller.history = (req, res) => {
    if (req.cookies.idusers) {
        const idusers = req.cookies.idusers;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM alerts al JOIN alertstype alty ON al.alertstype_id = alty.idalertstype JOIN statusalerts stal ON stal.idstatusalerts = al.status_al WHERE userid_al = ? ORDER BY idalerts', [idusers], (err, alerts) => {
                conn.query('SELECT DATE_FORMAT(DATE_ADD(datetime_al, INTERVAL 543 YEAR), "วันที่ %d/%m/%Y" )date, DATE_FORMAT(datetime_al, "เวลา %H:%i:%s น." )time,  DATE_FORMAT(DATE_ADD(datesuccess_al, INTERVAL 543 YEAR), "วันที่ %d/%m/%Y" )closejob FROM alerts al JOIN alertstype alty ON al.alertstype_id = alty.idalertstype WHERE userid_al = ? ORDER BY idalerts', [idusers], (err, timealerts) => {
                    conn.query('SELECT * FROM users WHERE idusers =?;', [idusers], (err, users) => {
                        if (err) {
                            res.json(err);
                        }
                        res.render('alerts/history', { users: users[0], alerts: alerts, timealerts: timealerts, cookies: req.cookies });
                    })
                })
            })
        })
    } else {
        res.redirect('/loginusers')
    }
};

//----------------------------------------------------------------อันเก่า--------------
// controller.save = (req, res) => {
//     if (req.cookies.idusers) {
//         const data = req.body;
//         const idusers = req.cookies.idusers;
//         const { id } = req.params;
//         const setmenu = id.split("menu");
//         const mn_page = setmenu[0]
//         const idmn = setmenu[1]

//         req.getConnection((err, conn) => {
//             conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
//                 let setgroup_value = '';
//                 if (max_count[0].max === null) {
//                     setgroup_value = 1;
//                 } else {
//                     setgroup_value = max_count[0].max + 1;
//                 }
//                 if (data) {
//                     for (const [key, value] of Object.entries(data)) {
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,user_id = ?,count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, idusers, setgroup_value], (err1, notify_save) => {

//                             });
//                         });
//                     }
//                 }

//                 if (req.files) {
//                     for (const file of Object.values(req.files)) {
//                         const { fieldname, filename } = file;
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,user_id = ?,count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, idusers, setgroup_value], (err1, notify_save1) => {

//                             });
//                         });
//                     }
//                 }

//                 res.render('alerts/success', {
//                     cookies: req.cookies
//                 });
                // if (err1) {
                //     console.log(err3);
                //     res.render('alerts/error', {
                //         cookies: req.cookies
                //     });
                // } else if (err2) {
                //     console.log(err2);
                // } else if (err1) {
                //     console.log(err1);
                // } else {
                //     for (var i = 0; i <= alertstype.length; i++) {
                //         if (data.alertstype_id == alertstype[0].idalertstype && data.latitude) {
                // request({
                //     method: 'POST',
                //     url: 'https://notify-api.line.me/api/notify',
                //     header: {
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     auth: {
                //         bearer: alertstype[0].token_notify, //token
                //     },
                //     form: {
                //         message: alertstype[0].name_alty + ' (ผู้แจ้ง)' + users[0].fname_us + ' ' + users[0].lname_us + ' (เบอร์โทรติดต่อ)' + users[0].phone_us + ' (ตำแหน่ง) ' + data.latitude + ',' + data.longitude + ' (รายละเอียด)' + data.detail_al + ' (link) https://wiangthoeng.thesaban.org/personnelAlerts', //ข้อความที่จะส่ง
                //     },
                // },)


                // } else {
                //     res.render('alerts/error', {
                //         cookies: req.cookies
                //     });
                // }
                // }
                // }
//             });
//         });
//     } else {
//         res.redirect('/loginusers');
//     }
// };

//----------------------------อันใหม่--------------------------------------------------------------

// controller.save = (req, res) => {
//     if (req.cookies.idusers) {
//         const data = req.body;
//         const idusers = req.cookies.idusers;
//         const { id } = req.params;
//         const setmenu = id.split("menu");
//         const mn_page = setmenu[0];
//         const idmn = setmenu[1];

//         req.getConnection((err, conn) => {
//             if (err) return res.json(err);

//             conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
//                 if (err1) return res.json(err1);

//                 let setgroup_value = '';
//                 if (max_count[0].max === null) {
//                     setgroup_value = 1;
//                 } else {
//                     setgroup_value = max_count[0].max + 1;
//                 }

//                 // บันทึกข้อมูลที่เป็นฟิลด์
//                 if (data) {
//                     for (const [key, value] of Object.entries(data)) {
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                             if (err1) return res.json(err1);

//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, user_id = ?, count_res = ?', 
//                             [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, idusers, setgroup_value], (err1) => {
//                                 if (err1) console.log(err1);
//                             });
//                         });
//                     }
//                 }

//                 // บันทึกข้อมูลที่เป็นไฟล์
//                 if (req.files) {
//                     for (const file of Object.values(req.files)) {
//                         const { fieldname, filename } = file;
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                             if (err1) return res.json(err1);

//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, user_id = ?, count_res = ?', 
//                             [idmn, mn_page, ff1[0].forms_id, fieldname, filename, idusers, setgroup_value], (err1) => {
//                                 if (err1) console.log(err1);
//                             });
//                         });
//                     }
//                 }

//                 // ส่งการแจ้งเตือนผ่าน LINE Notify
//                 conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
//                     if (error) return res.json(error);
                    

//                     request({
//                         method: 'POST',
//                         url: 'https://notify-api.line.me/api/notify',
//                         headers: {
//                             'Content-Type': 'application/x-www-form-urlencoded',
//                             'Authorization': `Bearer ${token[0].line_token}` // ใช้โทเค็นจากฐานข้อมูล
//                         },
//                         form: {
//                             message: 'ได้มีการส่งแบบฟอมร์', // ข้อความที่ต้องการส่ง
//                         }
//                     }, (err, response, body) => {
//                         if (err) {
//                             console.error('Error sending LINE Notify:', err);
//                         }

//                         // แสดงหน้าความสำเร็จ
//                         res.render('alerts/success'); // เปลี่ยนไปที่หน้า `/success` หรือหน้าที่คุณต้องการ
//                     });
//                 });
//             });
//         });
//     } else {
//         res.redirect('/loginusers');
//     }
// };

//---------------------------------------แก้ V2----------------------------


controller.save = (req, res) => {
    if (req.cookies.idusers) {
        const data = req.body;
        const idusers = req.cookies.idusers;
        const { id } = req.params;
        const setmenu = id.split("menu");
        const mn_page = setmenu[0];
        const idmn = setmenu[1];

        req.getConnection((err, conn) => {
            if (err) return res.json(err);

            conn.query('SELECT MAX(count_res) AS max FROM value_res', (err1, max_count) => {
                if (err1) return res.json(err1);

                let setgroup_value = max_count[0].max === null ? 1 : max_count[0].max + 1;

                // Save field data
                if (data) {
                    const fieldQueries = Object.entries(data).map(([key, value]) => {
                        return new Promise((resolve, reject) => {
                            conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
                                if (err1) return reject(err1);

                                conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, user_id = ?, count_res = ?', 
                                [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, idusers, setgroup_value], (err1) => {
                                    if (err1) return reject(err1);
                                    resolve();
                                });
                            });
                        });
                    });

                    Promise.all(fieldQueries).then(() => {
                        // Save file data
                        if (req.files) {
                            const fileQueries = Object.values(req.files).map(file => {
                                const { fieldname, filename } = file;
                                return new Promise((resolve, reject) => {
                                    conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
                                        if (err1) return reject(err1);

                                        conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, user_id = ?, count_res = ?', 
                                        [idmn, mn_page, ff1[0].forms_id, fieldname, filename, idusers, setgroup_value], (err1) => {
                                            if (err1) return reject(err1);
                                            resolve();
                                        });
                                    });
                                });
                            });

                            Promise.all(fileQueries).then(() => {
                                // Get name_mm from menu_main
                                conn.query('SELECT name_mm FROM menu_main WHERE idmenu_main = ?', [idmn], (err2, menu_main_result) => {
                                    if (err2) return res.json(err2);

                                    const name_mm = menu_main_result[0].name_mm;

                                    // Send LINE Notify
                                    conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
                                        if (error) return res.json(error);

                                        const formName = `/alerts/${mn_page}`; // Form name
                                        request({
                                            method: 'POST',
                                            url: 'https://notify-api.line.me/api/notify',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Authorization': `Bearer ${token[0].line_token}` // Use token from database
                                            },
                                            form: {
                                                message: `สมาชิกได้มีการส่งแบบฟอมร์  (ชื่อฟอร์ม: ${name_mm})`, // Message with name_mm
                                            }
                                        }, (err, response, body) => {
                                            if (err) {
                                                console.error('Error sending LINE Notify:', err);
                                            }

                                            // Show success page
                                            res.render('alerts/success'); // Change to the page you want
                                        });
                                    });
                                });
                            }).catch(error => res.json(error));
                        } else {
                            // If no files are uploaded
                            res.render('alerts/success'); // Change to the page you want
                        }
                    }).catch(error => res.json(error));
                } else {
                    // If no data is provided
                    res.render('alerts/success'); // Change to the page you want
                }
            });
        });
    } else {
        res.redirect('/loginusers');
    }
};



//!-------------------------------------------------------------แจ้งเหตุประชาชนทั่วไป--------------------------------------------------
controller.menu_normal = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main WHERE nomember_radio = 1 and del_status = 0 order by nomember_order', (err, menu_data) => {
            res.render('alertsnormal/index', { menu_data ,cookies: req.cookies});
        })
    })
};

controller.menu_normal_sub = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub WHERE mm_id = ? and nomember_radio = 1 and del_status = 0 order by nomember_order;', [id], (err, menu_data) => {
            if (err) {
                res.json(err);
            }
            res.render('alertsnormal/menu', { menu_data ,cookies: req.cookies});
        })
    })
};

controller.notify_nm_m = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        res.render('alertsnormal/notify', { mn: 1, mn_id: id ,cookies: req.cookies});
    });
};

controller.notify_nm_s = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        res.render('alertsnormal/notify', { mn: 2, mn_id: id ,cookies: req.cookies});
    });
};

controller.notify_nm_showform = (req, res) => {
    const mn = req.body.mn;
    const mn_id = req.body.mn_id;
    req.getConnection((err, conn) => {
        if (mn == 1) {
            conn.query('SELECT * FROM menu_main WHERE idmenu_main =?;', [mn_id], (err, mm) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_mm], (err, ff) => {
                    conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_mm], (err, f) => {
                        res.json({ mn, mm, ff, f, cookies: req.cookies });
                    });
                });
            });
        } else {
            conn.query('SELECT * FROM menu_sub WHERE idmenu_sub =?;', [mn_id], (err, mm) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_ms], (err, ff) => {
                    conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_ms], (err, f) => {
                        res.json({ mn, mm, ff, f, cookies: req.cookies });
                    });
                });
            });
        }
    });
};


// controller.save_normal = (req, res) => {
//     const data = req.body;
//     const { id } = req.params;
//     const setmenu = id.split("menu");
//     const mn_page = setmenu[0]
//     const idmn = setmenu[1]
//     const phone_us_nm = req.cookies.phone_us;

//     req.getConnection((err, conn) => {
//         conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
//             let setgroup_value = '';
//             if (max_count[0].max === null) {
//                 setgroup_value = 1;
//             } else {
//                 setgroup_value = max_count[0].max + 1;
//             }
//             if (data) {
//                 for (const [key, value] of Object.entries(data)) {
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                         conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,phone_al = ?,count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, phone_us_nm, setgroup_value], (err1, notify_save) => {

//                         });
//                     });
//                 }
//             }

//             if (req.files) {
//                 for (const file of Object.values(req.files)) {
//                     const { fieldname, filename } = file;
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                         conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,phone_al = ?,count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, phone_us_nm, setgroup_value], (err1, notify_save1) => {

//                         });
//                     });
//                 }
//             }

//             res.render('alerts/success', {
//                 cookies: req.cookies
//             });
            // if (err3) {
            //     console.log(err3);
            //     res.render('alerts/error', {
            //     });
            // } else if (err1) {
            //     console.log(err1);
            // } else {
            //     if (data.alertstype_id == alertstype[0].idalertstype && data.latitude_al) {
            //         request({
            //             method: 'POST',
            //             url: 'https://notify-api.line.me/api/notify',
            //             header: {
            //                 'Content-Type': 'application/x-www-form-urlencoded',
            //             },
            //             auth: {
            //                 bearer: alertstype[0].token_notify, //token
            //             },
            //             form: {
            //                 message: 'ผู้แจ้งทั่วไป!!' + alertstype[0].name_alty + ' (รายละเอียด)' + data.detail_al + ' (ชื่อผู้รายงาน)'
            //                     + data.usernamealerts + ' ' + data.phonealerts + "   Google map: " + 'https://www.google.com/maps/search/?api=1&query='
            //                     + data.latitude_al + ',' + data.longitude_al + '&@' + data.latitude_al + ',' + data.longitude_al + ',z=17', //ข้อความที่จะส่ง
            //             },
            //         }, (err, httpResponse, body) => {
            //             if (err) {
            //                 console.log(err)
            //             } else {
            //                 console.log(body)
            //             }
            //         })

            //         res.render('alerts/success', {
            //         });
            //     } else {
            //         res.render('alerts/error', {
            //         });
            //     }
            // }
            // });
//         });
//     });
// };


//--------------------------------------------------------แก้ใหม่---------------------------


controller.save_normal = (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const setmenu = id.split("menu");
    const mn_page = setmenu[0];
    const idmn = setmenu[1];
    const phone_us_nm = req.cookies.phone_us;

    req.getConnection((err, conn) => {
        conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
            let setgroup_value = '';
            if (max_count[0].max === null) {
                setgroup_value = 1;
            } else {
                setgroup_value = max_count[0].max + 1;
            }

            // Saving form data
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
                        conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,phone_al = ?,count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, phone_us_nm, setgroup_value], (err1, notify_save) => {
                        });
                    });
                }
            }

            // Saving file uploads
            if (req.files) {
                for (const file of Object.values(req.files)) {
                    const { fieldname, filename } = file;
                    conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
                        conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,phone_al = ?,count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, phone_us_nm, setgroup_value], (err1, notify_save1) => {
                        });
                    });
                }
            }

            // LINE Notify alert
            conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
                if (error) return res.json(error);

                const formName = `/alerts/${mn_page}`; // Form name
                request({
                    method: 'POST',
                    url: 'https://notify-api.line.me/api/notify',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token[0].line_token}` // Use token from database
                    },
                    form: {
                        message: `ได้มีการส่งแบบฟอร์ม  (ชื่อฟอร์ม: ${formName})`, // Message with formName
                    }
                }, (err, response, body) => {
                    if (err) {
                        console.error('Error sending LINE Notify:', err);
                    }

                    // Show success page
                    res.render('alerts/success', {
                        cookies: req.cookies
                    });
                });
            });
        });
    });
};


controller.update = (req, res) => {
    const data = req.body;
    const { id } = req.params;
    req.session.success = true;
    req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
    req.getConnection((err, conn) => {
        conn.query('UPDATE alerts set checkdel = 0  where idalerts = ?',
            [id], (err, result) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/admin/alerts/member');
                }, 1000)
            });

    });
}

controller.update2 = (req, res) => {
    const data = req.body;
    const { id } = req.params;
    req.session.success = true;
    req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
    req.getConnection((err, conn) => {
        conn.query('UPDATE alerts set checkdel = 0  where idalerts = ?',
            [id], (err, result) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/admin/alerts/general');
                }, 1000)
            });

    });
}

controller.delalerts = (req, res) => {
    const { id } = req.params;
    const errorss = { errors: [{ value: '', msg: 'ลบข้อมูลนี้ไม่ได้ ', param: '', location: '' }] }/////Update
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM alerts WHERE idalerts= ?', [id], (err, adminList) => {
            if (err) {
                req.session.errors = errorss;
                req.session.success = false;
            } else {
                req.session.success = true;
                req.session.topic = "ลบข้อมูลเสร็จแล้ว";
            }
            res.redirect('/admin/alerts/member');
        });
    });
};


controller.notify_qrcode = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        res.render('alertsnormal/qrcode_notify', {id, cookies: req.cookies });
    });
};

controller.notify_qrcode_create = (req, res) => {
    const api_form = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [api_form], (err, ff) => {
            conn.query('SELECT * FROM forms WHERE idforms = ?;', [api_form], (err, f) => {
                res.json({ ff, f, cookies: req.cookies });
            });
        });
    });
};

// controller.save_qrcode = (req, res) => {
//     const data = req.body;
//     req.getConnection((err, conn) => {
//         conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
//             let setgroup_value = '';
//             if (max_count[0].max === null) {
//                 setgroup_value = 1;
//             } else {
//                 setgroup_value = max_count[0].max + 1;
//             }
//             if (data) {
//                 for (const [key, value] of Object.entries(data)) {
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                         conn.query('INSERT INTO value_res SET idmenu = 0, menu_page = 0, form_id = ?,field_id = ?,value_res = ?,user_id = 0,count_res = ?', [ ff[0].forms_id, ff[0].idfield, `${value}`, setgroup_value], (err1, notify_save) => {

//                         });
//                     });
//                 }
//             }

//             if (req.files) {
//                 for (const file of Object.values(req.files)) {
//                     const { fieldname, filename } = file;
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                         conn.query('INSERT INTO value_res SET idmenu = 0, menu_page = 0, form_id = ?,field_id = ?,value_res = ?,user_id = 0,count_res = ?', [ ff1[0].forms_id, fieldname, filename, setgroup_value], (err1, notify_save1) => {

//                         });
//                     });
//                 }
//             }

//             res.render('alerts/success', {
//                 cookies: req.cookies
//             });
            // if (err3) {
            //     console.log(err3);
            //     res.render('alerts/error', {
            //     });
            // } else if (err1) {
            //     console.log(err1);
            // } else {
            //     if (data.alertstype_id == alertstype[0].idalertstype && data.latitude_al) {
            //         request({
            //             method: 'POST',
            //             url: 'https://notify-api.line.me/api/notify',
            //             header: {
            //                 'Content-Type': 'application/x-www-form-urlencoded',
            //             },
            //             auth: {
            //                 bearer: alertstype[0].token_notify, //token
            //             },
            //             form: {
            //                 message: 'ผู้แจ้งทั่วไป!!' + alertstype[0].name_alty + ' (รายละเอียด)' + data.detail_al + ' (ชื่อผู้รายงาน)'
            //                     + data.usernamealerts + ' ' + data.phonealerts + "   Google map: " + 'https://www.google.com/maps/search/?api=1&query='
            //                     + data.latitude_al + ',' + data.longitude_al + '&@' + data.latitude_al + ',' + data.longitude_al + ',z=17', //ข้อความที่จะส่ง
            //             },
            //         }, (err, httpResponse, body) => {
            //             if (err) {
            //                 console.log(err)
            //             } else {
            //                 console.log(body)
            //             }
            //         })

            //         res.render('alerts/success', {
            //         });
            //     } else {
            //         res.render('alerts/error', {
            //         });
            //     }
            // }
            // });
//         });
//     });
// };


//-------------------------ใหม่-----------------------

controller.save_qrcode = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
            let setgroup_value = '';
            if (max_count[0].max === null) {
                setgroup_value = 1;
            } else {
                setgroup_value = max_count[0].max + 1;
            }

            // Saving form data
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
                        conn.query('INSERT INTO value_res SET idmenu = 0, menu_page = 0, form_id = ?, field_id = ?, value_res = ?, user_id = 0, count_res = ?', 
                        [ff[0].forms_id, ff[0].idfield, `${value}`, setgroup_value], (err1, notify_save) => {
                            // Check for errors
                            if (err1) {
                                console.error('Error saving form data:', err1);
                            }
                        });
                    });
                }
            }

            // Saving file uploads
            if (req.files) {
                for (const file of Object.values(req.files)) {
                    const { fieldname, filename } = file;
                    conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
                        conn.query('INSERT INTO value_res SET idmenu = 0, menu_page = 0, form_id = ?, field_id = ?, value_res = ?, user_id = 0, count_res = ?', 
                        [ff1[0].forms_id, fieldname, filename, setgroup_value], (err1, notify_save1) => {
                            // Check for errors
                            if (err1) {
                                console.error('Error saving file data:', err1);
                            }
                        });
                    });
                }
            }

            // LINE Notify alert
            conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
                if (error) {
                    console.error('Error retrieving LINE token:', error);
                    return res.json(error);
                }

                const formName = `/alerts/qrcode`; // Form name can be modified as per your need
                const message = `ประชาชทั่วไป ได้มีการส่งแบบฟอร์ม  (ชื่อฟอร์ม: ${formName})`; // Customize message if necessary

                request({
                    method: 'POST',
                    url: 'https://notify-api.line.me/api/notify',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token[0].line_token}` // Use token from database
                    },
                    form: {
                        message: message // Send message via LINE Notify
                    }
                }, (err, response, body) => {
                    if (err) {
                        console.error('Error sending LINE Notify:', err);
                        return res.render('alerts/error', {
                            error: 'Error sending LINE Notify'
                        });
                    }

                    if (response.statusCode !== 200) {
                        console.error('LINE Notify error response:', body);
                        return res.render('alerts/error', {
                            error: `LINE Notify failed with status ${response.statusCode}`
                        });
                    }

                    // Show success page
                    res.render('alerts/success', {
                        cookies: req.cookies
                    });
                });
            });
        });
    });
};

controller.index_menu = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main WHERE nomember_radio = 1 and del_status = 0 and status_radio = 1 and group_radio = 1 order by nomember_order;', (err, menu_data) => {
            res.render('alertsnouser/index', { menu_data ,cookies: req.cookies});
        })
    })
};

controller.menu_nouser_sub = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub WHERE mm_id = ? and nomember_radio = 1 and del_status = 0 and status_ms = 1 and group_radio = 1 order by nomember_order;', [id], (err, menu_data) => {
            if (err) {
                res.json(err);
            }
            res.render('alertsnouser/menu', { menu_data ,cookies: req.cookies});
        })
    })
};

controller.notify_nus_m = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        res.render('alertsnormal/notify', { mn: 1, mn_id: id ,cookies: req.cookies});
    });
};

controller.notify_nus_s = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        res.render('alertsnormal/notify', { mn: 2, mn_id: id ,cookies: req.cookies});
    });
};

controller.notify_nus_showform = (req, res) => {
    const mn = req.body.mn;
    const mn_id = req.body.mn_id;
    req.getConnection((err, conn) => {
        if (mn == 1) {
            conn.query('SELECT * FROM menu_main WHERE idmenu_main =?;', [mn_id], (err, mm) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_mm], (err, ff) => {
                    conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_mm], (err, f) => {
                        res.json({ mn, mm, ff, f, cookies: req.cookies });
                    });
                });
            });
        } else {
            conn.query('SELECT * FROM menu_sub WHERE idmenu_sub =?;', [mn_id], (err, mm) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 order by position_field;', [mm[0].form_ms], (err, ff) => {
                    conn.query('SELECT * FROM forms WHERE idforms = ?;', [mm[0].form_ms], (err, f) => {
                        res.json({ mn, mm, ff, f, cookies: req.cookies });
                    });
                });
            });
        }
    });
};

//-------------------------------------------------------------------อันเก่า-------------------------

// controller.save_nouser = (req, res) => {
//     const data = req.body;
//     const { id } = req.params;
//     const setmenu = id.split("menu");
//     const mn_page = setmenu[0]
//     const idmn = setmenu[1]

//     req.getConnection((err, conn) => {
//         conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
//             let setgroup_value = '';
//             if (max_count[0].max === null) {
//                 setgroup_value = 1;
//             } else {
//                 setgroup_value = max_count[0].max + 1;
//             }
//             if (data) {
//                 for (const [key, value] of Object.entries(data)) {
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                         conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, setgroup_value], (err1, notify_save) => {

//                         });
//                     });
//                 }
//             }

//             if (req.files) {
//                 for (const file of Object.values(req.files)) {
//                     const { fieldname, filename } = file;
//                     conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                         conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, setgroup_value], (err1, notify_save1) => {

//                         });
//                     });
//                 }
//             }

//             res.render('alerts/success', {
//                 cookies: req.cookies
//             });
            // if (err3) {
            //     console.log(err3);
            //     res.render('alerts/error', {
            //     });
            // } else if (err1) {
            //     console.log(err1);
            // } else {
            //     if (data.alertstype_id == alertstype[0].idalertstype && data.latitude_al) {
            //         request({
            //             method: 'POST',
            //             url: 'https://notify-api.line.me/api/notify',
            //             header: {
            //                 'Content-Type': 'application/x-www-form-urlencoded',
            //             },
            //             auth: {
            //                 bearer: alertstype[0].token_notify, //token
            //             },
            //             form: {
            //                 message: 'ผู้แจ้งทั่วไป!!' + alertstype[0].name_alty + ' (รายละเอียด)' + data.detail_al + ' (ชื่อผู้รายงาน)'
            //                     + data.usernamealerts + ' ' + data.phonealerts + "   Google map: " + 'https://www.google.com/maps/search/?api=1&query='
            //                     + data.latitude_al + ',' + data.longitude_al + '&@' + data.latitude_al + ',' + data.longitude_al + ',z=17', //ข้อความที่จะส่ง
            //             },
            //         }, (err, httpResponse, body) => {
            //             if (err) {
            //                 console.log(err)
            //             } else {
            //                 console.log(body)
            //             }
            //         })

            //         res.render('alerts/success', {
            //         });
            //     } else {
            //         res.render('alerts/error', {
            //         });
            //     }
            // }
            // });
//         });
//     });
// };

//----------------------------------------------ใหม่--------------------------------
controller.save_nouser = (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const setmenu = id.split("menu");
    const mn_page = setmenu[0];
    const idmn = setmenu[1];

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json(err);

        conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
            if (err1) return res.status(500).json(err1);

            let setgroup_value = '';
            if (max_count[0].max === null) {
                setgroup_value = 1;
            } else {
                setgroup_value = max_count[0].max + 1;
            }

            const fileQueries = [];

            // Process form data
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    const queryPromise = new Promise((resolve, reject) => {
                        conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
                            if (err1) return reject(err1);
                            conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, setgroup_value], (err1, notify_save) => {
                                if (err1) return reject(err1);
                                resolve();
                            });
                        });
                    });
                    fileQueries.push(queryPromise);
                }
            }

            // Process file uploads
            if (req.files) {
                for (const file of Object.values(req.files)) {
                    const { fieldname, filename } = file;
                    const queryPromise = new Promise((resolve, reject) => {
                        conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
                            if (err1) return reject(err1);
                            conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, setgroup_value], (err1, notify_save1) => {
                                if (err1) return reject(err1);
                                resolve();
                            });
                        });
                    });
                    fileQueries.push(queryPromise);
                }
            }

            // Process all the queries before sending the notification
            Promise.all(fileQueries).then(() => {
                // Get name_mm from menu_main
                conn.query('SELECT name_mm FROM menu_main WHERE idmenu_main = ?', [idmn], (err2, menu_main_result) => {
                    if (err2) return res.json(err2);

                    const name_mm = menu_main_result[0].name_mm;

                    // Fetch the LINE Notify token and send the notification
                    conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
                        if (error) return res.status(500).json(error);

                        const formName = `/alerts/${mn_page}`; // Use the form name dynamically
                        request({
                            method: 'POST',
                            url: 'https://notify-api.line.me/api/notify',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Bearer ${token[0].line_token}` // Use token from the database
                            },
                            form: {
                                message: `ประชาชนทั่วไปมีการส่งแบบฟอร์ม (ชื่อฟอร์ม: ${name_mm})`, // Message with formName and name_mm
                            }
                        }, (err, response, body) => {
                            if (err) {
                                console.error('Error sending LINE Notify:', err);
                            }

                            // Show success page after sending the LINE Notify alert
                            res.render('alerts/success', {
                                cookies: req.cookies
                            });
                        });
                    });
                });
            }).catch(err => {
                console.error('Error processing form or files:', err);
                res.status(500).json(err);
            });
        });
    });
};

module.exports = controller;
