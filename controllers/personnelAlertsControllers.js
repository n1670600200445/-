const controller = {};
const request = require('request');
const uuidv4 = require('uuid').v4;
const fs = require('fs');


controller.index = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel WHERE idpersonnel = ? AND status_id = 1', [idpersonnel], (err, data) => {
                conn.query('SELECT * FROM personnel WHERE idpersonnel = ?', [data[0].idpersonnel], (err, data2) => {
                    conn.query('SELECT * FROM menu_main WHERE officer_radio = 1 and del_status = 0', (err, menu_data) => {
                        let listmenu_ps = [];
                        if (data[0].group_ps) {
                            const groupUsData = data[0].group_ps;
                            const groupUsArray = groupUsData.split(',').map(Number);
                            for (let i = 0; i < menu_data.length; i++) {
                                if (menu_data[i].group_radio == 1) {
                                    listmenu_ps.push(menu_data[i]);
                                } else {
                                    const menuGroupArray = menu_data[i].group_mm.split(',').map(Number);
                                    const commonValues = groupUsArray.filter(value => menuGroupArray.includes(value));

                                    if (commonValues.length > 0) {
                                        listmenu_ps.push(menu_data[i]);
                                    }
                                }
                            }
                        }
                        if (err) {
                            console.error(err);
                            return res.status(500).json(err);
                        }

                        res.render('personnelAlerts/index', {
                            data,
                            data2,
                            menu_data,
                            cookies: req.cookies,
                        });
                    });
                });
            });
        })
    } else {
        res.redirect('/');
    }
};


// controller.list = (req, res) => {
//     if (req.cookies.idpersonnel) {
//         const idpersonneltype = req.cookies.idpersonneltype;
//         req.getConnection((err, conn) => {
//             conn.query(`
//                 SELECT form_mm 
//                 FROM menu_main 
//                 WHERE personneltype_mm = ? 
//                 UNION 
//                 SELECT form_ms 
//                 FROM menu_sub 
//                 WHERE personneltype_ms = ?;
//             `, [idpersonneltype, idpersonneltype], (err, num_forms) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).json(err);
//                 }

//                 const formIds = num_forms.map(form => form.form_mm);

//                 conn.query(`
//                     SELECT idforms, name_forms, detail_forms, forms_type, DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f, status_del, idforms_type, name_forms_type 
//                     FROM forms f 
//                     JOIN forms_type ft 
//                     ON f.forms_type = ft.idforms_type 
//                     WHERE status_del = 0 
//                     AND forms_type = 1 
//                     AND idforms IN (?);
//                 `, [formIds], (err, forms) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).json(err);
//                     }

//                     conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
//                         if (err) {
//                             console.error(err);
//                             return res.status(500).json(err);
//                         }

//                         res.render('personnelAlerts/list', { forms, forms_type, cookies: req.cookies });
//                     });
//                 });
//             });
//         });
//     } else {
//         res.redirect('/loginpersonnel');
//     }
// };

controller.list = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonneltype = req.cookies.idpersonneltype;
        req.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            conn.query(`
                SELECT form_mm 
                FROM menu_main 
                WHERE personneltype_mm = ? 
                UNION 
                SELECT form_ms 
                FROM menu_sub 
                WHERE personneltype_ms = ?;
            `, [idpersonneltype, idpersonneltype], (err, num_forms) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(err);
                }

                const formIds = num_forms.map(form => form.form_mm);

                if (formIds.length === 0) {
                    // No forms available
                    return res.render('personnelAlerts/list', { forms: [], forms_type: [], cookies: req.cookies });
                }

                conn.query(`
                    SELECT idforms, name_forms, detail_forms, forms_type, DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f, status_del, idforms_type, name_forms_type 
                    FROM forms f 
                    JOIN forms_type ft 
                    ON f.forms_type = ft.idforms_type 
                    WHERE status_del = 0 
                    AND forms_type = 1 
                    AND idforms IN (?);
                `, [formIds], (err, forms) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json(err);
                    }

                    conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json(err);
                        }

                        res.render('personnelAlerts/list', { forms, forms_type, cookies: req.cookies });
                    });
                });
            });
        });
    } else {
        res.redirect('/loginpersonnel');
    }
};



