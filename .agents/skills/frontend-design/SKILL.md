---
name: frontend-design
description: Bootstrap 5 + Tailwind CSS 기반 UI 프론트엔드 코드 실행. DESIGN.md로부터 역할 분리 및 규칙을 위임받아 HTML/CSS/JS 코드를 작성합니다.
license: Complete terms in LICENSE.txt
---

# SKILL.md - Frontend Implementation Execution

## 1. Role in Pipeline
이 스킬 파일은 프론트엔드 UI 구축 파이프라인의 **최종 실행(Execution) 단계**를 담당합니다.
- **Context 수신**: `AGENTS.md`에서 전체 기술 스택과 허용 범위를 파악합니다.
- **Design 수신 및 실행**: `.agents/design/DESIGN.md`에서 정의된 Bootstrap과 Tailwind의 역할 분리 규칙과 접근성(a11y) 가이드를 전달받아, 실제 코드로 **구현(위임받은 실행)**합니다.

## 2. 파일 구조 및 설정
프로젝트는 기본적으로 다음 구조를 따릅니다.
```
soundscape/
├── index.html
├── tailwind.config.js
├── css/
│   ├── custom.css        # Bootstrap 변수 오버라이드
│   └── output.css        # Tailwind 빌드 결과물
├── js/
│   └── main.js
└── components/           # 재사용 HTML 스니펫
```

### 충돌 방지 설정 (`tailwind.config.js`)
Bootstrap과 Tailwind의 `preflight`(기본 reset)가 충돌하므로 반드시 비활성화해야 합니다.
```js
module.exports = {
  corePlugins: { preflight: false }, // 필수: Bootstrap reset과 충돌 방지
  content: ["./**/*.html", "./**/*.js"],
  theme: { extend: {} },
};
```

## 3. Coding Conventions

### 3.1. 클래스 작성 순서
같은 태그에 두 프레임워크 클래스가 섞일 때는 아래 순서를 따릅니다.
`Bootstrap 구조 클래스 → Bootstrap 상태 클래스 → Tailwind 레이아웃 → Tailwind 스타일`

```html
<!-- 올바른 순서 -->
<div class="card card-hover flex flex-col gap-4 rounded-xl text-slate-700">...</div>
```

### 3.2. HTML 구조 규칙
1. Bootstrap 구조 클래스 먼저 작성, Tailwind 유틸리티는 뒤에 작성.
2. Bootstrap 내부 클래스(`card-body`, `card-footer` 등) 유지, 세부 조정만 Tailwind로 수행.

### 3.3. JavaScript 규칙
1. **Bootstrap JS API 우선 사용** (예: `new bootstrap.Modal()`).
2. 순수 DOM 조작 시 data 속성(`data-toggle`)과 Tailwind 유틸리티(`classList.toggle('hidden')`)를 활용.

## 4. 자주 쓰는 패턴 레퍼런스
- **네비게이션**: `<nav class="navbar navbar-expand-lg bg-white border-b px-4">`
- **알림 배너**: `<div class="alert alert-warning flex items-center gap-3 rounded-lg text-amber-800" role="alert">`
- **폼 인풋**: `<input type="email" class="form-control rounded-lg text-sm">`

## 5. Output Format
코드 출력 시 다음 항목을 준수합니다.
1. **파일 경로** — 첫 줄 주석으로 명시 (`<!-- 파일 경로: components/card.html -->`)
2. **CDN 링크** — 새 파일이면 필요한 Bootstrap / Tailwind CDN 태그 포함
3. **사용 예시** — 해당 컴포넌트를 어떻게 페이지에 삽입하는지 한 줄 설명
4. **응답 길이** — 전체 파일 출력은 명시적 요청 시에만 수행, 수정 시에는 변경된 부분과 컨텍스트(±5줄)만 출력.
