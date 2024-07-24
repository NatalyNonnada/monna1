import { AndLayout } from "../components/layout/AndLayout";
import { BannerHome, HomeService } from "../components";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <AndLayout title={"MONNA | Agenda online"} pageDescription={"Agenda aquí tu próxima cita con Monna Beauty Studio, especialistas en Acrilicas esculpidas y extensiones de pestañas"}>
      <Container>
        <BannerHome />
        <HomeService />
      </Container>
    </AndLayout>
  );
}
