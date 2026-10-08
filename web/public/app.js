const form = document.querySelector('#contact-form');
const whatsappLink = document.querySelector('#whatsapp-link');
const modeNote = document.querySelector('#mode-note');

function updateMessage() {
  const data = new FormData(form);
  const home = data.get('mode') === 'domicilio';
  const name = String(data.get('clientName') || '').trim();
  const services = data.getAll('service');
  const message = [
    `Olá, Dalvan!${name ? ` Me chamo ${name}.` : ''}`,
    `Gostaria de consultar um atendimento ${home ? 'em domicílio, no domingo, em Malhador/Alecrim' : 'na barbearia'}.`,
    ...(services.length ? [`Serviços: ${services.join(', ')}.`] : []),
    'Quais horários você tem disponíveis?',
  ].join('\n');
  whatsappLink.href = `https://wa.me/5579998424231?text=${encodeURIComponent(message)}`;
  modeNote.textContent = home
    ? 'Domingos em Malhador e Alecrim. Deslocamento combinado à parte.'
    : 'Combine o dia e o horário pelo WhatsApp.';
}
form.addEventListener('input', updateMessage);
form.addEventListener('change', updateMessage);
form.addEventListener('submit', event => { event.preventDefault(); whatsappLink.click(); });
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const input = [...form.querySelectorAll('[name="service"]')].find(item => item.value === link.dataset.service);
    input.checked = true;
    updateMessage();
  });
});
document.querySelectorAll('[data-mode]').forEach(link => {
  link.addEventListener('click', () => {
    const input = [...form.querySelectorAll('[name="mode"]')].find(item => item.value === link.dataset.mode);
    input.checked = true;
    updateMessage();
  });
});
updateMessage();



const workLightbox = document.querySelector('#work-lightbox');
const workLightboxImage = document.querySelector('#work-lightbox-image');
const workLightboxCaption = document.querySelector('#work-lightbox-caption');
const workLightboxClose = document.querySelector('.work-lightbox-close');

document.querySelectorAll('.work-photo-open').forEach(button => {
  button.addEventListener('click', () => {
    if (!workLightbox || !workLightboxImage || !workLightboxCaption) return;

    workLightboxImage.src = button.dataset.full || '';
    workLightboxImage.alt = button.getAttribute('aria-label')?.replace('Abrir foto: ', '') || 'Trabalho da DJ Barbearia';
    workLightboxCaption.textContent = button.dataset.caption || '';
    workLightbox.showModal();
  });
});

workLightboxClose?.addEventListener('click', () => workLightbox?.close());

workLightbox?.addEventListener('click', event => {
  if (event.target === workLightbox) workLightbox.close();
});


document.querySelectorAll('[data-certificate-full]').forEach(button => {
  button.addEventListener('click', () => {
    if (!workLightbox || !workLightboxImage || !workLightboxCaption) return;

    workLightboxImage.src = button.dataset.certificateFull || '';
    workLightboxImage.alt = button.getAttribute('aria-label') || 'Certificado da DJ Barbearia';
    workLightboxCaption.textContent = button.dataset.certificateCaption || '';
    workLightbox.showModal();
  });
});
