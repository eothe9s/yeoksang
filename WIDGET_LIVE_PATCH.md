# 曆象 v2.5.1 · Widget LIVE Sync 1.0

이 패키지는 사용자가 제공한 `YEOKSANG_v2_5_1_GITHUB_FLAT.zip`을 기준으로 만든 병합본입니다.

## 보존
- 앱 버전: **2.5.1 그대로**
- 데이터 스키마: 기존 그대로
- 기존 핵심 JS 로직: 원본 유지
- 기존 README / QA: 원본 유지

## 추가/변경된 파일
- `app-widget-live.js` 신규 추가
- `index.html`: 설정 화면에 위젯 자동 동기화 카드 + 신규 스크립트 로드만 추가
- `sw-v200.js`: 새 동기화 스크립트를 오프라인 캐시에 포함하고 캐시 이름 갱신

## 동기화 동작
1. 기존 `saveDB()`의 최종 구현이 성공한 뒤에만 snapshot을 생성합니다.
2. 약 180ms debounce 후 Worker `/snapshot`으로 전송합니다.
3. 실패한 snapshot은 작은 pending 데이터로 유지합니다.
4. online / focus / pageshow / visibilitychange / pagehide / 다음 저장 때 재전송합니다.
5. 전체 DB가 아니라 오늘 위젯에 필요한 최소 정보만 전송합니다.

## 설치 후
설정 → 위젯 자동 동기화에서 Worker 주소와 `SYNC_TOKEN`을 넣고 `지금 업로드`를 누르세요.
