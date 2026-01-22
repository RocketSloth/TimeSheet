import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [currentStatus, setCurrentStatus] = useState({
    clockedIn: false,
    onLunch: false,
    clockInTime: null,
    lunchStartTime: null,
    lunchEndTime: null,
    skippedLunch: false
  });
  const [today, setToday] = useState('');

  useEffect(() => {
    // Get today's date string (YYYY-MM-DD)
    const todayDate = new Date();
    const todayStr = todayDate.toISOString().split('T')[0];
    setToday(todayStr);

    // Load data
    if (window.electronAPI) {
      const savedData = window.electronAPI.getData();
      setData(savedData);

      // Check if already clocked in today
      if (savedData[todayStr]) {
        const todayData = savedData[todayStr];
        if (todayData.clockInTime && !todayData.clockOutTime) {
          setCurrentStatus({
            clockedIn: true,
            onLunch: todayData.onLunch || false,
            clockInTime: todayData.clockInTime,
            lunchStartTime: todayData.lunchStartTime || null,
            lunchEndTime: todayData.lunchEndTime || null,
            skippedLunch: todayData.skippedLunch || false
          });
        }
      }
    }
  }, []);

  const isWeekday = () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
  };

  const saveData = (newData) => {
    if (window.electronAPI) {
      window.electronAPI.saveData(newData);
      setData(newData);
    }
  };

  const clockIn = () => {
    if (!isWeekday()) {
      alert('You can only clock in Monday through Friday!');
      return;
    }

    const now = new Date().toISOString();
    const updatedData = { ...data };
    
    if (!updatedData[today]) {
      updatedData[today] = {
        clockInTime: now,
        clockOutTime: null,
        lunchStartTime: null,
        lunchEndTime: null,
        skippedLunch: false,
        onLunch: false
      };
    } else {
      updatedData[today].clockInTime = now;
      updatedData[today].clockOutTime = null;
    }

    setCurrentStatus({
      clockedIn: true,
      onLunch: false,
      clockInTime: now,
      lunchStartTime: null,
      lunchEndTime: null,
      skippedLunch: false
    });

    saveData(updatedData);
  };

  const clockOut = () => {
    if (!currentStatus.clockedIn) {
      alert('You must clock in first!');
      return;
    }

    const now = new Date().toISOString();
    const updatedData = { ...data };
    
    if (updatedData[today]) {
      updatedData[today].clockOutTime = now;
      if (currentStatus.onLunch) {
        updatedData[today].onLunch = false;
      }
    }

    setCurrentStatus({
      clockedIn: false,
      onLunch: false,
      clockInTime: null,
      lunchStartTime: null,
      lunchEndTime: null,
      skippedLunch: false
    });

    saveData(updatedData);
  };

  const startLunch = () => {
    if (!currentStatus.clockedIn) {
      alert('You must be clocked in to start lunch!');
      return;
    }

    if (currentStatus.onLunch) {
      alert('You are already on lunch!');
      return;
    }

    const now = new Date().toISOString();
    const updatedData = { ...data };
    
    if (updatedData[today]) {
      updatedData[today].lunchStartTime = now;
      updatedData[today].onLunch = true;
    }

    setCurrentStatus({
      ...currentStatus,
      onLunch: true,
      lunchStartTime: now
    });

    saveData(updatedData);
  };

  const endLunch = () => {
    if (!currentStatus.onLunch) {
      alert('You are not currently on lunch!');
      return;
    }

    const now = new Date().toISOString();
    const updatedData = { ...data };
    
    if (updatedData[today]) {
      updatedData[today].lunchEndTime = now;
      updatedData[today].onLunch = false;
    }

    setCurrentStatus({
      ...currentStatus,
      onLunch: false,
      lunchEndTime: now
    });

    saveData(updatedData);
  };

  const skipLunch = () => {
    if (!currentStatus.clockedIn) {
      alert('You must be clocked in to skip lunch!');
      return;
    }

    if (currentStatus.onLunch) {
      alert('You are currently on lunch! End lunch first.');
      return;
    }

    const updatedData = { ...data };
    
    if (updatedData[today]) {
      updatedData[today].skippedLunch = true;
    }

    setCurrentStatus({
      ...currentStatus,
      skippedLunch: true
    });

    saveData(updatedData);
  };

  const calculateHours = (dateStr) => {
    if (!data[dateStr]) return 0;

    const dayData = data[dateStr];
    if (!dayData.clockInTime) return 0;

    const clockOut = dayData.clockOutTime 
      ? new Date(dayData.clockOutTime) 
      : new Date();
    
    const clockIn = new Date(dayData.clockInTime);
    let totalMs = clockOut - clockIn;

    // Subtract lunch time if taken
    if (dayData.lunchStartTime && dayData.lunchEndTime) {
      const lunchStart = new Date(dayData.lunchStartTime);
      const lunchEnd = new Date(dayData.lunchEndTime);
      totalMs -= (lunchEnd - lunchStart);
    }

    return totalMs / (1000 * 60 * 60); // Convert to hours
  };

  const getWeekHours = () => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    let totalHours = 0;
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      totalHours += calculateHours(dateStr);
    }
    
    return totalHours;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const todayHours = calculateHours(today);
  const weekHours = getWeekHours();

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>⏰ TimeSheet</h1>
          <p className="date">{formatDate(today)}</p>
        </header>

        <div className="status-card">
          <div className="status-indicator">
            <div className={`status-dot ${currentStatus.clockedIn ? 'active' : 'inactive'}`}></div>
            <span className="status-text">
              {currentStatus.clockedIn 
                ? (currentStatus.onLunch ? 'On Lunch' : 'Clocked In') 
                : 'Clocked Out'}
            </span>
          </div>
          
          {currentStatus.clockedIn && currentStatus.clockInTime && (
            <p className="clock-time">
              Clocked in at: {formatTime(currentStatus.clockInTime)}
            </p>
          )}
        </div>

        <div className="controls">
          {!currentStatus.clockedIn ? (
            <button className="btn btn-primary" onClick={clockIn}>
              Clock In
            </button>
          ) : (
            <>
              {!currentStatus.onLunch && !currentStatus.skippedLunch ? (
                <div className="lunch-controls">
                  <button className="btn btn-secondary" onClick={startLunch}>
                    Start Lunch
                  </button>
                  <button className="btn btn-secondary" onClick={skipLunch}>
                    Skip Lunch
                  </button>
                </div>
              ) : currentStatus.onLunch ? (
                <button className="btn btn-secondary" onClick={endLunch}>
                  End Lunch
                </button>
              ) : null}
              
              <button className="btn btn-danger" onClick={clockOut}>
                Clock Out
              </button>
            </>
          )}
        </div>

        <div className="hours-display">
          <div className="hours-card">
            <h3>Today's Hours</h3>
            <p className="hours-value">{todayHours.toFixed(2)}</p>
          </div>
          
          <div className="hours-card">
            <h3>Week's Hours</h3>
            <p className="hours-value">{weekHours.toFixed(2)}</p>
          </div>
        </div>

        {currentStatus.onLunch && currentStatus.lunchStartTime && (
          <div className="lunch-info">
            <p>Lunch started at: {formatTime(currentStatus.lunchStartTime)}</p>
          </div>
        )}

        {currentStatus.skippedLunch && (
          <div className="lunch-info">
            <p>✓ Lunch skipped today</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

