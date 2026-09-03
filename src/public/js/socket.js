const socket = io();

socket.on('serviceCreated', service => {
  const container = document.getElementById('services-list');
  if (!container) return;

  const emptyMessage = document.getElementById('empty-services');
  if (emptyMessage) emptyMessage.remove();

  const article = document.createElement('article');
  article.className = 'card';
  article.id = `service-${service._id}`;

  article.innerHTML = `
    <h3>${service.name}</h3>
    <p>${service.description}</p>
    <dl>
      <dt>Duración</dt>
      <dd>${service.duration} minutos</dd>
      <dt>Precio</dt>
      <dd>$${service.price}</dd>
      <dt>Categoría</dt>
      <dd>${service.category}</dd>
      <dt>Disponible</dt>
      <dd>${service.available ? 'Sí' : 'No'}</dd>
    </dl>
  `;

  container.prepend(article);
});

socket.on('serviceUpdated', service => {
  const card = document.getElementById(`service-${service._id}`);
  if (!card) return;

  card.innerHTML = `
    <h3>${service.name}</h3>
    <p>${service.description}</p>
    <dl>
      <dt>Duración</dt>
      <dd>${service.duration} minutos</dd>
      <dt>Precio</dt>
      <dd>$${service.price}</dd>
      <dt>Categoría</dt>
      <dd>${service.category}</dd>
      <dt>Disponible</dt>
      <dd>${service.available ? 'Sí' : 'No'}</dd>
    </dl>
  `;
});

socket.on('serviceDeleted', payload => {
  const card = document.getElementById(`service-${payload.id}`);
  if (card) card.remove();
});

socket.on('bookingCreated', booking => {
  const container = document.getElementById('bookings-list');
  if (!container) return;

  const emptyMessage = document.getElementById('empty-bookings');
  if (emptyMessage) emptyMessage.remove();

  const article = document.createElement('article');
  article.className = 'card';
  article.id = `booking-${booking._id}`;

  article.innerHTML = `
    <h4>${booking.clientName}</h4>
    <p>${booking.clientEmail}</p>
    <p><strong>Fecha:</strong> ${booking.date}</p>
    <p><strong>Hora:</strong> ${booking.time}</p>
    <p><strong>Estado:</strong> ${booking.status}</p>
    <p><strong>Servicios asociados:</strong> ${booking.services.length}</p>
  `;

  container.prepend(article);
});
