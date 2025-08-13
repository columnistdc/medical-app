import { Test, TestingModule } from '@nestjs/testing';

import { ClinicsService } from '../clinics';
import { PatientsService, Patient } from '../patients';

import { MedicalService } from './medical.service';

describe('MedicalService', () => {
  let service: MedicalService;
  let clinicsService: jest.Mocked<ClinicsService>;
  let patientsService: jest.Mocked<PatientsService>;

  const mockClinics = [
    { id: 1, name: 'Salve Fertility' },
    { id: 2, name: 'London IVF' },
  ];

  const mockPatients = [
    {
      id: 1,
      clinic_id: 1,
      first_name: 'Harriott',
      last_name: 'Wansbury',
      date_of_birth: '1961-10-16',
    },
    {
      id: 2,
      clinic_id: 1,
      first_name: 'Glennis',
      last_name: 'Eustis',
      date_of_birth: '1985-04-08',
    },
    {
      id: 1,
      clinic_id: 2,
      first_name: 'Emlynn',
      last_name: 'Tompkin',
      date_of_birth: '1964-10-02',
    },
    {
      id: 2,
      clinic_id: 2,
      first_name: 'Kenyon',
      last_name: 'Domleo',
      date_of_birth: '1960-05-24',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalService,
        {
          provide: ClinicsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: PatientsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MedicalService>(MedicalService);
    clinicsService = module.get(ClinicsService);
    patientsService = module.get(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getClinicsWithPatients', () => {
    it('should return clinics with their patients', async () => {
      clinicsService.findAll.mockResolvedValue(mockClinics);
      patientsService.findAll.mockResolvedValue(mockPatients);

      const result = await service.getClinicsWithPatients();

      expect(result).toHaveLength(2);

      // Check Salve Fertility clinic
      expect(result[0]).toEqual({
        id: 1,
        name: 'Salve Fertility',
        patients: mockPatients.filter(p => p.clinic_id === 1),
        patient_count: 2,
      });

      // Check London IVF clinic
      expect(result[1]).toEqual({
        id: 2,
        name: 'London IVF',
        patients: mockPatients.filter(p => p.clinic_id === 2),
        patient_count: 2,
      });
    });

    it('should handle clinic with no patients', async () => {
      const clinicsWithNoPatients = [{ id: 1, name: 'Empty Clinic' }];
      const emptyPatients: Patient[] = [];

      clinicsService.findAll.mockResolvedValue(clinicsWithNoPatients);
      patientsService.findAll.mockResolvedValue(emptyPatients);

      const result = await service.getClinicsWithPatients();

      expect(result[0]).toEqual({
        id: 1,
        name: 'Empty Clinic',
        patients: [],
        patient_count: 0,
      });
    });
  });

  describe('getPatientsWithClinicInfo', () => {
    it('should return patients with clinic names', async () => {
      clinicsService.findAll.mockResolvedValue(mockClinics);
      patientsService.findAll.mockResolvedValue(mockPatients);

      const result = await service.getPatientsWithClinicInfo();

      expect(result).toHaveLength(4);

      // Check first patient
      expect(result[0]).toEqual({
        ...mockPatients[0],
        clinic_name: 'Salve Fertility',
      });

      // Check patient from second clinic
      expect(result[2]).toEqual({
        ...mockPatients[2],
        clinic_name: 'London IVF',
      });
    });

    it('should handle unknown clinic_id gracefully', async () => {
      const patientsWithUnknownClinic = [
        {
          id: 1,
          clinic_id: 999,
          first_name: 'Unknown',
          last_name: 'Patient',
          date_of_birth: '1990-01-01',
        },
      ];

      clinicsService.findAll.mockResolvedValue(mockClinics);
      patientsService.findAll.mockResolvedValue(patientsWithUnknownClinic);

      const result = await service.getPatientsWithClinicInfo();

      expect(result[0]).toEqual({
        ...patientsWithUnknownClinic[0],
        clinic_name: 'Unknown Clinic',
      });
    });
  });

  describe('getClinicSummary', () => {
    it('should return comprehensive summary', async () => {
      clinicsService.findAll.mockResolvedValue(mockClinics);
      patientsService.findAll.mockResolvedValue(mockPatients);

      const result = await service.getClinicSummary();

      expect(result).toEqual({
        total_clinics: 2,
        total_patients: 4,
        clinics: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Salve Fertility',
            patient_count: 2,
          }),
          expect.objectContaining({
            id: 2,
            name: 'London IVF',
            patient_count: 2,
          }),
        ]),
      });
    });

    it('should calculate totals correctly', async () => {
      const singleClinic = [{ id: 1, name: 'Single Clinic' }];
      const singlePatient: Patient[] = [
        {
          id: 1,
          clinic_id: 1,
          first_name: 'Single',
          last_name: 'Patient',
          date_of_birth: '1990-01-01',
        },
      ];

      clinicsService.findAll.mockResolvedValue(singleClinic);
      patientsService.findAll.mockResolvedValue(singlePatient);

      const result = await service.getClinicSummary();

      expect(result.total_clinics).toBe(1);
      expect(result.total_patients).toBe(1);
      expect(result.clinics[0].patient_count).toBe(1);
    });
  });
});
