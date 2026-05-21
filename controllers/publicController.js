const Idea = require("../models/Idea");
const User = require("../models/User");
const Comment = require("../models/Comment");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const heroSlides = [{
        id: 1,
        title: "Share Ideas. Inspire Innovation. Build the Future.",
        subtitle: "Discover startup concepts, collaborate with creators, and turn bold ideas into investable momentum.",
        image: "/Assets/Skill-Based-Education.png",
        label: "Idea Vault",
        description: "Centralized hub for startup innovation",
    },
    {
        id: 2,
        title: "From Concept to Community Validation.",
        subtitle: "Publish your idea, gather intelligent feedback, and iterate with a serious founder network.",
        image: "/Assets/smart-waste-tracker.webp",
        label: "Live Signal",
        description: "Real-time validation with community feedback",
    },
    {
        id: 3,
        title: "Where Builders Meet Their Next Breakthrough.",
        subtitle: "Track traction, spark conversations, and make your startup concept impossible to ignore.",
        image: "/Assets/Urban-Farmer.webp",
        label: "Innovation Radar",
        description: "Trending concepts validated by real founder feedback",
    },
];

const whyItems = [{
        title: "Collaborate",
        description: "Find co-builders and domain experts ready to shape your concept.",
    },
    {
        title: "Validate",
        description: "Receive focused feedback from founders, mentors, and operators.",
    },
    {
        title: "Innovate",
        description: "Explore emerging trends and discover adjacent opportunities faster.",
    },
    {
        title: "Grow",
        description: "Build audience trust before launch with meaningful community traction.",
    },
];

const stories = [{
        name: "Arif Hossain",
        role: "Co-founder, GreenSync",
        quote: "IdeaVault helped us validate pricing, refine positioning, and meet our first angel mentor in two weeks.",
    },
    {
        name: "Nabila Karim",
        role: "Founder, LearnNest",
        quote: "The feedback loop here felt different: specific, constructive, and truly founder-friendly.",
    },
    {
        name: "Tahmid Rahman",
        role: "Builder, PulseCare",
        quote: "We moved from rough idea to pilot-ready roadmap using comments and interaction insights.",
    },
];

const getHomeContent = catchAsync(async(req, res) => {
    const [ideasCount, usersCount, commentsCount, categories] = await Promise.all([
        Idea.countDocuments(),
        User.countDocuments(),
        Comment.countDocuments(),
        Idea.distinct("category"),
    ]);

    const counters = [
        { label: "Ideas Shared", value: ideasCount },
        { label: "Active Users", value: usersCount },
        { label: "Comments", value: commentsCount },
        { label: "Categories", value: categories.length },
    ];

    const responseData = {
        heroSlides,
        counters,
        whyItems,
        stories,
    };

    return sendResponse(res, 200, true, "Home content fetched", responseData);
});

module.exports = { getHomeContent };