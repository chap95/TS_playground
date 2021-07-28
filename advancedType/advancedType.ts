import { type } from "os";

// 1. conditional type (조건부 타입)
declare function funcTest<T extends boolean>(
  x: T
): T extends true ? string : number;
let x = funcTest(Math.random() < 0.5);
// x 의 type 은 string | number 가 된다.
console.log(x);
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function testing<T>(x: T): T extends Foo ? string : number;
function foo<U>(x: U) {
  let a = testing(x); // a 의 타입은 string | number 인 union type을 가지게 된다.
  let b: string | number = a; // a 가 b 에 할당이 가능한 이유는 a 의 타입이 string 또는 number 인 것은 확실하기 때문
  // 사용이유
  // contitional type 은 generic 과 같이 주로 사용한다.
  // T 타입 변수에는 어떠한 타입이 올지 모르기 때문에 컴파일 단계에서 타입을 걸러내기 힘들다.
  //
}
// 2. distributive conditional type (분배조건부 타입)
// 검사가 이루어진 이후 날 것의 타입? 이라고 하는데 뭔소리인지?
// 아마도 타입 검사 직후의 type을 의미하는 거 같다.
type EmailAddress = string | string[] | null | undefined;
type NotNullable<T> = T extends null | undefined ? never : T;
type NotNullableAddress = NotNullable<EmailAddress>;
// NotNullableAddress 의 타입은 string | string[] 이 된다.
// 아래는 분배되는 과정을 적음
type NotNullableEmailAddress = NotNullable<
  string | string[] | null | undefined
>;
// 다음
type NotNullableEmailAddress2 =
  | NonNullable<string>
  | NonNullable<string[]>
  | NonNullable<null>
  | NonNullable<undefined>;
// 다음
type NotNullableEmailAddress3 =
  | NonNullable<string extends null | undefined ? never : string>
  | NonNullable<string[] extends null | undefined ? never : string[]>
  | NonNullable<null extends null | undefined ? never : null>
  | NonNullable<undefined extends null | undefined ? never : null>;
// 다음
type NotNullableEmailAddress4 = string | string[] | never | never;
// 다음
type NotNullableEmailAddress5 = string | string[];
// ===================================================
// 3. infer
// '추론하다' 라는 뜻을 가진 키워드 이다. 타입을 추론하는데 사용한다.
// 타입을 추론한다는 건 단어만 봐도 알 수 있다. 실질적으로 어떤 기능을 하는지 알아보자
// infer 는 conditional type 에 많이 사용한다.
// 아래의 예시를 한 번 보자

type UnpackArrayType<T> = T extends (infer R)[] ? R : T;
type T1 = UnpackArrayType<number[]>;
type T2 = UnpackArrayType<string>;
// 이 예제 코드는 array type을 unpacking 해주는 타입을 conditional type 으로 만들어 놓은것이다.
// 코드 설명을 잠깐 하자면
// T1 은 number 타입이 되는데 number[] 가 (infer R)[] 의 부분집합이 될 수 있기 때문에 T1 은 number 가 된다.
// 여기서 infer의 역할을 무엇인가?
// 컴파일러에게 새로운 타입 변수 R 이 UnpackArrayType scope 안에 선언됐다고 알려주는 역할을 한다.
// 아래 예제를 살펴보자
type R = string;
type R1<T> = T extends R ? R : number;
type R2<T> = T extends infer R ? R : number;
// R1 과 R2 의 차이점은 무엇일까
// R1 에 사용된 R 은 위에서 선언한 R 타입을 참조한다.
// 하지만 R2에 사용된 R은 R2 scope 에 선언되어서 type R 과 상관없는 타입 변수가 된다.

// infer 키워드를 사용하면 타입 추론이 가능해진다.
// 아래 공변성, 항공변성 예제를 보자
// 타입 추론의 다양한 case 중 다중 후보군 case
// 공변성과 항공변성 co-variant VS contra-variant
// 1) 공변성
type unboxFromObject<T> = T extends { a: infer R; b: infer R } ? R : never;
type r1 = unboxFromObject<{ a: string; b: number }>; // string | number
// 2) 항공변성
type unboxFromObjectFunctions<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : never;
type r2 = unboxFromObjectFunctions<{
  a: (x: string) => void;
  b: (x: number) => void;
}>; // string & number 문자열과 숫자는 교집합이 없으므로 never 타입을 얻는다.
//
// 4_1 -> 공변성과 반공변성은 무엇인가?
// -> 공변성
// 공변성은 type 에 SOLID 원칙 중 하나인 리스코프 치환 원칙을 적용한다는 의미다.
// 리스코프 치환 원칙을 간단히 말하자면 '상위 타입을 사용하는 객체를 하위 타입을 사용하는 객체로 치환해도
// 프로그램은 오류 없이 정상 동작해야한다.' 이다.
// 일반적인 sub type 관계가 함수 인자에서는 반대로 적용된다는 의미
type TA = { a: string }; // 상위 타입
type TB = { a: string; b: string }; // 하위 타입

let ta: TA;
let tb: TB;
// tb 는 ta 의 subType 이다. 이 표현이 맞는지 모르겠다. super 라는 의미는 초월 or 어떠한 것을 넘어선 의미가 강한 단어라 생각한다.
ta = tb;
// tb 는 ta 의 subType 이기 때문에 할당이 가능하지만 그 반대는 불가능하다. 이것이 공변성이다.
// 잘 생각해보면 간단하다. ta 를 사용한 변수들은 a 라는 프로퍼티만 접근 가능했지만 tb 를 사용한 변수들은 b 라는 프로퍼티에도
// 접근할 수 있다. tb 를 갑자기 ta 로 치환해 버리면 b 가 없다는 에러를 발생시킬 것이 뻔하다.

// -> 반공변성
// 리스코프 치환 원칙의 키워드는 '상위를 하위로' 이다.
// 반공변성은 이 반대 개념으로 생각하면 되겠다.
type FTA<T> = (param: T) => void; // 상위
type FTB<T> = (param: T) => void; // 하위

let fta: FTA<string | number> = (x) => {};

let ftb: FTB<number> = (x) => {};

ftb = fta;
// fta 의 파라미터는 union ftb 의 파라미터는 단일 타입이다.
// fta 의 파라미터에 string 이라는 타입이 존재하기 때문에 ftb 는 string 타입에 대한 커버 능력이 없다.
// 그렇기 때문에 fta 만 ftb 에 할당이 가능하다.
// 상식적으로 이해는 가지 않는다. 하지만 이렇게 알아두자

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type Test1<T> = T extends string ? 1 : 2;
type Test2 = Test1<never>; // never type
type Test3 = never extends string ? 1 : 2; // 1

// 반공변성을 이용한 예제라 생각한다. 위 type 은 union -> intersection 으로 바꾸는 타입이다}
