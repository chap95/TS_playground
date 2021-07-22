function a(x: string, y: string): string;
function a(x: number, y: number): number;

function a(x: any, y: any) {
  return x + y;
}

const b = a(1, 2);
const c = a("가", "나");
console.log(b, c);
