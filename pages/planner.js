import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

// Mock events data
const mockEvents = [
  { id: 1, title: 'Client Meeting - Acme Corp', date: '2023-09-15', time: '10:00 AM', type: 'meeting' },
  { id: 2, title: 'Quarterly Tax Filing', date: '2023-09-20', time: '12:00 PM', type: 'deadline' },
  { id: 3, title: 'Team Review', date: '2023-09-18', time: '02:30 PM', type: 'meeting' },
  { id: 4, title: 'Project Kick-off', date: '2023-09-22', time: '09:00 AM', type: 'meeting' },
  { id: 5, title: 'Invoice #1282 Due', date: '2023-09-25', time: '', type: 'invoice' },
];

// Mock tasks data
const mockTasks = [
  { id: 1, title: 'Prepare quarterly financial report', completed: false, priority: 'high', deadline: '2023-09-18' },
  { id: 2, title: 'Review marketing expenses', completed: false, priority: 'medium', deadline: '2023-09-20' },
  { id: 3, title: 'Update client billing information', completed: true, priority: 'medium', deadline: '2023-09-15' },
  { id: 4, title: 'Schedule meeting with accountant', completed: false, priority: 'low', deadline: '2023-09-22' },
  { id: 5, title: 'Submit tax documents', completed: false, priority: 'high', deadline: '2023-09-20' },
];

// Generate days for the calendar
const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i);
    days.push({
      date: prevMonthDay,
      currentMonth: false,
      hasEvent: mockEvents.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === prevMonthDay.getDate() &&
               eventDate.getMonth() === prevMonthDay.getMonth() &&
               eventDate.getFullYear() === prevMonthDay.getFullYear();
      })
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDay = new Date(year, month, i);
    days.push({
      date: currentDay,
      currentMonth: true,
      hasEvent: mockEvents.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === currentDay.getDate() &&
               eventDate.getMonth() === currentDay.getMonth() &&
               eventDate.getFullYear() === currentDay.getFullYear();
      })
    });
  }
  
  // Add days from next month to fill the last week
  const lastDayOfWeek = lastDay.getDay(); // 0 for Sunday, 6 for Saturday
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const nextMonthDay = new Date(year, month + 1, i);
    days.push({
      date: nextMonthDay,
      currentMonth: false,
      hasEvent: mockEvents.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === nextMonthDay.getDate() &&
               eventDate.getMonth() === nextMonthDay.getMonth() &&
               eventDate.getFullYear() === nextMonthDay.getFullYear();
      })
    });
  }
  
  return days;
};

export default function PlannerPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarDays, setCalendarDays] = useState(generateCalendarDays(currentYear, currentMonth));
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', deadline: '' });
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Helper to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Go to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setCalendarDays(generateCalendarDays(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1));
  };
  
  // Go to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCalendarDays(generateCalendarDays(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1));
  };
  
  // Handle task checkbox change
  const toggleTaskCompleted = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      completed: false,
      priority: newTask.priority,
      deadline: newTask.deadline || '2023-09-30',
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', priority: 'medium', deadline: '' });
  };
  
  // Get events for selected date
  const getEventsForSelectedDate = () => {
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, selectedDate);
    });
  };

  return (
    <Layout>
      <Head>
        <title>Planner - FiscalFusion</title>
        <meta name="description" content="Plan your business activities, tasks, and events" />
      </Head>
      
      <div id="planner-page" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Business Planner</h1>
          <p className="text-gray-400">Manage your schedule, tasks, and events</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Weekday headers */}
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 py-1">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      h-12 rounded-md flex items-center justify-center relative
                      ${!day.currentMonth ? 'text-gray-600' : 'text-white'}
                      ${isSameDay(day.date, today) ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}
                      ${isSameDay(day.date, selectedDate) && !isSameDay(day.date, today) ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <span>{day.date.getDate()}</span>
                    {day.hasEvent && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Selected day events */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              
              {getEventsForSelectedDate().length > 0 ? (
                <div className="space-y-3">
                  {getEventsForSelectedDate().map(event => (
                    <div key={event.id} className="flex p-3 rounded-md bg-gray-800">
                      <div className={`
                        w-2 self-stretch rounded-full mr-3
                        ${event.type === 'meeting' ? 'bg-blue-500' : ''}
                        ${event.type === 'deadline' ? 'bg-yellow-500' : ''}
                        ${event.type === 'invoice' ? 'bg-green-500' : ''}
                      `}></div>
                      <div>
                        <p className="text-white">{event.title}</p>
                        {event.time && <p className="text-gray-400 text-sm">{event.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No events scheduled for this day.</p>
              )}
              
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                + Add Event
              </button>
            </div>
          </div>
          
          {/* Tasks */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>
            
            <form onSubmit={handleAddTask} className="mb-6">
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Add a new task..."
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start p-3 rounded-md bg-gray-800">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompleted(task.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className={`text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex justify-between mt-1">
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${task.priority === 'high' ? 'bg-red-500 text-white' : ''}
                        ${task.priority === 'medium' ? 'bg-yellow-500 text-gray-900' : ''}
                        ${task.priority === 'low' ? 'bg-green-500 text-white' : ''}
                      `}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 