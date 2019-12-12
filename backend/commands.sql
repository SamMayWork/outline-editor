CREATE TABLE DisplayNotes (
    note_id varchar(8) PRIMARY KEY,
    note_date_created  date NOT NULL,
    note_title  varchar(50),
    note_content TEXT
);