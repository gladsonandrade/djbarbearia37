// Horários de expediente são minutos locais; instantes de reservas são epoch ms.
export const BUSINESS_TIME_ZONE = 'America/Fortaleza';
export const DEFAULT_POLICY = Object.freeze({
  openingMinute: 8 * 60,
  closingMinute: 20 * 60,
  delayToleranceMinutes: 10,
  gapMinutes: 10,
  holdMinutes: 60,
});

export function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

export function fitsWorkingHours(startMinute, durationMinutes, { delayed = false, policy = DEFAULT_POLICY } = {}) {
  if (!Number.isInteger(startMinute) || !Number.isInteger(durationMinutes) || durationMinutes <= 0) return false;
  const limit = policy.closingMinute + (delayed ? policy.delayToleranceMinutes : 0);
  return startMinute >= policy.openingMinute && startMinute + durationMinutes <= limit;
}

export function blocksAvailability(booking, now) {
  return booking.status === 'confirmed' || (booking.status === 'pending' && booking.expiresAt > now);
}

export function agendaGroup(booking, now) {
  if (booking.status === 'pending') return booking.expiresAt > now ? 'pending' : 'history';
  if (booking.status === 'confirmed') return booking.endsAt > now ? 'to_attend' : 'needs_outcome';
  return 'history';
}

// As folgas de deslocamento devem ser calculadas antes pelo serviço de disponibilidade.
export function occupiedPeriod({ startsAt, endsAt, travelBeforeMinutes = 0, travelAfterMinutes = 0, gapMinutes = 10 }) {
  const values = [travelBeforeMinutes, travelAfterMinutes, gapMinutes];
  if (!Number.isSafeInteger(startsAt) || !Number.isSafeInteger(endsAt) || endsAt <= startsAt ||
      values.some(value => !Number.isInteger(value) || value < 0)) throw new Error('INVALID_PERIOD');
  return { start: startsAt - travelBeforeMinutes * 60000, end: endsAt + (travelAfterMinutes + gapMinutes) * 60000 };
}
