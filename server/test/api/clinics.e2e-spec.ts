import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Clinics API (e2e)', () => {
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

  describe('/clinics (GET)', () => {
    it('should return all clinics', () => {
      return request(app.getHttpServer())
        .get('/clinics')
        .expect(200)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
        });
    });

    it('should return clinics with correct structure', () => {
      return request(app.getHttpServer())
        .get('/clinics')
        .expect(200)
        .expect(res => {
          const clinic = res.body[0];
          expect(typeof clinic.id).toBe('number');
          expect(typeof clinic.name).toBe('string');
          expect(clinic.name).toMatch(/^(Salve Fertility|London IVF)$/);
        });
    });
  });

  describe('/clinics/names (GET)', () => {
    it('should return clinic names only', () => {
      return request(app.getHttpServer())
        .get('/clinics/names')
        .expect(200)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
          expect(res.body).toContain('Salve Fertility');
          expect(res.body).toContain('London IVF');
        });
    });

    it('should return only strings', () => {
      return request(app.getHttpServer())
        .get('/clinics/names')
        .expect(200)
        .expect(res => {
          res.body.forEach((name: any) => {
            expect(typeof name).toBe('string');
          });
        });
    });
  });

  describe('/clinics/:id (GET)', () => {
    it('should return clinic by id', () => {
      return request(app.getHttpServer())
        .get('/clinics/1')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('name');
          expect(typeof res.body.name).toBe('string');
        });
    });

    it('should return clinic by another id', () => {
      return request(app.getHttpServer())
        .get('/clinics/2')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', 2);
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should handle non-existent clinic id', () => {
      return request(app.getHttpServer()).get('/clinics/999').expect(404);
    });

    it('should validate clinic id parameter', () => {
      return request(app.getHttpServer()).get('/clinics/invalid').expect(400);
    });
  });
});
