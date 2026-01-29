import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiUsers, FiGlobe, FiMonitor, FiSmartphone, FiTablet, FiEye, FiFolder } from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../../services/api";

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  visitsPerDay: Array<{
    day: string;
    count: number;
  }>;
  routes: {
    [key: string]: number;
  };
  projectViews?: {
    [projectId: string]: {
      totalViews: number;
      uniqueViewers: number;
    };
  };
  totalProjectViews?: number;
  uniqueProjectViewers?: number;
  projectViewsPerDay?: Array<{
    day: string;
    count: number;
  }>;
  topProjects?: Array<{
    projectId: string;
    views: number;
  }>;
}

interface AdminAnalyticsProps {
  adminPassword: string;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const AdminAnalytics = ({ adminPassword }: AdminAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    todayVisits: 0,
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    visitsPerDay: [],
    routes: {},
    projectViews: {},
    totalProjectViews: 0,
    uniqueProjectViewers: 0,
    projectViewsPerDay: [],
    topProjects: []
  });
  const [projects, setProjects] = useState<Array<{ _id?: string; id?: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
    fetchProjects();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/analytics", {
        headers: { "x-admin-password": adminPassword }
      });
      setAnalytics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find((p) => (p._id || p.id) === projectId);
    return project?.title || projectId;
  };

  // Format route names for display
  const formatRouteName = (route: string) => {
    if (route === "/") return "Home";
    if (route === "/projects") return "Projects";
    if (route === "/contact") return "Contact";
    return route;
  };

  // Prepare data for charts
  const routeChartData = Object.entries(analytics.routes)
    .map(([route, count]) => ({
      name: formatRouteName(route),
      visits: count
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  const deviceChartData = [
    { name: "Desktop", value: analytics.devices.desktop, icon: <FiMonitor /> },
    { name: "Mobile", value: analytics.devices.mobile, icon: <FiSmartphone /> },
    { name: "Tablet", value: analytics.devices.tablet, icon: <FiTablet /> }
  ].filter((item) => item.value > 0);

  const totalDeviceVisits = analytics.devices.desktop + analytics.devices.mobile + analytics.devices.tablet;
  const mostViewedRoute = Object.entries(analytics.routes).sort((a, b) => b[1] - a[1])[0];

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <motion.div
      className="admin-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="admin-analytics-header">
        <h2>
          <FiTrendingUp /> Analytics Dashboard
        </h2>
        <p className="admin-description">
          Track visitor statistics and page performance
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Cards */}
      <div className="analytics-stats-grid">
        <motion.div
          className="analytics-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card-icon" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
            <FiUsers />
          </div>
          <div className="stat-card-content">
            <h3>{analytics.totalVisits.toLocaleString()}</h3>
            <p>Total Visitors</p>
          </div>
        </motion.div>

        <motion.div
          className="analytics-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <FiTrendingUp />
          </div>
          <div className="stat-card-content">
            <h3>{analytics.todayVisits.toLocaleString()}</h3>
            <p>Visitors Today</p>
          </div>
        </motion.div>

        <motion.div
          className="analytics-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-card-icon" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
            <FiGlobe />
          </div>
          <div className="stat-card-content">
            <h3>{mostViewedRoute ? formatRouteName(mostViewedRoute[0]) : "N/A"}</h3>
            <p>Most Viewed Page</p>
          </div>
        </motion.div>

        <motion.div
          className={`analytics-stat-card ${!analytics.totalProjectViews || analytics.totalProjectViews === 0 ? 'stat-card-empty' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-card-icon" style={{ background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}>
            <FiEye />
          </div>
          <div className="stat-card-content">
            <h3>
              {analytics.totalProjectViews && analytics.totalProjectViews > 0 
                ? analytics.totalProjectViews.toLocaleString() 
                : <span className="stat-zero">No views yet</span>}
            </h3>
            <p>Total Project Views</p>
            {analytics.totalProjectViews && analytics.totalProjectViews > 0 && (
              <span className="stat-subtitle">Tracked from project modals</span>
            )}
          </div>
        </motion.div>

        <motion.div
          className={`analytics-stat-card ${!analytics.uniqueProjectViewers || analytics.uniqueProjectViewers === 0 ? 'stat-card-empty' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-card-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
            <FiUsers />
          </div>
          <div className="stat-card-content">
            <h3>
              {analytics.uniqueProjectViewers && analytics.uniqueProjectViewers > 0 
                ? analytics.uniqueProjectViewers.toLocaleString() 
                : <span className="stat-zero">No viewers yet</span>}
            </h3>
            <p>Unique Project Viewers</p>
            {analytics.uniqueProjectViewers && analytics.uniqueProjectViewers > 0 && (
              <span className="stat-subtitle">Different visitors</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Line Chart - Visits Per Day */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Visits Per Day (Last 30 Days)</h3>
          {analytics.visitsPerDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.visitsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  style={{ fontSize: "0.75rem" }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(15, 23, 42, 0.1)",
                    borderRadius: "8px"
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No data available</div>
          )}
        </motion.div>

        {/* Bar Chart - Route Popularity */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Top Pages</h3>
          {routeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: "0.75rem" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(15, 23, 42, 0.1)",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="visits" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No data available</div>
          )}
        </motion.div>

        {/* Pie Chart - Device Split */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Device Distribution</h3>
          {deviceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(15, 23, 42, 0.1)",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No data available</div>
          )}
        </motion.div>
      </div>

      {/* Project Views Section */}
      {analytics.totalProjectViews && analytics.totalProjectViews > 0 && (
        <>
          {/* Project Views Per Day Chart */}
          {analytics.projectViewsPerDay && analytics.projectViewsPerDay.length > 0 && (
            <motion.div
              className="analytics-chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3>Project Views Per Day (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.projectViewsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    style={{ fontSize: "0.75rem" }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "0.75rem" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(15, 23, 42, 0.1)",
                      borderRadius: "8px"
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Top Projects by Views */}
          {analytics.topProjects && analytics.topProjects.length > 0 && (
            <motion.div
              className="analytics-chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>
                <FiFolder /> Top Projects by Views
              </h3>
              <div className="top-projects-list">
                {analytics.topProjects.map((project, index) => {
                  const projectData = analytics.projectViews?.[project.projectId];
                  return (
                    <div key={project.projectId} className="top-project-item">
                      <div className="project-rank">
                        <span className="rank-number">{index + 1}</span>
                        <div className="project-info">
                          <strong>{getProjectTitle(project.projectId)}</strong>
                          <span className="project-stats">
                            {project.views} views
                            {projectData && ` • ${projectData.uniqueViewers} unique viewers`}
                          </span>
                        </div>
                      </div>
                      <div className="project-views-bar">
                        <div
                          className="project-views-fill"
                          style={{
                            width: `${(project.views / (analytics.topProjects?.[0]?.views || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Project Views Table */}
          {analytics.projectViews && Object.keys(analytics.projectViews).length > 0 && (
            <motion.div
              className="analytics-chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3>All Projects View Statistics</h3>
              <div className="project-views-table">
                <div className="table-header">
                  <div>Project</div>
                  <div>Total Views</div>
                  <div>Unique Viewers</div>
                </div>
                {Object.entries(analytics.projectViews)
                  .sort((a, b) => b[1].totalViews - a[1].totalViews)
                  .map(([projectId, data]) => (
                    <div key={projectId} className="table-row">
                      <div className="table-cell project-name">{getProjectTitle(projectId)}</div>
                      <div className="table-cell">{data.totalViews}</div>
                      <div className="table-cell">{data.uniqueViewers}</div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Device Stats */}
      {totalDeviceVisits > 0 && (
        <motion.div
          className="analytics-device-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3>Device Breakdown</h3>
          <div className="device-stats-grid">
            <div className="device-stat-item">
              <FiMonitor />
              <div>
                <strong>{analytics.devices.desktop}</strong>
                <span>
                  {totalDeviceVisits > 0
                    ? ((analytics.devices.desktop / totalDeviceVisits) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="device-stat-item">
              <FiSmartphone />
              <div>
                <strong>{analytics.devices.mobile}</strong>
                <span>
                  {totalDeviceVisits > 0
                    ? ((analytics.devices.mobile / totalDeviceVisits) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="device-stat-item">
              <FiTablet />
              <div>
                <strong>{analytics.devices.tablet}</strong>
                <span>
                  {totalDeviceVisits > 0
                    ? ((analytics.devices.tablet / totalDeviceVisits) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminAnalytics;

