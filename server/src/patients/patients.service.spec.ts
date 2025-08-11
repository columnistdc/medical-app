import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';

// Mock the entire modules
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('csv-parse/sync', () => ({
  parse: jest.fn(),
}));

describe('PatientsService', () => {
  let service: PatientsService;
  let mockReadFileSync: jest.MockedFunction<any>;
  let mockParse: jest.MockedFunction<any>;

  const mockPatients1Data = [
    { id: 1, clinic_id: 1, first_name: 'Harriott', last_name: 'Wansbury', date_of_birth: '1961-10-16' },
    { id: 2, clinic_id: 1, first_name: 'Glennis', last_name: 'Eustis', date_of_birth: '1985-04-08' },
  ];

  const mockPatients2Data = [
    { id: 1, clinic_id: 2, first_name: 'Emlynn', last_name: 'Tompkin', date_of_birth: '1964-10-02' },
    { id: 2, clinic_id: 2, first_name: 'Kenyon', last_name: 'Domleo', date_of_birth: '1960-05-24' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsService],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    
    // Get the mocked functions
    const fs = require('fs');
    const csvParse = require('csv-parse/sync');
    mockReadFileSync = fs.readFileSync;
    mockParse = csvParse.parse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all patients from both files', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.findAll();

      expect(result).toHaveLength(4);
      expect(result).toEqual([...mockPatients1Data, ...mockPatients2Data]);
      expect(mockReadFileSync).toHaveBeenCalledTimes(2);
      expect(mockParse).toHaveBeenCalledTimes(2);
    });

    it('should handle file read errors', async () => {
      const errorMessage = 'File not found';
      mockReadFileSync.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(service.findAll()).rejects.toThrow(
        `Failed to read patients data: ${errorMessage}`,
      );
    });
  });

  describe('findByClinicId', () => {
    it('should return patients for specific clinic', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.findByClinicId(1);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockPatients1Data);
      expect(result.every(patient => patient.clinic_id === 1)).toBe(true);
    });

    it('should return empty array for non-existent clinic', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.findByClinicId(999);

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return patient by id', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.findById(1);

      expect(result).toEqual(mockPatients1Data[0]);
    });

    it('should return null for non-existent id', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('getPatientsByClinicName', () => {
    it('should return patients for Salve Fertility clinic', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.getPatientsByClinicName('Salve Fertility');

      expect(result).toHaveLength(2);
      expect(result.every(patient => patient.clinic_id === 1)).toBe(true);
    });

    it('should return patients for London IVF clinic', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.getPatientsByClinicName('London IVF');

      expect(result).toHaveLength(2);
      expect(result.every(patient => patient.clinic_id === 2)).toBe(true);
    });

    it('should throw error for unknown clinic name', async () => {
      await expect(service.getPatientsByClinicName('Unknown Clinic')).rejects.toThrow(
        'Clinic not found: Unknown Clinic',
      );
    });
  });

  describe('getPatientCountByClinic', () => {
    it('should return patient count for each clinic', async () => {
      mockReadFileSync
        .mockReturnValueOnce('mock csv content 1')
        .mockReturnValueOnce('mock csv content 2');
      mockParse
        .mockReturnValueOnce(mockPatients1Data)
        .mockReturnValueOnce(mockPatients2Data);

      const result = await service.getPatientCountByClinic();

      expect(result).toEqual([
        { clinic_id: 1, count: 2 },
        { clinic_id: 2, count: 2 },
      ]);
    });
  });
});
