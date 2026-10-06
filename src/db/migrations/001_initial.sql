CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER CHECK (price_cents >= 0),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  active INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0, 1)),
  CHECK (active = 0 OR (price_cents IS NOT NULL AND duration_minutes IS NOT NULL))
) STRICT;

CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('shop', 'home')),
  region TEXT,
  address TEXT,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL CHECK (ends_at > starts_at),
  occupied_start INTEGER NOT NULL,
  occupied_end INTEGER NOT NULL CHECK (occupied_end > occupied_start),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined', 'expired', 'cancelled', 'attended', 'no_show')),
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  CHECK (occupied_start <= starts_at AND occupied_end >= ends_at),
  CHECK (status != 'pending' OR expires_at IS NOT NULL)
) STRICT;
CREATE INDEX bookings_occupancy ON bookings(status, occupied_start, occupied_end);

CREATE TABLE booking_services (
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  name_snapshot TEXT NOT NULL,
  price_cents_snapshot INTEGER NOT NULL CHECK (price_cents_snapshot >= 0),
  duration_minutes_snapshot INTEGER NOT NULL CHECK (duration_minutes_snapshot > 0),
  PRIMARY KEY (booking_id, service_id)
) STRICT;

CREATE TABLE schedule_blocks (
  id TEXT PRIMARY KEY,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL CHECK (ends_at > starts_at),
  reason TEXT NOT NULL DEFAULT ''
) STRICT;

CREATE TABLE working_windows (
  id TEXT PRIMARY KEY,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  mode TEXT NOT NULL CHECK (mode IN ('shop', 'home')),
  opening_minute INTEGER NOT NULL CHECK (opening_minute BETWEEN 0 AND 1439),
  closing_minute INTEGER NOT NULL CHECK (closing_minute BETWEEN 1 AND 1440),
  CHECK (closing_minute > opening_minute)
) STRICT;

-- Serviços conhecidos, ainda desativados: não inventar preço/duração definitivos.
INSERT INTO services(id, name) VALUES
  ('corte', 'Corte masculino'), ('barba', 'Barba'),
  ('sobrancelha', 'Sobrancelha'), ('acabamento', 'Acabamento');
-- Janelas por modalidade ainda dependem de confirmação: não gerar slots fictícios.
