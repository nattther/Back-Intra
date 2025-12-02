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

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    teacher_id INT REFERENCES teachers(id),
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
    label TEXT,
    room TEXT,
    date TEXT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    message TEXT
);
