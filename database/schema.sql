-- ============================================================
-- CHAOS PLANNER — PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE  -- ROLE_ADMIN, ROLE_USER
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password_hash   VARCHAR(255) NOT NULL,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER_ROLES (join table)
-- ============================================================
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT  NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================
-- OTP VERIFICATIONS
-- ============================================================
CREATE TABLE otp_verifications (
    id              SERIAL PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_code        VARCHAR(10) NOT NULL,
    otp_type        VARCHAR(30) NOT NULL,  -- SIGNUP, FORGOT_PASSWORD
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    attempts        INT NOT NULL DEFAULT 0,
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_user_id ON otp_verifications(user_id);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- ============================================================
-- VENUES
-- ============================================================
CREATE TABLE venues (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    address     TEXT,
    city        VARCHAR(100),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE rooms (
    id          SERIAL PRIMARY KEY,
    venue_id    INT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    capacity    INT,
    floor       VARCHAR(20),
    notes       TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_venue ON rooms(venue_id);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title                   VARCHAR(255) NOT NULL,
    organizer_id            UUID NOT NULL REFERENCES users(id),
    description             TEXT,
    category                VARCHAR(80),
    venue_id                INT REFERENCES venues(id),
    room_id                 INT REFERENCES rooms(id),
    event_date              DATE NOT NULL,
    start_time              TIME NOT NULL,
    end_time                TIME NOT NULL,
    capacity                INT NOT NULL DEFAULT 100,
    registration_open_at    TIMESTAMP,
    registration_close_at   TIMESTAMP,
    is_approval_required    BOOLEAN NOT NULL DEFAULT FALSE,
    status                  VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                            -- DRAFT, PUBLISHED, PAUSED, CANCELLED
    banner_url              VARCHAR(500),
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date   ON events(event_date);
CREATE INDEX idx_events_org    ON events(organizer_id);

-- ============================================================
-- REGISTRATIONS
-- ============================================================
CREATE TABLE registrations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    -- PENDING, APPROVED, REJECTED, CANCELLED, WAITLISTED
    waitlist_pos    INT,
    registered_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at     TIMESTAMP,
    cancelled_at    TIMESTAMP,
    notes           TEXT,
    UNIQUE (event_id, user_id)
);

CREATE INDEX idx_reg_event  ON registrations(event_id);
CREATE INDEX idx_reg_user   ON registrations(user_id);
CREATE INDEX idx_reg_status ON registrations(status);

-- ============================================================
-- CHECK-INS
-- ============================================================
CREATE TABLE check_ins (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id     UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE UNIQUE,
    qr_token            VARCHAR(255) NOT NULL UNIQUE,
    checked_in          BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at       TIMESTAMP,
    checked_in_by       UUID REFERENCES users(id),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkin_qr  ON check_ins(qr_token);
CREATE INDEX idx_checkin_reg ON check_ins(registration_id);

-- ============================================================
-- VOLUNTEER SHIFTS
-- ============================================================
CREATE TABLE volunteer_shifts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    role_name       VARCHAR(100) NOT NULL,  -- check-in desk, logistics, etc.
    description     TEXT,
    start_time      TIMESTAMP NOT NULL,
    end_time        TIMESTAMP NOT NULL,
    slots_total     INT NOT NULL DEFAULT 1,
    slots_filled    INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shifts_event ON volunteer_shifts(event_id);

-- ============================================================
-- VOLUNTEER ASSIGNMENTS
-- ============================================================
CREATE TABLE volunteer_assignments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id    UUID NOT NULL REFERENCES volunteer_shifts(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'ASSIGNED',
                -- ASSIGNED, CONFIRMED, DECLINED, COMPLETED
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (shift_id, user_id)
);

CREATE INDEX idx_vassign_shift ON volunteer_assignments(shift_id);
CREATE INDEX idx_vassign_user  ON volunteer_assignments(user_id);

-- ============================================================
-- ROOM CONFLICTS
-- ============================================================
CREATE TABLE room_conflicts (
    id              SERIAL PRIMARY KEY,
    room_id         INT NOT NULL REFERENCES rooms(id),
    event_id_a      UUID NOT NULL REFERENCES events(id),
    event_id_b      UUID NOT NULL REFERENCES events(id),
    conflict_date   DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    resolved        BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at     TIMESTAMP,
    detected_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conflicts_room ON room_conflicts(room_id);
CREATE INDEX idx_conflicts_res  ON room_conflicts(resolved);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE announcements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id        UUID REFERENCES events(id) ON DELETE CASCADE,  -- NULL = global
    created_by      UUID NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    priority        VARCHAR(20) NOT NULL DEFAULT 'NORMAL',  -- NORMAL, HIGH, URGENT
    target_audience VARCHAR(30) NOT NULL DEFAULT 'ALL',     -- ALL, ATTENDEES, VOLUNTEERS
    published_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announce_event    ON announcements(event_id);
CREATE INDEX idx_announce_priority ON announcements(priority);

-- ============================================================
-- NOTIFICATIONS (per-user)
-- ============================================================
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    announcement_id     UUID REFERENCES announcements(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    body                TEXT NOT NULL,
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_user   ON notifications(user_id);
CREATE INDEX idx_notif_read   ON notifications(is_read);
