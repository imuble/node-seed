
CREATE TABLE analytics (
    id serial,
    type text,
    userId uuid,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE sample (
    id serial,
    sampleData text,
    PRIMARY KEY (id)
);
