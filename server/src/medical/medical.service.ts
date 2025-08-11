import { Injectable } from "@nestjs/common";
import { ClinicsService, Clinic } from "../clinics";
import { PatientsService, Patient } from "../patients";

export interface ClinicWithPatients extends Clinic {
  patients: Patient[];
  patient_count: number;
}

export interface PatientWithClinic extends Patient {
  clinic_name: string;
}

@Injectable()
export class MedicalService {
  constructor(
    private readonly clinicsService: ClinicsService,
    private readonly patientsService: PatientsService,
  ) {}

  async getClinicsWithPatients(): Promise<ClinicWithPatients[]> {
    const clinics = await this.clinicsService.findAll();
    const patients = await this.patientsService.findAll();

    return clinics.map((clinic) => {
      const clinicPatients = patients.filter(
        (patient) => patient.clinic_id === clinic.id,
      );
      return {
        ...clinic,
        patients: clinicPatients,
        patient_count: clinicPatients.length,
      };
    });
  }

  async getPatientsWithClinicInfo(): Promise<PatientWithClinic[]> {
    const clinics = await this.clinicsService.findAll();
    const patients = await this.patientsService.findAll();

    const clinicMap = new Map<number, string>();
    clinics.forEach((clinic) => clinicMap.set(clinic.id, clinic.name));

    return patients.map((patient) => ({
      ...patient,
      clinic_name: clinicMap.get(patient.clinic_id) || "Unknown Clinic",
    }));
  }

  async getClinicSummary(): Promise<{
    total_clinics: number;
    total_patients: number;
    clinics: ClinicWithPatients[];
  }> {
    const clinicsWithPatients = await this.getClinicsWithPatients();
    const totalPatients = clinicsWithPatients.reduce(
      (sum, clinic) => sum + clinic.patient_count,
      0,
    );

    return {
      total_clinics: clinicsWithPatients.length,
      total_patients: totalPatients,
      clinics: clinicsWithPatients,
    };
  }
}
