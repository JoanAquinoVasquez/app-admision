import { MdPeople } from "react-icons/md";
import DashboardCard from "../../../components/Cards/DashboardCard";

const TotalInscritos = () => {
  return (
    <DashboardCard title="Total de Inscritos" icon={<MdPeople className="text-purple-500" />}>
      <p className="text-2xl font-semibold">1,250</p>
      <p className="text-gray-600">Estudiantes registrados</p>
    </DashboardCard>
  );
};

export default TotalInscritos;
