# 曆象 오답 분석 패키지 형식 v1

최상위 필수 필드:

- `kind`: `yeoksang-analysis-package`
- `schemaVersion`: `1`
- `packageId`: 같은 패키지의 중복 병합을 막는 고유 ID
- `mode`: `historical-archive` 또는 `active`
- `subject`: 과목
- `tests`: 시험 묶음 배열

`historical-archive`는 날짜가 불완전한 오래된 오답 파일에 사용합니다. 현재 미해결 문항이나 오늘 우선순위를 자동으로 증가시키지 않습니다.

`active`는 현재 시험 기록에 병합할 때 사용하며 각 시험에 `exactDate`가 있어야 합니다. 정확한 날짜가 없는 기록을 현재 시험처럼 활성화하지 않습니다.

문항의 핵심 필드:

- `number`: 확정할 수 있을 때만 숫자
- `status`: `wrong`, `uncertain` 등
- `directCause`: 사용자가 실제로 적은 직접 원인
- `type`, `cause`, `pattern`: 분석 분류
- `controlRule`: 다음 풀이에서 적용할 규칙
- `note`: 원문 분석 보존용
- `sourcePage`: 원본 페이지
- `provenance`: 각 필드가 `source-authored`인지 `model-inferred`인지 구분

문항번호를 읽을 수 없으면 번호를 추정하지 않습니다. 내용은 관찰 기록으로 남깁니다.
