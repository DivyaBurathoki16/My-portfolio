const ProjectView = require("../models/ProjectView");

const trackView = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(200).json({ message: "View tracked (MongoDB not configured)" });
    }

    const { projectId, visitorId } = req.body;

    if (!projectId || !visitorId) {
      return res.status(400).json({ error: "projectId and visitorId are required" });
    }

    // Optional: Prevent counting duplicate views (same visitor + same project + same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingView = await ProjectView.findOne({
      projectId,
      visitorId,
      timestamp: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // If view already exists today, don't count again (optional behavior)
    if (existingView) {
      return res.status(200).json({ message: "View already tracked today", duplicate: true });
    }

    // Detect device from user agent
    const userAgent = req.headers["user-agent"] || "";
    let device = "desktop";
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
      device = "mobile";
    } else if (/tablet|ipad|playbook|silk/i.test(userAgent.toLowerCase())) {
      device = "tablet";
    }

    // Save the view
    await ProjectView.create({
      projectId,
      visitorId,
      device,
      timestamp: new Date()
    });

    res.status(200).json({ message: "View tracked successfully" });
  } catch (error) {
    next(error);
  }
};

const getProjectViews = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        projectViews: {},
        totalViews: 0,
        uniqueViewers: 0,
        viewsPerDay: [],
        topProjects: []
      });
    }

    const { projectId } = req.query;

    // Get date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const matchFilter = {
      timestamp: { $gte: thirtyDaysAgo }
    };

    if (projectId) {
      matchFilter.projectId = projectId;
    }

    // Total views per project
    const projectViews = await ProjectView.aggregate([
      {
        $match: matchFilter
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
    const totalViews = await ProjectView.countDocuments(matchFilter);

    // Unique viewers
    const uniqueViewers = await ProjectView.distinct("visitorId", matchFilter);

    // Views per day (last 30 days)
    const viewsPerDay = await ProjectView.aggregate([
      {
        $match: matchFilter
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

    // Top projects by views
    const topProjects = await ProjectView.aggregate([
      {
        $match: matchFilter
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

    res.json({
      projectViews: projectViewsMap,
      totalViews,
      uniqueViewers: uniqueViewers.length,
      viewsPerDay,
      topProjects
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { trackView, getProjectViews };

