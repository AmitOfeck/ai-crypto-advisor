import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  headerAction,
}) => {
  const isFlexLayout = className.includes('flex');
  
  return (
    <div
      className={`
        bg-slate-800 rounded-xl
        border border-slate-700
        shadow-lg hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        ${className}
      `}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={`p-6 ${isFlexLayout ? 'flex flex-col flex-grow min-h-0' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;

