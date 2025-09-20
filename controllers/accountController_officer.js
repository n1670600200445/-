const accountController_officer = {};

accountController_officer.showForm = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

     const query = `SELECT a.id, a.cardnumber, a.fname_us, a.lname_us, a.age, a.birthday, a.tel, a.h_number, v.name_village, 
       a.canton, a.congenital, a.district, a.province, a.sex_us, a.assessment, soc.ms, r.name,a.latitude, a.longitude  
FROM new_tasaban.account AS a
JOIN new_tasaban.village AS v ON a.village_id = v.idvillage
JOIN new_tasaban.society AS soc ON a.ms_us = soc.id
JOIN new_tasaban.rights AS r ON a.rights_id = r.id;
                    `;

    const msQuery = `SELECT id, ms FROM new_tasaban.society`; // Query to fetch ms data
    const rightsQuery = `SELECT id, name FROM new_tasaban.rights`; // Query to fetch rights data
    const villageQuery = `SELECT idvillage, name_village FROM new_tasaban.village`; // Query to fetch village data

    conn.query(query, (err, accounts) => {
      if (err) {
        console.error("Query error:", err);
        res.status(500).json(err);
        return;
      }

      // Fetch ms, rights, and village data
      conn.query(msQuery, (err, msData) => {
        if (err) {
          console.error("Query error (ms):", err);
          res.status(500).json(err);
          return;
        }

        conn.query(rightsQuery, (err, rightsData) => {
          if (err) {
            console.error("Query error (rights):", err);
            res.status(500).json(err);
            return;
          }

          conn.query(villageQuery, (err, villageData) => {
            if (err) {
              console.error("Query error (village):", err);
              res.status(500).json(err);
              return;
            }

            // Pass accounts, msData, rightsData, and villageData to the view
            res.render("aclist_officer", {
              accounts: accounts,
              ms: msData,
              rights: rightsData,
              village: villageData, // Pass the village data
              session: req.session,
            });
          });
        });
      });
    });
  });
};

accountController_officer.addForm = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).json(err);
      return;
    }

    conn.query("SELECT id, ms FROM new_tasaban.society", (err, ms) => {
      if (err) {
        console.error("Query error:", err);
        res.status(500).json(err);
        return;
      }

      conn.query(
        "SELECT idvillage, name_village FROM new_tasaban.village",
        (err, village) => {
          if (err) {
            console.error("Query error:", err);
            res.status(500).json(err);
            return;
          }

          conn.query(
            "SELECT id, name FROM new_tasaban.rights",
            (err, rights) => {
              if (err) {
                console.error("Query error:", err);
                res.status(500).json(err);
                return;
              }

              res.render("account_officer", {
                ms: ms,
                village: village,
                rights: rights,
                session: req.session,
              });
            }
          );
        }
      );
    });
  });
};

// // เพิ่มข้อมูล
accountController_officer.add = (req, res) => {
  console.log(req.body); // ตรวจสอบว่า request body ถูกต้องหรือไม่
  console.log("Latitude:", req.body.latitude); // ตรวจสอบค่าของ latitude
  console.log("Longitude:", req.body.longitude); // ตรวจสอบค่าของ longitude

  const data = {
    cardnumber: req.body.cardnumber,
    ms_us: req.body.ms_us,
    fname_us: req.body.fname_us,
    lname_us: req.body.lname_us,
    sex_us: req.body.sex_us,
    birthday: `${req.body.year}-${req.body.month}-${req.body.day}`,
    age: req.body.age,
    congenital: req.body.congenital,
    rights_id: req.body.name,
    tel: req.body.tel,
    h_number: req.body.h_number,
    district: req.body.district,
    village_id: req.body.village_id,
    canton: req.body.canton,
    province: req.body.province,
    assessment: req.body.assessment,
    latitude: req.body.latitude, // รับค่าละติจูด
    longitude: req.body.longitude, // รับค่าลองจิจูด
  };

  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
      return;
    }

    conn.query("INSERT INTO new_tasaban.account SET ?", [data], (err) => {
      if (err) {
        console.error("Insert query error:", err);
        res.json(err);
        return;
      }

      res.redirect("/aclist_officer");
    });
  });
};

