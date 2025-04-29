// import React from "react";
// import "./MonitorActivity.css";

import React, { useState } from "react";
import "./MonitorActivity.css";
import { FaUser, FaUserPlus, FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";

const activityCards = [
  {
    key: "online",
    label: "Online Users",
    value: 4,
    icon: <FaUser size={32} />,
    color: "#2563eb",
  },
  {
    key: "registration",
    label: "Registration",
    value: 11,
    icon: <FaUserPlus size={32} />,
    color: "#06b6d4",
  },
  {
    key: "notify-student",
    label: "Notify Student",
    value: 18,
    icon: <FaGraduationCap size={32} />,
    color: "#22c55e",
  },
  {
    key: "notify-teacher",
    label: "Notify Teachers",
    value: 4,
    icon: <FaChalkboardTeacher size={32} />,
    color: "#ef4444",
  },
];

const onlineUsersData = [
  { name: "michale jordan", role: "Teacher", status: "active", time: "2 min ago" },
  { name: "marcho", role: "Student", status: "active", time: "Just now" },
  { name: "jeffrey D", role: "Student", status: "active", time: "5 min ago" },
  { name: "Jeff Brown", role: "Teacher", status: "active", time: "1 min ago" },
];
const idleUsersData = [
  { name: "Idle User", role: "Student", status: "idle", time: "1 min ago" },
];

const registrationData = [
  { name: "Alice Smith", role: "Student", time: "Just now" },
  { name: "Bob Lee", role: "Teacher", time: "2 min ago" },
  { name: "Carol Danvers", role: "Student", time: "5 min ago" },
  { name: "David Kim", role: "Student", time: "7 min ago" },
  { name: "Eva Green", role: "Student", time: "10 min ago" },
];

const notifyStudentData = [
  { name: "marcho", message: "Assignment Due!", time: "Just now" },
  { name: "jeffrey D", message: "Quiz Reminder", time: "2 min ago" },
];

const notifyTeacherData = [
  { name: "michale jordan", message: "Meeting at 2pm", time: "1 min ago" },
  { name: "Jeff Brown", message: "Grade submissions", time: "5 min ago" },
];

const MonitorActivity = () => {
  const [selected, setSelected] = useState("online");

  // Animated content switcher
  const renderRightPanel = () => {
    switch (selected) {
      case "online":
        return (
          <div className="right-panel-content fade-in">
            <div className="online-header">
              <span className="dot online"></span> <b>3 Active Users</b>
              <span style={{ flex: 1 }}></span>
              <span className="dot idle"></span> 1 Idle
            </div>
            <div className="user-list">
              {onlineUsersData.map((u, i) => (
                <div className="user-row" key={u.name}>
                  <span className="dot online"></span>
                  <div className="user-info">
                    <b>{u.name}</b>
                    <span>{u.role}</span>
                  </div>
                  <span className="user-time">{u.time}</span>
                </div>
              ))}
              {idleUsersData.map((u, i) => (
                <div className="user-row" key={u.name}>
                  <span className="dot idle"></span>
                  <div className="user-info">
                    <b>{u.name}</b>
                    <span>{u.role}</span>
                  </div>
                  <span className="user-time">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "registration":
        return (
          <div className="right-panel-content fade-in">
            <div className="section-title">Recent Registrations</div>
            <div className="user-list">
              {registrationData.map((u, i) => (
                <div className="user-row" key={u.name}>
                  <span className="dot online"></span>
                  <div className="user-info">
                    <b>{u.name}</b>
                    <span>{u.role}</span>
                  </div>
                  <span className="user-time">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "notify-student":
        return (
          <div className="right-panel-content fade-in">
            <div className="section-title">Student Notifications</div>
            <div className="user-list">
              {notifyStudentData.map((n, i) => (
                <div className="user-row" key={n.name + n.message}>
                  <span className="dot online"></span>
                  <div className="user-info">
                    <b>{n.name}</b>
                    <span>{n.message}</span>
                  </div>
                  <span className="user-time">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "notify-teacher":
        return (
          <div className="right-panel-content fade-in">
            <div className="section-title">Teacher Notifications</div>
            <div className="user-list">
              {notifyTeacherData.map((n, i) => (
                <div className="user-row" key={n.name + n.message}>
                  <span className="dot online"></span>
                  <div className="user-info">
                    <b>{n.name}</b>
                    <span>{n.message}</span>
                  </div>
                  <span className="user-time">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="monitor-activity-root">
      <div className="monitor-header">User Activity Monitor</div>
      <div className="monitor-content">
        <div className="monitor-left">
          <div className="monitor-left-title">Monitoring Activity</div>
          <div className="activity-cards">
            {activityCards.map((card) => (
              <div
                key={card.key}
                className={`activity-card ${selected === card.key ? "selected" : ""}`}
                style={{ background: card.color, boxShadow: selected === card.key ? `0 4px 24px ${card.color}55` : undefined }}
                onClick={() => setSelected(card.key)}
              >
                <div className="activity-card-icon">{card.icon}</div>
                <div className="activity-card-label">{card.label}</div>
                <div className="activity-card-value">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="monitor-right">
          <div className="monitor-right-title">Online Users</div>
          <div className="monitor-right-panel">
            {renderRightPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorActivity;
