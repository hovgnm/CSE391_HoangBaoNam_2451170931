const students = [
  { name: "An", math: 8, physics: 7, cs: 9, gender: "M" },
  { name: "Bình", math: 6, physics: 9, cs: 7, gender: "F" },
  { name: "Chi", math: 9, physics: 6, cs: 8, gender: "F" },
  { name: "Dũng", math: 5, physics: 5, cs: 6, gender: "M" },
  { name: "Em", math: 10, physics: 8, cs: 9, gender: "F" },
  { name: "Phong", math: 3, physics: 4, cs: 5, gender: "M" },
  { name: "Giang", math: 7, physics: 7, cs: 7, gender: "F" },
  { name: "Huy", math: 4, physics: 6, cs: 3, gender: "M" },
];

// 1. tinh diem trung binh va xep loai cho tung sinh vien
for (let i = 0; i < students.length; i++) {
  let sv = students[i];
  sv.avg = sv.math * 0.4 + sv.physics * 0.3 + sv.cs * 0.3;
  sv.avg = Math.round(sv.avg * 10) / 10; // lam tron 1 chu so thap phan

  if (sv.avg >= 8.0) {
    sv.rank = "Giỏi";
  } else if (sv.avg >= 6.5) {
    sv.rank = "Khá";
  } else if (sv.avg >= 5.0) {
    sv.rank = "Trung bình";
  } else {
    sv.rank = "Yếu";
  }
}

// 3. in bang ket qua
console.log("| STT | Tên    | TB   | Xếp loại    |");
console.log("|-----|--------|------|-------------|");
for (let i = 0; i < students.length; i++) {
  let sv = students[i];
  // can chinh cho dep mot chut
  let stt = String(i + 1).padEnd(3);
  let ten = sv.name.padEnd(6);
  let tb = String(sv.avg).padEnd(4);
  let xeploai = sv.rank.padEnd(11);
  console.log(`| ${stt} | ${ten} | ${tb} | ${xeploai} |`);
}

// 4. dem so sv moi xep loai
let gioi = 0,
  kha = 0,
  trungbinh = 0,
  yeu = 0;
for (let i = 0; i < students.length; i++) {
  if (students[i].rank == "Giỏi") gioi++;
  else if (students[i].rank == "Khá") kha++;
  else if (students[i].rank == "Trung bình") trungbinh++;
  else yeu++;
}
console.log("\nSố lượng theo xếp loại:");
console.log("Giỏi:", gioi);
console.log("Khá:", kha);
console.log("Trung bình:", trungbinh);
console.log("Yếu:", yeu);

// 5. tim sv cao nhat va thap nhat
let max = students[0];
let min = students[0];
for (let i = 1; i < students.length; i++) {
  if (students[i].avg > max.avg) max = students[i];
  if (students[i].avg < min.avg) min = students[i];
}
console.log("\nSV điểm cao nhất:", max.name, "-", max.avg);
console.log("SV điểm thấp nhất:", min.name, "-", min.avg);

// 6. diem tb toan lop theo tung mon
let tongMath = 0,
  tongPhysics = 0,
  tongCs = 0;
for (let i = 0; i < students.length; i++) {
  tongMath += students[i].math;
  tongPhysics += students[i].physics;
  tongCs += students[i].cs;
}
console.log("\nĐiểm TB toàn lớp:");
console.log("Toán:", Math.round((tongMath / students.length) * 10) / 10);
console.log("Lý:", Math.round((tongPhysics / students.length) * 10) / 10);
console.log("CNTT:", Math.round((tongCs / students.length) * 10) / 10);

// 7. bonus: diem tb theo gioi tinh
let tongNam = 0,
  soNam = 0,
  tongNu = 0,
  soNu = 0;
for (let i = 0; i < students.length; i++) {
  if (students[i].gender == "M") {
    tongNam += students[i].avg;
    soNam++;
  } else {
    tongNu += students[i].avg;
    soNu++;
  }
}
console.log("\nBonus - Điểm TB theo giới tính:");
console.log("Nam:", Math.round((tongNam / soNam) * 10) / 10);
console.log("Nữ:", Math.round((tongNu / soNu) * 10) / 10);
