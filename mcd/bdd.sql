-- =========================
-- DROP TABLES
-- =========================
DROP TABLE IF EXISTS planning CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS user_classes CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================
-- CREATE TABLES
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL,
    role  TEXT NOT NULL,          -- 'student' | 'teacher' | 'admin'
    password_hash TEXT NOT NULL   -- mot de passe hashé (bcrypt)
);


CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL
);

-- relation N-N user <-> class
CREATE TABLE user_classes (
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, class_id)
);

CREATE TABLE notes (
   id SERIAL PRIMARY KEY,
   student_user_id INT REFERENCES users(id), -- role = 'student'
   teacher_user_id INT REFERENCES users(id), -- role = 'teacher'
   class_id INT REFERENCES classes(id),
   value NUMERIC,
   ects INT
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type TEXT,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    validated_by_user_id INT REFERENCES users(id),
    validated_at TIMESTAMPTZ
);


CREATE TABLE planning (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  teacher_user_id INT REFERENCES users(id), -- prof = user
  label TEXT,       -- nom du cours / matière
  room TEXT,        -- salle
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    message TEXT
);

-- =========================
-- SEED DATA
-- =========================

----------------------
-- USERS
----------------------
INSERT INTO users (id, name, email, role, password_hash) VALUES
  (1, 'Alice Admin',   'alice.admin@example.com',   'admin',   '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi'),
  (2, 'Thomas Teacher','thomas.teacher@example.com','teacher', '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi'),
  (3, 'Emma Expert',   'emma.expert@example.com',   'teacher', '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi'),
  (4, 'Sam Student',   'sam.student@example.com',   'student', '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi'),
  (5, 'Chloe Student', 'chloe.student@example.com', 'student', '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi'),
  (6, 'Leo Student',   'leo.student@example.com',   'student', '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi');

INSERT INTO users (id,name, email, role, password_hash)
VALUES (7,
  'Paul Responsable',
  'paul.respo@example.com',
  'responsable_pedagogique',
  '$2a$10$wzVWCk0rH6nNWjO7bCvSOuT4wYmpEjtvWJwLuwZ0z2VTP0Vr1ckBi' -- mdp: test123
);


----------------------
-- CLASSES
----------------------
INSERT INTO classes (id, label) VALUES
  (1, '3A Informatique'),
  (2, '3B Design');

----------------------
-- USER_CLASSES
----------------------
INSERT INTO user_classes (user_id, class_id) VALUES
  (1, 1), -- Alice admin a accès 3A
  (1, 2), -- Alice admin a accès 3B
  (2, 1), -- Thomas enseigne en 3A
  (3, 2), -- Emma enseigne en 3B
  (4, 1), -- Sam en 3A
  (5, 1), -- Chloe en 3A
  (6, 2); -- Leo en 3B

----------------------
-- PLANNING
-- teacher_user_id = id de users où role = 'teacher'
----------------------
INSERT INTO planning (class_id, teacher_user_id, label, room, date, start_time, end_time) VALUES
  (1, 2, 'Programmation Web',         'B101', DATE '2025-01-06', TIME '09:00', TIME '11:00'),
  (1, 2, 'Bases de données',          'B102', DATE '2025-01-07', TIME '14:00', TIME '16:00'),
  (2, 3, 'Maths appliquées au design','C201', DATE '2025-01-06', TIME '10:00', TIME '12:00'),
  (2, 3, 'Statistiques',              'C202', DATE '2025-01-08', TIME '08:30', TIME '10:00');

----------------------
-- NOTES
----------------------
INSERT INTO notes (id, student_user_id, teacher_user_id, class_id, value, ects) VALUES
  (1, 4, 2, 1, 15.5, 6),  -- Sam / Thomas / 3A
  (2, 5, 2, 1, 12.0, 6),  -- Chloe / Thomas / 3A
  (3, 6, 3, 2, 17.0, 5),  -- Leo / Emma / 3B
  (4, 4, 2, 1, 9.5,  3);  -- Sam / Thomas / 3A

----------------------
-- DOCUMENTS
----------------------
INSERT INTO documents (id, user_id, type, file_path) VALUES
  (1, 4, 'releve_notes', '/files/students/sam/releve_notes_2025.pdf'),
  (2, 5, 'certificat_scolarite', '/files/students/chloe/certificat_2025.pdf'),
  (3, 2, 'contrat_travail', '/files/teachers/thomas/contrat.pdf');

----------------------
-- NOTIFICATIONS
----------------------
INSERT INTO notifications (id, user_id, message) VALUES
  (1, 4, 'Votre cours "Programmation Web" commence demain à 09:00 en B101.'),
  (2, 5, 'Une nouvelle note a été ajoutée à votre relevé.'),
  (3, 2, 'Vous avez 2 cours programmés cette semaine.'),
  (4, 1, 'Rapport hebdomadaire disponible dans le back-office.');

COMMIT;

-- Et après, resync des sequences si besoin :
SELECT setval('users_id_seq',    (SELECT COALESCE(MAX(id), 0) FROM users) + 1, false);
SELECT setval('classes_id_seq',  (SELECT COALESCE(MAX(id), 0) FROM classes) + 1, false);
SELECT setval('planning_id_seq', (SELECT COALESCE(MAX(id), 0) FROM planning) + 1, false);
SELECT setval('notes_id_seq',    (SELECT COALESCE(MAX(id), 0) FROM notes) + 1, false);
