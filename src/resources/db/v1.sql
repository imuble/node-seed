
CREATE TABLE user_credentials (
    username text,
    password text,
    id uuid,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id)
);
