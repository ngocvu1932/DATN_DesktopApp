import React from 'react';

interface ILoadingOverlay {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<ILoadingOverlay> = ({isLoading}) => {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div> */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-white border-l-white" />
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
