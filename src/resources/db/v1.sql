
CREATE TABLE user_credentials (
    username text NOT NULL,
    password text NOT NULL,
    id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id)
);
