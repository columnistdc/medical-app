import { Test, TestingModule } from '@nestjs/testing';
import { ClinicsService } from './clinics.service';

// Mock the entire modules
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('csv-parse/sync', () => ({
  parse: jest.fn(),
}));

describe('ClinicsService', () => {
  let service: ClinicsService;
  let mockReadFileSync: jest.MockedFunction<any>;
  let mockParse: jest.MockedFunction<any>;

  const mockClinicsData = [
    { id: 1, name: 'Salve Fertility' },
    { id: 2, name: 'London IVF' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicsService],
    }).compile();

    service = module.get<ClinicsService>(ClinicsService);
    
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
    it('should return all clinics', async () => {
      mockReadFileSync.mockReturnValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findAll();

      expect(result).toEqual(mockClinicsData);
      expect(mockReadFileSync).toHaveBeenCalled();
      expect(mockParse).toHaveBeenCalled();
    });

    it('should handle file read errors', async () => {
      const errorMessage = 'File not found';
      mockReadFileSync.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(service.findAll()).rejects.toThrow(
        `Failed to read clinics data: ${errorMessage}`,
      );
    });
  });

  describe('findById', () => {
    it('should return clinic by id', async () => {
      mockReadFileSync.mockReturnValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findById(1);

      expect(result).toEqual(mockClinicsData[0]);
    });

    it('should return null for non-existent id', async () => {
      mockReadFileSync.mockReturnValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('getNames', () => {
    it('should return clinic names only', async () => {
      mockReadFileSync.mockReturnValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.getNames();

      expect(result).toEqual(['Salve Fertility', 'London IVF']);
    });
  });
});
