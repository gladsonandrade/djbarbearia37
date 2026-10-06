import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaGroup, fitsWorkingHours, occupiedPeriod } from '../src/domain/agenda.js';

test('novo horário termina às 20h; atraso permite somente até 20h10', () => {
  assert.equal(fitsWorkingHours(19 * 60 + 30, 30), true);
  assert.equal(fitsWorkingHours(19 * 60 + 40, 30), false);
  assert.equal(fitsWorkingHours(19 * 60 + 40, 30, { delayed: true }), true);
  assert.equal(fitsWorkingHours(19 * 60 + 41, 30, { delayed: true }), false);
  assert.equal(fitsWorkingHours(20 * 60, 30), false);
});

test('atendimento some de A atender no término, sem ganhar resultado automaticamente', () => {
  const booking = { status: 'confirmed', endsAt: 2000 };
  assert.equal(agendaGroup(booking, 1999), 'to_attend');
  assert.equal(agendaGroup(booking, 2000), 'needs_outcome');
  assert.equal(booking.status, 'confirmed');
  assert.equal(agendaGroup({ ...booking, status: 'attended' }, 2000), 'history');
});

test('deslocamento e intervalo ocupam a agenda única', () => {
  assert.deepEqual(occupiedPeriod({ startsAt: 1200000, endsAt: 3000000, travelBeforeMinutes: 20, travelAfterMinutes: 20 }),
    { start: 0, end: 4800000 });
});
