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
    'nav a:nth-child(1)': '작업',
    'nav a:nth-child(2)': '이력서',
    'nav a:nth-child(3)': '서비스',
    'nav a:nth-child(4)': '문의'
  };

  const pages = {
    home: {
      title: 'Isaiah Yoon — 소프트웨어 엔지니어 · 독립 창작자',
      description: 'Isaiah Yoon은 사람과 공동체를 위한 세심한 디지털 경험을 만드는 소프트웨어 엔지니어입니다.',
      content: {
        '#hero-title': '디지털 세상에<br />조금 더 <em>따뜻한 마음을.</em>',
        '.hero-intro': '안녕하세요, 소프트웨어 엔지니어이자 독립 창작자 Isaiah입니다. 사람과 공동체를 위한 웹사이트와 디지털 경험을 만듭니다.',
        '.hero-copy .button': '주요 작업 살펴보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 5 11 11M5 11h6V5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.hero-copy .text-link': '웹사이트 제작 서비스 살펴보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.hero-note': '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="1.5" /></svg> 로스앤젤레스 기반 · 의미 있는 프로젝트를 기다립니다',
        '.work-section .eyebrow': '01 / 주요 작업',
        '.work-section h2': '의미를 담은 <em>작업.</em>',
        '.work-section .section-heading > p': '말씀부터 공동체까지, 소중한 것에 조금 더 쉽게 다가갈 수 있도록 만든 프로젝트입니다.',
        '.word-visual .mini-reader span': '복음서',
        '.word-visual .mini-reader strong': '요한복음',
        '.word-visual .mini-reader i': '01 / 태초에',
        '.word-visual .visual-label': '말씀을 읽는 조용한 공간',
        '.word-card .project-kicker': '01 / 성경 읽기 서비스 · 창작자 및 엔지니어',
        '.word-card .project-body > p:not(.project-kicker)': '온라인과 오프라인에서 말씀을 찾고 읽고 간직할 수 있도록 8개 언어 성경 읽기 서비스를 만들었습니다.',
        '.word-card .project-link:not(.instagram-link)': 'The Amazing Word 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.word-card .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.church-frame strong': '함께하는<br /><em>곳.</em>',
        '.church-visual .visual-label': '신앙 · 공동체',
        '.church-card .project-kicker': '02 / 교회 웹사이트 · 웹 개발자',
        '.church-card .project-body > p:not(.project-kicker)': '설교 오디오, 독자와 소통하는 목회 칼럼, 사진 갤러리, 2단계 인증 관리자 포털까지 Node.js로 처음부터 직접 구축한 이중 언어 교회 플랫폼입니다.',
        '.church-card .project-link:not(.instagram-link)': '교회 웹사이트 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.church-card .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.stones-frame strong': '스윙의 기본부터,<br /><em>다시 단단하게.</em>',
        '.stones-visual .visual-label': '레슨 · 클럽 피팅',
        '.stones-card .project-kicker': '03 / 골프 클럽 웹사이트 · 웹 개발자',
        '.stones-card .project-body > p:not(.project-kicker)': '로스앤젤레스 골프 클럽을 위한 한국어 중심 웹사이트를 디자인하고 개발했습니다. 레슨 철학, 레슨과 클럽 피팅, 방문 정보를 한곳에 담았습니다.',
        '.stones-card .project-link': 'David’s Stones Golf Club 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.hrr-frame strong': '느껴 보세요.<br /><em>음악을 계속 돌려요.</em>',
        '.hrr-visual .visual-label': '독립 정신 · 아날로그 영혼',
        '.hrr-card .project-kicker': '04 / 독립 레이블 · 웹 개발자',
        '.hrr-card .project-body > p:not(.project-kicker)': '소울, 재즈, 펑크, 가스펠 음반을 감상실과 디지털 레코드 경험으로 이어주는 독립 레이블의 디지털 홈을 디자인하고 개발했습니다.',
        '.hrr-card .project-link:not(.instagram-link)': 'Human Rhythm Records 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.hrr-card .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.concept-section .eyebrow': '02 / 콘셉트 디자인',
        '.concept-section h2': '아이디어를 <em>디자인으로.</em>',
        '.concept-section .section-heading > p': '웹사이트의 가능성을 탐구한 독립적인 디자인입니다. 실제 의뢰 작업이 아닌 콘셉트입니다.',
        '.academy-concept .project-kicker': '개인 콘셉트 · 교육',
        '.academy-concept .project-body > p:not(.project-kicker)': 'Doan Math Academy에서 영감을 받아 만든 독립적인 웹사이트 콘셉트로, 실제 의뢰 작업이 아닙니다.',
        '.academy-concept .project-link': 'Doan Math Academy 콘셉트 보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.cafe-concept .project-kicker': '개인 콘셉트 · 카페',
        '.cafe-concept .project-body > p:not(.project-kicker)': '가상의 동네 카페를 위한 웹사이트 콘셉트로, 주문 데모를 포함합니다.',
        '.cafe-concept .project-link': 'The Café 콘셉트 보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.invitation h2': '프로젝트를<br /><em>웹으로.</em>',
        '.invitation p:not(.eyebrow)': '활동을 위한 따뜻한 온라인 공간을 함께 만들어 봅니다.',
        '.invitation .button': '웹사이트 제작 서비스 살펴보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>'
      }
    },
    services: {
      title: '웹사이트 제작 서비스 — Isaiah Yoon',
      description: '소규모 기업, 비영리 단체, 교회와 그 밖의 프로젝트를 위한 세심한 랜딩 웹사이트를 제작합니다.',
      content: {
        '.service-hero-copy .eyebrow': '<span class="star" aria-hidden="true">✦</span> 웹사이트 제작 서비스',
        '.service-hero-copy h1': '프로젝트를 위한<br /><em>명확한 웹사이트.</em>',
        '.service-hero-copy > p:not(.eyebrow)': '프로젝트와 방문자를 중심으로 세심하게 구성한 반응형 랜딩 웹사이트를 만듭니다.',
        '.featured-work .eyebrow': '주요 작업',
        '.featured-project.word-visual .project-kicker': '성경 읽기 서비스',
        '.featured-project.word-visual > p:not(.project-kicker)': '온라인과 오프라인에서 읽을 수 있는 8개 언어 성경 서비스입니다.',
        '.featured-project.word-visual .project-link:not(.instagram-link)': 'The Amazing Word 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.word-visual .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.church-visual .project-kicker': '교회 웹사이트',
        '.featured-project.church-visual > p:not(.project-kicker)': '예배와 공동체를 위한 이중 언어 웹사이트입니다.',
        '.featured-project.church-visual .project-link:not(.instagram-link)': '교회 웹사이트 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.church-visual .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.stones-visual .project-kicker': '골프 클럽 웹사이트',
        '.featured-project.stones-visual > p:not(.project-kicker)': '골프 레슨과 클럽 피팅을 소개하는 한국어 중심 웹사이트입니다.',
        '.featured-project.stones-visual .project-link': 'David’s Stones Golf Club 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.hrr-visual .project-kicker': '독립 레이블',
        '.featured-project.hrr-visual > p:not(.project-kicker)': '소울, 재즈, 펑크, 가스펠 음반을 위한 디지털 공간입니다.',
        '.featured-project.hrr-visual .project-link:not(.instagram-link)': 'Human Rhythm Records 방문하기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.featured-project.hrr-visual .instagram-link': 'Instagram <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.service-section .eyebrow': '서비스 소개',
        '.service-section h2': '활동을 위한<br /><em>따뜻한 공간.</em>',
        '.service-section .section-heading > p': '방문자가 활동과 연락 방법을 쉽게 이해할 수 있도록 구성합니다.',
        '.service-audiences li:nth-child(1)': '소규모 기업',
        '.service-audiences li:nth-child(2)': '비영리 단체',
        '.service-audiences li:nth-child(3)': '교회',
        '.service-audiences li:nth-child(4)': '그 밖의 프로젝트',
        '.service-details h3': '웹사이트에 담을 수 있는 내용',
        '.service-details li:nth-child(1)': '활동과 그 특별한 가치에 대한 소개.',
        '.service-details li:nth-child(2)': '서비스, 사명, 방문 안내와 같은 주요 정보.',
        '.service-details li:nth-child(3)': '이메일이나 문의 링크와 같은 연락 방법.',
        '.service-details > p': '내용과 기능은 함께 정한 범위에 따라 달라집니다.',
        '.concept-link': '독립적인 콘셉트 디자인 살펴보기 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
        '.service-pricing .eyebrow': '비용 안내',
        '.service-pricing h3': '웹사이트 제작 및 공개 비용은 $1,000부터 시작합니다.',
        '.service-pricing p:nth-of-type(2)': '상담 후 작업을 시작하기 전에 범위와 비용을 함께 정합니다. 온라인 예약, 전자상거래, 맞춤형 연동과 같은 복잡한 기능이 추가되면 프로젝트 비용이 높아질 수 있습니다.',
        '.service-pricing p:nth-of-type(3)': '공개 후 작업은 시간당 $100입니다. 진행하기 전에 작업 내용과 예상 비용을 논의합니다. 도메인, 호스팅 및 외부 서비스에 별도 비용이 발생할 수 있으며, 이 또한 미리 안내해 드립니다.',
        '.service-payment': 'Venmo, Cash App, Zelle 또는 현금으로 결제하실 수 있습니다. 결제 정보는 프로젝트에 합의한 후 안내해 드립니다.',
        '.approach .eyebrow': '진행 방식',
        '.approach h2': '아이디어에서<br /><em>웹사이트까지.</em>',
        '.approach-steps li:nth-child(1) strong': '프로젝트 이야기 나누기',
        '.approach-steps li:nth-child(1) p': '방문자와 목표, 담고 싶은 정보를 나눕니다.',
        '.approach-steps li:nth-child(2) strong': '계획 정하기',
        '.approach-steps li:nth-child(2) p': '작업을 시작하기 전에 범위, 일정, 비용 및 결제 일정을 서면 계약으로 확정합니다.',
        '.approach-steps li:nth-child(3) strong': '제작 및 공개',
        '.approach-steps li:nth-child(3) p': '함께 정한 범위에 맞춰 웹사이트를 만듭니다.',
        '.invitation h2': '어떤 일을<br /><em>계획하고 계신가요?</em>',
        '.invitation > div > p': '프로젝트와 구상 중인 웹사이트에 대해 들려주세요.',
        '.invitation .button': '프로젝트에 대해 알려주세요 <svg class="link-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M5 11 11 5M5 5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>'
      }
    },
    contact: {
      title: '문의하기 — Isaiah Yoon',
      description: 'Isaiah Yoon에게 이메일, 문자 또는 소셜 미디어로 연락하세요.',
      content: {
        '.page-hero h1': '함께 이야기를<br /><em>나눠요.</em>',
        '.page-hero > p:not(.eyebrow)': '구상 중인 프로젝트가 있거나 인사를 나누고 싶으신가요? 연락을 기다립니다.',
        '.contact-list article:nth-child(1) h3': '이메일',
        '.contact-list article:nth-child(2) h3': '문자',
        '.contact-list article:nth-child(3) h3': '다른 채널'
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
    document.querySelector(selector).content = '짙은 남색 배경의 빛나는 금색 큐브에 담긴 Isaiah Yoon 모노그램';
  }
  document.querySelector('.brand').setAttribute('aria-label', 'Isaiah Yoon 홈');
  document.querySelector('nav').setAttribute('aria-label', '주 메뉴');
  const audiences = document.querySelector('.service-audiences');
  if (audiences) audiences.setAttribute('aria-label', '함께하는 프로젝트');
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
