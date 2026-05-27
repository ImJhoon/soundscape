# DESIGN.md - UI Framework Design System

## 1. Role in Pipeline
이 문서는 `AGENTS.md`로부터 프로젝트의 핵심 컨텍스트(Bootstrap 5 + Tailwind CSS 환경)를 전달받아, **디자인 규칙과 프레임워크 간 역할 분리 시스템**을 정의합니다.
이후 이 규칙을 코드 레벨로 구현하기 위해 `.agents/skills/frontend-design/SKILL.md` 에이전트 스킬에게 **실행을 위임**합니다.

## 2. Bootstrap vs Tailwind 역할 분리 원칙
두 프레임워크를 함께 쓸 때 가장 중요한 것은 **역할을 명확히 분리**하는 것입니다.
같은 속성을 두 프레임워크가 동시에 제어하면 충돌이 발생합니다.

| 역할                         | 담당 프레임워크 | 예시                                      |
| ---------------------------- | --------------- | ----------------------------------------- |
| 그리드 / 레이아웃            | Bootstrap       | `container`, `row`, `col-md-6`            |
| 네비게이션 / 모달 / 드롭다운 | Bootstrap       | `navbar`, `modal`, `dropdown`             |
| 버튼 / 폼 / 카드 기본 구조   | Bootstrap       | `btn btn-primary`, `form-control`, `card` |
| 여백 / 간격 세부 조정        | Tailwind        | `mt-6`, `px-3`, `gap-4`                   |
| 색상 커스터마이징            | Tailwind        | `text-slate-600`, `bg-indigo-50`          |
| 타이포그래피 세부 조정       | Tailwind        | `text-sm`, `font-semibold`, `leading-6`   |
| 반응형 세부 조정             | Tailwind        | `md:flex`, `lg:hidden`                    |
| 애니메이션 / 트랜지션        | Tailwind        | `transition-all`, `hover:scale-105`       |

## 3. 반응형 처리 원칙
레이아웃 분기는 Bootstrap 그리드로, 세부 조정은 Tailwind 반응형으로 처리합니다.

```html
<!-- 레이아웃 분기: Bootstrap 그리드 사용 -->
<div class="row g-4">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- 세부 조정: Tailwind 반응형 사용 -->
    <div class="card p-4 md:p-6 lg:p-8">
      ...
    </div>
  </div>
</div>
```

## 4. Accessibility (a11y) 기본 원칙
- Bootstrap 컴포넌트의 `aria-*` 속성 기본값 반드시 유지 (임의로 제거 금지)
- 아이콘만 있는 버튼에는 `aria-label` 추가
- 색상만으로 상태 구분 금지 — 아이콘 또는 텍스트 병행
- 모달 사용 시 `aria-labelledby`, `aria-describedby` 속성 포함

## 5. Execution Delegation (실행 위임)
위의 역할 분리와 디자인 명세에 대한 실제 HTML, CSS, JS 코드 작성 및 환경 설정(`tailwind.config.js` 등)은 **`.agents/skills/frontend-design/SKILL.md`** 에게 전적으로 위임합니다. SKILL.md는 이 문서를 가이드 삼아 코딩 컨벤션을 준수하여 코드를 작성해야 합니다.
