import React from "react";
import "./Loader.css";

const Loader = ({ fullscreen = true }) => {
  const LoaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Three Bouncing Colored Dots mimicking modern loaders */}
      <div className="custom-loader-wrapper">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium tracking-widest uppercase text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {LoaderContent}
      </div>
    );
  }

  return LoaderContent;
};

export default Loader;
