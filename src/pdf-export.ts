import { jsPDF } from 'jspdf';

// Функция для создания скругленного прямоугольника на canvas
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Генератор страниц презентации высокого разрешения (A4 альбомная: 1600 x 1131 px)
function createSlideCanvas(slideNumber: number): HTMLCanvasElement {
  const width = 1600;
  const height = 1131;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Базовый фон
  ctx.fillStyle = '#F8F9FC';
  ctx.fillRect(0, 0, width, height);

  // Сетка-паттерн
  ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
  for (let x = 40; x < width; x += 40) {
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Верхний колонтитул (кроме титульного слайда)
  if (slideNumber > 1) {
    ctx.font = '900 26px "Unbounded", "Inter", sans-serif';
    const logoText = 'ВЗРОСЛЫЕ';
    const logoWidth = Math.max(ctx.measureText(logoText).width, 240);

    ctx.fillStyle = '#0F172A';
    ctx.fillText(logoText, 80, 70);

    // Стильный тег-бейдж для подзаголовка с гарантированным отступом
    const tagX = 80 + logoWidth + 30;
    const tagText = 'ПРОСТРАНСТВО ДЛЯ МОЛОДЫХ РОДИТЕЛЕЙ И ДРУЗЕЙ';
    ctx.font = 'bold 13px "Inter", sans-serif';
    const tagWidth = ctx.measureText(tagText).width + 32;

    roundRect(ctx, tagX, 48, tagWidth, 32, 16);
    ctx.fillStyle = 'rgba(255, 87, 51, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 87, 51, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#FF5733';
    ctx.fillText(tagText, tagX + 16, 69);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 15px "Inter", sans-serif';
    ctx.fillText(`Слайд 0${slideNumber} / 04`, width - 200, 70);

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 95);
    ctx.lineTo(width - 80, 95);
    ctx.stroke();
  }

  // Слайд 1: Обложка & Манифест
  if (slideNumber === 1) {
    // Декоративное пятно
    const grad = ctx.createRadialGradient(width - 300, 200, 50, width - 300, 200, 400);
    grad.addColorStop(0, 'rgba(255, 87, 51, 0.15)');
    grad.addColorStop(1, 'rgba(255, 87, 51, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(width - 700, 0, 700, 600);

    // Стикер-тег
    roundRect(ctx, 80, 140, 420, 44, 22);
    ctx.fillStyle = 'rgba(255, 87, 51, 0.12)';
    ctx.fill();
    ctx.fillStyle = '#FF5733';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillText('✨ С ДЕТЬМИ ТУСОВАТЬСЯ — ЭТО СТИЛЬ', 105, 168);

    // Главный заголовок
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 86px "Unbounded", sans-serif';
    ctx.fillText('ВЗРОСЛЫЕ', 80, 280);

    // Подзаголовок
    ctx.fillStyle = '#FF5733';
    ctx.font = '700 32px "Inter", sans-serif';
    ctx.fillText('Пространство, где быть родителем — это модно.', 80, 340);
    ctx.fillStyle = '#475569';
    ctx.font = '500 26px "Inter", sans-serif';
    ctx.fillText('С детьми рядом или соло • без скучных детских комнат', 80, 380);

    // Главный манифест в карточке
    roundRect(ctx, 80, 440, width - 160, 360, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.fillText('Почему мы здесь собрались?', 120, 510);

    ctx.fillStyle = '#334155';
    ctx.font = '400 22px "Inter", sans-serif';
    const lines = [
      '• Молодым родителям (18–35 лет) буквально негде тусоваться: бары не для колясок,',
      '  в кофейнях смотрят косо, а в обычных «мамочковых» клубах — нафталин и тоска.',
      '• Мы доказываем: родительство — это не изоляция и не день сурка, а новый рок-н-ролл.',
      '• Дети находятся рядом — в открытой мастерской ремёсел с наставником театра народов.',
      '• Родители в 5 метрах пьют фильтр-кофе, обсуждают карьеру, проекты и играют в настолки.',
      '• А без детей — велкам в живое творческое комьюнити без снобизма!'
    ];
    let y = 565;
    for (const l of lines) {
      ctx.fillText(l, 120, y);
      y += 40;
    }

    // Бейджи внизу
    const badges = [
      { text: '18–35 лет', color: '#FF5733' },
      { text: 'Дети рядом (0+)', color: '#059669' },
      { text: 'Спешелти-чай & кофе', color: '#D97706' },
      { text: '100% бесплатно', color: '#2563EB' }
    ];
    let bx = 80;
    for (const b of badges) {
      roundRect(ctx, bx, 850, 240, 52, 26);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.stroke();

      ctx.fillStyle = b.color;
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText(`✓ ${b.text}`, bx + 24, 882);
      bx += 260;
    }

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText('Проект открытого городского комьюнити «Взрослые» • 2026', 80, 1060);
  }

  // Слайд 2: Проблема и Решение (Контраст)
  if (slideNumber === 2) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 38px "Unbounded", sans-serif';
    ctx.fillText('Главная боль: Молодым родителям негде тусоваться', 80, 160);

    // Карточка 1: Проблема
    roundRect(ctx, 80, 200, 690, 680, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    roundRect(ctx, 110, 230, 220, 36, 18);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fill();
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('✕ КАК ОБЫЧНО В ГОРОДЕ', 125, 254);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('Изоляция, день сурка и чужие взгляды', 110, 310);

    const problemPoints = [
      '• Бары и модные места: не пройдёшь с коляской, громко,',
      '  ловишь раздражение окружающих.',
      '• Кофейни: страх, что ребёнок уронит чашку или заплачет.',
      '• Традиционные клубы: душные советы из 90-х, разговоры',
      '  исключительно о смесях и коликах.',
      '• Друзья без детей постепенно отдаляются, потому что',
      '  не понимают сложностей с ребёнком.',
      '• Итог: родители сидят дома в 4 стенах и теряют себя.'
    ];
    let py = 360;
    ctx.fillStyle = '#475569';
    ctx.font = '400 20px "Inter", sans-serif';
    for (const p of problemPoints) {
      ctx.fillText(p, 110, py);
      py += 44;
    }

    // Карточка 2: Решение во «Взрослых»
    roundRect(ctx, 830, 200, 690, 680, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    roundRect(ctx, 860, 230, 250, 36, 18);
    ctx.fillStyle = 'rgba(5, 150, 105, 0.12)';
    ctx.fill();
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('✓ ПРОСТРАНСТВО «ВЗРОСЛЫЕ»', 875, 254);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('С детьми тусоваться — это новый стиль', 860, 310);

    const solutionPoints = [
      '• Дети рядом: открытое зонирование, без тревоги и стресса.',
      '• Настоящий крафт: мастер театра народов учит детей',
      '  лепке из глины, работе по дереву и театру теней.',
      '• Родители свободны: 2 часа в неделю за фильтр-кофе,',
      '  настолками, карьерой и живым общением.',
      '• Без детей тоже можно: пары и соло находят компанию',
      '  с открытым взглядом на жизнь.',
      '• 0% шейминга: безопасное пространство без токсичности.'
    ];
    let sy = 360;
    ctx.fillStyle = '#334155';
    ctx.font = '400 20px "Inter", sans-serif';
    for (const s of solutionPoints) {
      ctx.fillText(s, 860, sy);
      sy += 44;
    }

    // Нижняя плашка
    roundRect(ctx, 80, 920, width - 160, 110, 20);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('Главный посыл: мы помогаем молодым родителям не выпадать из жизни,', 120, 965);
    ctx.fillStyle = '#FF5733';
    ctx.fillText('а превратить родительство в модный, классный и разделяемый опыт.', 120, 1000);
  }

  // Слайд 3: 4 Трека & Детская мастерская
  if (slideNumber === 3) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 38px "Unbounded", sans-serif';
    ctx.fillText('Что происходит во время встречи (2 часа)', 80, 160);

    const tracks = [
      {
        num: '01',
        title: 'Менталка & Ресурс',
        desc: 'Выдохнуть, снять маску «идеального родителя», обсудить границы, усталость и найти поддержку среди сверстников.'
      },
      {
        num: '02',
        title: 'Карьера & Пет-проекты',
        desc: 'Как совмещать работу, фриланс и семью. Нетворкинг, поиск коллабораций и вдохновения для личного роста.'
      },
      {
        num: '03',
        title: 'Коворкинг, Настолки & Чай',
        desc: 'Спешелти-чай, фильтр-кофе, любимые настольные игры или тихий угол для ноутбука в уютной атмосфере.'
      },
      {
        num: '04',
        title: 'Молодое родительство без духоты',
        desc: 'Обмен реальными современными лайфхаками без нравоучений. Вовлечённое отцовство и партнёрский быт.'
      }
    ];

    let tx = 80;
    let ty = 210;
    tracks.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 80 + col * 730;
      const y = 210 + row * 260;

      roundRect(ctx, x, y, 700, 230, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FF5733';
      ctx.font = 'bold 20px "Unbounded", sans-serif';
      ctx.fillText(t.num, x + 30, y + 50);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText(t.title, x + 85, y + 50);

      ctx.fillStyle = '#475569';
      ctx.font = '400 19px "Inter", sans-serif';
      // Оборачиваем текст
      ctx.fillText(t.desc, x + 30, y + 95, 640);
    });

    // Блок мастерской для детей внизу
    roundRect(ctx, 80, 750, width - 160, 280, 22);
    ctx.fillStyle = '#059669';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Unbounded", sans-serif';
    ctx.fillText('Детская мастерская: Театр народов и тактильный крафт', 120, 810);

    ctx.font = '400 20px "Inter", sans-serif';
    ctx.fillText('Пока взрослые общаются, дети от 0+ находятся рядом с наставником театра:', 120, 860);
    ctx.fillText('• Никаких экранов и мультиков: только глина, войлок, дерево и театр теней', 120, 900);
    ctx.fillText('• Безопасное открытое пространство: дети всегда в поле зрения родителей', 120, 940);
    ctx.fillText('• Ежемесячные выставки крафтовых шедевров и совместные показы сказок', 120, 980);
  }

  // Слайд 4: Для кого, План на 4 недели & Контакты
  if (slideNumber === 4) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 38px "Unbounded", sans-serif';
    ctx.fillText('Для кого создано комьюнити & Как подключиться', 80, 160);

    // Сетка целевой аудитории
    const groups = [
      { t: 'Молодые мамы (18–35)', d: 'Кому нужен выход из рутины, горячий чай и взрослое общение.' },
      { t: 'Отцы новой волны (18–35)', d: 'Вовлечённые, стильные папы: проводят время с детьми и друзьями.' },
      { t: 'Пары и соло без детей', d: 'Ищут тёплое сообщество, настолки, спешелти-чай и нетворкинг.' },
      { t: 'Фрилансеры & креаторы', d: 'Возможность поработать за ноутбуком с чаем, пока дети заняты.' }
    ];

    let gx = 80;
    groups.forEach((g) => {
      roundRect(ctx, gx, 210, 340, 220, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.fillText(g.t, gx + 20, 260);

      ctx.fillStyle = '#64748B';
      ctx.font = '400 17px "Inter", sans-serif';
      ctx.fillText(g.d, gx + 20, 305, 300);

      gx += 365;
    });

    // Нижний блок: Контакты и старт
    roundRect(ctx, 80, 480, width - 160, 520, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 87, 51, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 30px "Unbounded", sans-serif';
    ctx.fillText('Приходи во «Взрослые»: каждый четверг, 18:30–20:30', 120, 550);

    ctx.fillStyle = '#475569';
    ctx.font = '500 22px "Inter", sans-serif';
    ctx.fillText('Вход 100% свободный • Чай, кофе и все материалы для детей включены', 120, 600);

    // Дорожная карта мини
    const steps = [
      '1. Заполни короткую анкету (4 вопроса в Telegram или на сайте)',
      '2. Получи подтверждение и приглашение на ближайший четверг',
      '3. Приходи с ребёнком, парой или соло — здесь сразу познакомят и нальют чай',
      '4. Становись частью комьюнити, предлагай свои проекты и темы треков'
    ];
    let stepY = 660;
    ctx.fillStyle = '#1E293B';
    ctx.font = '500 20px "Inter", sans-serif';
    for (const st of steps) {
      ctx.fillText(st, 120, stepY);
      stepY += 46;
    }

    // Кнопка-ссылка
    roundRect(ctx, 120, 870, 480, 64, 32);
    ctx.fillStyle = '#FF5733';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('Telegram: @adults_space', 210, 910);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText('Вопросы и партнёрства: hello@vzroslye.space', 640, 910);
  }

  return canvas;
}

// Функция для модального окна просмотра презентации
function openPresentationModal(pdfBlobUrl: string, canvases: HTMLCanvasElement[]) {
  let modal = document.getElementById('presentationPreviewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'presentationPreviewModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
    modal.style.backdropFilter = 'blur(8px)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    modal.style.boxSizing = 'border-box';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background: #0F172A; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; width: 100%; max-width: 980px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
      <!-- Шапка модалки -->
      <div style="padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: rgba(30,41,59,0.7);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: rgba(255,87,51,0.2); color: #FF5733; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Презентация (4 слайда)</span>
          <h3 style="margin: 0; color: #FFFFFF; font-size: 1.15rem; font-family: 'Unbounded', sans-serif;">Взрослые • 2026</h3>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <a id="modalDirectDownloadBtn" href="${pdfBlobUrl}" download="Vzroslye_Presentation_2026.pdf" style="background: #FF5733; color: #FFFFFF; text-decoration: none; padding: 8px 18px; border-radius: 9999px; font-weight: 700; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(255,87,51,0.4); transition: transform 0.2s ease;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Скачать файл PDF
          </a>
          <button id="modalCloseBtn" style="background: rgba(255,255,255,0.1); border: none; color: #FFFFFF; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; transition: background 0.2s ease;">
            ✕
          </button>
        </div>
      </div>

      <!-- Контейнер слайдов с плавной прокруткой -->
      <div id="modalSlidesContainer" style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; align-items: center; background: #090D16;">
        <div style="color: #94A3B8; font-size: 0.85rem; margin-bottom: 4px;">Файл PDF готов к сохранению. Ниже постраничный просмотр всех 4 слайдов:</div>
      </div>
    </div>
  `;

  const container = modal.querySelector('#modalSlidesContainer');
  if (container) {
    canvases.forEach((canvas, index) => {
      const slideWrapper = document.createElement('div');
      slideWrapper.style.width = '100%';
      slideWrapper.style.maxWidth = '880px';
      slideWrapper.style.borderRadius = '12px';
      slideWrapper.style.overflow = 'hidden';
      slideWrapper.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
      slideWrapper.style.border = '1px solid rgba(255,255,255,0.08)';

      const slideHeader = document.createElement('div');
      slideHeader.style.padding = '8px 16px';
      slideHeader.style.background = '#1E293B';
      slideHeader.style.color = '#94A3B8';
      slideHeader.style.fontSize = '0.78rem';
      slideHeader.style.fontWeight = '600';
      slideHeader.style.display = 'flex';
      slideHeader.style.justifyContent = 'space-between';
      slideHeader.innerHTML = `<span>СЛАЙД 0${index + 1}</span><span>Формат A4 Альбомный</span>`;

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/jpeg', 0.95);
      img.style.width = '100%';
      img.style.display = 'block';
      img.alt = `Слайд ${index + 1}`;

      slideWrapper.appendChild(slideHeader);
      slideWrapper.appendChild(img);
      container.appendChild(slideWrapper);
    });
  }

  const closeBtn = modal.querySelector('#modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  modal.style.display = 'flex';
}

// Главная функция экспорта PDF презентации
export async function downloadPresentationPdf(): Promise<void> {
  const buttons = document.querySelectorAll<HTMLElement>('#downloadPdfBtn, #heroDownloadPdfBtn, #mobileDownloadPdfBtn, #footerDownloadPdfBtn');
  buttons.forEach(btn => {
    btn.setAttribute('data-original-text', btn.innerText);
    const textSpan = btn.querySelector('.pdf-btn-text') || btn.querySelector('span');
    if (textSpan) textSpan.textContent = '⏳ Формируем PDF...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.75';
  });

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 297;
    const pdfHeight = 210;
    const canvases: HTMLCanvasElement[] = [];

    // Генерируем 4 слайда высокого разрешения
    for (let slide = 1; slide <= 4; slide++) {
      const canvas = createSlideCanvas(slide);
      canvases.push(canvas);
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (slide > 1) {
        pdf.addPage('a4', 'landscape');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const fileName = 'Vzroslye_Presentation_2026.pdf';
    
    // Получаем blob для прямого скачивания через Blob URL и iframe-safe ссылку
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Метод 1: jsPDF native save
    try {
      pdf.save(fileName);
    } catch (saveErr) {
      console.warn('pdf.save не сработал напрямую, используем fallback:', saveErr);
    }

    // Метод 2: Скрытая ссылка для принудительного скачивания
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(() => {
      if (document.body.contains(downloadLink)) {
        document.body.removeChild(downloadLink);
      }
    }, 1000);

    // Показываем превью презентации в модальном окне с кнопкой загрузки
    openPresentationModal(blobUrl, canvases);

    // Показываем красивый тост об успешном скачивании
    showToastNotification('✅ Презентация проекта «Взрослые» сформирована и готова к скачиванию!');

  } catch (error) {
    console.error('Ошибка при формировании PDF:', error);
    try {
      window.print();
    } catch {
      showToastNotification('Откройте приложение в новой вкладке для скачивания PDF');
    }
  } finally {
    buttons.forEach(btn => {
      const textSpan = btn.querySelector('.pdf-btn-text') || btn.querySelector('span');
      if (textSpan) {
        if (btn.id === 'downloadPdfBtn') textSpan.textContent = 'Скачать PDF';
        else if (btn.id === 'heroDownloadPdfBtn') textSpan.textContent = 'Презентация (PDF)';
        else textSpan.textContent = 'Скачать презентацию в PDF';
      }
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
    });
  }
}

// Функция для всплывающего уведомления (Toast)
function showToastNotification(message: string) {
  let toast = document.getElementById('pdfToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pdfToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.backgroundColor = '#0F172A';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '9999px';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    toast.style.zIndex = '10005';
    toast.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
    toast.style.opacity = '0';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }
  }, 4000);
}

// Инициализация обработчиков при загрузке документа
function initPdfButtons() {
  const downloadBtns = ['downloadPdfBtn', 'heroDownloadPdfBtn', 'mobileDownloadPdfBtn', 'footerDownloadPdfBtn'];
  downloadBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        downloadPresentationPdf();
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPdfButtons);
} else {
  initPdfButtons();
}

// Экспорт в глобальную область видимости
(window as unknown as { downloadPresentationPdf: typeof downloadPresentationPdf }).downloadPresentationPdf = downloadPresentationPdf;
