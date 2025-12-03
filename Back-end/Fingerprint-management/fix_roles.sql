-- SQL script to fix role values in the database
-- This removes the "ROLE_" prefix from existing role values

USE fingerprint_attendance;

-- Update users table to remove ROLE_ prefix
UPDATE users
SET role = REPLACE(role, 'ROLE_', '')
WHERE role LIKE 'ROLE_%';

-- Verify the changes
SELECT userId, email, role FROM users;

