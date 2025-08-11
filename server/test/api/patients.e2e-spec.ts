import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Patients API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/patients (GET)', () => {
    it('should return all patients', () => {
      return request(app.getHttpServer())
        .get('/patients')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('clinic_id');
          expect(res.body[0]).toHaveProperty('first_name');
          expect(res.body[0]).toHaveProperty('last_name');
          expect(res.body[0]).toHaveProperty('date_of_birth');
        });
    });

    it('should return patients with correct structure', () => {
      return request(app.getHttpServer())
        .get('/patients')
        .expect(200)
        .expect((res) => {
          const patient = res.body[0];
          expect(typeof patient.id).toBe('number');
          expect(typeof patient.clinic_id).toBe('number');
          expect(typeof patient.first_name).toBe('string');
          expect(typeof patient.last_name).toBe('string');
          expect(typeof patient.date_of_birth).toBe('string');
        });
    });

    it('should sort patients by first_name ascending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=first_name&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by first_name ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].first_name.localeCompare(res.body[i + 1].first_name)).toBeLessThanOrEqual(0);
          }
        });
    });

    it('should sort patients by first_name descending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=first_name&sortOrder=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by first_name descending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].first_name.localeCompare(res.body[i + 1].first_name)).toBeGreaterThanOrEqual(0);
          }
        });
    });

    it('should sort patients by last_name ascending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=last_name&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by last_name ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].last_name.localeCompare(res.body[i + 1].last_name)).toBeLessThanOrEqual(0);
          }
        });
    });

    it('should sort patients by date_of_birth ascending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=date_of_birth&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by date_of_birth ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            const currentDate = new Date(res.body[i].date_of_birth);
            const nextDate = new Date(res.body[i + 1].date_of_birth);
            expect(currentDate.getTime()).toBeLessThanOrEqual(nextDate.getTime());
          }
        });
    });

    it('should sort patients by date_of_birth descending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=date_of_birth&sortOrder=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by date_of_birth descending
          for (let i = 0; i < res.body.length - 1; i++) {
            const currentDate = new Date(res.body[i].date_of_birth);
            const nextDate = new Date(res.body[i + 1].date_of_birth);
            expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
          }
        });
    });

    it('should sort patients by clinic_id ascending', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=clinic_id&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by clinic_id ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].clinic_id).toBeLessThanOrEqual(res.body[i + 1].clinic_id);
          }
        });
    });

    it('should use default sort order (asc) when not specified', () => {
      return request(app.getHttpServer())
        .get('/patients?sortBy=first_name')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          // Check if sorted by first_name ascending (default)
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].first_name.localeCompare(res.body[i + 1].first_name)).toBeLessThanOrEqual(0);
          }
        });
    });
  });

  describe('/patients/clinic/:clinicId (GET)', () => {
    it('should return patients for clinic 1', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 1)).toBe(true);
        });
    });

    it('should return patients for clinic 2', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/2')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 2)).toBe(true);
        });
    });

    it('should return empty array for non-existent clinic', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/999')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should sort patients by clinic 1 by first_name ascending', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/1?sortBy=first_name&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 1)).toBe(true);
          
          // Check if sorted by first_name ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].first_name.localeCompare(res.body[i + 1].first_name)).toBeLessThanOrEqual(0);
          }
        });
    });

    it('should sort patients by clinic 2 by last_name descending', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/2?sortBy=last_name&sortOrder=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 2)).toBe(true);
          
          // Check if sorted by last_name descending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].last_name.localeCompare(res.body[i + 1].last_name)).toBeGreaterThanOrEqual(0);
          }
        });
    });

    it('should validate clinic id parameter', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic/invalid')
        .expect(400);
    });
  });

  describe('/patients/clinic-name (GET)', () => {
    it('should return patients for Salve Fertility', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic-name?name=Salve Fertility')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((patient: any) => {
            expect(patient.clinic_id).toBe(1);
          });
        });
    });

    it('should return patients for London IVF', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic-name?name=London IVF')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((patient: any) => {
            expect(patient.clinic_id).toBe(2);
          });
        });
    });

    it('should handle missing name parameter', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic-name')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should sort patients by Salve Fertility clinic by date_of_birth ascending', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic-name?name=Salve Fertility&sortBy=date_of_birth&sortOrder=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 1)).toBe(true);
          
          // Check if sorted by date_of_birth ascending
          for (let i = 0; i < res.body.length - 1; i++) {
            const currentDate = new Date(res.body[i].date_of_birth);
            const nextDate = new Date(res.body[i + 1].date_of_birth);
            expect(currentDate.getTime()).toBeLessThanOrEqual(nextDate.getTime());
          }
        });
    });

    it('should sort patients by London IVF clinic by id descending', () => {
      return request(app.getHttpServer())
        .get('/patients/clinic-name?name=London IVF&sortBy=id&sortOrder=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every((patient: any) => patient.clinic_id === 2)).toBe(true);
          
          // Check if sorted by id descending
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].id).toBeGreaterThanOrEqual(res.body[i + 1].id);
          }
        });
    });
  });

  describe('/patients/count-by-clinic (GET)', () => {
    it('should return patient count for each clinic', () => {
      return request(app.getHttpServer())
        .get('/patients/count-by-clinic')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
          
          const clinic1 = res.body.find((item: any) => item.clinic_id === 1);
          const clinic2 = res.body.find((item: any) => item.clinic_id === 2);
          
          expect(clinic1).toHaveProperty('count');
          expect(clinic2).toHaveProperty('count');
          expect(typeof clinic1.count).toBe('number');
          expect(typeof clinic2.count).toBe('number');
        });
    });
  });

  describe('/patients/:id (GET)', () => {
    it('should return patient by id', () => {
      return request(app.getHttpServer())
        .get('/patients/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('clinic_id');
          expect(res.body).toHaveProperty('first_name');
          expect(res.body).toHaveProperty('last_name');
          expect(res.body).toHaveProperty('date_of_birth');
        });
    });

    it('should handle non-existent patient id', () => {
      return request(app.getHttpServer())
        .get('/patients/999')
        .expect(404);
    });

    it('should validate patient id parameter', () => {
      return request(app.getHttpServer())
        .get('/patients/invalid')
        .expect(400);
    });
  });
});
