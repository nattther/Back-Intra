-- =========================
-- DROP TABLES (si existent)
-- =========================
DROP TABLE IF EXISTS planning CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS user_classes CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================
-- CREATE TABLES
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    label TEXT
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    class_id INT REFERENCES classes(id)
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    speciality TEXT
);

CREATE TABLE user_classes (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, class_id)
);

CREATE TABLE notes (
   id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id),
   teacher_id INT REFERENCES teachers(id),
   class_id INT REFERENCES classes(id),
   value NUMERIC,
   ects INT
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type TEXT,
    file_path TEXT
);

CREATE TABLE planning (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  teacher_id INT REFERENCES teachers(id),
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

----------------------
-- USERS
----------------------
INSERT INTO users (id, name, email, role) VALUES
  (1, 'Alice Admin',   'alice.admin@example.com',   'admin'),
  (2, 'Thomas Teacher','thomas.teacher@example.com','teacher'),
  (3, 'Emma Expert',   'emma.expert@example.com',   'teacher'),
  (4, 'Sam Student',   'sam.student@example.com',   'student'),
  (5, 'Chloe Student', 'chloe.student@example.com', 'student'),
  (6, 'Leo Student',   'leo.student@example.com',   'student');

----------------------
-- CLASSES
----------------------
INSERT INTO classes (id, label) VALUES
  (1, '3A Informatique'),
  (2, '3B Design');

----------------------
-- STUDENTS
-- (lien entre user "student" et sa classe principale)
----------------------
INSERT INTO students (id, user_id, class_id) VALUES
  (1, 4, 1),  -- Sam -> 3A Info
  (2, 5, 1),  -- Chloe -> 3A Info
  (3, 6, 2);  -- Leo -> 3B Design

----------------------
-- TEACHERS
-- (lien entre user "teacher" et sa spécialité)
----------------------
INSERT INTO teachers (id, user_id, speciality) VALUES
  (1, 2, 'Informatique'),
  (2, 3, 'Mathématiques');

----------------------
-- USER_CLASSES
-- (qui est rattaché à quelle classe : profs, élèves, admin)
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
----------------------
INSERT INTO planning (class_id, teacher_id, label, room, date, start_time, end_time) VALUES
  (1, 1, 'Programmation Web',       'B101', DATE '2025-01-06', TIME '09:00', TIME '11:00'),
  (1, 1, 'Bases de données',        'B102', DATE '2025-01-07', TIME '14:00', TIME '16:00'),
  (2, 2, 'Maths appliquées au design','C201', DATE '2025-01-06', TIME '10:00', TIME '12:00'),
  (2, 2, 'Statistiques',            'C202', DATE '2025-01-08', TIME '08:30', TIME '10:00');

----------------------
-- NOTES
----------------------
INSERT INTO notes (id, student_id, teacher_id, class_id, value, ects) VALUES
  (1, 1, 1, 1, 15.5, 6),  -- Sam, Thomas, 3A Info
  (2, 2, 1, 1, 12.0, 6),  -- Chloe, Thomas, 3A Info
  (3, 3, 2, 2, 17.0, 5),  -- Leo, Emma, 3B Design
  (4, 1, 1, 1, 9.5,  3);  -- Sam, deuxième note

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
