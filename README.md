<p align="center">
  <img src="https://github.com/user-attachments/assets/93f4befa-dbac-43ef-be99-d93f65dee73f" width="30%" />
</p>

## 프로젝트 소개
* "매출 50억원을 목표로... [하고있습니다]? [삼았습니다]? 다른 좋은 표현 없나?"
* 글쓰기 도중 적절한 표현이 생각나지 않을때! 사용한 단어가 너무 진부한 것 같을 때! 도움을 주는 ai 웹사이트입니다.
## 구현 화면

![ai-aftersentence2](https://github.com/user-attachments/assets/a4828ce5-2fc1-456c-885c-81b951c73d03)



## 제작 기간
* 2024.10.28 ~ 2024.12.6 (1개월)
## 시스템 아키텍쳐 구성
### - 전체 구성도
![github architecture](https://github.com/user-attachments/assets/ec508939-1ed9-4678-919b-c425aceb2dc9)
### - 백엔드 세부 기술 구성도
![github architecture2](https://github.com/user-attachments/assets/9254406e-eecd-46f0-a1a3-6fd47b62b9c5)
## 주요 기능
### ai 관련 기능

* 특정 문장구 이후에 나올 표현 추천 기능
<img src="https://github.com/user-attachments/assets/0c713c3e-2dda-4850-b533-fa0ce37d13a3" width="55%" />

    - 이용자가 편집하고 싶은 부분을 클릭
    - 이용자가 적어놓은 글을 전처리하여 ai 프롬프트에 전달, ai에서 나온 답변을 전처리하여 출력
  
* 특정 단어를 드래그시 문맥에 어울리는 다른 단어 추천 기능
<img src="https://github.com/user-attachments/assets/f9852a14-0e43-45a2-b96d-e03c3e4bd8b4" width="55%" />

    - 이용자가 편집하고 싶은 단어구를 드래그
    - 이용자가 적어놓은 글을 전처리하여 ai 프롬프트에 전달, ai에서 나온 답변을 전처리하여 출력

* 토큰 시스템을 설정하여 ai 요청 횟수 제한
  - ai 요청시 1토큰 차감, 4시간 지나면 토큰 갱신
* ai 재요청 기능
### 문서 편집 관련 기능

- undo, redo 기능
<img src="https://github.com/user-attachments/assets/a35f4f71-75a6-4336-9fbb-95136b6da9d8" width="49%" />

- 복사 기능
- 페이지 벗어나기 전 경고 기능
- 글자수 세기 기능
- ai 요청 버튼이 커서를 따라오도록 위치 배치
### 회원 관리 기능
- 네이버, 구글 소셜 로그인&회원가입 기능
<img src="https://github.com/user-attachments/assets/ecf33d19-7eb8-4be5-9bff-596e3b250253" width="49%" />


### 튜토리얼 화면
- 사이트 사용법 설명
  
### 오류 화면
<img src="https://github.com/user-attachments/assets/e311dc32-e88f-46ad-8ef5-2bc612ac1206" width="49%" />
<img src="https://github.com/user-attachments/assets/b3ec6deb-c87b-494d-9427-9804be09809b" width="49%" />
<img src="https://github.com/user-attachments/assets/a7dc999a-f58e-428e-989c-f850078d8912" width="49%" />
<img src="https://github.com/user-attachments/assets/465fdb08-88b5-49c0-8d44-ed2f5acedce7" width="49%" />
<img src="https://github.com/user-attachments/assets/bfdcdd0c-f171-4f0f-82c0-88b620714d42" width="49%" />

## 작성한 기술 블로그
* [챗 gpt api vs claude api 가격 비교 분석](https://annyeong46.tistory.com/58)
* [spring yml/yaml/properties 파일 작동 안됨 오류 해결](https://annyeong46.tistory.com/60)
* [spring boot에 claude API 연동하는 방법 정리](https://annyeong46.tistory.com/62)
* [react와 spring boot 간 연동하기 / 통신하기 정리](https://annyeong46.tistory.com/63)
* [(SpringBoot) jpaRepsitory bean 등록 관련 오류 해결](https://annyeong46.tistory.com/64)
* [(React)useBlocker 관련 오류 해결](https://annyeong46.tistory.com/65)
* [(React)UseEffect의 async/await 관련 오류 해결](https://annyeong46.tistory.com/67)
* [원격서버에 프로젝트 빌드시 서버 다운되는 문제 해결](https://annyeong46.tistory.com/68)
