UPDATE users SET is_verified=true WHERE email='newadmin@chaos.dev';
DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email='newadmin@chaos.dev');
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email='newadmin@chaos.dev'), 1);