controller.value_reslist_ps = (req, res) => {
    if (req.cookies.idpersonnel) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,idforms_type,name_forms_type FROM forms f JOIN forms_type ft ON f.forms_type = ft.idforms_type WHERE status_del = 0 AND idforms = ?;', [id], (err, forms) => {
                conn.query('select * from forms_field ff join value_res vr on vr.field_id = ff.idfield WHERE forms_id = ?', [id], (err, forms_field) => {
                    conn.query('select count_res from forms_field ff join value_res vr on vr.field_id = ff.idfield where forms_id = ? and status_al = 1 group by count_res', [id], (err, num_groubvr) => {
                        conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                            if (err) {
                                res.json(err);
                            }
                            res.render('personnelAlerts/value_reslist_ps', { forms, forms_field, forms_type, num_groubvr, cookies: req.cookies });
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.menu_ps = (req, res) => {
    if (req.cookies.idpersonnel) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE mm_id = ? and del_status = 0;', [id], (err, menu_sub) => {
                if (err) {
                    res.json(err);
                }
                res.render('personnelAlerts/menu', { menu_sub, cookies: req.cookies });
            })
        })
    } else {
        res.redirect('/loginusers')
    }
};

controller.notify_m = (req, res) => {
    if (req.cookies.idpersonnel) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            res.render('personnelAlerts/notify', { mn: 1, mn_id: id, cookies: req.cookies });
        });
    } else {
        res.redirect('/loginusers');
    }
};

controller.notify_s = (req, res) => {
    if (req.cookies.idpersonnel) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            res.render('personnelAlerts/notify', { mn: 2, mn_id: id, cookies: req.cookies });
        });
    } else {
        res.redirect('/loginusers');
    }
};


