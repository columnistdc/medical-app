import { readFile } from 'fs/promises';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

import { SortParamsDto } from './dto/sort-params.dto';

export interface Patient {
  id: number;
  clinic_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

@Injectable()
export class PatientsService {
  private readonly dataPath1 = join(__dirname, '../../data/patients-1.csv');
  private readonly dataPath2 = join(__dirname, '../../data/patients-2.csv');

  async findAll(sortParams?: SortParamsDto): Promise<Patient[]> {
    try {
      const patients1 = await this.readPatientsFile(this.dataPath1);
      const patients2 = await this.readPatientsFile(this.dataPath2);

      const allPatients = [...patients1, ...patients2];

      if (sortParams?.sortBy) {
        return this.sortPatients(allPatients, sortParams);
      }

      return allPatients;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read patients data: ${errorMessage}`);
    }
  }

  async findByClinicId(clinicId: number, sortParams?: SortParamsDto): Promise<Patient[]> {
    const allPatients = await this.findAll();
    const filteredPatients = allPatients.filter(patient => patient.clinic_id === clinicId);

    if (sortParams?.sortBy) {
      return this.sortPatients(filteredPatients, sortParams);
    }

    return filteredPatients;
  }

  async findById(id: number): Promise<Patient | null> {
    const allPatients = await this.findAll();
    const patient = allPatients.find(patient => patient.id === id);
    return patient ?? null;
  }

  async getPatientsByClinicName(
    clinicName?: string,
    sortParams?: SortParamsDto,
  ): Promise<Patient[]> {
    if (!clinicName) {
      return [];
    }

    // Map clinic names to IDs
    const clinicIdMap: { [key: string]: number } = {
      'Salve Fertility': 1,
      'London IVF': 2,
    };

    const clinicId = clinicIdMap[clinicName];
    if (!clinicId) {
      throw new Error(`Clinic not found: ${clinicName}`);
    }

    return this.findByClinicId(clinicId, sortParams);
  }

  async getPatientCountByClinic(): Promise<{ clinic_id: number; count: number }[]> {
    const allPatients = await this.findAll();
    const clinicCounts = new Map<number, number>();

    allPatients.forEach(patient => {
      const currentCount = clinicCounts.get(patient.clinic_id) ?? 0;
      clinicCounts.set(patient.clinic_id, currentCount + 1);
    });

    return Array.from(clinicCounts.entries()).map(([clinic_id, count]) => ({
      clinic_id,
      count,
    }));
  }

  private sortPatients(patients: Patient[], sortParams: SortParamsDto): Patient[] {
    const { sortBy, sortOrder = 'asc' } = sortParams;

    if (!sortBy) {
      return patients;
    }

    return [...patients].sort((a, b) => {
      const aValue = a[sortBy as keyof Patient];
      const bValue = b[sortBy as keyof Patient];

      let aCompare: string | number;
      let bCompare: string | number;

      // Handle numeric fields
      if (sortBy === 'id' || sortBy === 'clinic_id') {
        aCompare = Number(aValue);
        bCompare = Number(bValue);
      }
      // Handle date fields
      else if (sortBy === 'date_of_birth') {
        aCompare = new Date(aValue as string | number | Date).getTime();
        bCompare = new Date(bValue as string | number | Date).getTime();
      }
      // Handle string fields
      else {
        aCompare = String(aValue).toLowerCase();
        bCompare = String(bValue).toLowerCase();
      }

      let comparison = 0;
      if (aCompare < bCompare) {
        comparison = -1;
      } else if (aCompare > bCompare) {
        comparison = 1;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private async readPatientsFile(filePath: string): Promise<Patient[]> {
    const fileContent = await readFile(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === 'id' || context.column === 'clinic_id') {
          return parseInt(value, 10);
        }
        return value;
      },
    });

    return records.map((record: Record<string, unknown>) => ({
      id: record.id as number,
      clinic_id: record.clinic_id as number,
      first_name: record.first_name as string,
      last_name: record.last_name as string,
      date_of_birth: record.date_of_birth as string,
    }));
  }
}
