import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

// Mock projects data
const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'Acme Corp',
    budget: 15000,
    startDate: '2023-08-01',
    deadline: '2023-10-15',
    status: 'in-progress',
    progress: 65,
    team: [
      { id: 1, name: 'John Doe', avatar: 'JD', role: 'Lead Developer' },
      { id: 2, name: 'Jane Smith', avatar: 'JS', role: 'UI Designer' },
      { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Content Writer' },
    ],
    tasks: [
      { id: 1, title: 'Design homepage mockup', status: 'completed', assignee: 'Jane Smith' },
      { id: 2, title: 'Develop frontend components', status: 'in-progress', assignee: 'John Doe' },
      { id: 3, title: 'Write content for about page', status: 'in-progress', assignee: 'Mike Johnson' },
      { id: 4, title: 'Implement backend APIs', status: 'pending', assignee: 'John Doe' },
    ]
  },
  {
    id: 2,
    name: 'Mobile App Development',
    client: 'Globex Industries',
    budget: 25000,
    startDate: '2023-07-15',
    deadline: '2023-11-30',
    status: 'in-progress',
    progress: 35,
    team: [
      { id: 1, name: 'John Doe', avatar: 'JD', role: 'Project Manager' },
      { id: 4, name: 'Emily Wilson', avatar: 'EW', role: 'Mobile Developer' },
      { id: 5, name: 'David Brown', avatar: 'DB', role: 'UX Designer' },
    ],
    tasks: [
      { id: 5, title: 'Design app wireframes', status: 'completed', assignee: 'David Brown' },
      { id: 6, title: 'Develop login/registration', status: 'completed', assignee: 'Emily Wilson' },
      { id: 7, title: 'Implement core features', status: 'in-progress', assignee: 'Emily Wilson' },
      { id: 8, title: 'Beta testing coordination', status: 'pending', assignee: 'John Doe' },
    ]
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    client: 'Wayne Enterprises',
    budget: 8500,
    startDate: '2023-09-01',
    deadline: '2023-10-01',
    status: 'on-hold',
    progress: 20,
    team: [
      { id: 6, name: 'Sarah Lee', avatar: 'SL', role: 'Marketing Manager' },
      { id: 7, name: 'Tom Clark', avatar: 'TC', role: 'Graphic Designer' },
      { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Content Writer' },
    ],
    tasks: [
      { id: 9, title: 'Create campaign strategy', status: 'completed', assignee: 'Sarah Lee' },
      { id: 10, title: 'Design promotional materials', status: 'in-progress', assignee: 'Tom Clark' },
      { id: 11, title: 'Write ad copy', status: 'pending', assignee: 'Mike Johnson' },
      { id: 12, title: 'Coordinate social media posts', status: 'pending', assignee: 'Sarah Lee' },
    ]
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [activeProject, setActiveProject] = useState(mockProjects[0]);
  const [filter, setFilter] = useState('all');
  
  // Filter projects by status
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status tag with color
  const getStatusTag = (status) => {
    let className = 'px-2 py-1 text-xs rounded-full ';
    
    switch(status) {
      case 'completed':
        return <span className={className + 'bg-green-100 text-green-800'}>Completed</span>;
      case 'in-progress':
        return <span className={className + 'bg-blue-100 text-blue-800'}>In Progress</span>;
      case 'on-hold':
        return <span className={className + 'bg-yellow-100 text-yellow-800'}>On Hold</span>;
      case 'cancelled':
        return <span className={className + 'bg-red-100 text-red-800'}>Cancelled</span>;
      default:
        return <span className={className + 'bg-gray-100 text-gray-800'}>Unknown</span>;
    }
  };
  
  // Get task status badge
  const getTaskStatusBadge = (status) => {
    let className = 'px-2 py-0.5 text-xs rounded-full ';
    
    switch(status) {
      case 'completed':
        return <span className={className + 'bg-green-100 text-green-800'}>Completed</span>;
      case 'in-progress':
        return <span className={className + 'bg-blue-100 text-blue-800'}>In Progress</span>;
      case 'pending':
        return <span className={className + 'bg-gray-100 text-gray-800'}>Pending</span>;
      default:
        return <span className={className + 'bg-gray-100 text-gray-800'}>Unknown</span>;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Projects - FiscalFusion</title>
        <meta name="description" content="Manage your projects" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Create New Project
            </button>
          </div>
          
          {/* Project filters */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('on-hold')}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === 'on-hold'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              On Hold
            </button>
          </div>
          
          {/* Projects grid and active project details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects list */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => setActiveProject(project)}
                    className={`bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                      activeProject.id === project.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      {getStatusTag(project.status)}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">Client: {project.client}</p>
                    
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-400">Budget: <span className="text-white">{formatCurrency(project.budget)}</span></span>
                      <span className="text-gray-400">Deadline: <span className="text-white">{formatDate(project.deadline)}</span></span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-400">{project.progress}% complete</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Active project details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project overview */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{activeProject.name}</h2>
                    <p className="text-gray-400">Client: {activeProject.client}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                      Archive
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-800 p-3 rounded-md">
                    <p className="text-gray-400 text-xs mb-1">Budget</p>
                    <p className="text-white font-medium">{formatCurrency(activeProject.budget)}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-md">
                    <p className="text-gray-400 text-xs mb-1">Start Date</p>
                    <p className="text-white font-medium">{formatDate(activeProject.startDate)}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-md">
                    <p className="text-gray-400 text-xs mb-1">Deadline</p>
                    <p className="text-white font-medium">{formatDate(activeProject.deadline)}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{activeProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${activeProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Team members */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <button className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700">
                    + Add Member
                  </button>
                </div>
                
                <div className="space-y-3">
                  {activeProject.team.map(member => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {member.avatar}
                        </div>
                        <div className="ml-3">
                          <p className="text-white">{member.name}</p>
                          <p className="text-gray-400 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tasks */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Tasks</h3>
                  <button className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700">
                    + Add Task
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProject.tasks.map(task => (
                        <tr key={task.id} className="border-b border-gray-800">
                          <td className="py-3 px-4 text-white">{task.title}</td>
                          <td className="py-3 px-4">{getTaskStatusBadge(task.status)}</td>
                          <td className="py-3 px-4 text-gray-300">{task.assignee}</td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-blue-500 hover:text-blue-400 mr-2">Edit</button>
                            <button className="text-red-500 hover:text-red-400">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 