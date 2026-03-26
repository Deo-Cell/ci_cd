const express = require('express');
const router = express.Router();
const data = require('../data/students');

const validFields = ["Informatique", "Marketing", "Design", "Management"];

// GET /students/stats
router.get('/stats', (req, res) => {
  const students = data.getStudents();
  if (students.length === 0) {
    return res.status(200).json({
      totalStudents: 0,
      averageGrade: 0,
      studentsByField: {},
      bestStudent: null
    });
  }

  const totalStudents = students.length;
  const averageGrade = Number((students.reduce((acc, curr) => acc + curr.grade, 0) / totalStudents).toFixed(2));
  
  const studentsByField = students.reduce((acc, curr) => {
    acc[curr.field] = (acc[curr.field] || 0) + 1;
    return acc;
  }, {});

  const bestStudent = students.reduce((prev, current) => (prev.grade > current.grade) ? prev : current);

  res.status(200).json({
    totalStudents,
    averageGrade,
    studentsByField,
    bestStudent
  });
});

// GET /students/search?q=...
router.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q || q.trim() === '') {
    return res.status(400).json({ error: "Le paramètre 'q' est requis" });
  }

  const term = q.toLowerCase();
  const students = data.getStudents();
  const results = students.filter(s => 
    s.firstName.toLowerCase().includes(term) || 
    s.lastName.toLowerCase().includes(term)
  );

  res.status(200).json(results);
});

// GET /students
router.get('/', (req, res) => {
  const students = data.getStudents();
  const { page, limit } = req.query;

  if (page && limit) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    return res.status(200).json(students.slice(startIndex, endIndex));
  }

  res.status(200).json(students);
});

// GET /students/:id
router.get('/:id', (req, res) => {
  const idStr = req.params.id;
  if (isNaN(idStr)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  const id = parseInt(idStr);
  const students = data.getStudents();
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Étudiant non trouvé" });
  }

  res.status(200).json(student);
});

// Helper validation
function validateStudentInput(body, currentId = null) {
  const { firstName, lastName, email, grade, field } = body;

  if (!firstName || !lastName || email === undefined || grade === undefined || !field) {
    return "Tous les champs sont obligatoires";
  }

  if (firstName.length < 2 || lastName.length < 2) {
    return "Le nom et le prénom doivent contenir au moins 2 caractères";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "L'email n'est pas valide";
  }

  if (typeof grade !== 'number' || grade < 0 || grade > 20) {
    return "La note doit être un nombre entre 0 et 20";
  }

  if (!validFields.includes(field)) {
    return "La filière n'est pas autorisée";
  }

  const students = data.getStudents();
  const emailExists = students.find(s => s.email === email && s.id !== currentId);
  if (emailExists) {
    return "email_exists";
  }

  return null;
}

// POST /students
router.post('/', (req, res) => {
  const error = validateStudentInput(req.body);
  
  if (error === "email_exists") {
    return res.status(409).json({ error: "Cet email est déjà pris" });
  } else if (error) {
    return res.status(400).json({ error });
  }

  const students = data.getStudents();
  const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = { id: newId, ...req.body };
  
  students.push(newStudent);
  res.status(200).json(newStudent);
});

// PUT /students/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  const students = data.getStudents();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Étudiant non trouvé" });
  }

  const error = validateStudentInput(req.body, id);
  
  if (error === "email_exists") {
    return res.status(409).json({ error: "Cet email est déjà pris" });
  } else if (error) {
    return res.status(400).json({ error });
  }

  const updatedStudent = { id, ...req.body };
  students[index] = updatedStudent;

  res.status(200).json(updatedStudent);
});

// DELETE /students/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  const students = data.getStudents();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Étudiant non trouvé" });
  }

  students.splice(index, 1);
  res.status(200).json({ message: "Étudiant supprimé avec succès" });
});

module.exports = router;
