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


function prepareHeroLogo() {
  const source = new Image();
  source.src = 'assets/logo-dj-barbearia.jpeg';

  source.addEventListener('load', () => {
    const maxWidth = 900;
    const scale = Math.min(1, maxWidth / source.naturalWidth);
    const width = Math.round(source.naturalWidth * scale);
    const height = Math.round(source.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    context.drawImage(source, 0, 0, width, height);
    const image = context.getImageData(0, 0, width, height);
    const pixels = image.data;

    const sampleSize = Math.max(6, Math.round(Math.min(width, height) * 0.018));
    const corners = [
      [0, 0],
      [width - sampleSize, 0],
      [0, height - sampleSize],
      [width - sampleSize, height - sampleSize],
    ];

    let red = 0;
    let green = 0;
    let blue = 0;
    let samples = 0;

    for (const [startX, startY] of corners) {
      for (let y = startY; y < startY + sampleSize; y += 1) {
        for (let x = startX; x < startX + sampleSize; x += 1) {
          const index = (y * width + x) * 4;
          red += pixels[index];
          green += pixels[index + 1];
          blue += pixels[index + 2];
          samples += 1;
        }
      }
    }

    red /= samples;
    green /= samples;
    blue /= samples;

    const transparentDistance = 18;
    const opaqueDistance = 48;

    for (let index = 0; index < pixels.length; index += 4) {
      const dr = pixels[index] - red;
      const dg = pixels[index + 1] - green;
      const db = pixels[index + 2] - blue;
      const distance = Math.sqrt((dr * dr) + (dg * dg) + (db * db));

      if (distance <= transparentDistance) {
        pixels[index + 3] = 0;
      } else if (distance < opaqueDistance) {
        const amount = (distance - transparentDistance) / (opaqueDistance - transparentDistance);
        pixels[index + 3] = Math.round(pixels[index + 3] * amount);
      }
    }

    context.putImageData(image, 0, 0);

    try {
      const transparentLogo = canvas.toDataURL('image/webp', 0.92);
      document.documentElement.style.setProperty('--hero-logo-image', `url("${transparentLogo}")`);
    } catch {
      // Se o navegador não conseguir gerar WebP, mantém somente o degradê.
    }
  });
}

prepareHeroLogo();
