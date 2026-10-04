  CREATE TABLE users (
      id                 CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      username           VARCHAR(255) NOT NULL UNIQUE,
      password_hash      VARCHAR(255) NOT NULL,
      salt               VARCHAR(255) NOT NULL,
      first_name         VARCHAR(100) NOT NULL,
      middle_name        VARCHAR(100),
      last_name          VARCHAR(100) NOT NULL,
      date_of_birth      DATE,
      created_by         VARCHAR(255),
      created_date       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_updated_by    VARCHAR(255),
      last_updated_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON
  UPDATE CURRENT_TIMESTAMP
  );