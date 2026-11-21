const isKorean = new URLSearchParams(location.search).get('lang') === 'ko';
const languageSwitch = document.querySelector('.language-switch');
if (isKorean) {
  languageSwitch.textContent = 'English';
  languageSwitch.lang = 'en';
  languageSwitch.hreflang = 'en';
  languageSwitch.setAttribute('aria-label', 'View in English');
}
function updateLanguageSwitch() {
  const url = new URL(location.href);
  if (isKorean) url.searchParams.delete('lang');
  else url.searchParams.set('lang', 'ko');
  languageSwitch.href = `${url.pathname}${url.search}${url.hash}`;
}
updateLanguageSwitch();
window.addEventListener('hashchange', updateLanguageSwitch);

if (isKorean) {
  const common = {
    '.skip': '본문으로 건너뛰기',
    '.brand small': '소프트웨어 엔지니어 · 독립 창작자',
    'nav a:nth-child(1) .nav-label': '주요 작업',
    'nav a:nth-child(1) .nav-label-mobile': '작업',
    'nav a:nth-child(2)': '이력서',
    'nav a:nth-child(3) .nav-label': '기업 · 비영리 단체',
    'nav a:nth-child(3) .nav-label-mobile': '서비스',
    'nav a:nth-child(4)': '문의'
  };

  const pages = {
    home: {
      title: 'Isaiah Yoon — 소프트웨어 엔지니어 · 독립 창작자',
      description: 'Isaiah Yoon은 사람과 공동체를 위한 세심한 디지털 경험을 만드는 소프트웨어 엔지니어입니다.',
      content: {
        '#hero-title': '디지털 세상에<br />조금 더 <em>따뜻한 마음을.</em>',
        '.hero-intro': '안녕하세요, 소프트웨어 엔지니어이자 독립 창작자 Isaiah입니다. 사람과 공동체에 도움이 되는 편안하고 유용한 디지털 경험을 만듭니다.',
        '.hero-copy .button': '주요 작업 살펴보기 <span aria-hidden="true">↘</span>',
        '.hero-copy .text-link': '이력서 보기 <span aria-hidden="true">↗</span>',
        '.hero-note': '<span aria-hidden="true">✳</span> 로스앤젤레스 기반 · 의미 있는 프로젝트를 기다립니다',
        '.work-section .eyebrow': '01 / 주요 작업',
        '.work-section h2': '의미를 담은 <em>작업.</em>',
        '.work-section .section-heading > p': '말씀부터 공동체까지, 소중한 것에 조금 더 쉽게 다가갈 수 있도록 만든 프로젝트입니다.',
        '.word-visual .mini-reader span': '복음서',
        '.word-visual .mini-reader strong': '요한복음',
        '.word-visual .mini-reader i': '01 / 태초에',
        '.word-visual .visual-label': '말씀을 읽는 조용한 공간',
        '.word-card .project-kicker': '01 / 성경 읽기 서비스',
        '.word-card .project-body > p:not(.project-kicker)': '온라인과 오프라인에서 말씀을 찾고 읽고 간직할 수 있도록 만든 8개 언어 성경 읽기 서비스입니다.',
        '.word-card .project-link': 'The Amazing Word 방문하기 <span aria-hidden="true">↗</span>',
        '.church-frame strong': '함께하는<br /><em>곳.</em>',
        '.church-visual .visual-label': '신앙 · 공동체',
        '.church-card .project-kicker': '02 / 교회 웹사이트',
        '.church-card .project-body > p:not(.project-kicker)': '예배 안내, 설교, 공동체 갤러리를 한곳에 담은 이중 언어 교회 웹사이트입니다.',
        '.church-card .project-link': '교회 웹사이트 방문하기 <span aria-hidden="true">↗</span>',
        '.invitation h2': '좋은 시작은<br /><em>여기에서.</em>',
        '.invitation p:not(.eyebrow)': '소규모 기업, 비영리 단체, 교회의 이야기를 따뜻하게 전할 수 있는 온라인 공간을 함께 만들어 봅니다.',
        '.invitation .button': '웹사이트 제작 서비스 살펴보기 <span aria-hidden="true">↗</span>'
      }
    },
    services: {
      title: '웹사이트 제작 서비스 — Isaiah Yoon',
      description: '소규모 기업, 비영리 단체, 교회를 위한 세심한 랜딩 웹사이트를 제작합니다.',
      content: {
        '.page-hero .eyebrow': '<span class="star" aria-hidden="true">✦</span> 좋은 일을 위한 웹사이트',
        '.page-hero h1': '당신의 공간에<br /><em>따뜻한 환영을.</em>',
        '.page-hero > p:not(.eyebrow)': '소규모 기업, 비영리 단체, 교회를 위해 사람을 생각하고 세부 사항까지 살핀 아름답고 명확한 랜딩 웹사이트를 만듭니다.',
        '.page-hero .button': '문의 <span aria-hidden="true">↗</span>',
        '.page-hero .text-link': '주요 작업 보기 <span aria-hidden="true">↗</span>',
        '.service-section .eyebrow': '당신의 사명을 위해',
        '.service-section h2': '좋은 일에는<br /><em>좋은 공간이 필요합니다.</em>',
        '.service-section .section-heading > p': '새로운 고객, 이웃, 성도를 맞이할 때 웹사이트가 다음 걸음을 쉽게 안내할 수 있습니다.',
        '.service-grid article:nth-child(1) h3': '소규모 기업',
        '.service-grid article:nth-child(1) p': '사업을 소개하고 특별한 가치를 전하며 고객이 쉽게 연락할 수 있도록 돕습니다.',
        '.service-grid article:nth-child(2) h3': '비영리 단체',
        '.service-grid article:nth-child(2) p': '단체의 사명을 전하고 사람들이 참여하거나 연락하는 방법을 알기 쉽게 안내합니다.',
        '.service-grid article:nth-child(3) h3': '교회',
        '.service-grid article:nth-child(3) p': '예배 정보를 나누고 공동체를 소개하며 방문자를 따뜻하게 맞이하는 공간을 만듭니다.',
        '.approach .eyebrow': '진행 방식',
        '.approach h2': '첫 인사부터<br /><em>세심하게.</em>',
        '.approach-copy p:nth-child(1)': '모든 프로젝트는 함께하는 사람들, 목표, 웹사이트에 담고 싶은 이야기를 나누는 대화로 시작합니다.',
        '.approach-copy p:nth-child(2)': '그다음 필요한 범위와 일정, 비용을 함께 논의합니다. 당신다운 명확하고 반응형인 웹사이트를 만드는 것이 목표입니다.',
        '.invitation h2': '어떤 일을<br /><em>계획하고 계신가요?</em>',
        '.invitation > div > p': '단체와 구상 중인 웹사이트에 대해 들려주세요.',
        '.invitation .button': '프로젝트에 대해 알려주세요 <span aria-hidden="true">↗</span>'
      }
    },
    contact: {
      title: '문의하기 — Isaiah Yoon',
      description: 'Isaiah Yoon에게 이메일, 문자 또는 소셜 미디어로 연락하세요.',
      content: {
        '.page-hero h1': '함께 이야기를<br /><em>나눠요.</em>',
        '.page-hero > p:not(.eyebrow)': '구상 중인 프로젝트가 있거나 인사를 나누고 싶으신가요? 연락을 기다립니다.',
        '.service-grid article:nth-child(1) h3': '이메일',
        '.service-grid article:nth-child(2) h3': '문자',
        '.service-grid article:nth-child(3) h3': '다른 채널'
      }
    },
    resume: {
      title: '이력서 — Isaiah Yoon',
      description: 'Isaiah Yoon의 소프트웨어 엔지니어링 이력서를 확인하고 다운로드하세요.',
      content: {
        '.resume-page > .eyebrow': '<span class="star" aria-hidden="true">✦</span> 경력 및 학력',
        '.resume-heading h1': '작업을 뒷받침하는<br /><em>경험.</em>',
        '.resume-heading p': '소프트웨어 엔지니어링, 독립 프로젝트, 공동체 활동을 소개합니다. 아래 이력서는 영문입니다.',
        '.resume-fallback': '이 기기에서 이력서가 표시되지 않으면 <a href="/assets/resume.pdf#view=FitH" target="_blank" rel="noopener noreferrer">영문 이력서 PDF 열기</a>를 선택해 새 탭에서 확인하세요.'
      }
    }
  };

  const page = pages[document.body.dataset.page];
  if (!page) throw new Error('Missing Korean translation for this page');

  document.documentElement.lang = 'ko';
  document.title = page.title;
  document.querySelector('meta[name="description"]').content = page.description;
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    document.querySelector(selector).content = page.title;
  }
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    document.querySelector(selector).content = page.description;
  }
  for (const selector of ['meta[property="og:image:alt"]', 'meta[name="twitter:image:alt"]']) {
    document.querySelector(selector).content = 'The Amazing Word 성경 읽기 서비스 이름과 프리즘 검 문양';
  }
  document.querySelector('.brand').setAttribute('aria-label', 'Isaiah Yoon 홈');
  document.querySelector('nav').setAttribute('aria-label', '주 메뉴');
  const resume = document.querySelector('.resume-document iframe');
  if (resume) resume.title = 'Isaiah Yoon의 영문 이력서 PDF';

  for (const [selector, translation] of Object.entries({ ...common, ...page.content })) {
    const element = document.querySelector(selector);
    if (!element) throw new Error(`Missing element for Korean translation: ${selector}`);
    element.innerHTML = translation;
  }

  for (const link of document.querySelectorAll('a[href]')) {
    if (link === languageSwitch) continue;
    const href = link.getAttribute('href');
    if (href.startsWith('#')) continue;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || url.pathname.startsWith('/assets/')) continue;
    url.searchParams.set('lang', 'ko');
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  }
}
