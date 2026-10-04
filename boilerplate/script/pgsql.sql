 

  CREATE TABLE users (
      id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username           VARCHAR(255) NOT NULL UNIQUE,
      password_hash      VARCHAR(255) NOT NULL,
      salt               VARCHAR(255) NOT NULL,
      first_name         VARCHAR(100) NOT NULL,
      middle_name        VARCHAR(100),
      last_name          VARCHAR(100) NOT NULL,
      date_of_birth      DATE,
      created_by         VARCHAR(255),
      created_date       TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_updated_by    VARCHAR(255),
      last_updated_date  TIMESTAMPTZ NOT NULL DEFAULT now()
  );
