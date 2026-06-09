-- ============================================================
-- CHAOS PLANNER — Seed / Demo Data
-- ============================================================

-- Roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_USER');

-- Venues
INSERT INTO venues (id, name, address, city) VALUES
(1, 'Main Campus Hall', '123 University Ave', 'Springfield'),
(2, 'Innovation Hub', '45 Tech Park Road', 'Springfield'),
(3, 'Student Union Building', '7 College Drive', 'Springfield');

-- Rooms
INSERT INTO rooms (id, venue_id, name, capacity, floor) VALUES
(1, 1, 'Auditorium A', 500, 'Ground'),
(2, 1, 'Seminar Room B1', 80, '1st'),
(3, 1, 'Seminar Room B2', 80, '1st'),
(4, 2, 'Innovation Lab', 120, 'Ground'),
(5, 2, 'Conference Room 1', 40, '2nd'),
(6, 3, 'Main Hall', 300, 'Ground'),
(7, 3, 'Meeting Room 101', 30, '1st');

-- Admin user (password: Admin@123 → bcrypt)
INSERT INTO users (id, full_name, email, phone, password_hash, is_verified, is_active) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Admin User',
  'admin@chaos.dev',
  '+1-555-0100',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpwEFalMfIKxJy', -- Admin@123
  TRUE,
  TRUE
),
-- Regular users (password: User@123 → bcrypt)
(
  'b0000000-0000-0000-0000-000000000001',
  'Alice Johnson',
  'alice@example.com',
  '+1-555-0101',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', -- password
  TRUE,
  TRUE
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Bob Martinez',
  'bob@example.com',
  '+1-555-0102',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
  TRUE,
  TRUE
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Carol Smith',
  'carol@example.com',
  '+1-555-0103',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
  TRUE,
  TRUE
),
(
  'b0000000-0000-0000-0000-000000000004',
  'David Lee',
  'david@example.com',
  '+1-555-0104',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
  TRUE,
  TRUE
),
(
  'b0000000-0000-0000-0000-000000000005',
  'Eva Williams',
  'eva@example.com',
  '+1-555-0105',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
  TRUE,
  TRUE
);

-- Assign roles
INSERT INTO user_roles (user_id, role_id) VALUES
('a0000000-0000-0000-0000-000000000001', 1), -- admin
('b0000000-0000-0000-0000-000000000001', 2),
('b0000000-0000-0000-0000-000000000002', 2),
('b0000000-0000-0000-0000-000000000003', 2),
('b0000000-0000-0000-0000-000000000004', 2),
('b0000000-0000-0000-0000-000000000005', 2);

-- Events
INSERT INTO events (id, title, organizer_id, description, category, venue_id, room_id,
    event_date, start_time, end_time, capacity, registration_open_at, registration_close_at,
    is_approval_required, status) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'TechFest 2026 — Annual Technology Summit',
  'a0000000-0000-0000-0000-000000000001',
  'The biggest annual tech summit for students. Features keynotes, workshops, hackathon, and networking.',
  'Technology',
  1, 1,
  '2026-07-15',
  '09:00', '18:00',
  400,
  '2026-06-01 00:00:00',
  '2026-07-10 23:59:59',
  FALSE,
  'PUBLISHED'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'Leadership & Governance Workshop',
  'a0000000-0000-0000-0000-000000000001',
  'A full-day workshop on student governance, club management, and community leadership.',
  'Workshop',
  2, 4,
  '2026-07-20',
  '10:00', '17:00',
  100,
  '2026-06-05 00:00:00',
  '2026-07-18 23:59:59',
  TRUE,
  'PUBLISHED'
),
(
  'e0000000-0000-0000-0000-000000000003',
  'Culture Fest — Diversity & Inclusion Night',
  'a0000000-0000-0000-0000-000000000001',
  'A cultural evening celebrating diversity with performances, food, and community activities.',
  'Cultural',
  3, 6,
  '2026-07-25',
  '17:00', '21:00',
  250,
  '2026-06-10 00:00:00',
  '2026-07-22 23:59:59',
  FALSE,
  'PUBLISHED'
),
(
  'e0000000-0000-0000-0000-000000000004',
  'Club Orientation Day — Draft Event',
  'a0000000-0000-0000-0000-000000000001',
  'Orientation event for new club members. Currently in planning phase.',
  'Orientation',
  1, 2,
  '2026-08-05',
  '11:00', '14:00',
  80,
  NULL,
  NULL,
  FALSE,
  'DRAFT'
);

