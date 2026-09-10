const existingAppointments = [
  {
    horarios: { hora_inicio: 8 },
    detalle_cita_servicio: [ { servicios: { duracion: 30 } } ]
  }
];

const toMinutes = (h) => {
  const str = h.toString().padStart(4, '0');
  return parseInt(str.slice(0, 2)) * 60 + parseInt(str.slice(2, 4));
};

const newStart = toMinutes(8);
const newDuration = 30;
const newEnd = newStart + newDuration;

const hasOverlap = existingAppointments.some((r) => {
  const existingStart = toMinutes(r.horarios?.hora_inicio || 0);
  const existingDuration = r.detalle_cita_servicio?.[0]?.servicios?.duracion || 30;
  const existingEnd = existingStart + existingDuration;
  console.log({ existingStart, existingDuration, existingEnd, newStart, newEnd });
  return newStart < existingEnd && newEnd > existingStart;
});

console.log("hasOverlap:", hasOverlap);
