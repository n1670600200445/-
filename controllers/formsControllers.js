const controller = {};
const qr = require("qrcode");
const { URL } = require('url');


function getdatetime_now() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//รายการฟอร์ม
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,name_forms_type FROM forms f JOIN forms_type ft on f.forms_type = ft.idforms_type WHERE status_del = 0;', (err, forms) => {
                if (err) {
                    res.json(err);
                    return;
                }

                conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                    if (err) {
                        res.json(err);
                        return;
                    }

                    const formCheckPromises = forms.map(form => {
                        return new Promise((resolve, reject) => {
                            conn.query('SELECT form_id FROM value_res WHERE form_id = ? group by form_id;', [form.idforms], (err, have_res) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    if (have_res.length > 0) {
                                        resolve(have_res[0].form_id);
                                    } else {
                                        resolve(null);
                                    }
                                }
                            });
                        });
                    });

                    Promise.all(formCheckPromises)
                        .then(results => {
                            const nonNullResults = results.filter(result => result !== null);
                            console.log(nonNullResults);
                            res.render('forms/list', { forms, checkForms: nonNullResults, forms_type, session: req.session });
                        })
                        .catch(error => {
                            console.error(error);
                            res.json(error);
                        });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};



controller.save = (req, res) => {
    if (req.session.idadmins) {
        const name_forms = req.body.name_forms;
        const forms_type = req.body.forms_type;
        const detail_forms = req.body.detail_forms;
        const datecreate = getdatetime_now()
        const flow_forms = req.body.flow_forms;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO forms SET name_forms = ?,forms_type = ?, detail_forms = ?, datecreate_f = ?,flow_forms = ? ; ', [name_forms, forms_type, detail_forms, datecreate, flow_forms], (err, forms) => {
                if (err) {
                    res.json(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "เพิ่มข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/forms',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.edit = (req, res) => {
    if (req.session.idadmins) {
        const idforms = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,flow_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,idforms_type,name_forms_type FROM forms f JOIN forms_type ft ON f.forms_type = ft.idforms_type WHERE idforms = ?;', [idforms], (err, forms) => {
                conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({
                        forms,
                        forms_type,
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};



controller.update = (req, res) => {
    if (req.session.idadmins) {
        const idforms = req.body.idforms;
        const name_forms = req.body.name_forms;
        const forms_type = req.body.forms_type;
        const detail_forms = req.body.detail_forms;
        const flow_forms = req.body.flow_forms;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms SET name_forms = ?,forms_type = ?, detail_forms = ?,flow_forms = ? WHERE idforms = ?;', [name_forms, forms_type, detail_forms, flow_forms, idforms], (err, forms) => {
                if (err) {
                    res.json(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "แก้ไขข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/forms',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.check = (req, res) => {
    if (req.session.idadmins) {
        const idforms = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms WHERE idforms = ?;', [idforms], (err, forms) => {
                if (err) {
                    res.json(err);
                }
                res.json({
                    forms,
                })
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const idforms = req.body.idforms;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms SET status_del = 1 WHERE idforms = ?;', [idforms], (err, forms) => {
                if (err) {
                    console.log(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/forms',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.forms_res = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,idforms_type,name_forms_type FROM forms f JOIN forms_type ft ON f.forms_type = ft.idforms_type WHERE status_del = 0 and forms_type = 1;', (err, forms) => {
                conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                    if (err) {
                        res.json(err);
                    }
                    res.render('forms/list_res', { forms, forms_type, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.forms_res_list = (req, res) => {
    if (req.session.idadmins) {
        var data = {};
        var data_res = {};
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms where forms_type = 1;', (err, forms) => {
                if (err) {
                    return res.json(err);
                }

                const formQueries = forms.map((form, i) => {
                    return new Promise((resolve, reject) => {
                        const personKey = 'forms' + (i + 1);
                        conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0;', [form.idforms], (err, forms_field) => {

                            if (err) {
                                return reject(err);
                            }

                            data[personKey] = {
                                form_id: form.idforms,
                                name: form.name_forms,
                                forms_field: {},
                            };


                            for (j in forms_field) {
                                var formsKey = forms_field[j].idfield;
                                if (forms_field[j].field_type == 'Shorttextfield_q') {
                                    if (forms_field[j].label_inputname) {
                                        // data[i].push(forms_field[j].label_inputname)
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_inputname;
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความสั้น';
                                        // data[i].push('ข้อความสั้น')
                                    }
                                } else if (forms_field[j].field_type == 'Longtextfield_q') {
                                    if (forms_field[j].label_longtext) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_longtext;
                                        // data[i].push(forms_field[j].label_longtext)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('ข้อความยาว')
                                    }
                                } else if (forms_field[j].field_type == 'Dropdownfield_q') {
                                    if (forms_field[j].label_dropdown) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_dropdown;
                                        // data[i].push(forms_field[j].label_dropdown)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('dropdown')
                                    }
                                } else if (forms_field[j].field_type == 'Radiofield_q') {
                                    if (forms_field[j].label_radio) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_radio;
                                        // data[i].push(forms_field[j].label_radio)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('dropdown')
                                    }
                                } else if (forms_field[j].field_type == 'Checkboxfield_q') {
                                    if (forms_field[j].label_checkbox) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_checkbox;
                                        // data[i].push(forms_field[j].label_checkbox)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('dropdown')
                                    }
                                } else if (forms_field[j].field_type == 'Imagefield_q') {
                                    if (forms_field[j].label_inputimage) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_inputimage;
                                        // data[i].push(forms_field[j].label_inputimage)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('dropdown')
                                    }
                                } else if (forms_field[j].field_type == 'Datetimefield_q') {
                                    if (forms_field[j].label_datetime) {
                                        data[personKey].forms_field[formsKey] = forms_field[j].label_datetime;
                                        // data[i].push(forms_field[j].label_datetime)
                                    } else {
                                        data[personKey].forms_field[formsKey] = 'ข้อความยาว';
                                        // data[i].push('dropdown')
                                    }
                                } else if (forms_field[j].field_type == 'Gpsfield_q') {
                                    data[personKey].forms_field[formsKey] = 'ข้อมูลตำแหน่ง';
                                    // data[i].push('ข้อมูลตำแหน่ง')
                                }
                            }
                            resolve();
                        })
                    });
                });

                conn.query('SELECT * FROM value_res group by count_res;', (err, group_res) => {
                    if (err) {
                        return reject(err);
                    }
                    const valueResQueries = group_res.map((group) => {
                        return new Promise((resolveValueRes, rejectValueRes) => {
                            var fieldKey = group.count_res;
                            data_res[fieldKey] = {
                                form_id: group.form_id,
                                answer_res: {},
                            };
                            conn.query('SELECT * FROM value_res WHERE count_res = ?;', [fieldKey], (err, value_res) => {
                                if (err) {
                                    return rejectValueRes(err);
                                }

                                for (const value of value_res) {
                                    const res_Key = value.idres;
                                    data_res[fieldKey].answer_res[res_Key] = value.value_res;
                                }

                                // เพิ่มการ resolve ที่นี่
                                resolveValueRes();
                            });
                        });
                    });
                    Promise.all(valueResQueries)
                        .then(() => {
                            Promise.all(formQueries)
                                .then(() => {
                                    res.json({ forms, data, data_res, session: req.session });
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.json(error);
                                });
                        })
                        .catch(error => {
                            console.error(error);
                            res.json(error);
                        });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

controller.value_reslist = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,idforms_type,name_forms_type FROM forms f JOIN forms_type ft ON f.forms_type = ft.idforms_type WHERE status_del = 0 AND idforms = ?;', [id], (err, forms) => {
                conn.query('select * from forms_field ff join value_res vr on vr.field_id = ff.idfield WHERE forms_id = ?', [id], (err, forms_field) => {
                    conn.query('select count_res from forms_field ff join value_res vr on vr.field_id = ff.idfield where forms_id = ? and status_al = 1 group by count_res', [id], (err, num_groubvr) => {
                        conn.query('SELECT * FROM forms_type;', (err, forms_type) => {
                            if (err) {
                                res.json(err);
                            }
                            res.render('forms/value_reslist', { forms, forms_field, forms_type, num_groubvr, session: req.session });
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.editvalue_res = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT idforms,name_forms,detail_forms,forms_type,DATE_FORMAT(datecreate_f, "%Y-%m-%d %H:%i:%s") as datecreate_f,status_del,idforms_type,name_forms_type FROM forms f JOIN forms_type ft ON f.forms_type = ft.idforms_type WHERE status_del = 0 AND idforms = ?;', [id], (err, forms) => {
                conn.query('select * from forms_field ff join value_res vr on vr.field_id = ff.idfield WHERE forms_id = ?', [id], (err, forms_field) => {
                    conn.query('select count_res from forms_field ff join value_res vr on vr.field_id = ff.idfield where forms_id = ? and status_al = 1 group by count_res', [id], (err, num_groubvr) => {
                        conn.query('SELECT * FROM FORMS_TYPE;', (err, forms_type) => {
                            if (err) {
                                res.json(err);
                            }
                            res.render('forms/value_reslist', { forms, forms_field, forms_type, num_groubvr, session: req.session });
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.value_edit = (req, res) => {
    if (req.session.idadmins) {
        const value_gid = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM value_res where count_res = ?', [value_gid], (err, all_value) => {
                const form_id = all_value[0].form_id;
                const ff = []
                all_value.forEach((value) => {
                    conn.query('SELECT * FROM forms_field WHERE forms_id = ? AND idfield = ? AND status_del = 0 ORDER BY position_field;', [form_id, value.field_id], (err, formField) => {
                        ff.push(formField[0]); // นำข้อมูลจาก query ลงใน array ff
                        // ตรวจสอบว่า ff มีข้อมูลเท่ากับ all_value หรือไม่ ถ้าเท่ากันให้ส่ง JSON กลับ
                        if (ff.length === all_value.length) {
                            res.json({ ff, all_value, cookies: req.cookies });
                        }
                    });
                });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.value_update = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        const {id} = req.params;
        req.getConnection((err, conn) => {
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    console.log(`${key}`, `${value}`);
                    conn.query('UPDATE value_res SET value_res = ? WHERE idres = ?', [`${value}`,`${key}`], (err1, notify_update1) => {

                    });
                }
            }

            if (req.files) {
                for (const file of Object.values(req.files)) {
                    const { fieldname, filename } = file;
                    conn.query('UPDATE value_res SET value_res = ? WHERE idres = ?', [filename,fieldname], (err1, notify_update2) => {

                    });
                }
            }
            if (err) {
                console.log(err);
            } else {
                req.session.success = true;
                req.session.topic = "แก้ไขข้อมูลสำเร็จ";
                setTimeout(() => {
                    res.redirect('/forms_res/findvalue_res' + id);
                }, 1000)
            }
        });
    } else {
        res.redirect('/');
    }
};

// controller.value_delete = (req, res) => {
//     if (req.session.idadmins) {
//         const value_gid = req.body.value_group;
//         req.getConnection((err, conn) => {
//             conn.query('SELECT * FROM notify_dev.value_res where count_res = ?', [value_gid], (err, all_value) => {
//                 const form_id = all_value[0].form_id;
//                 for (i in all_value) {
//                     conn.query('DELETE FROM value_res where idres = ?', [all_value[i].idres], (err, all_value) => { })
//                 }
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     req.session.success = true;
//                     req.session.topic = "ลบข้อมูลสำเร็จ";
//                     setTimeout(() => {
//                         res.redirect('/forms_res/findvalue_res' + form_id);
//                     }, 1000)
//                 }
//             })
//         })
//     } else {
//         res.redirect('/');
//     }
// };

//-------------------แก้ใหม่


controller.value_delete = (req, res) => {
    if (req.session.idadmins) {
        const value_gid = req.body.value_group;
        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                res.redirect('/');
                return;
            }

            conn.query('SELECT * FROM value_res WHERE count_res = ?', [value_gid], (err, all_value) => {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                    return;
                }

                if (all_value && all_value.length > 0) {
                    const form_id = all_value[0].form_id;

                    for (let i = 0; i < all_value.length; i++) {
                        conn.query('DELETE FROM value_res WHERE idres = ?', [all_value[i].idres], (err) => {
                            if (err) {
                                console.log(err);
                                res.redirect('/');
                                return;
                            }
                        });
                    }

                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลสำเร็จ";
                    res.redirect('/forms_res');
                } else {
                    console.log('No data found');
                    res.redirect('/forms_res');
                }
            });
        });
    } else {
        res.redirect('/');
    }
};












// controller.value_delete = (req, res) => {
//     if (req.session.idadmins) {
//         const value_gid = req.body.value_group;
//         req.getConnection((err, conn) => {
//             if (err) {
//                 console.log('Database connection error:', err);
//                 res.redirect('/');
//                 return;
//             }
            
//             conn.query('SELECT * FROM notify_dev.value_res WHERE count_res = ?', [value_gid], (err, all_value) => {
//                 if (err) {
//                     console.log('Error fetching values:', err);
//                     res.redirect('/');
//                     return;
//                 }

//                 if (!all_value || all_value.length === 0) {
//                     console.log('No values found to delete.');
//                     req.session.success = false;
//                     req.session.topic = "ไม่พบข้อมูลที่จะลบ";
//                     res.redirect('/forms_res');
//                     return;
//                 }

//                 const form_id = all_value[0].form_id;
//                 let deleteError = false;
                
//                 // Use async/await style for better readability and handling errors
//                 const deleteValues = async () => {
//                     for (let i = 0; i < all_value.length; i++) {
//                         try {
//                             await new Promise((resolve, reject) => {
//                                 conn.query('DELETE FROM notify_dev.value_res WHERE idres = ?', [all_value[i].idres], (err, result) => {
//                                     if (err) {
//                                         console.log('Error deleting value:', err);
//                                         deleteError = true;
//                                         reject(err);
//                                     } else {
//                                         resolve(result);
//                                     }
//                                 });
//                             });
//                         } catch (err) {
//                             console.log('Failed to delete some values.');
//                             deleteError = true;
//                             break;
//                         }
//                     }

//                     if (deleteError) {
//                         req.session.success = false;
//                         req.session.topic = "เกิดข้อผิดพลาดในการลบข้อมูลบางส่วน";
//                     } else {
//                         req.session.success = true;
//                         req.session.topic = "ลบข้อมูลสำเร็จ";
//                     }

//                     setTimeout(() => {
//                         res.redirect('/forms_res/findvalue_res' + form_id);
//                     }, 1000);
//                 };

//                 deleteValues();
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// };





controller.genQrcode = (req, res) => {
    if (req.session.idadmins) {
        const url = req.body.urldomain + '/alerts_qrcode/forms' + req.body.id;

        if (url.length === 0) res.send("Empty Data!");

        qr.toDataURL(url, (err, src) => {
            if (err) res.send("Error occured");
            console.log(src);
            res.json({
                src,
            })
        });
    } else {
        res.redirect('/');
    }
}

module.exports = controller;