-- Registrations for TechFest
INSERT INTO registrations (id, event_id, user_id, status, registered_at, approved_at) VALUES
(
  'r0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'APPROVED',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days'
),
(
  'r0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'APPROVED',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '3 days'
),
(
  'r0000000-0000-0000-0000-000000000003',
  'e0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'PENDING',
  NOW() - INTERVAL '2 days',
  NULL
);

-- Registrations for Leadership Workshop (approval-required)
INSERT INTO registrations (id, event_id, user_id, status, registered_at, approved_at) VALUES
(
  'r0000000-0000-0000-0000-000000000004',
  'e0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000004',
  'APPROVED',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
),
(
  'r0000000-0000-0000-0000-000000000005',
  'e0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000005',
  'PENDING',
  NOW() - INTERVAL '1 day',
  NULL
);

-- Check-ins (for approved registrations)
INSERT INTO check_ins (id, registration_id, qr_token, checked_in, checked_in_at) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'r0000000-0000-0000-0000-000000000001',
  'QR-ALICE-TECHFEST-2026-001',
  TRUE,
  NOW() - INTERVAL '2 hours'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'r0000000-0000-0000-0000-000000000002',
  'QR-BOB-TECHFEST-2026-002',
  FALSE,
  NULL
),
(
  'c0000000-0000-0000-0000-000000000004',
  'r0000000-0000-0000-0000-000000000004',
  'QR-DAVID-WORKSHOP-2026-001',
  FALSE,
  NULL
);

-- Volunteer Shifts for TechFest
INSERT INTO volunteer_shifts (id, event_id, role_name, description, start_time, end_time, slots_total, slots_filled) VALUES
(
  's0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'Check-In Desk',
  'Manage attendee check-in, scan QR codes',
  '2026-07-15 08:00:00',
  '2026-07-15 11:00:00',
  4, 2
),
(
  's0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001',
  'Logistics',
  'Setup, breakdown, and logistics coordination',
  '2026-07-15 07:00:00',
  '2026-07-15 19:00:00',
  6, 1
),
(
  's0000000-0000-0000-0000-000000000003',
  'e0000000-0000-0000-0000-000000000001',
  'Media & Photography',
  'Event photography and social media coverage',
  '2026-07-15 09:00:00',
  '2026-07-15 18:00:00',
  2, 2
),
(
  's0000000-0000-0000-0000-000000000004',
  'e0000000-0000-0000-0000-000000000001',
  'Help Desk',
  'Assist attendees with queries and directions',
  '2026-07-15 09:00:00',
  '2026-07-15 18:00:00',
  3, 0
);

-- Volunteer Shifts for Culture Fest
INSERT INTO volunteer_shifts (id, event_id, role_name, description, start_time, end_time, slots_total, slots_filled) VALUES
(
  's0000000-0000-0000-0000-000000000005',
  'e0000000-0000-0000-0000-000000000003',
  'Stage Management',
  'Coordinate performers and stage setup',
  '2026-07-25 15:00:00',
  '2026-07-25 21:30:00',
  3, 1
),
(
  's0000000-0000-0000-0000-000000000006',
  'e0000000-0000-0000-0000-000000000003',
  'Room Monitor',
  'Monitor activity areas and manage crowds',
  '2026-07-25 17:00:00',
  '2026-07-25 21:00:00',
  4, 0
);

