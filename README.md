# TS_playground

---

타입스크립트를 사용하면서 궁금했던 것들을 조사후  
직접 사용해 보기 위한 공간입니다 :)

### 초기설정

ts-node 를 설치하셔서 예제 코드를 실행시켜보는 것을 추천드립니다.

```bash
npm install -D ts-node // local
npm install -g ts-node // global
```

### 실행

현재 저는 local 로 설치해서 사용하고 있기 때문인지 모르겠는데
ts-node 명령어가 동작을 안합니다. 그래서 아래와 같이 실행하고 있습니다.

```
npx ts-node [filename]
```

이 부분 아시는 분 있으면 알려주세요 ㅠ

---

### 1. [advancedType](https://github.com/chap95/TS_playground/blob/master/advancedType/advancedType.ts).

- conditional type (조건부 타입)
- distributive conditional type(분배조건부 타입)
- infer 키워드
- 공변성과 항공변성

### 2. [baseType](https://github.com/chap95/TS_playground/tree/master/baseType)

- unknown
- never
- any

### 3. [utilityType]()

- partial
