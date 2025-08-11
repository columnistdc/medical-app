import { Module } from "@nestjs/common";
import { MedicalController } from "./medical.controller";
import { MedicalService } from "./medical.service";
import { ClinicsModule } from "../clinics";
import { PatientsModule } from "../patients";

@Module({
  imports: [ClinicsModule, PatientsModule],
  controllers: [MedicalController],
  providers: [MedicalService],
  exports: [MedicalService],
})
export class MedicalModule {}
