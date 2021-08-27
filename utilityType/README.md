# utility type

---

### Partial

```
 Partial<T>
```

위와 같이 사용하면 T type 에 오는 모든 속성은 optional 하게 사용이 가능하다.

아래 예제를 참고해보자

```typescript
interface IBook {
  title: string;
  info: string;
}

interface IAuthor {
  name: string;
  homeTown: string;
}

type BookInfo = IBook & IAuthor;
type AuthorInfo = IAuthor & Partial<IBook>;

const book1: BookInfo = {
  title: "책 1",
  info: "1번 책입니다.",
  name: "김작가",
  homeTown: "강원도",
};

const author1: AuthorInfo = {
  name: "신인작가",
  homeTown: "서울",
};
```

책은 저자가 무조건 있어야 된다 판단해 BookInfo 의 타입은 IBook 과 IAuthor 로 선언했다.

반면 작가 중에 첫 작품을 작업 중이라면 아직 작품이 없을 수 있다 판단해 IBook 을 Partial 로 optional 하게 사용했다.
이 예제의 상황은 내가 가정을 했기 때문에 설득력이 떨어질 수 있다.

다음 예제는 우리가 사용할 수 있는 예제가 나오니 유심히 들여다 보자.

```typescript
interface ISample {
  title: string;
  content: string;
}

function updateSample(sample: ISample, fieldsToUpdate: Partial<ISample>) {
  return { ...sample, ...fieldsToUpdate };
}

const proto: ISample = {
  title: "원형 입니다.",
  content: "내용을 적어주세요",
};

const sample1 = updateSample(proto, {
  content: "sample 입니다.",
});
```
