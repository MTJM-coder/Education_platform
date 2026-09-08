-- ============================================================
-- EDUCATION PLATFORM — SCHEMA POSTGRESQL
-- Basé sur le diagramme de classe validé (22 entités)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- pour gen_random_uuid()

-- ============================================================
-- 1. UTILISATEURS & RÔLES
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    phone           TEXT UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('super_admin','admin_staff','teacher','parent','student')),
    photo_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Extension 1:1 de users pour role = 'teacher'
CREATE TABLE teachers (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    id_card_url             TEXT,
    cv_url                  TEXT,
    degrees_url             TEXT,
    location_plan_url       TEXT,
    bio                     TEXT,                       -- présentation libre (remplace la lettre de motivation)
    experience_years        NUMERIC(4,1),
    teaching_radius_km      NUMERIC(5,2),
    location                TEXT,
    expected_rate           NUMERIC(10,2),
    validation_status       TEXT NOT NULL DEFAULT 'pending'
                                 CHECK (validation_status IN ('pending','approved','rejected')),
    rank                    TEXT NOT NULL DEFAULT 'teacher'
                                 CHECK (rank IN ('teacher','senior_teacher','head_teacher','admin_staff')),
    rank_points             INTEGER NOT NULL DEFAULT 0,
    eligible_for_promotion  BOOLEAN NOT NULL DEFAULT FALSE,
    stars                   INTEGER NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 5),  -- impacte le tarif
    balance                 NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- Extension 1:1 de users pour role = 'parent'
CREATE TABLE parents (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    address             TEXT,
    id_card_photo_url   TEXT
);

-- ============================================================
-- 2. STRUCTURE PÉDAGOGIQUE
-- ============================================================

CREATE TABLE subjects (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    TEXT NOT NULL UNIQUE
);

CREATE TABLE levels (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    TEXT NOT NULL UNIQUE
);

CREATE TABLE classrooms (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    level_id    UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE (level_id, name)
);

-- ============================================================
-- 3. LEARNER (élève auto-inscrit OU enfant géré par un parent)
-- ============================================================

CREATE TABLE learners (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            TEXT NOT NULL CHECK (type IN ('self','child')),
    parent_id       UUID REFERENCES parents(user_id) ON DELETE CASCADE,
    user_id         UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    section         TEXT CHECK (section IN ('english','french')),
    level_id        UUID REFERENCES levels(id),
    class_id        UUID REFERENCES classrooms(id),
    school_name     TEXT,
    location        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_learner_owner CHECK (
        (type = 'child' AND parent_id IS NOT NULL) OR
        (type = 'self'  AND user_id  IS NOT NULL)
    )
);

CREATE INDEX idx_learners_parent ON learners(parent_id);
CREATE INDEX idx_learners_user   ON learners(user_id);

-- ============================================================
-- 4. HOD & VALIDATION DES MATIÈRES ENSEIGNÉES
-- ============================================================

-- Un HOD est un Teacher qui supervise une matière (pas une entité séparée)
CREATE TABLE department_heads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    appointed_at    DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- Un seul HOD actif par matière à la fois
CREATE UNIQUE INDEX idx_one_active_hod_per_subject
    ON department_heads(subject_id) WHERE is_active;

-- Matières/classes qu'un enseignant est validé pour enseigner
CREATE TABLE teacher_subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id        UUID REFERENCES classrooms(id),
    validated       BOOLEAN NOT NULL DEFAULT FALSE,
    validated_by    UUID REFERENCES teachers(user_id),  -- doit être le HOD de la matière (règle métier)
    validated_at    TIMESTAMPTZ,
    UNIQUE (teacher_id, subject_id, class_id)
);

CREATE TABLE teacher_availabilities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
    day_of_week     TEXT NOT NULL CHECK (day_of_week IN
                        ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    CHECK (end_time > start_time)
);

CREATE INDEX idx_availability_teacher ON teacher_availabilities(teacher_id);

-- ============================================================
-- 5. TUTORAT, AFFECTATION & SESSIONS
-- ============================================================

CREATE TABLE tutoring_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    location        TEXT,
    preferred_days  TEXT,
    preferred_time  TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','matched','cancelled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_learner ON tutoring_requests(learner_id);

CREATE TABLE assignments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id          UUID NOT NULL REFERENCES tutoring_requests(id) ON DELETE CASCADE,
    teacher_id          UUID NOT NULL REFERENCES teachers(user_id),
    status              TEXT NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','active','completed','cancelled')),
    agreed_price        NUMERIC(10,2),
    validated_by_admin  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_request ON assignments(request_id);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id   UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    session_date    DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    location        TEXT,
    status          TEXT NOT NULL DEFAULT 'scheduled'
                         CHECK (status IN ('scheduled','completed','cancelled','disputed')),
    CHECK (end_time > start_time)
);

