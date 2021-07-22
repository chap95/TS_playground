declare function f<T extends boolean>(x: T): T extends true ? string : number;
let x = f(Math.random() < 0.5);
// x 의 type 은 string | number 가 된다.

interface Foo {
  propA: boolean;
  propB: boolean;
}
declare function f<T>(x: T): T extends Foo ? string : number;
function foo<U>(x: U) {
  let a = f(x); // a 의 타입은 string | number 인 union type을 가지게 된다.
  let b: string | number = a; // a 가 b 에 할당이 가능한 이유는 a 의 타입이 string 또는 number 인 것은 확실하기 때문
}

// 분배조건부타입
type EmailAddress = string | string[] | null | undefined;
type NotNullable<T> = T extends null | undefined ? never : T;
type NotNullableAddress = NotNullable<EmailAddress>;
// NotNullableAddress 의 타입은 string | string[] 이 된다.
// 아래는 분배되는 과정을 적음
type NotNullableEmailAddress = NotNullable<
  string | string[] | null | undefined
>;
