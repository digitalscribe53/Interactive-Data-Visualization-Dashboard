// src/components/Dashboard/DashboardHint.tsx
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface DashboardHintProps {
  delay?: number;
}

// List of available hints
const hints = [
  {
    title: "Edit Dashboard",
    icon: <AutoAwesomeIcon />,
    content: "Click 'Edit Dashboard' to rearrange and resize your widgets by dragging them around."
  },
  {
    title: "Add Widgets",
    icon: <LightbulbIcon />,
    content: "Click 'Add Widget' in the top bar to choose from different visualization types for your data."
  },
  {
    title: "Upload Your Data",
    icon: <TipsAndUpdatesIcon />,
    content: "You can upload your own CSV or Excel files to visualize in any widget. Click on a widget's menu and select 'Edit'."
  },
  {
    title: "Custom Dashboard",
    icon: <AutoAwesomeIcon />,
    content: "Create multiple dashboards from the sidebar to organize different data visualizations."
  }
];

const DashboardHint: React.FC<DashboardHintProps> = ({ delay = 5000 }) => {
  const [visible, setVisible] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if hints have been dismissed before
    const hintsDismissed = localStorage.getItem('dashboard-hints-dismissed');
    if (hintsDismissed === 'true') {
      setDismissed(true);
      return;
    }

    // Show the hint after the delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    // Cycle through hints
    const hintTimer = setInterval(() => {
      setHintIndex((prevIndex) => (prevIndex + 1) % hints.length);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(hintTimer);
    };
  }, [delay]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('dashboard-hints-dismissed', 'true');
  };

  if (dismissed || !visible) {
    return null;
  }

  const currentHint = hints[hintIndex];

  return (
    <div className="dashboard-hint">
      <button className="dashboard-hint-close" onClick={handleDismiss}>
        <CloseIcon fontSize="small" />
      </button>
      <h4>{currentHint.icon} {currentHint.title}</h4>
      <p>{currentHint.content}</p>
    </div>
  );
};

export default DashboardHint;