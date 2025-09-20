

const ac_groupController = {};

// controllers/ac_groupController.js
const osmoController = require('./osmoController');

ac_groupController.list = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const membersSql = `
      SELECT gm.id AS group_member_id,
             CONCAT(gm.firstname,' ',gm.lastname) AS fullname,
             s.ms, gm.age1 AS age, v.name_village, a.congenital, r.name AS rights_name
      FROM new_tasaban.group_us_member gm
      JOIN new_tasaban.account a ON gm.id = a.id
      JOIN new_tasaban.society s ON gm.msd = s.id
      JOIN new_tasaban.rights  r ON gm.sitt = r.id
      JOIN new_tasaban.village v ON gm.mooban = v.idvillage
      ORDER BY fullname;
    `;

    conn.query(membersSql, (qErr, members) => {
      if (qErr) return res.send(qErr);

      osmoController.fetchAll(conn, (e2, osmos) => {
        if (e2) return res.send(e2);
        // >>> ส่ง osmos เข้า view ด้วย <<<
        res.render("ac_group_list", { members, osmos });
      });
    });
  });
};


// controllers/ac_groupController.js (เฉพาะฟังก์ชัน listByOsmo)
ac_groupController.listByOsmo = (req, res) => {
  const osmoId = req.params.osmoId;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: 'DB connect error', details: err });

    const sql = `
      SELECT 
        a.id AS member_id,
        gm.id AS group_member_id,  -- ใช้ไปลิงก์หน้าอุณหภูมิ
        CONCAT(a.fname_us, ' ', a.lname_us) AS fullname,
        s.ms, a.age, v.name_village, a.congenital, r.name AS rights_name,
        p.idpersonnel AS osmo_id,
        CONCAT_WS(' ', p.fname_ps, p.lname_ps) AS osmo_name
      FROM osmo_member om
        JOIN new_tasaban.account a                ON om.member_id = a.id
        LEFT JOIN new_tasaban.group_us_member gm  ON gm.id = a.id
        LEFT JOIN new_tasaban.society s           ON a.ms_us = s.id
        LEFT JOIN new_tasaban.rights r            ON a.rights_id = r.id
        LEFT JOIN new_tasaban.village v           ON a.village_id = v.idvillage
        LEFT JOIN new_tasaban.personnel p         ON p.idpersonnel = om.osmo_id
      WHERE om.osmo_id = ?
      ORDER BY fullname;
    `;
    conn.query(sql, [osmoId], (qErr, rows) => {
      if (qErr) return res.status(500).json({ error: 'Query failed', details: qErr });
      res.json(rows);
    });
  });
};


// ✅ ค้นหาประชาชนด้วยชื่อ/นามสกุล (เฉพาะคนที่ "ยังไม่อยู่ใน group_us_member")
ac_groupController.search = (req, res) => {
  const keyword = `%${req.query.q || ""}%`;

  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err);

    const sql = `
      SELECT 
        a.id,
        a.fname_us,
        a.lname_us
      FROM new_tasaban.account a
      WHERE (a.fname_us LIKE ? OR a.lname_us LIKE ?)
        AND a.id NOT IN (SELECT id FROM new_tasaban.group_us_member)
      ORDER BY a.fname_us, a.lname_us
      LIMIT 20;
    `;

    conn.query(sql, [keyword, keyword], (qErr, rows) => {
      if (qErr) return dbFail(res, qErr);
      res.json(rows);
    });
  });
};

// ✅ เพิ่มคนเข้าตาราง group_us_member จากตาราง account
ac_groupController.add = (req, res) => {
  const userId = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err, 500, "Database connection error");

    const insertSql = `
      INSERT INTO new_tasaban.group_us_member (id, msd, firstname, lastname, age1, mooban, con, sitt)
      SELECT 
        a.id, a.ms_us, a.fname_us, a.lname_us, a.age, a.village_id, a.congenital, a.rights_id
      FROM new_tasaban.account a
      WHERE a.id = ?;
    `;

    conn.query(insertSql, [userId], (errInsert) => {
      if (errInsert) {
        // ถ้ามีใน group อยู่แล้ว อาจชน DUP — ส่งข้อความอ่านง่าย
        if (errInsert.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "มีสมาชิกคนนี้ในกลุ่มแล้ว" });
        }
        return dbFail(res, errInsert, 500, "Insert failed");
      }

      const selectSql = `
        SELECT 
          gm.id AS group_member_id,
          CONCAT(gm.firstname, ' ', gm.lastname) AS fullname,
          s.ms AS ms,
          gm.age1 AS age,
          v.name_village,
          a.congenital,
          r.name AS rights_name
        FROM new_tasaban.group_us_member gm
        JOIN new_tasaban.account a ON gm.id = a.id
        JOIN new_tasaban.society s ON gm.msd = s.id
        JOIN new_tasaban.rights r ON gm.sitt = r.id
        JOIN new_tasaban.village v ON gm.mooban = v.idvillage
        WHERE gm.id = ?;
      `;

      conn.query(selectSql, [userId], (errSelect, rows) => {
        if (errSelect) return dbFail(res, errSelect, 500, "Select failed");
        if (rows.length === 0) {
          return res.status(404).json({ error: "ไม่พบข้อมูลสมาชิกที่เพิ่มใหม่" });
        }
        res.json(rows[0]);
      });
    });
  });
};

