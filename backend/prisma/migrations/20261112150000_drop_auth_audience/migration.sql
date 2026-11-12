-- No column uses the auth_audience type since staff and customers have their own session tables.
-- The audience is now only the aud claim of the JWT (a constant in code).
DROP TYPE "auth_audience";
