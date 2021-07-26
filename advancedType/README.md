# advancedType
---
### 1. conditional type   
조건부 타입은 삼항연산자와 유사한 syntax를 가지고 있다.    
` a === 3 ? true : false ` 와 같은 구조를 가진다.    
` T extends U ? X : Y ` 이러한 방식으로 사용한다.    
` type testType<T> = 
    T extends string ? "string" : 
    T extends number ? "number :
    T extends boolean ? "boolean :
    T extends undefined ? "undefined" : 
    T extends Function ? "function" : "object";
`.   
위와 같은 방식이 condition type을 사용하는 방법이다.   
    
조건부 타입의 장점중 하나는 평가를 유예할 수 있다는 점이다.    
advancedType.ts 의 두번째 줄을 보면 Math.random 함수 때문에    
true 가 될 수 있고 false 가 될 수 있다.   코드로만 봐서는 type을 결정할 수 없기 때문에    
타입은 string | number 인 union type 이 된다.    