-- Volunteer assignments
INSERT INTO volunteer_assignments (id, shift_id, user_id, status) VALUES
(
  'v0000000-0000-0000-0000-000000000001',
  's0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'CONFIRMED'
),
(
  'v0000000-0000-0000-0000-000000000002',
  's0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'ASSIGNED'
),
(
  'v0000000-0000-0000-0000-000000000003',
  's0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000003',
  'ASSIGNED'
),
(
  'v0000000-0000-0000-0000-000000000004',
  's0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000004',
  'CONFIRMED'
),
(
  'v0000000-0000-0000-0000-000000000005',
  's0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000005',
  'ASSIGNED'
),
(
  'v0000000-0000-0000-0000-000000000006',
  's0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000001',
  'ASSIGNED'
);

-- Room conflict (Seminar Room B1 double-booked - demo scenario)
-- NOTE: room_id=2 (Seminar Room B1) is also referenced by draft event 4
INSERT INTO room_conflicts (room_id, event_id_a, event_id_b, conflict_date, start_time, end_time, resolved) VALUES
(2,
 'e0000000-0000-0000-0000-000000000001',
 'e0000000-0000-0000-0000-000000000004',
 '2026-07-15',
 '09:00', '14:00',
 FALSE
);

-- Announcements
INSERT INTO announcements (id, event_id, created_by, title, body, priority, target_audience, published_at) VALUES
(
  'an000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  '🚨 URGENT: Gate B is now closed — use Gate A only',
  'Due to maintenance, Gate B is temporarily closed. All attendees must enter through Gate A on the east side of the building. Volunteers, please redirect everyone accordingly.',
  'URGENT',
  'ALL',
  NOW() - INTERVAL '30 minutes'
),
(
  'an000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Keynote Speaker Confirmed: Dr. Sarah Chen',
  'We are thrilled to announce that Dr. Sarah Chen, CTO of Nexus Labs, will be our keynote speaker for TechFest 2026. The keynote begins at 10:00 AM in Auditorium A.',
  'HIGH',
  'ATTENDEES',
  NOW() - INTERVAL '2 days'
),
(
  'an000000-0000-0000-0000-000000000003',
  NULL,
  'a0000000-0000-0000-0000-000000000001',
  'Platform Update: New QR Pass Feature Available',
  'All registered attendees can now access their digital QR pass from the My QR Pass section. Simply show your QR code at the check-in desk for fast entry.',
  'NORMAL',
  'ALL',
  NOW() - INTERVAL '5 days'
),
(
  'an000000-0000-0000-0000-000000000004',
  'e0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Volunteer Briefing: Culture Fest',
  'All Culture Fest volunteers, please attend the briefing session on July 24th at 4:00 PM in Meeting Room 101. Attendance is mandatory.',
  'HIGH',
  'VOLUNTEERS',
  NOW() - INTERVAL '1 day'
);

-- Notifications for users
INSERT INTO notifications (user_id, announcement_id, title, body, is_read) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'an000000-0000-0000-0000-000000000001',
  '🚨 URGENT: Gate B is now closed — use Gate A only',
  'Due to maintenance, Gate B is temporarily closed. All attendees must enter through Gate A.',
  FALSE
),
(
  'b0000000-0000-0000-0000-000000000001',
  'an000000-0000-0000-0000-000000000002',
  'Keynote Speaker Confirmed: Dr. Sarah Chen',
  'Dr. Sarah Chen, CTO of Nexus Labs, will be the keynote speaker for TechFest 2026.',
  TRUE
),
(
  'b0000000-0000-0000-0000-000000000002',
  'an000000-0000-0000-0000-000000000001',
  '🚨 URGENT: Gate B is now closed — use Gate A only',
  'Due to maintenance, Gate B is temporarily closed. All attendees must enter through Gate A.',
  FALSE
),
(
  'b0000000-0000-0000-0000-000000000003',
  'an000000-0000-0000-0000-000000000003',
  'Platform Update: New QR Pass Feature Available',
  'All registered attendees can now access their digital QR pass.',
  FALSE
);
