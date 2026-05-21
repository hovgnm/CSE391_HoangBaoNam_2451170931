// Câu A1 - kiểm chứng var / let / const
// mình đoán trước rồi chạy để xem có đúng không

// Đoạn 1 - var hoisting
// mình đoán: undefined (vì var được hoist lên nhưng chưa gán giá trị)
console.log("Đoạn 1:");
console.log(x); // đoán: undefined
var x = 5;

// Đoạn 2 - let không hoist được
// mình đoán: lỗi ReferenceError
console.log("\nĐoạn 2:");
try {
  console.log(y); // đoán: lỗi
  let y = 10;
} catch (e) {
  console.log("Lỗi:", e.message);
}

// Đoạn 3 - const không gán lại được
// mình đoán: lỗi TypeError
console.log("\nĐoạn 3:");
try {
  const z = 15;
  z = 20;
  console.log(z);
} catch (e) {
  console.log("Lỗi:", e.message);
}

// Đoạn 4 - const với array thì vẫn push được
// mình đoán ban đầu nghĩ sẽ lỗi nhưng thực ra không lỗi
// vì const chỉ không cho gán lại biến, còn sửa bên trong array thì ok
console.log("\nĐoạn 4:");
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // đoán: [1, 2, 3, 4]

// Đoạn 5 - block scope của let
// mình đoán: trong block in 2, ngoài block in 1
console.log("\nĐoạn 5:");
let a = 1;
{
  let a = 2;
  console.log("Trong block:", a); // đoán: 2
}
console.log("Ngoài block:", a); // đoán: 1

/*
KẾT QUẢ SAU KHI CHẠY:
- Đoạn 1: undefined → đúng như đoán, var bị hoist lên đầu nhưng giá trị chưa gán
- Đoạn 2: ReferenceError → đúng, let có TDZ (temporal dead zone) không đọc được trước khi khai báo
- Đoạn 3: TypeError → đúng, const không cho gán lại
- Đoạn 4: [1,2,3,4] → lúc đầu mình nghĩ sẽ lỗi nhưng thực ra const chỉ khóa
  tham chiếu của biến thôi, không khóa nội dung bên trong object/array
- Đoạn 5: 2 rồi 1 → đúng, let có block scope nên 2 biến a khác nhau hoàn toàn
*/
