import React from 'react';

const MusicOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
);
const MusicOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM3 3l18 18" />
    </svg>
);
const SoundOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);
const SoundOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l-4-4m0 4l4-4" />
    </svg>
);

interface SettingsProps {
  isMusicEnabled: boolean;
  areSoundsEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSounds: () => void;
  className?: string;
}

const Settings: React.FC<SettingsProps> = ({ isMusicEnabled, areSoundsEnabled, onToggleMusic, onToggleSounds, className = '' }) => {
  const buttonBaseClass = "p-2 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400";
  const enabledClass = "bg-teal-100 text-teal-600";
  const disabledClass = "bg-gray-200 text-gray-500";
    
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-semibold text-teal-800">Music</span>
        <button 
          onClick={onToggleMusic} 
          title={isMusicEnabled ? 'Mute Music' : 'Unmute Music'} 
          className={`${buttonBaseClass} ${isMusicEnabled ? enabledClass : disabledClass}`}
        >
          {isMusicEnabled ? <MusicOnIcon /> : <MusicOffIcon />}
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
         <span className="text-sm font-semibold text-teal-800">Sound FX</span>
        <button 
          onClick={onToggleSounds} 
          title={areSoundsEnabled ? 'Mute Sounds' : 'Unmute Sounds'} 
          className={`${buttonBaseClass} ${areSoundsEnabled ? enabledClass : disabledClass}`}
        >
          {areSoundsEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </div>
    </div>
  );
};

export default Settings;
