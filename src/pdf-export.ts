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
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 24px "Unbounded", "Inter", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('ВЗРОСЛЫЕ', 80, 70);

    // Гарантированная позиция бейджа с отступом от логотипа
    const tagX = 350;
    const tagText = 'ПРОСТРАНСТВО ДЛЯ МОЛОДЫХ РОДИТЕЛЕЙ И ДРУЗЕЙ';
    ctx.font = 'bold 12px "Inter", sans-serif';
    const tagWidth = ctx.measureText(tagText).width + 36;

    roundRect(ctx, tagX, 47, tagWidth, 32, 16);
    ctx.fillStyle = 'rgba(255, 87, 51, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 87, 51, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#FF5733';
    ctx.fillText(tagText, tagX + 18, 68);

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

  // Слайд 1: Для организаторов & Паспорт проекта
  if (slideNumber === 1) {
    const grad = ctx.createRadialGradient(width - 300, 200, 50, width - 300, 200, 400);
    grad.addColorStop(0, 'rgba(255, 87, 51, 0.15)');
    grad.addColorStop(1, 'rgba(255, 87, 51, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(width - 700, 0, 700, 600);

    // Стикер-тег: Паспорт проекта
    roundRect(ctx, 80, 120, 520, 42, 21);
    ctx.fillStyle = 'rgba(255, 87, 51, 0.12)';
    ctx.fill();
    ctx.fillStyle = '#FF5733';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('📋 ПАСПОРТ ПРОЕКТА • ДЛЯ ОРГАНИЗАТОРОВ И ПЛОЩАДОК', 105, 147);

    // Главный заголовок
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 76px "Unbounded", sans-serif';
    ctx.fillText('ВЗРОСЛЫЕ', 80, 240);

    // Подзаголовок
    ctx.fillStyle = '#FF5733';
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillText('Проект от Иммерсивного театра народов России • Наставники: Семейные', 80, 286);

    ctx.fillStyle = '#475569';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText('Культурный код: воспитание через уважение и созидательный труд руками • 18–35 лет', 80, 316);

    // 3 карточки паспорта: Кто проводит | Проблема | Зачем и формат
    const passportCards = [
      {
        title: 'КТО ПРОВОДИТ',
        color: '#FF5733',
        bg: 'rgba(255, 87, 51, 0.08)',
        lines: [
          'Иммерсивный театр народов России. Наставники: Семейные',
          '(семейные пары и мастера традиций, психологи, педагоги,',
          'предприниматели и опытные родители со стажем воспитания).'
        ]
      },
      {
        title: 'КАКАЯ ПРОБЛЕМА',
        color: '#DC2626',
        bg: 'rgba(239, 68, 68, 0.08)',
        lines: [
          '1) Бары не для детей, в кофейнях с коляской неловко — день сурка.',
          '2) Соло 18–35 свайпают дейтинги впустую, негде встретить осознанных людей.',
          '3) Дети часами сидят в смартфонах из-за отсутствия живого труда и ремёсел.'
        ]
      },
      {
        title: 'ИТОГО 3 ЗОНЫ',
        color: '#059669',
        bg: 'rgba(5, 150, 105, 0.08)',
        lines: [
          '1) Зона трека: взрослые треки сменяют друг друга по очереди (1 в день).',
          '2) Свободная зона: параллельно чайная станция, настолки и свободное общение.',
          '3) Детская зона: мастерская робототехники и ремёсел руками (четверг 18:00–20:00).'
        ]
      }
    ];

    let py = 355;
    passportCards.forEach(c => {
      roundRect(ctx, 80, py, width - 160, 140, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      roundRect(ctx, 105, py + 20, 190, 32, 16);
      ctx.fillStyle = c.bg;
      ctx.fill();
      ctx.fillStyle = c.color;
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(c.title, 120, py + 41);

      ctx.fillStyle = '#334155';
      ctx.font = '500 18px "Inter", sans-serif';
      let ly = py + 38;
      c.lines.forEach((l, idx) => {
        ctx.fillText(l, 320, ly + idx * 26);
      });

      py += 160;
    });

    // Бейджи внизу
    const badges = [
      { text: '18–35 лет', color: '#FF5733' },
      { text: 'Дети рядом (0+)', color: '#059669' },
      { text: 'Спешелти-чай & кофе', color: '#D97706' },
      { text: 'Соло кто хочет семью', color: '#6366F1' },
      { text: '100% бесплатно', color: '#0F172A' }
    ];
    let bx = 80;
    for (const b of badges) {
      roundRect(ctx, bx, 855, 265, 48, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.stroke();

      ctx.fillStyle = b.color;
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillText(`✓ ${b.text}`, bx + 18, 885);
      bx += 280;
    }

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 15px "Inter", sans-serif';
    ctx.fillText('Проект открытого городского комьюнити «Взрослые» • Для организаторов и аудитории • 2026', 80, 1060);
  }

  // Слайд 2: Взрослые треки (1 трек в день по очереди + параллельный чай)
  if (slideNumber === 2) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 34px "Unbounded", sans-serif';
    ctx.fillText('Три зоны: 1 трек в день, чай & детская зона', 80, 150);

    ctx.fillStyle = '#FF5733';
    ctx.font = '600 19px "Inter", sans-serif';
    ctx.fillText('Взрослые треки сменяют друг друга по очереди (один в день) • Параллельно: чайная станция и детская мастерская', 80, 185);

    const tracks = [
      {
        num: '01',
        tag: 'THEATRE',
        title: 'Театральный клуб & Выставки',
        bullets: [
          '• Классика в современном прочтении и читки',
          '• Совместные выставки и арт-проекты',
          '• Импровизация, снятие зажимов и страхов',
          '• Свободное творчество без оценок'
        ]
      },
      {
        num: '02',
        tag: 'KITCHEN',
        title: 'Совместная кулинария & Чай',
        bullets: [
          '• Рецепты народов России на новый лад',
          '• Готовим вместе, дегустируем за общим столом',
          '• Спешелти-чайная станция, самовар и травы',
          '• Живое тёплое общение нон-стоп'
        ]
      },
      {
        num: '03',
        tag: 'TECH',
        title: 'Совместные IT-проекты & Своё дело',
        bullets: [
          '• Pet-проекты, код, AI-тулы и стартапы',
          '• Коллаборации айтишников, дизайнеров и маркетологов',
          '• Удалёнка и фриланс в декрете без перегруза',
          '• Семейный бюджет и финграмотность'
        ]
      },
      {
        num: '04',
        tag: 'CALM',
        title: 'Спокойствие, отдых & Отцы',
        bullets: [
          '• Спокойствие & отдых: снимаем тревогу и вину',
          '• Границы с родственниками без скандалов',
          '• Отцы новой волны: честный мужской круг',
          '• Зона тишины: можно просто чиллить в наушниках'
        ]
      }
    ];

    tracks.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 80 + col * 730;
      const y = 220 + row * 340;

      roundRect(ctx, x, y, 700, 310, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FF5733';
      ctx.font = 'bold 20px "Unbounded", sans-serif';
      ctx.fillText(t.num, x + 30, y + 45);

      roundRect(ctx, x + 75, y + 25, 80, 26, 13);
      ctx.fillStyle = 'rgba(255, 87, 51, 0.1)';
      ctx.fill();
      ctx.fillStyle = '#FF5733';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.fillText(t.tag, x + 95, y + 42);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText(t.title, x + 30, y + 90);

      ctx.fillStyle = '#475569';
      ctx.font = '400 18px "Inter", sans-serif';
      let by = y + 135;
      t.bullets.forEach(b => {
        ctx.fillText(b, x + 30, by);
        by += 38;
      });
    });

    roundRect(ctx, 80, 930, width - 160, 90, 18);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText('☕ Итого три зоны: 1) Зона трека (1 в день по очереди), 2) Свободная зона (чай & общение), 3) Детская мастерская в 5 метрах.', 110, 982);
  }

  // Слайд 3: Детская мастерская + Сегментация аудитории
  if (slideNumber === 3) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 34px "Unbounded", sans-serif';
    ctx.fillText('Ремёсла, уроки труда & Сегменты аудитории', 80, 150);

    ctx.fillStyle = '#059669';
    ctx.font = '600 19px "Inter", sans-serif';
    ctx.fillText('Иммерсивный театр народов России • Культурный код: уважение и созидательный труд руками', 80, 185);

    // Левая карточка: Детская мастерская ремёсел
    roundRect(ctx, 80, 220, 690, 780, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    roundRect(ctx, 110, 250, 390, 36, 18);
    ctx.fillStyle = 'rgba(5, 150, 105, 0.12)';
    ctx.fill();
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText('🎨 РЕМЁСЛА & УРОКИ ТРУДА (0+)', 125, 274);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('Иммерсивный театр народов России', 110, 325);

    const kidsBullets = [
      '• Наставники: Семейные мастера театра и инженеры.',
      '• Прикладная робототехника & инженерный кружок:',
      '  сборка схем, механика и роботы без гаджетов.',
      '• Ремёсла и уроки труда: гончарный круг, свистульки,',
      '  резьба по дереву, ткачество и сказки народов.',
      '• Разделение по зонам: дети увлечены делом,',
      '  взрослые общаются в параллельных треках.',
      '• Вместо сидения в смартфонах — созидание руками.',
      '• Родитель в 5 метрах: никакой тревоги разлуки.'
    ];

    let ky = 370;
    ctx.fillStyle = '#334155';
    ctx.font = '400 18px "Inter", sans-serif';
    kidsBullets.forEach(b => {
      ctx.fillText(b, 110, ky);
      ky += 43;
    });

    // Правая колонка: Иерархия аудитории (3 группы)
    const audienceGroups = [
      {
        badge: 'АКЦЕНТ №1 • ГЛАВНЫЙ ФОКУС',
        title: '1. Родители с детьми (18–35 лет)',
        lines: [
          'Приходят вместе с ребёнком (0+). Не нужно искать няню или сидеть дома.',
          'Дети увлечены крафтом рядом, а родители стильно отдыхают и общаются.',
          'Показываем: с детьми тусоваться — это модно, современно и красиво.'
        ],
        color: '#FF5733',
        bg: 'rgba(255, 87, 51, 0.1)'
      },
      {
        badge: 'АКЦЕНТ №2 • ВЫДОХНУТЬ',
        title: '2. Родители отдельно (соло или пара)',
        lines: [
          'Ребёнок остался дома со вторым родителем или бабушкой.',
          'Возможность на 2 часа перезагрузиться, выпить горячий кофе,',
          'поговорить на взрослые темы и заняться своими проектами.'
        ],
        color: '#059669',
        bg: 'rgba(5, 150, 105, 0.1)'
      },
      {
        badge: 'АКЦЕНТ №3 • КТО ХОЧЕТ СЕМЬЮ',
        title: '3. Соло и пары без детей',
        lines: [
          'Те, у кого ещё нет семьи, но кто хочет создать семью и детей.',
          'Зрелое, открытое окружение со схожими ценностями без давления,',
          'поверхностных дейтинг-приложений и стереотипов.'
        ],
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.1)'
      }
    ];

    let ay = 220;
    audienceGroups.forEach(ag => {
      roundRect(ctx, 810, ay, 710, 240, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      roundRect(ctx, 835, ay + 20, 290, 30, 15);
      ctx.fillStyle = ag.bg;
      ctx.fill();
      ctx.fillStyle = ag.color;
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(ag.badge, 850, ay + 40);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText(ag.title, 835, ay + 82);

      ctx.fillStyle = '#475569';
      ctx.font = '400 17px "Inter", sans-serif';
      let ly = ay + 118;
      ag.lines.forEach(line => {
        ctx.fillText(line, 835, ly);
        ly += 26;
      });

      ay += 270;
    });
  }

  // Слайд 4: Для организаторов: Запуск на площадке & Метрики
  if (slideNumber === 4) {
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 36px "Unbounded", sans-serif';
    ctx.fillText('Для организаторов: Запуск слота & Метрики успеха', 80, 150);

    ctx.fillStyle = '#FF5733';
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText('Готовая модель запуска регулярного слота в молодёжном центре или арт-пространстве', 80, 185);

    // Блок 1: Что нужно для запуска
    roundRect(ctx, 80, 220, 460, 480, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('📦 Модель запуска («Молодёжь Москвы»)', 105, 265);

    const reqs = [
      '• Открытый зал с зонированием',
      '• Чайная станция и столы для общения',
      '• Столы для прикладного труда и ремёсел',
      '• Семейные наставники театра народов',
      '• Ведущие треков (психологи, фаундеры)',
      '• Эко-материалы (глина, береста, чай)'
    ];
    let ry = 315;
    ctx.fillStyle = '#475569';
    ctx.font = '400 18px "Inter", sans-serif';
    reqs.forEach(r => {
      ctx.fillText(r, 105, ry);
      ry += 42;
    });

    // Блок 2: План запуска за 4 недели
    roundRect(ctx, 570, 220, 470, 480, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('🗓️ План старта (4 недели)', 600, 265);

    const weeks = [
      'Н1: Анкета запросов в Telegram-каналах',
      'Н2: Подготовка зонирования и мастера',
      'Н3: Пилотная встреча «Взрослые» (2 ч)',
      'Н4: Ретроспектива и еженедельный график'
    ];
    let wy = 320;
    weeks.forEach((w, idx) => {
      roundRect(ctx, 600, wy - 22, 410, 60, 12);
      ctx.fillStyle = '#F8F9FC';
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = '500 17px "Inter", sans-serif';
      ctx.fillText(w, 615, wy + 14);
      wy += 85;
    });

    // Блок 3: Ключевые показатели (Метрики)
    roundRect(ctx, 1070, 220, 450, 480, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('📊 Ориентиры слота', 1100, 265);

    const metricsData = [
      { v: '12–18', l: 'участников на встрече' },
      { v: '75%', l: 'возвращаемость в клуб' },
      { v: '0 ₽', l: 'вход для аудитории' },
      { v: '1 раз', l: 'в месяц детская выставка' }
    ];
    let my = 330;
    metricsData.forEach(m => {
      ctx.fillStyle = '#FF5733';
      ctx.font = 'bold 30px "Unbounded", sans-serif';
      ctx.fillText(m.v, 1100, my);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 16px "Inter", sans-serif';
      ctx.fillText(m.l, 1100, my + 30);
      my += 85;
    });

    // Нижняя плашка контактов
    roundRect(ctx, 80, 740, width - 160, 270, 22);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Unbounded", sans-serif';
    ctx.fillText('Готовы запустить комьюнити на вашей площадке?', 120, 805);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 20px "Inter", sans-serif';
    ctx.fillText('Проект легко интегрируется в график молодёжного центра или креативного кластера.', 120, 850);

    ctx.fillStyle = '#FF5733';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('Telegram кураторов: @adults_space • Вопросы: hello@vzroslye.space', 120, 910);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('Встречи проходят каждый четверг, 18:00–20:00 • 100% бесплатно', 120, 960);
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
