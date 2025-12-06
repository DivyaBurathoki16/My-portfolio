const Analytics = require("../models/Analytics");

const getAnalytics = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        totalVisits: 0,
        todayVisits: 0,
        devices: { mobile: 0, desktop: 0, tablet: 0 },
        visitsPerDay: [],
        routes: {}
      });
    }

    // Get date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total visits
    const totalVisits = await Analytics.countDocuments();

    // Today's visits
    const todayVisits = await Analytics.countDocuments({
      timestamp: { $gte: today }
    });

    // Device breakdown (last 30 days)
    const deviceStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      }
    ]);

    const devices = {
      mobile: 0,
      desktop: 0,
      tablet: 0
    };

    deviceStats.forEach((stat) => {
      devices[stat._id] = stat.count;
    });

    // Visits per day (last 30 days)
    const visitsPerDay = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          day: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Route popularity (last 30 days)
    const routeStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: "$route",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const routes = {};
    routeStats.forEach((stat) => {
      routes[stat._id] = stat.count;
    });

    // Get project view analytics
    let projectViewsData = {
      projectViews: {},
      totalViews: 0,
      uniqueViewers: 0,
      viewsPerDay: [],
      topProjects: []
    };

    try {
      // Call getProjectViews directly (not as middleware)
      const ProjectView = require("../models/ProjectView");
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Total views per project
      const projectViews = await ProjectView.aggregate([
        {
          $match: {
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: "$projectId",
            totalViews: { $sum: 1 },
            uniqueViewers: { $addToSet: "$visitorId" }
          }
        },
        {
          $project: {
            projectId: "$_id",
            totalViews: 1,
            uniqueViewers: { $size: "$uniqueViewers" },
            _id: 0
          }
        }
      ]);

      const projectViewsMap = {};
      projectViews.forEach((pv) => {
        projectViewsMap[pv.projectId] = {
          totalViews: pv.totalViews,
          uniqueViewers: pv.uniqueViewers
        };
      });

      // Total views
      const totalProjectViews = await ProjectView.countDocuments({
        timestamp: { $gte: thirtyDaysAgo }
      });

      // Unique viewers
      const uniqueProjectViewers = await ProjectView.distinct("visitorId", {
        timestamp: { $gte: thirtyDaysAgo }
      });

      // Views per day
      const projectViewsPerDay = await ProjectView.aggregate([
        {
          $match: {
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$timestamp"
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
          $project: {
            day: "$_id",
            count: 1,
            _id: 0
          }
        }
      ]);

      // Top projects
      const topProjects = await ProjectView.aggregate([
        {
          $match: {
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: "$projectId",
            views: { $sum: 1 }
          }
        },
        {
          $sort: { views: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            projectId: "$_id",
            views: 1,
            _id: 0
          }
        }
      ]);

      projectViewsData = {
        projectViews: projectViewsMap,
        totalViews: totalProjectViews,
        uniqueViewers: uniqueProjectViewers.length,
        viewsPerDay: projectViewsPerDay,
        topProjects
      };
    } catch (projectViewError) {
      // Silently fail if project views can't be fetched
      console.error("Error fetching project views:", projectViewError.message);
    }
    
    // Combine all analytics data
    res.json({
      totalVisits,
      todayVisits,
      devices,
      visitsPerDay,
      routes,
      projectViews: projectViewsData.projectViews,
      totalProjectViews: projectViewsData.totalViews,
      uniqueProjectViewers: projectViewsData.uniqueViewers,
      projectViewsPerDay: projectViewsData.viewsPerDay,
      topProjects: projectViewsData.topProjects
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };

