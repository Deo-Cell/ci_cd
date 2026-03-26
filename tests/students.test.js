const request = require('supertest');
const app = require('../src/app');
const data = require('../src/data/students');

describe('API Students', () => {
  beforeEach(() => {
    data.resetStudents();
  });

  // GET Tests de lecture (5)
  it('1. GET /students doit renvoyer 200 et un tableau', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('2. GET /students doit renvoyer tous les étudiants initiaux', async () => {
    const res = await request(app).get('/students');
    expect(res.body.length).toBe(5);
  });

  it('3. GET /students/:id valide doit renvoyer l\'étudiant correspondant', async () => {
    const res = await request(app).get('/students/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.firstName).toBe("Alice");
  });

  it('4. GET /students/:id inexistant doit renvoyer 404', async () => {
    const res = await request(app).get('/students/999');
    expect(res.statusCode).toBe(404);
  });

  it('5. GET /students/:id invalide doit renvoyer 400', async () => {
    const res = await request(app).get('/students/abc');
    expect(res.statusCode).toBe(400);
  });

  // POST Tests de création (4)
  it('6. POST avec données valides doit renvoyer 201 + étudiant avec ID', async () => {
    const newStudent = {
      firstName: "Jean", lastName: "Valjean", email: "jean@test.com", grade: 14, field: "Marketing"
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstName).toBe("Jean");
  });

  it('7. POST sans champ obligatoire doit renvoyer 400', async () => {
    const invalidStudent = { firstName: "Jean" }; // Missing fields
    const res = await request(app).post('/students').send(invalidStudent);
    expect(res.statusCode).toBe(400);
  });

  it('8. POST avec note invalide doit renvoyer 400', async () => {
    const invalidStudent = {
      firstName: "Jean", lastName: "Valjean", email: "jean2@test.com", grade: 25, field: "Marketing"
    };
    const res = await request(app).post('/students').send(invalidStudent);
    expect(res.statusCode).toBe(400);
  });

  it('9. POST avec email déjà existant doit renvoyer 409', async () => {
    const duplicateStudent = {
      firstName: "Alice", lastName: "Clone", email: "alice@test.com", grade: 15, field: "Informatique"
    };
    const res = await request(app).post('/students').send(duplicateStudent);
    expect(res.statusCode).toBe(409);
  });

  // PUT Tests de modification (2)
  it('10. PUT avec données valides doit renvoyer 200 + l\'étudiant modifié', async () => {
    const updatedStudent = {
      firstName: "AliceUpdated", lastName: "Dupont", email: "alice@test.com", grade: 16, field: "Informatique"
    };
    const res = await request(app).put('/students/1').send(updatedStudent);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("AliceUpdated");
  });

  it('11. PUT avec ID inexistant doit renvoyer 404', async () => {
    const updatedStudent = {
      firstName: "Ghost", lastName: "Rider", email: "ghost@test.com", grade: 16, field: "Informatique"
    };
    const res = await request(app).put('/students/999').send(updatedStudent);
    expect(res.statusCode).toBe(404);
  });

  // DELETE Tests de suppression (2)
  it('12. DELETE avec ID valide doit renvoyer 200', async () => {
    const res = await request(app).delete('/students/1');
    expect(res.statusCode).toBe(200);
    const verify = await request(app).get('/students/1');
    expect(verify.statusCode).toBe(404);
  });

  it('13. DELETE avec ID inexistant doit renvoyer 404', async () => {
    const res = await request(app).delete('/students/999');
    expect(res.statusCode).toBe(404);
  });

  // GET Tests stats & search (2)
  it('14. GET /students/stats doit renvoyer les statistiques', async () => {
    const res = await request(app).get('/students/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalStudents');
    expect(res.body).toHaveProperty('averageGrade');
    expect(res.body).toHaveProperty('studentsByField');
    expect(res.body).toHaveProperty('bestStudent');
  });

  it('15. GET /students/search?q=... doit renvoyer les étudiants correspondants', async () => {
    const res = await request(app).get('/students/search?q=alice');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].firstName.toLowerCase()).toContain("alice");
  });
});
