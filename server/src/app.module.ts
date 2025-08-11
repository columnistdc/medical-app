import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClinicsModule } from "./clinics";
import { PatientsModule } from "./patients";
import { MedicalModule } from "./medical";

@Module({
  imports: [ClinicsModule, PatientsModule, MedicalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
