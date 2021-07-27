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
// 3. never
// never는 일반적으로 함수의 return 타입으로 사용이된다.
// 어떤 함수의 return 타입으로 never 로 정해질 경우, 해당 함수는 절대 return 을 하지 않거나 오류를 출력한다.
type testType<T> = T | never;
// never 타입은 모든 타입의 subset 으로 어떤한 타입도 never 타입이 될 수가 없다.
// 그러므로 위 testType의 타입은 T 가 된다. 한마디로 어떠한 타입들과 union 하여도 아무 의미가 없기 때문에 union 한 타입이 나온다.
//
// 그렇다면 이런 아무의미 없는 타입을 도대체 왜 만들어서 사용하는 것일까? 그 이유를 알아보자
// 위에서 분배조건부 타입에서 never를 사용하여 타입을 추론하였다. 그 결과 위에서 설명한 이유로 인해 string | string[] 타입만 남게 되었다.
// 결국에는 NotNullableEmailAddress 타입에는 string 또는 string[] 타입이 오지 않으면 컴파일 에러가 발생하게 된다.
// 이제 감이 오는가??
//
// NonNullable 타입을 정의할 때 null 과 undefined 가 extends 될 수 있으면 never 타입으로 지정해 두었댜.
// 그렇기 때문에 NonNullable 타입에 null 이나 undefined 가 들어오게 되면 컴파일 에러가 일어나게 된다.
// ===================================================
// 4. infer
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
// 4_1 -> 공변성과 반공변성은 무엇인가?
// 일반적인 sub type 관계가 함수 인자에서는 반대로 적용된다는 의미
type TA = { a: string };
type TB = { a: string; b: string };

// ta 는 tb 의 subType 이다.
let ta: TA;
let tb: TB;

ta = tb;
// largeVar = smallVar subType 이기 때문
