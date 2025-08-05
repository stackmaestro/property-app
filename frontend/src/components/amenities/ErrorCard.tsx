import React from 'react';
import { Card, CardBody } from '../globals/Card';
import Button from '../globals/Button';

interface ErrorCardProps {
  error: {
    message: string;
  };
  onStartOver: () => void;
  title?: string;
  icon?: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  onStartOver,
  title = "Error Loading Suggestions",
  icon = "❌"
}) => {
  return (
    <Card>
      <CardBody className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={onStartOver} variant="secondary">
          Start Over
        </Button>
      </CardBody>
    </Card>
  );
};

export default ErrorCard;