const Idea = require("../models/Idea");

const getTrendingIdeas = async(limit = 6) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return Idea.aggregate([{
            $addFields: {
                recencyBonus: {
                    $cond: [{ $gte: ["$createdAt", oneWeekAgo] }, 5, 0],
                },
            },
        },
        {
            $addFields: {
                trendingScore: {
                    $add: [
                        { $multiply: ["$likesCount", 2] },
                        { $multiply: ["$commentsCount", 3] },
                        "$recencyBonus",
                    ],
                },
            },
        },
        { $sort: { trendingScore: -1, createdAt: -1 } },
        { $limit: limit },
    ]);
};

module.exports = { getTrendingIdeas };