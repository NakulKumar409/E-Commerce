import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Menu,
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Search,
  Bell,
  User,
  Calendar,
  TestTube,
  Briefcase,
  LogOut,
  TrendingUp,
  Activity,
  Target,
  Award,
  UserCheck,
  UserX,
  ExternalLink,
  UserPlus,
} from "lucide-react";

// Custom chart implementations to match the image design
const CustomLineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.invited, d.completed)));
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  
  // Calculate points for lines
  const getPoints = (dataKey) => {
    return data.map((item, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
      const y = chartHeight - padding - ((item[dataKey] / maxValue) * (chartHeight - 2 * padding));
      return `${x},${y}`;
    }).join(' ');
  };

  const invitedPoints = getPoints('invited');
  const completedPoints = getPoints('completed');

  return (
    <div className="relative">
      <svg width="100%" height="250" viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 200, 400, 600, 800, 1000].map((value, i) => {
          const y = chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="10"
                fill="#6b7280"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}
        
        {/* Invited Candidates line (orange) */}
        <polyline
          points={invitedPoints}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Completed Tests line (green) */}
        <polyline
          points={completedPoints}
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
          const invitedY = chartHeight - padding - ((item.invited / maxValue) * (chartHeight - 2 * padding));
          const completedY = chartHeight - padding - ((item.completed / maxValue) * (chartHeight - 2 * padding));
          
          return (
            <g key={index}>
              {/* Invited point */}
              <circle cx={x} cy={invitedY} r="4" fill="#f97316" />
              {/* Completed point */}
              <circle cx={x} cy={completedY} r="4" fill="#22c55e" />
              
              {/* Month label */}
              <text
                x={x}
                y={chartHeight + 20}
                fontSize="12"
                fill="#6b7280"
                textAnchor="middle"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Invited Candidates</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Completed Tests</span>
        </div>
      </div>
    </div>
  );
};

const CustomPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  
  let cumulativePercent = 0;
  
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-full h-64">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="2"
        />
        
        {data.map((item, i) => {
          const percent = (item.value / total) * 100;
          const startAngle = (cumulativePercent / 100) * 360;
          const endAngle = ((cumulativePercent + percent) / 100) * 360;
          
          const startX = centerX + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
          const startY = centerY + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
          const endX = centerX + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
          const endY = centerY + radius * Math.sin((endAngle - 90) * (Math.PI / 180));
          
          const largeArcFlag = percent > 50 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`,
          ].join(" ");
          
          cumulativePercent += percent;
          
          return (
            <path
              key={i}
              d={pathData}
              fill={item.name === "Passed" ? "#22c55e" : "#ef4444"}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Center hole */}
        <circle
          cx={centerX}
          cy={centerY}
          r={15}
          fill="white"
        />
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Passed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Failed</span>
        </div>
      </div>
    </div>
  );
};

// New ActionCard Component
const ActionCard = ({
  title,
  description,
  image,
  buttonText,
  onClick,
  buttonColor,
  testId,
  cardId,
}) => (
  <div
    id={cardId}
    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
    <div className="text-5xl mb-4" role="img" aria-label={title}>
      {image}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <button
      id={testId}
      onClick={onClick}
      className={`mt-auto w-full py-2 px-4 rounded-lg text-white font-medium bg-${buttonColor}-600 hover:bg-${buttonColor}-700 transition-colors`}>
      {buttonText}
    </button>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const { logout, currentUser } = useAuth();
  const history = useHistory();

  // Mock data
  const analyticsData = {
    monthlyTrends: [
      { month: "Jan", invited: 280, completed: 240 },
      { month: "Feb", invited: 400, completed: 380 },
      { month: "Mar", invited: 600, completed: 520 },
      { month: "Apr", invited: 800, completed: 680 },
      { month: "May", invited: 900, completed: 820 },
      { month: "Jun", invited: 850, completed: 750 },
      { month: "Jul", invited: 700, completed: 650 },
      { month: "Aug", invited: 750, completed: 680 },
      { month: "Sep", invited: 650, completed: 600 },
      { month: "Oct", invited: 600, completed: 540 },
      { month: "Nov", invited: 650, completed: 580 },
      { month: "Dec", invited: 680, completed: 620 },
    ],
    passFailData: [
      { name: "Passed", value: 70 },
      { name: "Failed", value: 30 },
    ],
    priorityFeatures: [
      {
        feature: "Code Review",
        activity: 890,
        priority: "High",
        growth: "+15%",
      },
      {
        feature: "Live Coding",
        activity: 756,
        priority: "High",
        growth: "+12%",
      },
      {
        feature: "System Design",
        activity: 623,
        priority: "Medium",
        growth: "+8%",
      },
      {
        feature: "Algorithm Tests",
        activity: 445,
        priority: "Medium",
        growth: "+5%",
      },
    ],
  };

  const dashboardData = {
    testsCreated: 147,
    candidatesInvited: 2786,
    testsAttempted: 2180,
    averageScore: 72,
    topCandidates: [
      {
        name: "Vijay Gupta",
        role: "Full Stack Developer",
        score: 95,
        status: "Hired",
        avatar: "VG",
      },
      {
        name: "Swati Gupta",
        role: "React Developer",
        score: 92,
        status: "In Review",
        avatar: "SG",
      },
      {
        name: "Anoop Singh",
        role: "React Developer",
        score: 89,
        status: "Scheduled",
        avatar: "AS",
      },
    ],
    upcomingTests: [
      {
        title: "Frontend Developer Assessment",
        date: "29 July 25",
        candidates: 15,
        status: "Active",
      },
      {
        title: "Full Stack Challenge",
        date: "30 July 25",
        candidates: 8,
        status: "Scheduled",
      },
    ],
  };

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation handlers
  const handleSubmitNew = () => {
    history.push("/create");
    setActiveSection("test-builder");
  };

  const handleSubmitEdit = () => {
    history.push("/edit");
    setActiveSection("manage-tests");
  };

  const handleSubmitResults = () => {
    history.push("/results");
    setActiveSection("test-results");
  };

  const handleMCQAdminPanel = () => {
    history.push("/mcqadminpanel");
    setActiveSection("settings");
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "blue",
    change,
    icon: Icon,
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div
          className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 text-${color}-600`} />}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {change && (
          <span className="text-sm text-green-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </span>
        )}
      </div>
    </div>
  );

  const FeaturePriorityCard = ({ feature, activity, priority, growth }) => {
    const priorityColors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{feature}</p>
            <p className="text-sm text-gray-500">{activity} activities</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-green-600">{growth}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gray-900 transition-all duration-300 flex-shrink-0`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">T</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-white">TestPlatform</span>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: Home },
            { id: "test-builder", label: "Test Builder", icon: TestTube },
            { id: "manage-tests", label: "Manage Tests", icon: FileText },
            { id: "test-results", label: "Test Results", icon: BarChart3 },
            { id: "post-a-job", label: "Post a Job", icon: Briefcase },
            { id: "candidate-hub", label: "Candidate Hub", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}>
                <Icon className="w-5 h-5" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {/* Dashboard Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <h1 className="text-xl font-semibold mb-1">
                Welcome, {currentUser?.email || "User"}!
              </h1>
              <p className="text-purple-100 text-sm">
                Here's what's happening with your assessments
              </p>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard
                title="Setup a New Coding Test"
                description="Create a new coding test with challenges and the option of adding video interview questions"
                image="🚀"
                buttonText="Create New Test"
                onClick={handleSubmitNew}
                buttonColor="blue"
                testId="setup-test"
                cardId="setup-test-card"
              />
              <ActionCard
                title="Edit Existing Coding Test"
                description="Edit or add new challenges and questions to an existing coding test and send email invites to participants"
                image="✏️"
                buttonText="Edit Tests"
                onClick={handleSubmitEdit}
                buttonColor="green"
                testId="edit-test"
                cardId="edit-test-card"
              />
              <ActionCard
                title="View Test Results"
                description="See the results from coding tests taken by participants including analytics and performance metrics"
                image="📊"
                buttonText="View Results"
                onClick={handleSubmitResults}
                buttonColor="purple"
                testId="history-results"
                cardId="history-results-card"
              />
              <ActionCard
                title="MCQ Admin Panel"
                description="Manage all aspects of MCQ tests including questions, test creation, participants, and results"
                image="⚙️"
                buttonText="Open Admin Panel"
                onClick={handleMCQAdminPanel}
                buttonColor="orange"
                testId="mcq-admin-button"
                cardId="mcq-admin-card"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Test Kits Created"
                value={dashboardData.testsCreated}
                subtitle="Total tests created"
                change="+12% vs last month"
                color="blue"
                icon={TestTube}
              />
              <StatCard
                title="Total Candidates Invited"
                value={dashboardData.candidatesInvited}
                subtitle="Candidates invited"
                change="+8% vs last month"
                color="green"
                icon={UserPlus}
              />
              <StatCard
                title="Tests Attempted"
                value={dashboardData.testsAttempted}
                subtitle="Tests completed"
                change="+15% vs last month"
                color="purple"
                icon={Target}
              />
              <StatCard
                title="Average Test Score"
                value={`${dashboardData.averageScore}%`}
                subtitle="Average score"
                change="+3% vs last month"
                color="orange"
                icon={Award}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Monthly Test Trends
                </h3>
                <CustomLineChart data={analyticsData.monthlyTrends} />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Pass vs Fail Distribution
                </h3>
                <CustomPieChart data={analyticsData.passFailData} />
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Priority Features */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Feature Activity Priorities
                </h3>
                <div className="space-y-3">
                  {analyticsData.priorityFeatures.map((item, index) => (
                    <FeaturePriorityCard
                      key={index}
                      feature={item.feature}
                      activity={item.activity}
                      priority={item.priority}
                      growth={item.growth}
                    />
                  ))}
                </div>
              </div>

              {/* Top Candidates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Candidates
                </h3>
                <div className="space-y-3">
                  {dashboardData.topCandidates.map((candidate, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {candidate.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {candidate.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">
                          {candidate.score}%
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            candidate.status === "Hired"
                              ? "bg-green-100 text-green-800"
                              : candidate.status === "In Review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tests */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Scheduled Tests
                </h3>
                <div className="space-y-3">
                  {dashboardData.upcomingTests.map((test, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {test.title}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{test.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              <span>{test.candidates} candidates</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            test.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;