const socket = io();

socket.on('serviceCreated', service => {
  const container = document.getElementById('services-list');
  if (!container) return;

  const empty = document.getElementById('empty-services');
  if (empty) empty.remove();

  const card = document.createElement('article');
  card.className = 'card';
  card.id = `service-${service._id}`;
  card.innerHTML = serviceCard(service);

  container.prepend(card);
});

socket.on('serviceUpdated', service => {
  const card = document.getElementById(`service-${service._id}`);
  if (!card) return;
  card.innerHTML = serviceCard(service);
});

socket.on('serviceDeleted', ({ id }) => {
  const card = document.getElementById(`service-${id}`);
  if (card) card.remove();
});

socket.on('bookingCreated', booking => {
  const container = document.getElementById('bookings-list');
  if (!container) return;

  const empty = document.getElementById('empty-bookings');
  if (empty) empty.remove();

  const card = document.createElement('article');
  card.className = 'card';
  card.id = `booking-${booking._id}`;
  card.innerHTML = `
    <h3>${escapeHtml(booking.clientName)}</h3>
    <p>${escapeHtml(booking.clientEmail)}</p>
    <p><strong>Fecha:</strong> ${escapeHtml(booking.date)}</p>
    <p><strong>Hora:</strong> ${escapeHtml(booking.time)}</p>
    <p><strong>Estado:</strong> ${escapeHtml(booking.status)}</p>
    <h4>Servicios</h4>
    <p>Sin servicios asociados.</p>
  `;
  container.prepend(card);
});

function serviceCard(service) {
  return `
    <h3>${escapeHtml(service.name)}</h3>
    <p>${escapeHtml(service.description)}</p>
    <dl>
      <dt>Duración</dt>
      <dd>${service.duration} min</dd>
      <dt>Precio</dt>
      <dd>$${service.price}</dd>
      <dt>Categoría</dt>
      <dd>${escapeHtml(service.category)}</dd>
      <dt>Disponible</dt>
      <dd>${service.available ? 'Sí' : 'No'}</dd>
    </dl>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
