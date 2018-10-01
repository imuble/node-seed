CREATE TABLE transaction (
    id serial,
    amount float NOT NULL,
    type text NOT NULL,
    category text NOT NULL,
    user_id uuid NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_credentials(id)
);