// ✅ ลบออกจาก "ตารางกลุ่ม" (ไม่ใช่ถอนจากอสม.)
ac_groupController.delete = (req, res) => {
  const groupMemberId = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      "DELETE FROM new_tasaban.group_us_member WHERE id = ?",
      [groupMemberId],
      (qErr, result) => {
        if (qErr) return res.send(qErr);
        res.json({ success: result.affectedRows > 0 });
      }
    );
  });
};

// ✅ มอบหมายอสม.ให้ดูแลประชาชน (1 อสม. <= 10 คน, 1 คนมีได้แค่อสม.เดียว)
// ใช้ INSERT ... SELECT ... WHERE เพื่อตรวจโควต้า 10 คนแบบอะตอมมิก
// แนะนำให้ตั้ง UNIQUE(member_id) บน osmo_member เพื่อกันคน ๆ เดียวซ้ำหลายอสม.
ac_groupController.assignMember = (req, res) => {
  const memberId = req.params.memberId; // account.id
  const osmoId = req.body.osmo_id;      // อสม.ที่เลือก

  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err, 500, "DB connect error");

    const sql = `
      INSERT INTO osmo_member (osmo_id, member_id)
      SELECT ?, ?
      WHERE (
        SELECT COUNT(*) FROM osmo_member WHERE osmo_id = ?
      ) < 10
    `;

    conn.query(sql, [osmoId, memberId, osmoId], (e, r) => {
      if (e) {
        if (e.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ error: "ประชาชนคนนี้ถูกมอบหมายให้อสม.คนอื่นแล้ว" });
        }
        return dbFail(res, e, 500, "Insert failed");
      }

      if (r.affectedRows === 0) {
        return res.status(409).json({ error: "อสม.คนนี้ดูแลครบ 10 คนแล้ว" });
      }

      return res.json({ success: true });
    });
  });
};

// ✅ ถอนการมอบหมาย (ถอดประชาชนออกจากอสม. ไม่ลบคนออกจากระบบ)
ac_groupController.unassignMember = (req, res) => {
  const { osmoId, memberId } = req.params;

  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err, 500, "DB connect error");

    conn.query(
      "DELETE FROM osmo_member WHERE osmo_id = ? AND member_id = ?",
      [osmoId, memberId],
      (e, r) => {
        if (e) return dbFail(res, e, 500, "Delete failed");
        res.json({ success: r.affectedRows > 0 });
      }
    );
  });
};

// ✅ ดึงข้อมูลประชาชน + อุณหภูมิตาม id
ac_groupController.getByMemberId = (req, res) => {
  const { memberId } = req.params;

  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err, 500, "Database connection error");

    const sql = `
      SELECT
        gm.id AS group_member_id,
        CONCAT(gm.firstname, ' ', gm.lastname) AS fullname,
        gm.age1 AS age,
        tm.temperature,
        tm.source,
        tm.timestamp,
        tm.officer_name
      FROM new_tasaban.group_us_member gm
        JOIN new_tasaban.temperature_log tm ON gm.id = tm.member_id 
      WHERE gm.id = ?
      ORDER BY tm.timestamp DESC;
    `;

    conn.query(sql, [memberId], (qErr, rows) => {
      if (qErr) return dbFail(res, qErr, 500, "Query failed");

      // ถ้ามีหน้า EJS ชื่อ temp_dataset ให้ render; ไม่งั้นส่ง JSON
      try {
        return res.render("temp_dataset", { logs: rows });
      } catch {
        return res.json(rows);
      }
    });
  });
};

// ✅ ดึงสมาชิกทั้งหมดใน "ตารางกลุ่ม" (ไม่ใช่ตามอสม.)
ac_groupController.getAll = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return dbFail(res, err, 500, "Database connection error");

    const sql = `
      SELECT
        gm.id AS group_member_id,
        CONCAT(gm.firstname, ' ', gm.lastname) AS fullname,
        a.id AS member_id,
        a.fname_us AS fname,
        a.lname_us AS lname,
        v.name_village AS vname,
        s.ms,
        r.name AS rights_name
      FROM new_tasaban.group_us_member gm
        JOIN new_tasaban.account a ON gm.id = a.id
        JOIN new_tasaban.village v ON gm.mooban = v.idvillage
        JOIN new_tasaban.society s ON gm.msd = s.id
        JOIN new_tasaban.rights r ON gm.sitt = r.id
      ORDER BY fullname;
    `;

    conn.query(sql, (qErr, rows) => {
      if (qErr) return dbFail(res, qErr, 500, "Query failed");
      res.json(rows);
    });
  });
};


module.exports = ac_groupController;
