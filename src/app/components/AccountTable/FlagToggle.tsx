import React, { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { Flag, FlagDetails, typeDetailsArray } from '../../types';

interface FlagToggleProps {
  flag: Flag
}

const lighterHexCodes: { [key: string]: string } = {
  "#FF0000": "#FF6666", // Red
  "#00FF00": "#66FF66", // Green
  "#0000FF": "#6666FF", // Blue
  "#FFFF00": "#FFFF66", // Yellow
  "#00FFFF": "#66FFFF", // Cyan
  "#FF00FF": "#FF66FF", // Magenta
  "#000000": "#666666", // Black
  "#FFFFFF": "#FFFFFF", // White (unchanged)
  "#808080": "#B3B3B3"  // Gray
};

function FlagModal({flagColor, setFlagColor}: {flagColor: string, setFlagColor: (flagColor: string) => void}) {
  return (
    <div
      className="absolute top-full left-1/2 z-50 flex -translate-x-1/2 translate-y-4 flex-col items-center gap-2 w-[125px] rounded-md border bg-white p-3 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      style={{overflow: 'visible'}}
    >
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-t border-l border-gray-200 bg-white" />
      {typeDetailsArray(FlagDetails).map((flagOption) => (
        <button 
          onClick={() => setFlagColor(flagOption.hexCode)}
          className="w-20 border rounded-full border-slate-300 px-3 py-1 flex gap-1 text-gray-400 font-light text-[10px]" 
          key={flagOption.display}
          style={{ backgroundColor: flagColor === flagOption.hexCode ? lighterHexCodes[flagOption.hexCode] : "" }}
        >
          {flagColor === flagOption.hexCode ? <Check className="h-4 w-4 text-slate-700" /> :
          <Bookmark
            className="rotate-[270deg] transform text-gray-400"
            size={16}
            fill={flagOption.hexCode}
            color={flagOption.hexCode === "#ffffff" ? "gray" : flagOption.hexCode} /> }
            {flagOption.display}
        </button> 
      ))}
    </div>
  )
}

export default function FlagToggle({ flag }: FlagToggleProps) {
  const [flagColor, setFlagColor] = useState<string>(FlagDetails[flag].hexCode);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFlagModal(prev => !prev);
  }

  return (
    <div className="relative" onClick={handleToggle}>
      <Bookmark
        className="rotate-[270deg] transform text-gray-400"
        id="form-flag"
        size={16}
        fill={flagColor === "#ffffff" ? "transparent" : flagColor}
        color={flagColor === "#ffffff" ? "gray" : flagColor}
      />
      {showFlagModal && <FlagModal flagColor={flagColor} setFlagColor={setFlagColor} />}
      <input type="hidden" name="flag" value={flag} />
    </div>
  )
}