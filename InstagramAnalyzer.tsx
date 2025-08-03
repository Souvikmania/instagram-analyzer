import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterPlot, Scatter, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, Users, Heart, MessageCircle, Share2, Eye, Hash, Clock, Download, Upload, BarChart3 } from 'lucide-react';

const InstagramAnalyzer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [loading, setLoading] = useState(false);

  // Generate synthetic Instagram data (simulating Kaggle dataset)
  const generateInstagramData = () => {
    const postTypes = ['Photo', 'Video', 'Carousel', 'Reel', 'Story'];
    const hashtags = [
      '#lifestyle', '#fashion', '#food', '#travel', '#fitness', '#art', '#photography',
      '#business', '#motivation', '#nature', '#tech', '#beauty', '#music', '#design'
    ];
    const captions = [
      'Amazing sunset today! 🌅', 'New product launch excitement! 🚀', 'Weekend vibes ✨',
      'Behind the scenes content 📸', 'Throwback to better times 🔙', 'Feeling grateful today 🙏',
      'New blog post is live! 📝', 'Coffee and creativity ☕', 'Adventure awaits! 🏔️',
      'Team work makes the dream work 💪', 'Self-care Sunday 🧘‍♀️', 'Innovation never stops 💡'
    ];

    const posts = [];
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      const postDate = new Date(now - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
      const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
      const baseReach = postType === 'Reel' ? 5000 : postType === 'Video' ? 3000 : 2000;
      const reach = Math.floor(baseReach + Math.random() * 10000);
      const engagementRate = 0.02 + Math.random() * 0.08; // 2-10%
      const likes = Math.floor(reach * engagementRate);
      const comments = Math.floor(likes * (0.05 + Math.random() * 0.15)); // 5-20% of likes
      const shares = Math.floor(likes * (0.01 + Math.random() * 0.05)); // 1-6% of likes
      const saves = Math.floor(likes * (0.02 + Math.random() * 0.08)); // 2-10% of likes

      posts.push({
        id: i + 1,
        date: postDate.toISOString().split('T')[0],
        time: postDate.toTimeString().split(' ')[0],
        type: postType,
        caption: captions[Math.floor(Math.random() * captions.length)],
        hashtags: hashtags.slice(0, 3 + Math.floor(Math.random() * 5)).join(' '),
        impressions: Math.floor(reach * 1.2 + Math.random() * 2000),
        reach: reach,
        likes: likes,
        comments: comments,
        shares: shares,
        saves: saves,
        engagement: likes + comments + shares + saves,
        engagementRate: (engagementRate * 100).toFixed(2),
        profileVisits: Math.floor(reach * 0.05 + Math.random() * 100),
        followsFromPost: Math.floor(reach * 0.01 + Math.random() * 20),
        weekday: postDate.toLocaleDateString('en-US', { weekday: 'long' }),
        hour: postDate.getHours(),
        month: postDate.toLocaleDateString('en-US', { month: 'long' })
      });
    }

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Load data on component mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const instagramData = generateInstagramData();
      setData(instagramData);
      setFilteredData(instagramData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selections
  useEffect(() => {
    let filtered = [...data];

    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(post => new Date(post.date) >= cutoffDate);
    }

    if (contentType !== 'all') {
      filtered = filtered.filter(post => post.type === contentType);
    }

    setFilteredData(filtered);
  }, [data, timeRange, contentType]);

  // Analytics calculations
  const analytics = {
    totalPosts: filteredData.length,
    totalReach: filteredData.reduce((sum, post) => sum + post.reach, 0),
    totalEngagement: filteredData.reduce((sum, post) => sum + post.engagement, 0),
    avgEngagementRate: filteredData.length > 0 
      ? (filteredData.reduce((sum, post) => sum + parseFloat(post.engagementRate), 0) / filteredData.length).toFixed(2)
      : 0,
    totalFollows: filteredData.reduce((sum, post) => sum + post.followsFromPost, 0),
    bestPost: filteredData.length > 0 
      ? filteredData.reduce((best, post) => post.engagement > best.engagement ? post : best, filteredData[0])
      : null
  };

  // Chart data preparations
  const engagementByType = postTypes => {
    const types = {};
    filteredData.forEach(post => {
      if (!types[post.type]) {
        types[post.type] = { type: post.type, posts: 0, totalEngagement: 0, totalReach: 0 };
      }
      types[post.type].posts++;
      types[post.type].totalEngagement += post.engagement;
      types[post.type].totalReach += post.reach;
    });
    
    return Object.values(types).map(type => ({
      ...type,
      avgEngagement: Math.round(type.totalEngagement / type.posts),
      avgReach: Math.round(type.totalReach / type.posts)
    }));
  };

  const engagementByDay = () => {
    const days = {};
    filteredData.forEach(post => {
      if (!days[post.weekday]) {
        days[post.weekday] = { day: post.weekday, posts: 0, totalEngagement: 0, totalReach: 0 };
      }
      days[post.weekday].posts++;
      days[post.weekday].totalEngagement += post.engagement;
      days[post.weekday].totalReach += post.reach;
    });
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayOrder.map(day => days[day] || { day, posts: 0, totalEngagement: 0, totalReach: 0 })
      .map(day => ({
        ...day,
        avgEngagement: day.posts > 0 ? Math.round(day.totalEngagement / day.posts) : 0,
        avgReach: day.posts > 0 ? Math.round(day.totalReach / day.posts) : 0
      }));
  };

  const timelineData = () => {
    const timeline = {};
    filteredData.forEach(post => {
      const month = post.date.substring(0, 7); // YYYY-MM format
      if (!timeline[month]) {
        timeline[month] = { month, posts: 0, reach: 0, engagement: 0, follows: 0 };
      }
      timeline[month].posts++;
      timeline[month].reach += post.reach;
      timeline[month].engagement += post.engagement;
      timeline[month].follows += post.followsFromPost;
    });
    
    return Object.values(timeline).sort((a, b) => a.month.localeCompare(b.month));
  };

  const postingTimeData = () => {
    const hours = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = { hour: i, posts: 0, avgEngagement: 0, totalEngagement: 0 };
    }
    
    filteredData.forEach(post => {
      hours[post.hour].posts++;
      hours[post.hour].totalEngagement += post.engagement;
    });
    
    return Object.values(hours).map(hour => ({
      ...hour,
      avgEngagement: hour.posts > 0 ? Math.round(hour.totalEngagement / hour.posts) : 0,
      time: `${hour.hour}:00`
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-xl mt-4">Loading Instagram Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Instagram Analytics Dashboard</h1>
                <p className="text-blue-200">Comprehensive social media data analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <select 
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="all">All Content</option>
                <option value="Photo">Photos</option>
                <option value="Video">Videos</option>
                <option value="Carousel">Carousels</option>
                <option value="Reel">Reels</option>
                <option value="Story">Stories</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Posts</p>
                <p className="text-2xl font-bold">{analytics.totalPosts}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Reach</p>
                <p className="text-2xl font-bold">{analytics.totalReach.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Engagement</p>
                <p className="text-2xl font-bold">{analytics.totalEngagement.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Avg Engagement Rate</p>
                <p className="text-2xl font-bold">{analytics.avgEngagementRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">New Followers</p>
                <p className="text-2xl font-bold">{analytics.totalFollows}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Avg Reach/Post</p>
                <p className="text-2xl font-bold">
                  {analytics.totalPosts > 0 ? Math.round(analytics.totalReach / analytics.totalPosts).toLocaleString() : 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement by Content Type */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Engagement by Content Type
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementByType()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="avgEngagement" fill="#8884d8" name="Avg Engagement" />
                <Bar dataKey="avgReach" fill="#82ca9d" name="Avg Reach" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Timeline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Performance Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="reach" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="engagement" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement by Day of Week */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-400" />
              Performance by Day of Week
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementByDay()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="avgEngagement" stroke="#ff7300" strokeWidth={3} name="Avg Engagement" />
                <Line type="monotone" dataKey="avgReach" stroke="#8dd1e1" strokeWidth={3} name="Avg Reach" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Best Posting Times */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-400" />
              Best Posting Times
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postingTimeData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="avgEngagement" fill="#ffc658" name="Avg Engagement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Performing Post */}
        {analytics.bestPost && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Best Performing Post
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-blue-200 text-sm">Caption</p>
                <p className="font-semibold">{analytics.bestPost.caption}</p>
                <p className="text-blue-200 text-sm mt-2">Type: {analytics.bestPost.type}</p>
                <p className="text-blue-200 text-sm">Date: {analytics.bestPost.date}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Reach</p>
                <p className="text-2xl font-bold text-green-400">{analytics.bestPost.reach.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Engagement</p>
                <p className="text-2xl font-bold text-purple-400">{analytics.bestPost.engagement.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Engagement Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.bestPost.engagementRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Source Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-400" />
            Dataset Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Available Metrics:</h4>
              <ul className="text-blue-200 space-y-1">
                <li>• Post impressions and reach data</li>
                <li>• Engagement metrics (likes, comments, shares, saves)</li>
                <li>• Content type analysis (photos, videos, reels, etc.)</li>
                <li>• Posting time optimization</li>
                <li>• Hashtag performance tracking</li>
                <li>• Follower growth from posts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analysis Features:</h4>
              <ul className="text-blue-200 space-y-1">
                <li>• Content type performance comparison</li>
                <li>• Reach prediction and optimization</li>
                <li>• Seasonal trend analysis</li>
                <li>• Optimal posting time identification</li>
                <li>• Engagement rate benchmarking</li>
                <li>• Caption and hashtag analysis using NLP</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
            <p className="text-sm">
              <strong>Dataset Source:</strong> This analysis simulates data similar to Instagram reach analysis datasets available on Kaggle. 
              Real datasets typically include metrics like impressions, reach, likes, comments, shares, saves, profile visits, and follower conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramAnalyzer;