import React from "react";

interface CardHeaderProps {
  icon?: string;
  title: string;
  className?: string;
  length?: number;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  className = "",
  length,
}) => {
  return (
    <div className={`card-header ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        {icon && <span className="text-xl mr-2">{icon}</span>}
        {title}
      {length ? (
        <span className="ml-2 text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {length}
        </span>
      ) : (
        <></>
      )}
      </h3>
    </div>
  );
};

export default CardHeader;
