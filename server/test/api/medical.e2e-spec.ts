import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Medical API (e2e)', () => {
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

  describe('/medical/clinics-with-patients (GET)', () => {
    it('should return clinics with their patients', () => {
      return request(app.getHttpServer())
        .get('/medical/clinics-with-patients')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
          
          // Check first clinic structure
          const firstClinic = res.body[0];
          expect(firstClinic).toHaveProperty('id');
          expect(firstClinic).toHaveProperty('name');
          expect(firstClinic).toHaveProperty('patients');
          expect(firstClinic).toHaveProperty('patient_count');
          expect(Array.isArray(firstClinic.patients)).toBe(true);
          expect(typeof firstClinic.patient_count).toBe('number');
        });
    });

    it('should return correct patient counts', () => {
      return request(app.getHttpServer())
        .get('/medical/clinics-with-patients')
        .expect(200)
        .expect((res) => {
          const clinic1 = res.body.find((clinic: any) => clinic.id === 1);
          const clinic2 = res.body.find((clinic: any) => clinic.id === 2);
          
          expect(clinic1.patient_count).toBeGreaterThan(0);
          expect(clinic2.patient_count).toBeGreaterThan(0);
          expect(clinic1.patients.length).toBe(clinic1.patient_count);
          expect(clinic2.patients.length).toBe(clinic2.patient_count);
        });
    });

    it('should have patients with correct clinic_id', () => {
      return request(app.getHttpServer())
        .get('/medical/clinics-with-patients')
        .expect(200)
        .expect((res) => {
          res.body.forEach((clinic: any) => {
            clinic.patients.forEach((patient: any) => {
              expect(patient.clinic_id).toBe(clinic.id);
            });
          });
        });
    });
  });

  describe('/medical/patients-with-clinic (GET)', () => {
    it('should return patients with clinic information', () => {
      return request(app.getHttpServer())
        .get('/medical/patients-with-clinic')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          
          const patient = res.body[0];
          expect(patient).toHaveProperty('id');
          expect(patient).toHaveProperty('clinic_id');
          expect(patient).toHaveProperty('first_name');
          expect(patient).toHaveProperty('last_name');
          expect(patient).toHaveProperty('date_of_birth');
          expect(patient).toHaveProperty('clinic_name');
          expect(typeof patient.clinic_name).toBe('string');
        });
    });

    it('should have valid clinic names', () => {
      return request(app.getHttpServer())
        .get('/medical/patients-with-clinic')
        .expect(200)
        .expect((res) => {
          const clinicNames = res.body.map((patient: any) => patient.clinic_name);
          expect(clinicNames).toContain('Salve Fertility');
          expect(clinicNames).toContain('London IVF');
        });
    });

    it('should match clinic_id with clinic_name', () => {
      return request(app.getHttpServer())
        .get('/medical/patients-with-clinic')
        .expect(200)
        .expect((res) => {
          const clinic1Patients = res.body.filter((patient: any) => patient.clinic_id === 1);
          const clinic2Patients = res.body.filter((patient: any) => patient.clinic_id === 2);
          
          clinic1Patients.forEach((patient: any) => {
            expect(patient.clinic_name).toBe('Salve Fertility');
          });
          
          clinic2Patients.forEach((patient: any) => {
            expect(patient.clinic_name).toBe('London IVF');
          });
        });
    });
  });

  describe('/medical/summary (GET)', () => {
    it('should return comprehensive summary', () => {
      return request(app.getHttpServer())
        .get('/medical/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total_clinics');
          expect(res.body).toHaveProperty('total_patients');
          expect(res.body).toHaveProperty('clinics');
          
          expect(typeof res.body.total_clinics).toBe('number');
          expect(typeof res.body.total_patients).toBe('number');
          expect(Array.isArray(res.body.clinics)).toBe(true);
        });
    });

    it('should have correct totals', () => {
      return request(app.getHttpServer())
        .get('/medical/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body.total_clinics).toBe(2);
          expect(res.body.total_patients).toBeGreaterThan(0);
          expect(res.body.clinics.length).toBe(res.body.total_clinics);
        });
    });

    it('should calculate total patients correctly', () => {
      return request(app.getHttpServer())
        .get('/medical/summary')
        .expect(200)
        .expect((res) => {
          const calculatedTotal = res.body.clinics.reduce((sum: number, clinic: any) => {
            return sum + clinic.patient_count;
          }, 0);
          
          expect(calculatedTotal).toBe(res.body.total_patients);
        });
    });

    it('should have clinics with complete information', () => {
      return request(app.getHttpServer())
        .get('/medical/summary')
        .expect(200)
        .expect((res) => {
          res.body.clinics.forEach((clinic: any) => {
            expect(clinic).toHaveProperty('id');
            expect(clinic).toHaveProperty('name');
            expect(clinic).toHaveProperty('patients');
            expect(clinic).toHaveProperty('patient_count');
            expect(Array.isArray(clinic.patients)).toBe(true);
            expect(clinic.patients.length).toBe(clinic.patient_count);
          });
        });
    });
  });
});
