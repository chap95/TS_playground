# utility type

유틸리티 타입 중 사용할 수 있는 몇 가지를 정리했다.

---

### Partial

```
 Partial<T>
```

위와 같이 사용하면 T type 에 오는 모든 속성은 optional 하게 사용이 가능하다. optional 하지 않은 속성도 optional 하게 사용이 가능

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

---

### Reauired

Partial 의 반대 개념이다. 모든 속성을 무조건 사용해야한다.

```
Required<T>
```

아래 예제를 살펴보자

```typescript
interface ISample {
  name?: string;
  phone?: number;
}

const somePerson: ISample = {
  name: "james",
};

const somePerson2: Required<ISample> = {
  name: "brian",
}; // error
```

---

### Pick

Pick 타입은 특정 타입의 속성을 몇 가지만 골라 사용할 수 있는 타입이다.

```
Pick<Type, Keys>
// keys = 'a' | 'b'
```

Pick 은 다음과 같은 경우에 사용할 수 있다.

```typescript
interface ITodo = {
  title: string;
  desription: string;
  completed: boolean;
  createDate: string;
}

type TodoPreview = Pick<ITodo, 'title' | 'completed'>

const myTodo: TodoPreview = {
  title: '세탁소 가기',
  completed: false,
}
```

---

### Omit

Omit 타입은 Pick 타입의 반대개념이다.

```
Omit<T, keys>
```

사용할 타입을 정하고 해당 타입에 존재하는 속성을 keys에 넣어주면 해당 속성을 제외한 type을 사용할 수 있다.

```typescript
interface ITodo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

type TodoPreview = Omit<ITodo, "createdAt" | "description">;

const todoPreview1: TodoPreview = {
  title: "TODO",
  completed: false,
}; // no error
```

제외해야할 타입의 수 가 적다면 Pick 보다 Omit 타입을 사용하면 좋을 것 같다.
