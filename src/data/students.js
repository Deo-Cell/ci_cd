const initialStudents = [
  { id: 1, firstName: "Alice", lastName: "Dupont", email: "alice@test.com", grade: 15.5, field: "Informatique" },
  { id: 2, firstName: "Bob", lastName: "Martin", email: "bob@test.com", grade: 12, field: "Marketing" },
  { id: 3, firstName: "Charlie", lastName: "Durand", email: "charlie@test.com", grade: 18, field: "Design" },
  { id: 4, firstName: "Diana", lastName: "Leroy", email: "diana@test.com", grade: 9, field: "Informatique" },
  { id: 5, firstName: "Eve", lastName: "Moreau", email: "eve@test.com", grade: 20, field: "Management" }
];

let students = JSON.parse(JSON.stringify(initialStudents));

function getStudents() {
  return students;
}

function resetStudents() {
  students = JSON.parse(JSON.stringify(initialStudents));
}

function setStudents(newStudents) {
  students = newStudents;
}

module.exports = {
  getStudents,
  resetStudents,
  setStudents
};
