# do-not-save

> **2025년 1학기 프론트엔드 수행평가 프로젝트**

---

## 주요 기능

- 🏷️ 카테고리별 북마크 관리 (추가/수정/삭제)
- ⭐ 즐겨찾기 기능
- 🎨 반응형 디자인
- 🔒 로컬스토리지 기반 저장
- 📝 회원가입/로그인
- ⚡ 빠른 로딩 속도

---

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드
npm run build
```

---

## 기술 스택

- React + TypeScript
- Vite
- styled-components
- LocalStorage

---

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── contexts/       # React Context
├── pages/         # 페이지 컴포넌트
├── styles/        # 전역 스타일 및 테마
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

---

## 프로젝트 목적

- React와 TypeScript를 활용한 웹 애플리케이션 개발 학습
- 로컬스토리지를 활용한 데이터 관리 구현
- 컴포넌트 기반 UI 개발 연습
- 반응형 웹 디자인 구현

---

> 북마크를 저장하고 관리할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 사용자 인증 (회원가입/로그인/로그아웃)
- 북마크 저장 및 관리
- 반응형 디자인

## 기술 스택

- React
- TypeScript
- Styled Components
- React Router
- Local Storage (인증 관리)

## 시작하기

### 필수 조건

- Node.js (v14 이상)
- npm

### 설치

```bash
# 저장소 클론
git clone [repository-url]

# 프로젝트 디렉토리로 이동
cd do-not-save

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 `http://localhost:5173`으로 접속하시면 됩니다.

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── contexts/       # React Context
├── pages/         # 페이지 컴포넌트
├── styles/        # 전역 스타일 및 테마
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

## 라이선스

MIT License   