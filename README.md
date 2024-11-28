
<div align="center">

# n-puzzle-solver
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/windopper/n-puzzle-solver/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/windopper/n-puzzle-solver/actions/workflows/deploy.yml)
</div>

*n-puzzle-solver*는 *n-puzzle* 문제를 다양한 알고리즘을 통해 해결하고 시각화하는 인터랙티브 애플리케이션입니다.

***

<div align="center">

![image](/docs/image.png)

</div>


**공식 페이지** : https://windopper.github.io/n-puzzle-solver/

## 🚀 주요 기능
- 🎲 수동 / 랜덤 초기 상태 설정
    - 해결 가능한 퍼즐 자동 판별

- 🔍 다중 알고리즘 지원
    - BFS
    - A*
    - Greedy

- 📊 알고리즘 성능 표기
    - 최적 경로 깊이
    - 소요 시간 계산
    - 탐색 노드 수 표시

- 🖼️ 단계별 퍼즐 상태 시각화
    - 노드 간 관계 그래픽 표현
    - 최적 경로 하이라이트

- 🕰️ 탐색 기록 저장 및 불러오기

## 📦 의존성
- Node.js 20.17.0 이상
- npm 10.8.2 이상

## 🛠️ 설치 방법

```bash
git clone https://github.com/windopper/n-puzzle-solver
cd n-puzzle-solver
npm install
```

## 🖥️ 프로젝트 실행
프로젝트를 실행하려면 다음 명령어를 사용하세요
```bash
npm start
```

## 🧪 테스트 실행

### 전체 테스트 실행
모든 테스트를 실행하려면 다음 명령어를 실행하세요:
```bash
npm test
```

### 개별 테스트 실행
특정 테스트를 실행하기 위한 미리 정의된 스크립트를 사용할 수 있습니다:

```bash
npm run test:puzzle     # 퍼즐 관련 테스트만 실행
npm run test:algorithm  # 알고리즘 관련 테스트만 실행
```

## 🌈 프로젝트 구조
```
n-puzzle-solver/
│
├── src/
│   ├── components/      # 리액트 컴포넌트
│   ├── libs/            # 유틸리티 함수
│   └── hooks/           # 커스텀 리액트 훅
│ 
├── test/                # 테스트 파일
├── public/              # 정적 리소스
└── docs/                # 문서화 관련 파일
```

## 🤝 기여 방법
해결하고 싶은 이슈를 이슈 트래커에서 확인 후 저장소를 포크하여 코드 작성 후 풀 리퀘스트를 날려주세요.

## 🐛 이슈 제보
다음과 같은 경우 이슈를 제보해 보세요.
- 버그 발견시
- 성능 개선 제안
- 새로운 알고리즘 또는 기능 요청
- 문서 오류나 개선 사항

## 🌟 팀원

| 이름 | GitHub |
|:---:|:---:|
| 권영훈 | [@windopper](https://github.com/windopper) |
| 김범수 | [@AISWKimBeomSu](https://github.com/AISWKimBeomSu) |
| 김채희 | [@purplestrawberrywatermelon](https://github.com/purplestrawberrywatermelon) |
| 신윤철 | [@yoonchulShin](https://github.com/yoonchulShin) |

## 📄 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
