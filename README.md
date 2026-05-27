# Calm - Immersive Meditation & Breathing

**Calm**은 깊은 집중과 평온함을 위한 프리미엄 호흡 가이드 및 명상 시각화 웹 애플리케이션입니다. 
시각적으로 안정감을 주는 오라(Aura) 애니메이션과 다양한 호흡 패턴, 그리고 자연의 백색 소음을 통해 사용자에게 몰입감 있는 명상 경험을 제공합니다.

## ✨ 주요 기능 (Key Features)

- **호흡 시각화 (Breathing Orb)**
  - 호흡 주기에 맞춰 자연스럽게 크기와 색상이 변하는 애니메이션
  - 부드러운 색상 보간(Lerp)을 통한 시각적 안정감 제공

- **3가지 맞춤형 호흡 패턴**
  - **Balance (4-4 호흡)**: 들숨과 날숨의 길이를 맞춰 자율 신경의 균형을 찾습니다.
  - **Focus (4-4-4-4 박스 호흡)**: 순간적인 몰입과 집중력을 끌어올립니다.
  - **Relax (4-7-8 호흡)**: 긴장을 풀고 깊은 휴식과 숙면을 준비합니다.

- **사운드스케이프 테마 (Soundscapes)**
  - **Midnight Serenity**: 깊은 밤하늘과 별 (기본 명상음)
  - **Deep Forest**: 비 내리는 깊은 숲속
  - **Ocean Wave**: 해변으로 밀려오는 파도 소리
  - *볼륨 조절, 페이드인/아웃 및 테마 전환 시 자연스러운 오디오 크로스페이드 지원*

- **세션 타이머 & 완료 알림**
  - 5분(Quick), 10분(Recommended), 15분(Extended), 20분(Deep) 단위 타이머 지원
  - 세션 종료 시 Web Audio API를 활용한 528Hz(힐링 주파수) 싱잉볼 사운드 합성 재생

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend Core**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **CSS Framework & Utilities**: 
  - Bootstrap 5.3.3 (컴포넌트 및 모달 뼈대 구조)
  - Tailwind CSS v3 CDN (세밀한 유틸리티 스타일링 및 반응형 디자인)
- **Typography & Icons**: Google Fonts (Inter, Playfair Display), Material Symbols
- **Audio Processing**: Web Audio API (사운드 게인 제어, 오실레이터 주파수 합성)

## 🚀 프로젝트 구조 및 실행 방법

이 프로젝트는 별도의 패키지 매니저(npm)나 빌드 도구 없이 브라우저에서 즉시 실행 가능하도록 순수 웹 표준 기술로 작성되었습니다.

### 파일 구조
```text
/
├── index.html     # 메인 마크업 및 UI (Tailwind 설정 포함)
├── style.css      # 커스텀 CSS 및 핵심 애니메이션 (Orb, Ripple, 파티클 등)
├── app.js         # 호흡 엔진, 타이머, 사운드 제어, 테마 스위치 등 비즈니스 로직
├── sounds/        # 테마별 백그라운드 오디오 파일 (meditation, forest, ocean)
└── img/           # Open Graph 이미지 등 에셋 파일
```

### 실행 방법
가장 최적의 경험을 위해 로컬 웹 서버 환경에서 실행하는 것을 권장합니다.
1. VS Code의 `Live Server` 확장 프로그램을 사용하여 `index.html`을 엽니다.
2. 혹은 터미널에서 Python, Node.js 등을 이용해 로컬 서버를 띄워 접속합니다. (예: `python -m http.server`)

## 🎨 디자인 및 아키텍처 원칙

이 프로젝트는 사전 정의된 프론트엔드 에이전트 규칙(`AGENTS.md`)에 기반하여 작성되었습니다.
- **Bootstrap + Tailwind의 조화**: 모달(Modal)이나 큰 레이아웃 뼈대는 Bootstrap 컴포넌트를 사용하고, 세부적인 커스텀 디자인(색상, 그라디언트, 타이포그래피 등)은 Tailwind CSS 유틸리티로 덮어쓰어 두 프레임워크의 장점을 모두 취했습니다.
- **의존성 최소화**: React나 Vue 같은 무거운 프레임워크 없이 순수 Vanilla JS로 상태(State)와 DOM 조작을 구현하여 가볍고 빠른 퍼포먼스를 유지합니다.