// แสดงฟอร์มลบข้อมูล
accountController_officer.showDeleteForm = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
      return;
    }
    conn.query(
      "SELECT * FROM new_tasaban.account WHERE id = ?",
      [id],
      (err, account) => {
        if (err) {
          console.error("Query error:", err);
          res.json(err);
          return;
        }
        if (account.length === 0) {
          return res.status(404).send("Not found");
        }
        res.render("aclist_officer", {
          account: account[0],
          session: req.session,
        });
      }
    );
  });
};

// ลบข้อมูล
accountController_officer.deleteAccount = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
      return;
    }

    conn.query("DELETE FROM new_tasaban.account WHERE id = ?", [id], (err) => {
      if (err) {
        res.json(err);
        return;
      }
      res.redirect("/aclist_officer");
    });
  });
};

accountController_officer.edit = (req, res) => {
  const idToEdit = req.params.id;

  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
      return;
    }

    // Fetch account details
    const queryAccount = `
        SELECT a.id, a.cardnumber, a.fname_us, a.lname_us, a.age, a.birthday, a.tel, a.h_number, a.village_id, v.name_village, a.canton, a.congenital, a.district, a.province, a.sex_us, a.assessment, a.ms_us, soc.ms, r.id AS rights_id, r.name AS rights_name,a.latitude, a.longitude  
        FROM new_tasaban.account AS a
        JOIN new_tasaban.village AS v ON a.village_id = v.idvillage
        JOIN new_tasaban.society AS soc ON a.ms_us = soc.id
        JOIN new_tasaban.rights AS r ON a.rights_id = r.id
        WHERE a.id = ?;
    `;

    conn.query(queryAccount, [idToEdit], (err, account) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      if (account.length === 0) {
        res.status(404).send("Account not found");
        return;
      }

      // Fetch other data
      const querySociety = "SELECT id, ms FROM new_tasaban.society;";
      const queryVillage =
        "SELECT idvillage, name_village FROM new_tasaban.village";
      const queryRights = "SELECT id, name FROM new_tasaban.rights";

      conn.query(querySociety, (err, ms) => {
        if (err) {
          console.error("Query error:", err);
          res.status(500).json(err);
          return;
        }

        conn.query(queryVillage, (err, village) => {
          if (err) {
            res.json(err);
            return;
          }

          conn.query(queryRights, (err, rights) => {
            if (err) {
              console.error("Query error:", err);
              res.status(500).json(err);
              return;
            }
            console.log("account.ms_us:", account.ms_us);
            console.log("account.village_id:", account[0].village_id);

            // Render the view with retrieved data
            res.render("aclist_officer_edit", {
              account: account[0],
              ms: ms,
              village: village,
              rights: rights,
              session: req.session,
              savedLatitude: account[0].latitude || "",
              savedLongitude: account[0].longitude || "",
            });
          });
        });
      });
    });
  });
};

accountController_officer.update = (req, res) => {
  const idToEdit = req.params.id;
  console.log("ID to Edit:", idToEdit); // Debugging output
  const updatedData = {
    cardnumber: req.body.cardnumber,
    ms_us: req.body.ms_us,
    fname_us: req.body.fname_us,
    lname_us: req.body.lname_us,
    sex_us: req.body.sex_us,
    birthday: `${req.body.year}-${req.body.month}-${req.body.day}`,
    age: req.body.age,
    congenital: req.body.congenital,
    rights_id: req.body.name,
    tel: req.body.tel,
    h_number: req.body.h_number,
    district: req.body.district,
    village_id: req.body.village_id,
    canton: req.body.canton,
    province: req.body.province,
    assessment: req.body.assessment,
    latitude: req.body.latitude, // รับค่าละติจูด
    longitude: req.body.longitude, // รับค่าลองจิจูด
  };

  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
      return;
    }

    const query = "UPDATE new_tasaban.account SET ? WHERE id = ?";
    conn.query(query, [updatedData, idToEdit], (err) => {
      if (err) {
        console.error("Update query error:", err);
        res.json(err);
        return;
      }
      res.redirect("/aclist_officer"); // Redirect to account list after updating
    });
  });
};

module.exports = accountController_officer;
