import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';


const ResizableColumn = ({ width, onResize, children }) => {
    return (
      <Resizable
        width={width}
        height={0}
        handle={
          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize" />
        }
        onResize={onResize}
      >
        <div 
          style={{ width: width }} 
          className="border-r border-gray-300 pr-2 pl-2 overflow-hidden"
        >
          <div className="truncate">
            {children}
          </div>
        </div>
      </Resizable>
    );
  };

export default ResizableColumn;