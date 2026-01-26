import { Card, CardHeader, CardBody } from "@nextui-org/react";

const DashboardCard = ({ icon, title, children }) => {
  return (
    <Card shadow="sm">
      <CardHeader className="flex items-center text-lg font-medium text-gray-800">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export default DashboardCard;
