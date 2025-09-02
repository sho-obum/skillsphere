import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', title, message, onClose, className = '' }) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
      messageColor: 'text-green-200',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      messageColor: 'text-red-200',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
      messageColor: 'text-yellow-200',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      messageColor: 'text-blue-200',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${title ? 'mt-1' : ''} ${config.messageColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${config.messageColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
