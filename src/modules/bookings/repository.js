import { randomUUID } from 'node:crypto';

// Camada interna. Não expor diretamente ao cliente: validar catálogo, expediente,
// antecedência, identidade e proteção contra abuso antes de criar uma reserva.
export function createHold(db, input, { now = Date.now(), holdMinutes = 60 } = {}) {
  const { customerName, customerPhone, mode, startsAt, endsAt, occupiedStart, occupiedEnd } = input;
  if (!customerName?.trim() || !/^\d{10,15}$/.test(customerPhone || '') || !['shop', 'home'].includes(mode) ||
      ![startsAt, endsAt, occupiedStart, occupiedEnd, now].every(Number.isSafeInteger) ||
      startsAt <= now || endsAt <= startsAt || occupiedStart > startsAt || occupiedEnd < endsAt ||
      !Number.isInteger(holdMinutes) || holdMinutes <= 0) throw new Error('INVALID_HOLD');
  // BEGIN IMMEDIATE serializa a verificação e a escrita, inclusive em conexões diferentes.
  db.exec('BEGIN IMMEDIATE');
  try {
    expireHolds(db, now);
    const collision = db.prepare(`SELECT id FROM bookings WHERE status IN ('pending', 'confirmed')
      AND occupied_start < ? AND occupied_end > ? LIMIT 1`).get(occupiedEnd, occupiedStart);
    const block = db.prepare(`SELECT id FROM schedule_blocks WHERE starts_at < ? AND ends_at > ? LIMIT 1`)
      .get(occupiedEnd, occupiedStart);
    if (collision || block) throw new Error('SLOT_UNAVAILABLE');
    const id = randomUUID();
    // Uma reserva nunca segue pendente depois que seu atendimento já deveria começar.
    const expiresAt = Math.min(now + holdMinutes * 60000, startsAt);
    db.prepare(`INSERT INTO bookings (id, customer_name, customer_phone, mode, region,
      starts_at, ends_at, occupied_start, occupied_end, status, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`)
      .run(id, customerName.trim(), customerPhone, mode, input.region || null,
        startsAt, endsAt, occupiedStart, occupiedEnd, expiresAt, now);
    db.exec('COMMIT');
    return { id, status: 'pending', expiresAt };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function expireHolds(db, now = Date.now()) {
  return db.prepare("UPDATE bookings SET status = 'expired' WHERE status = 'pending' AND expires_at <= ?").run(now).changes;
}
