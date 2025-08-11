import { ApiProperty } from "@nestjs/swagger";
import { ClinicDto } from "../../clinics";
import { PatientDto } from "../../patients";

export class ClinicWithPatientsDto extends ClinicDto {
  @ApiProperty({
    description: "List of patients in this clinic",
    type: [PatientDto],
  })
  patients: PatientDto[];

  @ApiProperty({
    description: "Number of patients in this clinic",
    example: 4,
  })
  patient_count: number;
}

export class PatientWithClinicDto extends PatientDto {
  @ApiProperty({
    description: "Name of the clinic the patient belongs to",
    example: "Salve Fertility",
  })
  clinic_name: string;
}

export class ClinicSummaryDto {
  @ApiProperty({
    description: "Total number of clinics",
    example: 2,
  })
  total_clinics: number;

  @ApiProperty({
    description: "Total number of patients across all clinics",
    example: 7,
  })
  total_patients: number;

  @ApiProperty({
    description: "List of clinics with their patients",
    type: [ClinicWithPatientsDto],
  })
  clinics: ClinicWithPatientsDto[];
}
