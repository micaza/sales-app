-- =========================================================
-- AUDIT: keeps updated_at / updated_by current on every UPDATE
-- (DEFAULT only fires on INSERT, so updates need a trigger)
-- =========================================================
CREATE OR REPLACE FUNCTION set_audit_fields() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  -- keep an app-supplied updated_by; otherwise fall back to 'system'
  IF NEW.updated_by IS NOT DISTINCT FROM OLD.updated_by THEN
    NEW.updated_by := 'system';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- STAGING: every sale event lands here, duplicates included
-- =========================================================
CREATE TABLE stg_sale_event (
  stg_sale_event_id BIGSERIAL    PRIMARY KEY,
  sale_uid          VARCHAR(64)  NOT NULL,          -- repeats allowed
  store_code        VARCHAR(20),
  register_code     VARCHAR(20),
  cashier_code      VARCHAR(20),
  sold_at           TIMESTAMPTZ,
  currency          VARCHAR(3),
  subtotal_cents    INTEGER,
  tax_cents         INTEGER,
  total_cents       INTEGER,
  payment_method    VARCHAR(20),
  payment_token     VARCHAR(100),
  payload           JSONB        NOT NULL,          -- the raw event, as received
  payload_hash      VARCHAR(64)  NOT NULL,          -- SHA-256 of the payload
  received_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  status            VARCHAR(20)  NOT NULL DEFAULT 'pending',
  processed_at      TIMESTAMPTZ,
  error_message     TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by        VARCHAR(100) NOT NULL DEFAULT 'system',
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by        VARCHAR(100) NOT NULL DEFAULT 'system'
);
CREATE INDEX ix_stg_sale_event_sale_uid ON stg_sale_event (sale_uid);
CREATE INDEX ix_stg_sale_event_pending  ON stg_sale_event (received_at) WHERE status = 'pending';
CREATE TRIGGER trg_stg_sale_event_audit BEFORE UPDATE ON stg_sale_event
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TABLE stg_sale_event_item (
  stg_sale_event_item_id BIGSERIAL PRIMARY KEY,
  stg_sale_event_id      BIGINT NOT NULL REFERENCES stg_sale_event (stg_sale_event_id) ON DELETE CASCADE,
  line_number            INTEGER,
  sku                    VARCHAR(40),
  description            VARCHAR(200),
  quantity               INTEGER,
  unit_price_cents       INTEGER,
  discount_cents         INTEGER,
  line_total_cents       INTEGER,
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by             VARCHAR(100) NOT NULL DEFAULT 'system',
  updated_at             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by             VARCHAR(100) NOT NULL DEFAULT 'system'
);
CREATE INDEX ix_stg_sale_event_item_event ON stg_sale_event_item (stg_sale_event_id);
CREATE TRIGGER trg_stg_sale_event_item_audit BEFORE UPDATE ON stg_sale_event_item
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- =========================================================
-- CLEAN: exactly one row per real sale
-- =========================================================
CREATE TABLE store (
  id         SERIAL       PRIMARY KEY,
  store_code VARCHAR(20)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  city       VARCHAR(60),
  state      VARCHAR(2) CHECK (state ~ '^[A-Z]{2}$'),
  time_zone  VARCHAR(40)  NOT NULL DEFAULT 'America/Denver',
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  closed_at  TIMESTAMPTZ
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by VARCHAR(100) NOT NULL DEFAULT 'system',
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by VARCHAR(100) NOT NULL DEFAULT 'system'
);
CREATE TRIGGER trg_store_audit BEFORE UPDATE ON store
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TABLE sale (
  id                  BIGSERIAL    PRIMARY KEY,
  sale_uid            VARCHAR(64)  NOT NULL UNIQUE,  -- the duplicate guard
  store_id            INTEGER      NOT NULL REFERENCES store (id),
  register_code       VARCHAR(20),
  cashier_code        VARCHAR(20),
  sold_at             TIMESTAMPTZ  NOT NULL,
  currency            VARCHAR(3)   NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  subtotal_cents      INTEGER      NOT NULL,
  tax_cents           INTEGER      NOT NULL,
  total_cents         INTEGER      NOT NULL,
  payment_method      VARCHAR(20),
  payment_token       VARCHAR(100),
  source_stg_event_id BIGINT,                        -- which staging row it came from
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by          VARCHAR(100) NOT NULL DEFAULT 'system',
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by          VARCHAR(100) NOT NULL DEFAULT 'system'
);
CREATE INDEX ix_sale_store_sold_at ON sale (store_id, sold_at);
CREATE TRIGGER trg_sale_audit BEFORE UPDATE ON sale
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TABLE sale_item (
  id               BIGSERIAL    PRIMARY KEY,
  sale_id          BIGINT       NOT NULL REFERENCES sale (id),
  line_number      INTEGER      NOT NULL,
  sku              VARCHAR(40)  NOT NULL,
  description      VARCHAR(200),
  quantity         INTEGER      NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER      NOT NULL,
  discount_cents   INTEGER      NOT NULL DEFAULT 0,
  line_total_cents INTEGER      NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by       VARCHAR(100) NOT NULL DEFAULT 'system',
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by       VARCHAR(100) NOT NULL DEFAULT 'system',
  UNIQUE (sale_id, line_number)
);
CREATE TRIGGER trg_sale_item_audit BEFORE UPDATE ON sale_item
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- Test stores
INSERT INTO store (store_code, name, city, state) VALUES
  ('STORE-001', 'Test Store 1', 'Salt Lake City', 'UT'),
  ('STORE-002', 'Test Store 2', 'Provo',          'UT'),
  ('STORE-003', 'Test Store 3', 'Ogden',          'UT');