CREATE INDEX idx_sessions_assignment ON sessions(assignment_id);

-- ============================================================
-- 6. PAIEMENT & SÉQUESTRE (fusionnés dans payments)
-- ============================================================

CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id           UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    amount                  NUMERIC(10,2) NOT NULL,
    currency                TEXT NOT NULL DEFAULT 'XAF',
    method                  TEXT NOT NULL CHECK (method IN ('mobile_money','bank_transfer','other')),
    period                  TEXT NOT NULL CHECK (period IN ('hourly','weekly','monthly')),
    status                  TEXT NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending','paid','failed','refunded')),
    commission_amount       NUMERIC(10,2),
    teacher_amount          NUMERIC(10,2),
    escrow_status           TEXT NOT NULL DEFAULT 'held'
                                 CHECK (escrow_status IN ('held','released','refunded')),
    escrow_release_date     TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_assignment ON payments(assignment_id);

CREATE TABLE disputes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    raised_by       UUID NOT NULL REFERENCES users(id),
    reason          TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','under_review','resolved')),
    resolution      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_one_dispute_per_session ON disputes(session_id);

-- ============================================================
-- 7. ÉVALUATIONS & RÉSULTATS
-- ============================================================

CREATE TABLE academic_evaluations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    title           TEXT NOT NULL,
    eval_date       DATE,
    created_by      UUID NOT NULL REFERENCES teachers(user_id)  -- doit être HOD (règle métier)
);

CREATE TABLE questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id   UUID NOT NULL REFERENCES academic_evaluations(id) ON DELETE CASCADE,
    text            TEXT NOT NULL,
    correct_answer  TEXT
);

CREATE TABLE results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    evaluation_id   UUID REFERENCES academic_evaluations(id),
    teacher_id      UUID REFERENCES teachers(user_id),
    score           NUMERIC(5,2),
    grade           TEXT,
    term            TEXT,
    academic_year   TEXT,
    comments        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_results_learner ON results(learner_id);

CREATE TABLE teacher_reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
    session_id      UUID REFERENCES sessions(id),
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    criteria        JSONB,          -- ex: {"quality":5,"punctuality":4,"communication":5}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_teacher ON teacher_reviews(teacher_id);
CREATE UNIQUE INDEX idx_one_review_per_session ON teacher_reviews(session_id) WHERE session_id IS NOT NULL;

-- ============================================================
-- 8. RÉCOMPENSES, CONTENU & CONCOURS
-- ============================================================

CREATE TABLE monthly_awards (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    award_type          TEXT NOT NULL CHECK (award_type IN
                             ('teacher_of_month','student_of_month','most_progressive_student')),
    month               INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year                INTEGER NOT NULL,
    score               NUMERIC(6,2),
    prize_description   TEXT,                              -- ex. "manuel scolaire", "sac d'école"
    teacher_id          UUID REFERENCES teachers(user_id),
    learner_id          UUID REFERENCES learners(id),
    CONSTRAINT chk_award_target CHECK (
        (teacher_id IS NOT NULL AND learner_id IS NULL) OR
        (teacher_id IS NULL AND learner_id IS NOT NULL)
    )
);

CREATE TABLE lecture_notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id),
    title           TEXT NOT NULL,
    file_url        TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    validated_by    UUID REFERENCES teachers(user_id),   -- doit être HOD (règle métier)
    validated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE competitive_exams (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                        TEXT NOT NULL,
    institution                 TEXT,
    city                        TEXT,
    field                       TEXT,
    exam_date                   DATE,
    admission_requirements      TEXT
);

CREATE TABLE exam_preparation_tracks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id             UUID NOT NULL REFERENCES competitive_exams(id) ON DELETE CASCADE,
    learner_id          UUID REFERENCES learners(id) ON DELETE CASCADE,
    teacher_id          UUID REFERENCES teachers(user_id),
    subjects_covered    TEXT
);

-- ============================================================
-- 9. ADMINISTRATION & PERMISSIONS (Admin Staff configurable)
-- ============================================================

CREATE TABLE permissions (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key     TEXT NOT NULL UNIQUE,      -- ex. 'manage_payments', 'validate_teachers'
    label   TEXT NOT NULL
);

CREATE TABLE admin_permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id   UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE (user_id, permission_id)
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notif_type      TEXT NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
