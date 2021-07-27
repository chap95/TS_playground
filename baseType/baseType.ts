// ts-node 로 실행할 때는 에러나는 부분을 찾아서 주석처리 후 실행시켜 주셔야 합니다!!
// ================================================================
// 1. unknown
// unknown 은 모든 타입들의 super set 이다.
// 무엇인가 any 타입과 똑같아 보인다. 그러면 unknown 타입의 특징을 any와 비교해가며 알아보자
// 그렇다면 any type 과 다른 점은 무엇일까?
let variable: unknown;
variable = 1;
variable = true;
variable = "1";
variable = {};
// unknown type 은 any 타입과 마찬가지로 모든 타입이 할당이 가능
// 하지만 any 타입과 다른 것은 any 외의 타입으로 선언된 변수에는 할당이 불가능하다.
let anyVar: any;
let unknownVar: unknown;
anyVar = unknownVar;
// booleanVar: boolean = unknownVar; 할당하면 에러가 발생한다.
// 또 다른 unknown 과 any 의 차이점은 프로퍼티, 메소드, 인스턴스 모두 다 생성할 수 없고 접근 불가하다.
// 말 그대로 '알려지지 않은 or 모르는' 타입이기 때문이다.
let anySomething: any;
let unknownSomething: unknown;

anySomething.foo;
// unknownSomething.foo; 하면 에러가 발생
anySomething[0];
// unknownSomething[0]; 하면 에러가 발생
anySomething();
// unknownSomething(); 하면 에러가 발생
anySomething.something();
// unknownSomething.something(); 하면 에러가 발생
new anySomething();
// new unknownSomething(); 하면 에러가 발생

// 하지만 unknown 타입도 위와 같은 방식으로 접근 가능한 경우가 있다.
// 바로 type guard 이다.
declare function isFunction(x: unknown): x is Function;
if (isFunction(unknownVar)) {
  unknownVar();
}
// 위와 같이 타입 가드를 하면 any 타입처럼 사용할 수 있다.
// unknown 타입을 union 하면 unknown 이 intersection 하면 unknown 말고 다른 타입이 나온다.
type UnionType<T> = T | unknown;
type IntersectionType<T> = T & unknown;

// 그렇다면 왜 why? unknown 타입을 사용하는 것일까?
// 위에 나온 특징들을 잘 살펴보면 된다.
// 1. any 대신
// any 타입은 신중하게 사용해야 하는 타입 중 하나다. 잘 못 사용하면 런타임 에러가 발생할 수 있기 때문이다.
// 타입 가드를 통해 any 를 대신할 수 있다면 any 를 사용하는 것 보다 unknown 과 타입 가드를 사용하는 것이 더 바람직해보인다.
// 2. 타입 가드
// 아래 예제 코드를 살펴보자

const isOfType = <T>(
  varTobeChecked: unknown,
  propertyToCheckFor: keyof T
): varTobeChecked is T =>
  (varTobeChecked as T)[propertyToCheckFor] !== undefined;

// isOfType 은 type 을 체크하는 로직이다. 그렇기 때문에 varTobeChecked 에 모든 타입이 올 수 있다.
// 그러면 varTobeChecked 는 any 타입으로 선언하는데 여기서는 unknown 타입으로 선언했다.
// 그리고 propertyToCheckFor 를 T 타입 변수의 key로 오게끔 한 후 varTobeChecked 에 해당 프로퍼티가 있으면 varTobeChecked 라고 판단합니다.

interface IAnimal {
  dog: string;
  cat: string;
  elephant: string;
}

const animalOfKorea = {
  dog: "jindo",
};

console.log(isOfType<IAnimal>(animalOfKorea, "dog")); // true
// 개인적인 생각 : 그냥 animalOfKorea 를 Type 체크 하는 것 보다
// 덕타이핑을 이용하여 as IAnimal 을 끝에 붙여주는게 좋지 않을까? 라는 생각이 든다.
// 출처 : https://jbee.io/typescript/TS-9-unknown/
// ================================================================
// 2. never
// never 타입은 말 그대로 절대 발생할 수 없는 type 이다. 만약 함수의 return 이 never 타입이라면
// 그 함수는 무한 루프이거나 오류를 발생시키는 함수이다. 그리고 타입 가드에 의해서 아무 타입도 얻지 못하게 된다면 never 타입을 획득한다.
// never 타입은 모든 타입의 subset 이다. 그렇기 때문에 never 타입은 어떠한 타입에도 할당이 가능하지만 반대로 모든 타입은 never 타입에
// 할당되지 못한다.
// 그렇다면 왜 why 절대 발생할 수 없는 type을 지정해 두고 사용하는 것일까?
// 1. never 타입으로 타입 추론 예외를 제거
type Arguments<T> = T extends (...args: infer A) => any ? A : never;
type Arguments1 = Arguments<(x: string, y: number) => string>;
type Arguments2 = Arguments<string>;
// 위 예제와 같이 Arguments 타입은 T 가 함수라면 Arguments의 타입 alias 는 A 타입으로 추론되고
// 함수형태가 아니라면 never 타입으로 추론이 된다.
// 이 과정에서 Arguments type alias 를 사용한 변수에 함수 타입이 아닌 다른 타입을 사용하면 컴파일 에러가 발생한다.
// never 타입은 사용해 보는게 체화 시키기 좋은 거 같다.
// 참고 : https://simsimjae.medium.com/typescript%EC%9D%98-never%EC%99%80-unknown-f4b9a9270f78 , https://typescript-kr.github.io/pages/basic-types.html
