import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Clinic {
  id: number;
  name: string;
}

@Injectable()
export class ClinicsService {
  private readonly dataPath = join(__dirname, '../../data/clinics.csv');

  async findAll(): Promise<Clinic[]> {
    try {
      const fileContent = readFileSync(this.dataPath, 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === 'id') {
            return parseInt(value, 10);
          }
          return value;
        },
      });

      return records.map((record: any) => ({
        id: record.id,
        name: record.name,
      }));
    } catch (error) {
      throw new Error(`Failed to read clinics data: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Clinic | null> {
    const clinics = await this.findAll();
    const clinic = clinics.find(clinic => clinic.id === id);
    return clinic || null;
  }

  async getNames(): Promise<string[]> {
    const clinics = await this.findAll();
    return clinics.map(clinic => clinic.name);
  }
}
