# 曆象 오답 분석 패키지 형식 v2

최상위 핵심 필드:
- `kind`: `yeoksang-analysis-package`
- `schemaVersion`: `1` 또는 `2`
- `packageId`: 중복 병합 방지용 고유 ID
- `reviewStatus`: `final`만 曆象에서 가져오기 허용
- `mode`: `historical-archive` 또는 `active`
- `subject`: 과목
- `tests`: 시험 묶음 배열

`historical-archive`는 정확한 날짜가 없는 과거 오답에 사용합니다. 성적 흐름에는 들어가지만 현재 미해결, 오늘 우선순위, 재풀이 대기를 자동으로 증가시키지 않습니다.

`active`는 현재 시험 기록에 병합할 때 사용하며 각 시험에 `exactDate`가 있어야 합니다.

문항 핵심 필드:
- `number`: 대화 검토까지 끝난 확정 문항번호
- `status`: `wrong`, `uncertain` 등
- `directCause`: 사용자가 실제로 적은 직접 원인
- `type`, `cause`, `pattern`: 검토가 끝난 분석 분류
- `controlRule`: 다음 풀이에서 적용할 규칙
- `note`: 원문 분석 보존
- `sourcePage`: 원본 페이지
- `provenance`: source-authored / model-inferred-reviewed 등 출처 구분

최종 파일을 만들기 전에 애매한 항목은 사용자와 대화에서 먼저 해결합니다. `draft`, `unresolved`, `model-inferred-unreviewed`가 남은 패키지는 가져오지 않습니다.
