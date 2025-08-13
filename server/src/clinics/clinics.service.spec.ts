import { Test, TestingModule } from '@nestjs/testing';

import { ClinicsService } from './clinics.service';

// Mock the entire modules
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('csv-parse/sync', () => ({
  parse: jest.fn(),
}));

describe('ClinicsService', () => {
  let service: ClinicsService;
  let mockReadFile: jest.MockedFunction<any>;
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
    const fs = require('fs/promises');
    const csvParse = require('csv-parse/sync');
    mockReadFile = fs.readFile;
    mockParse = csvParse.parse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all clinics', async () => {
      mockReadFile.mockResolvedValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findAll();

      expect(result).toEqual(mockClinicsData);
      expect(mockReadFile).toHaveBeenCalled();
      expect(mockParse).toHaveBeenCalled();
    });

    it('should handle file read errors', async () => {
      const errorMessage = 'File not found';
      mockReadFile.mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll()).rejects.toThrow(
        `Failed to read clinics data: ${errorMessage}`,
      );
    });
  });

  describe('findById', () => {
    it('should return clinic by id', async () => {
      mockReadFile.mockResolvedValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findById(1);

      expect(result).toEqual(mockClinicsData[0]);
    });

    it('should return null for non-existent id', async () => {
      mockReadFile.mockResolvedValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('getNames', () => {
    it('should return clinic names only', async () => {
      mockReadFile.mockResolvedValue('mock csv content');
      mockParse.mockReturnValue(mockClinicsData);

      const result = await service.getNames();

      expect(result).toEqual(['Salve Fertility', 'London IVF']);
    });
  });
});
