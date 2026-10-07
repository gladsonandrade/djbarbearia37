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
    : 'Combine o dia e o horário diretamente com Dalvan.';
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

