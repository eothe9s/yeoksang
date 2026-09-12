# 曆象 v2.2 QA

## 실제 검사한 항목

- 모든 JavaScript 파일 `node --check` 통과
- HTML id 377개, 중복 id 0개
- HTML이 참조하는 로컬 파일 누락 0개
- service worker asset 참조 누락 0개
- 오답 분석 패키지 구조 검증 통과
- 경제 과거 오답 패키지: 시험 묶음 14개 / 문항·관찰 기록 62개 / 번호 미확인 4개 / 원본 경고 2개
- 역사 아카이브 import VM 테스트 통과
  - 과거 오답 import 후 현재 활성 시험 수가 늘지 않음
  - 14개 시험 묶음, 62개 기록 보존
  - 번호 미확인 4개가 별도 관찰로 보존
  - 같은 historical package를 import 함수에 다시 적용해도 archive 중복 생성 없음
- 분석용 컨텍스트 export VM 테스트 통과
  - 과거 아카이브 14개와 번호 미확인 관찰 4개 포함

## 테스트 중 발견해 수정한 결함

JavaScript에서 `Number(null) === 0`이므로, 번호 미확인 문항의 `number: null`이 유효한 문항번호처럼 처리될 수 있었습니다. v2.2에서는 양의 정수 문항번호만 확정 번호로 인정하도록 수정했습니다.

## 브라우저 QA 한계

이 실행 환경의 headless Chromium은 DBus/프로세스 제약으로 DOM 덤프를 완료하지 못했습니다. 따라서 실제 iPad Safari의 파일 선택·다운로드 UI는 최종적으로 기기에서 한 번 확인해야 합니다. 정적 연결과 JavaScript 구문, import 핵심 로직은 위와 같이 검사했습니다.