controller.notify_showform_ps = (req, res) => {
    if (req.cookies.idpersonnel) {
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
                            console.log(ff);
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
//--------------------------------------------------อันเก่า---------------------------
// controller.save = (req, res) => {
//     if (req.cookies.idpersonnel) {
//         const data = req.body;
//         const idusers = req.cookies.idpersonnel;
//         const { id } = req.params;
//         const setmenu = id.split("menu");
//         const mn_page = setmenu[0]
//         const idmn = setmenu[1]
//         console.log("xxxxxxxxxxx",idusers);

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
//                         console.log(`${key}`, `${value}`);
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,personnel_id = ?,count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, idusers, setgroup_value], (err1, notify_save) => {

//                             });
//                         });
//                     }
//                 }

//                 if (req.files) {
//                     for (const file of Object.values(req.files)) {
//                         const { fieldname, filename } = file;
//                         conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
//                             conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?,field_id = ?,value_res = ?,personnel_id = ?,count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, idusers, setgroup_value], (err1, notify_save1) => {

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


//-------------------------------------อันใหม่---------------------------



controller.save = (req, res) => {
    if (req.cookies.idpersonnel) {
        const data = req.body;
        const idusers = req.cookies.idpersonnel;
        const { id } = req.params;
        const setmenu = id.split("menu");
        const mn_page = setmenu[0];
        const idmn = setmenu[1];
        console.log("xxxxxxxxxxx", idusers);

        req.getConnection((err, conn) => {
            conn.query('SELECT MAX(count_res) max FROM value_res', (err1, max_count) => {
                let setgroup_value = '';
                if (max_count[0].max === null) {
                    setgroup_value = 1;
                } else {
                    setgroup_value = max_count[0].max + 1;
                }
                
                if (data) {
                    for (const [key, value] of Object.entries(data)) {
                        console.log(`${key}`, `${value}`);
                        conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [`${key}`], (err1, ff) => {
                            conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, personnel_id = ?, count_res = ?', [idmn, mn_page, ff[0].forms_id, ff[0].idfield, `${value}`, idusers, setgroup_value], (err1, notify_save) => {
                                // Do nothing here
                            });
                        });
                    }
                }

                if (req.files) {
                    for (const file of Object.values(req.files)) {
                        const { fieldname, filename } = file;
                        conn.query('SELECT * FROM forms_field WHERE idfield = ?;', [fieldname], (err1, ff1) => {
                            conn.query('INSERT INTO value_res SET idmenu = ?, menu_page = ?, form_id = ?, field_id = ?, value_res = ?, personnel_id = ?, count_res = ?', [idmn, mn_page, ff1[0].forms_id, fieldname, filename, idusers, setgroup_value], (err1, notify_save1) => {
                                // Do nothing here
                            });
                        });
                    }
                }

                // Send LINE Notify after form and files are processed
                conn.query('SELECT * FROM line_token WHERE idline_token = 1', (err, token) => {
                    if (err) {
                        console.error('Error fetching LINE token:', err);
                    } else {
                        request({
                            method: 'POST',
                            url: 'https://notify-api.line.me/api/notify',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Bearer ${token[0].line_token}` // Use token from database
                            },
                            form: {
                                message: 'เจ้าหน้าที่ ได้มีการส่งแบบฟอมร์' // Message to send
                            }
                        }, (err, response, body) => {
                            if (err) {
                                console.error('Error sending LINE Notify:', err);
                            }
                        });
                    }
                });

                res.render('alerts/success', {
                    cookies: req.cookies
                });
            });
        });
    } else {
        res.redirect('/loginusers');
    }
};




controller.getJob = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const { idalerts } = req.params;
        req.getConnection((err, conn) => {
            conn.query('UPDATE alerts SET personnelid_al = ? , status_al = 2  WHERE idalerts = ?', [idpersonnel, idalerts], (err, result) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/personnelAlerts/getalerts');
                }, 1000)
            });
        });

    } else {
        res.redirect('/loginpersonnel');
    }
};

controller.jobSuccess = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const { idalerts } = req.params;
        if (req.files) {
            var file = req.files.filename;
            if (!Array.isArray(file)) {
                var filename = uuidv4() + "." + file.name.split(".")[1];
                file.mv("./public/img_alerts/" + filename, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            } else {
                for (var i = 0; i < file.length; i++) {
                    var filename = uuidv4() + "." + file[i].name.split(".")[1];
                    file[i].mv("./public/img_alerts/" + filename, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            }
        }
        req.getConnection((err, conn) => {
            conn.query('SELECT CURRENT_DATE()date;', (err, date) => {
                conn.query('SELECT name_alty,phonealerts,phone_us from alerts a left join users u on a.userid_al=u.idusers left join alertstype at on a.alertstype_id=at.idalertstype WHERE idalerts = ?;', [idalerts], (err, data1) => {
                    conn.query('UPDATE alerts SET personnelid_al = ? ,datesuccess_al = ?, status_al = 3, imgen_al = ?  WHERE idalerts = ?', [idpersonnel, date[0].date, filename, idalerts], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                        setTimeout(() => {
                            if (data1[0].phone_us) {
                                var data = '{"sender": "SMSOTP","msisdn":  ["' + data1[0].phone_us + '"],"message": "แจ้ง ' + data1[0].name_alty + ' เทศบาลตำบลเวียงเทิงได้ดำเนินการเสร็จเรียบร้อยแล้วค่ะ"}';
                                console.log(data);
                                var options = {
                                    //'method': 'GET',
                                    //'url': 'https://thsms.com/api/rest?username=wiangthoeng&password=053795321&method=send&from=Now&to='+ data1[0].phonealerts +'&message=ทตเวียงเทิงได้ดำเนินการเสร็จเรียบร้อยแล้วค่ะ',
                                    'method': 'POST',
                                    'url': 'https://thsms.com/api/send-sms',
                                    'headers': {
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aHNtcy5jb21cL2FwaS1rZXkiLCJpYXQiOjE2NDQ5OTU5NTIsIm5iZiI6MTY0NTAxNzk5NiwianRpIjoiZUpUeG9vMm5pSzZiZUExNiIsInN1YiI6MTAyODc2LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.KnhQsgD_UqZf-bwtTHkbKkSYkzYLTfdI-qAaurYkqok"
                                        , "Content-Type": "application/json"
                                    },
                                    'body': data
                                };
                                request(options, function (error, response) {
                                    if (error) throw new Error(error);
                                    console.log(response.body);
                                });
                            } else if (data1[0].phonealerts) {
                                var data = '{"sender": "SMSOTP","msisdn":  ["' + data1[0].phonealerts + '"],"message": "แจ้ง ' + data1[0].name_alty + ' เทศบาลตำบลเวียงเทิงได้ดำเนินการเสร็จเรียบร้อยแล้วค่ะ"}';
                                console.log(data);
                                var options = {
                                    //'method': 'GET',
                                    //'url': 'https://thsms.com/api/rest?username=wiangthoeng&password=053795321&method=send&from=Now&to='+ data1[0].phonealerts +'&message=ทตเวียงเทิงได้ดำเนินการเสร็จเรียบร้อยแล้วค่ะ',
                                    'method': 'POST',
                                    'url': 'https://thsms.com/api/send-sms',
                                    'headers': {
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aHNtcy5jb21cL2FwaS1rZXkiLCJpYXQiOjE2NDQ5OTU5NTIsIm5iZiI6MTY0NTAxNzk5NiwianRpIjoiZUpUeG9vMm5pSzZiZUExNiIsInN1YiI6MTAyODc2LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.KnhQsgD_UqZf-bwtTHkbKkSYkzYLTfdI-qAaurYkqok"
                                        , "Content-Type": "application/json"
                                    },
                                    'body': data
                                };
                                request(options, function (error, response) {
                                    if (error) throw new Error(error);
                                    console.log(response.body);
                                });
                            }
                            res.redirect('/personnelAlerts/alerts_success');
                        }, 1000)

                    });
                });
            });
        });
    } else {
        res.redirect('/loginpersonnel');
    }
};


controller.jobFailed = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const { idalerts } = req.params;
        const data = req.body
        req.getConnection((err, conn) => {
            conn.query('SELECT CURRENT_DATE()date;', (err, date) => {
                conn.query('UPDATE alerts SET personnelid_al = ? ,datesuccess_al = ?,comment_al = ? ,status_al = 4 WHERE idalerts = ?', [idpersonnel, date[0].date, data.comment_al, idalerts], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/personnelAlerts/alerts_failed');
                    }, 1000)
                });
            });
        });
    } else {
        res.redirect('/loginpersonnel');
    }
};

controller.getalerts = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const idpersonneltype = req.cookies.idpersonneltype;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM alertstype alty JOIN alerts al ON alty.idalertstype = al.alertstype_id LEFT JOIN users us ON us.idusers=al.userid_al WHERE personnel_type_alty = ? AND al.personnelid_al = ? AND status_al = 2 ORDER BY idalerts desc', [idpersonneltype, idpersonnel], (err, alerts) => {
                conn.query('SELECT * FROM personneltype WHERE idpersonneltype = ?', [idpersonneltype], (err, type) => {
                    conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 1', [idpersonneltype], (err, alerts_get) => {
                        conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 2', [idpersonneltype], (err, _getalerts) => {
                            if (err) {
                                res.json(err);
                            }
                            res.render('personnelAlerts/getalerts', { alerts: alerts, type: type[0], _getalerts: _getalerts[0], alerts_get: alerts_get[0], cookies: req.cookies });
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/loginpersonnel')
    }
};

controller.alerts_success = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const idpersonneltype = req.cookies.idpersonneltype;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM alertstype alty JOIN alerts al ON alty.idalertstype = al.alertstype_id LEFT JOIN users us ON us.idusers=al.userid_al WHERE personnel_type_alty = ? AND al.personnelid_al = ? AND status_al = 3 ORDER BY idalerts desc', [idpersonneltype, idpersonnel], (err, alerts) => {
                conn.query('SELECT * FROM personneltype WHERE idpersonneltype = ?', [idpersonneltype], (err, type) => {
                    conn.query('SELECT DATE_FORMAT(DATE_ADD(datesuccess_al, INTERVAL 543 YEAR), "วันที่ %d/%m/%Y" )date FROM alertstype alty JOIN alerts al ON alty.idalertstype = al.alertstype_id LEFT JOIN users us ON us.idusers=al.userid_al WHERE personnel_type_alty = ? AND al.personnelid_al = ? AND status_al = 3 ORDER BY idalerts desc', [idpersonneltype, idpersonnel], (err, date) => {
                        conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 1', [idpersonneltype], (err, alerts_get) => {
                            conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 2', [idpersonneltype], (err, _getalerts) => {
                                if (err) {
                                    res.json(err);
                                }
                                res.render('personnelAlerts/alerts_success', { alerts: alerts, type: type[0], _getalerts: _getalerts[0], alerts_get: alerts_get[0], date: date, cookies: req.cookies });
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/loginpersonnel')
    }
};

controller.alerts_failed = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonnel;
        const idpersonneltype = req.cookies.idpersonneltype;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM alertstype alty JOIN alerts al ON alty.idalertstype = al.alertstype_id LEFT JOIN users us ON us.idusers=al.userid_al WHERE personnel_type_alty = ? AND al.personnelid_al = ? AND status_al = 4 ORDER BY idalerts desc', [idpersonneltype, idpersonnel], (err, alerts) => {
                conn.query('SELECT * FROM personneltype WHERE idpersonneltype = ?', [idpersonneltype], (err, type) => {
                    conn.query('SELECT DATE_FORMAT(DATE_ADD(datesuccess_al, INTERVAL 543 YEAR), "วันที่ %d/%m/%Y" )date FROM alertstype alty JOIN alerts al ON alty.idalertstype = al.alertstype_id LEFT JOIN users us ON us.idusers=al.userid_al WHERE personnel_type_alty = ? AND al.personnelid_al = ? AND status_al = 4 ORDER BY idalerts desc', [idpersonneltype, idpersonnel], (err, date) => {
                        conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 1', [idpersonneltype], (err, alerts_get) => {
                            conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 2', [idpersonneltype], (err, _getalerts) => {
                                if (err) {
                                    res.json(err);
                                }
                                res.render('personnelAlerts/alerts_failed', { alerts: alerts, type: type[0], _getalerts: _getalerts[0], alerts_get: alerts_get[0], date: date, cookies: req.cookies });
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/loginpersonnel')
    }
};

controller.alertstype = (req, res) => {
    if (req.cookies.idpersonnel) {
        const idpersonnel = req.cookies.idpersonneltype;
        req.getConnection((err, conn) => {
            conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 1', [idpersonnel], (err, alerts_get) => {
                conn.query('SELECT COUNT(idalerts)_get FROM personneltype psty JOIN alertstype alty ON psty.idpersonneltype = alty.personnel_type_alty JOIN alerts al ON al.alertstype_id = alty.idalertstype WHERE idpersonneltype = ? AND status_al = 2', [idpersonnel], (err, _getalerts) => {
                    conn.query('SELECT * FROM personneltype WHERE idpersonneltype = ?', [idpersonnel], (err, type) => {
                        conn.query('SELECT * FROM alertstype WHERE personnel_type_alty = ?;', [idpersonnel], (err, alertstype) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render('personnelAlerts/alerts_type', { alertstype: alertstype, type: type[0], _getalerts: _getalerts[0], alerts_get: alerts_get[0], cookies: req.cookies });
                            }
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/loginpersonnel');
    }
};






module.exports = controller;