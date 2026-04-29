import { Card, CardHeader, CardBody } from "@heroui/react";

const DashboardCard = ({ icon, title, children, className = "p-4", actions, titleId, noHeader = false }) => {
  return (
    <Card shadow="sm" className="overflow-hidden border border-white/40 h-full flex flex-col">
      {!noHeader && (title || icon) && (
        <CardHeader className="flex items-center justify-between text-lg font-medium text-gray-800 bg-white/50 backdrop-blur-sm px-6 py-4 flex-none">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-xl">{icon}</span>}
            <span id={titleId}>{title}</span>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <CardBody className={`p-0 flex flex-col flex-1 overflow-hidden ${className}`}>
        {children}
      </CardBody>
    </Card>
  );
};

export default DashboardCard;
