import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Plus,
  Upload,
  Download,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  Share2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Wand2,
  DollarSign,
  Eye,
  RefreshCw,
  Sparkles,
  BrainCircuit,
  FilePlus,
  Sun,
  Moon,
  Image as ImageIcon,
  Table,
  Mail,
  MessageSquare,
  Send,
  GraduationCap,
  BookOpen,
  Trophy,
  Lightbulb,
  PlayCircle,
  AlertTriangle,
  Zap,
  Rocket,
  LucideIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- Interfaces ---

interface Platform {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
}

interface Status {
  id: string;
  name: string;
  color: string;
}

interface PerformanceData {
  name: string;
  spend: number;
  cpa: number;
  roas: number;
}

interface ChannelData {
  name: string;
  roas: number;
  cpa: number;
}

interface ContentItem {
  id: string;
  date: string;
  time: string;
  platform: string;
  format?: string;
  pillar: string;
  funnel: string;
  hook: string;
  caption: string;
  status: string;
  owner: string;
  ctr: string;
  impressions: string;
}

interface AgentInput {
  topic: string;
  pillar: string;
  platform: string;
}

interface ContentOption {
  hook: string;
  caption: string;
  rationale: string;
}

interface AgentOutput {
  optionA: ContentOption;
  optionB: ContentOption;
}

interface ScenarioData {
  scenario: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ScenarioFeedback {
  isCorrect: boolean;
  explanation: string;
}

interface CaseStudyData {
  tagline: string;
  challenge: string;
  insight: string;
  tactics: string[];
  results: string[];
  lesson: string;
}

// --- Constants ---

// FIX 1: Removed process.env to prevent "Cannot find name 'process'" error
const apiKey = "AIzaSyAd8uK8p897m0gL6NAs9x-OOtqc4PuexcM"; // PASTE YOUR GEMINI API KEY HERE

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram size={16} />,
    color: "#E1306C",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin size={16} />,
    color: "#0077B5",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook size={16} />,
    color: "#1877F2",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter size={16} />,
    color: "#1DA1F2",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Youtube size={16} />,
    color: "#FF0000",
  },
];

const STATUSES: Status[] = [
  { id: "idea", name: "Idea", color: "bg-gray-500" },
  { id: "drafting", name: "Drafting", color: "bg-yellow-500" },
  { id: "review", name: "In Review", color: "bg-orange-500" },
  { id: "scheduled", name: "Scheduled", color: "bg-blue-500" },
  { id: "published", name: "Published", color: "bg-green-500" },
];

const PILLARS = [
  "Education",
  "Entertainment",
  "Inspiration",
  "Promotion",
  "Culture",
  "Product",
];
const FUNNELS = ["Awareness", "Consideration", "Conversion", "Loyalty"];

const MOCK_PERFORMANCE_DATA: PerformanceData[] = [
  { name: "Mon", spend: 120, cpa: 12, roas: 2.5 },
  { name: "Tue", spend: 150, cpa: 14, roas: 2.8 },
  { name: "Wed", spend: 180, cpa: 11, roas: 3.2 },
  { name: "Thu", spend: 140, cpa: 13, roas: 2.9 },
  { name: "Fri", spend: 250, cpa: 15, roas: 3.5 },
  { name: "Sat", spend: 300, cpa: 10, roas: 4.0 },
  { name: "Sun", spend: 280, cpa: 12, roas: 3.8 },
];

const CHANNEL_DATA: ChannelData[] = [
  { name: "Instagram", roas: 3.8, cpa: 12 },
  { name: "LinkedIn", roas: 4.2, cpa: 25 },
  { name: "Facebook", roas: 2.5, cpa: 18 },
  { name: "Twitter", roas: 1.8, cpa: 8 },
];

const INITIAL_CONTENT: ContentItem[] = [
  {
    id: "101",
    date: "2025-11-21",
    time: "10:00",
    platform: "linkedin",
    format: "Carousel",
    pillar: "Education",
    funnel: "Awareness",
    hook: "5 Ways AI Changes Marketing",
    caption:
      "AI is not replacing you. It is replacing the boring parts of your job...",
    status: "published",
    owner: "Alex",
    ctr: "2.4%",
    impressions: "12.5k",
  },
  {
    id: "102",
    date: "2025-11-22",
    time: "14:00",
    platform: "instagram",
    format: "Reel",
    pillar: "Culture",
    funnel: "Engagement",
    hook: "POV: Marketing Managers on Friday",
    caption: "Wait for the end 😂 #MarketingLife #Agency",
    status: "scheduled",
    owner: "Sarah",
    ctr: "-",
    impressions: "-",
  },
];

const LEARNING_MODULES = [
  {
    id: "planning",
    title: "Strategic Planning",
    icon: CalendarIcon,
    desc: "Master the art of content calendars.",
  },
  {
    id: "crisis",
    title: "Crisis Management",
    icon: AlertTriangle,
    desc: "Handle PR disasters like a pro.",
  },
  {
    id: "analytics",
    title: "Data Analytics",
    icon: BarChart3,
    desc: "Read the numbers that matter.",
  },
  {
    id: "copywriting",
    title: "Viral Copywriting",
    icon: Wand2,
    desc: "Write hooks that stop the scroll.",
  },
];

// --- Helper Functions for Styling ---

const getGlassStyle = (theme: string, opacityValue: number) => {
  const alpha = opacityValue / 100;
  const rgb = theme === "dark" ? "20, 20, 20" : "255, 255, 255";
  return {
    backgroundColor: `rgba(${rgb}, ${alpha})`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border:
      theme === "dark"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.1)",
  };
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme: string;
  glassOpacity: number;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  theme,
  glassOpacity,
}) => (
  <div
    className={`rounded-xl p-6 shadow-lg transition-colors ${className}`}
    style={getGlassStyle(theme, glassOpacity)}
  >
    {children}
  </div>
);

const Badge = ({
  children,
  colorClass,
}: {
  children: React.ReactNode;
  colorClass: string;
}) => (
  <span
    className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${colorClass}`}
  >
    {children}
  </span>
);

// --- Sub-Components ---

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: string;
  glassOpacity: number;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  glassOpacity,
  setIsSettingsOpen,
}) => {
  const baseClass = `w-full flex items-center p-3.5 rounded-xl transition-all duration-200 mb-2 font-medium`;
  const activeClass =
    theme === "dark"
      ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
      : "bg-red-600 text-white shadow-md";
  const inactiveClass =
    theme === "dark"
      ? "text-neutral-400 hover:bg-white/10 hover:text-white"
      : "text-neutral-600 hover:bg-black/5 hover:text-black";

  return (
    <div
      className={`w-20 lg:w-72 h-full flex flex-col justify-between flex-shrink-0 z-30 border-r border-white/10 transition-all duration-300`}
      style={getGlassStyle(
        theme,
        glassOpacity > 90 ? 100 : Math.max(glassOpacity, 60)
      )}
    >
      <div>
        <div className="h-auto flex flex-col items-center lg:items-start justify-center lg:px-8 mb-8 mt-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-2xl text-white shadow-red-600/40 shadow-lg">
              N
            </div>
            <span
              className={`ml-3 font-bold text-xl hidden lg:block tracking-tight ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Newbie<span className="text-red-600">.AI</span>
            </span>
          </div>
          <p
            className={`hidden lg:block text-[10px] font-medium mt-2 tracking-wide uppercase leading-relaxed text-center lg:text-left ${
              theme === "dark" ? "text-neutral-500" : "text-gray-400"
            }`}
          >
            Learn, Plan & Analyze with Intelligence
          </p>
        </div>

        <nav className="px-3 lg:px-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`${baseClass} ${
              activeTab === "dashboard" ? activeClass : inactiveClass
            }`}
          >
            <LayoutDashboard size={22} />
            <span className="ml-3 hidden lg:block">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`${baseClass} ${
              activeTab === "calendar" ? activeClass : inactiveClass
            }`}
          >
            <CalendarIcon size={22} />
            <span className="ml-3 hidden lg:block">Planner</span>
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`${baseClass} ${
              activeTab === "tracker" ? activeClass : inactiveClass
            }`}
          >
            <BarChart3 size={22} />
            <span className="ml-3 hidden lg:block">Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab("learn")}
            className={`${baseClass} ${
              activeTab === "learn" ? activeClass : inactiveClass
            }`}
          >
            <GraduationCap size={22} />
            <span className="ml-3 hidden lg:block">Learn & Grow</span>
          </button>
        </nav>
      </div>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-colors ${
            theme === "dark"
              ? "text-neutral-400 hover:text-white hover:bg-white/10"
              : "text-gray-500 hover:text-black hover:bg-black/5"
          }`}
        >
          <Settings size={20} />
          <span className="ml-3 hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

interface DashboardViewProps {
  theme: string;
  glassOpacity: number;
  callGeminiForReport: () => void;
  aiReport: string | null;
  isReportLoading: boolean;
  handleEmailShare: () => void;
  askQuery: string;
  setAskQuery: (q: string) => void;
  handleAskData: () => void;
  isAsking: boolean;
  askResponse: string | null;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  theme,
  glassOpacity,
  callGeminiForReport,
  aiReport,
  isReportLoading,
  handleEmailShare,
  askQuery,
  setAskQuery,
  handleAskData,
  isAsking,
  askResponse,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* AI Executive Summary Section */}
    <Card
      theme={theme}
      glassOpacity={glassOpacity}
      className="relative overflow-hidden border-l-4 border-indigo-500"
    >
      <div
        className={`absolute inset-0 opacity-10 bg-gradient-to-r from-indigo-600 to-purple-600 pointer-events-none`}
      />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h4
            className={`text-xl font-bold flex items-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <Sparkles
              className="text-yellow-400 mr-2 fill-yellow-400"
              size={24}
            />
            AI Executive Brief
          </h4>
          <p
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            Real-time strategic analysis powered by Gemini 2.5
          </p>
        </div>
        <div className="flex gap-2">
          {aiReport && (
            <button
              onClick={handleEmailShare}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center ${
                theme === "dark"
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-black/5 text-black hover:bg-black/10"
              }`}
            >
              <Mail size={16} className="mr-2" /> Draft Email
            </button>
          )}
          <button
            onClick={callGeminiForReport}
            disabled={isReportLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center"
          >
            {isReportLoading ? (
              <RefreshCw className="mr-2 animate-spin" size={18} />
            ) : (
              <BrainCircuit className="mr-2" size={18} />
            )}
            {aiReport ? "Regenerate Analysis" : "Generate Report"}
          </button>
        </div>
      </div>

      {aiReport && (
        <div
          className={`p-5 rounded-xl border ${
            theme === "dark"
              ? "bg-black/30 border-indigo-500/30 text-gray-200"
              : "bg-white/50 border-indigo-200 text-gray-800"
          }`}
        >
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: aiReport }}
          />
        </div>
      )}
    </Card>

    {/* Ask The Data Feature */}
    <Card
      theme={theme}
      glassOpacity={glassOpacity}
      className="border-l-4 border-pink-500"
    >
      <div className="flex items-center mb-4">
        <MessageSquare
          className={`mr-2 ${
            theme === "dark" ? "text-pink-400" : "text-pink-600"
          }`}
          size={20}
        />
        <h4
          className={`text-lg font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Ask the Data
        </h4>
      </div>
      <div className="flex gap-3 h-12">
        <input
          type="text"
          value={askQuery}
          onChange={(e) => setAskQuery(e.target.value)}
          placeholder="e.g., Why is ROAS high this week?"
          className={`flex-1 px-4 h-full rounded-xl border outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
            theme === "dark"
              ? "bg-black/30 border-white/10 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
          onKeyDown={(e) => e.key === "Enter" && handleAskData()}
        />
        <button
          onClick={handleAskData}
          disabled={isAsking || !askQuery}
          className="w-16 h-full flex items-center justify-center bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all shadow-lg shadow-pink-600/30 disabled:opacity-50"
        >
          {isAsking ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      {askResponse && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-pink-500/10 border-pink-500/30 text-pink-100"
              : "bg-pink-50 border-pink-200 text-pink-900"
          }`}
        >
          <strong>Answer:</strong> {askResponse}
        </div>
      )}
    </Card>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          label: "Total Spend",
          value: "$12,450",
          icon: DollarSign,
          color: "red",
          change: "+12%",
        },
        {
          label: "Impressions",
          value: "2.4M",
          icon: Eye,
          color: "blue",
          change: "+8.5%",
        },
        {
          label: "Avg. ROAS",
          value: "3.2x",
          icon: Target,
          color: "emerald",
          change: "-2%",
        },
        {
          label: "Share of Voice",
          value: "18%",
          icon: Share2,
          color: "purple",
          change: "Leader: 22%",
        },
      ].map((metric, i) => (
        <Card
          key={i}
          theme={theme}
          glassOpacity={glassOpacity}
          className={`border-l-4 border-${metric.color}-500`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-neutral-400" : "text-gray-500"
                }`}
              >
                {metric.label}
              </p>
              <h3
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {metric.value}
              </h3>
            </div>
            <div
              className={`p-2.5 rounded-lg flex items-center justify-center ${
                theme === "dark" ? "bg-white/5" : "bg-black/5"
              }`}
            >
              <metric.icon size={20} className={`text-${metric.color}-500`} />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card theme={theme} glassOpacity={glassOpacity} className="lg:col-span-2">
        <h4
          className={`text-lg font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Efficiency Trend
        </h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_PERFORMANCE_DATA}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#888" : "#666"}
              />
              <YAxis
                yAxisId="left"
                stroke={theme === "dark" ? "#888" : "#666"}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={theme === "dark" ? "#888" : "#666"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
                  borderColor: theme === "dark" ? "#333" : "#eee",
                  borderRadius: "8px",
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#EF4444"
                fill="url(#colorSpend)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="roas"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10B981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card theme={theme} glassOpacity={glassOpacity}>
        <h4
          className={`text-lg font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Channel Performance
        </h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={CHANNEL_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                stroke={theme === "dark" ? "#888" : "#666"}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke={theme === "dark" ? "#ccc" : "#333"}
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Bar
                dataKey="roas"
                fill="#EF4444"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  </div>
);

interface CalendarViewProps {
  theme: string;
  glassOpacity: number;
  contentData: ContentItem[];
  handleUpdateRow: (id: string, field: string, value: string) => void;
  handleAddRow: () => void;
  setContentData: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  setIsPreviewOpen: (v: boolean) => void;
  handleResetTemplate: () => void;
  setIsAgentModalOpen: (v: boolean) => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  theme,
  glassOpacity,
  contentData,
  handleUpdateRow,
  handleAddRow,
  setContentData,
  setIsPreviewOpen,
  handleResetTemplate,
  setIsAgentModalOpen,
  handleImport,
}) => {
  const inputClass = `bg-transparent w-full outline-none border-b border-transparent focus:border-red-500 transition-colors ${
    theme === "dark"
      ? "text-white placeholder-neutral-600"
      : "text-gray-900 placeholder-gray-400"
  }`;
  const subTextClass = theme === "dark" ? "text-neutral-400" : "text-gray-500";
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Content Planner
        </h2>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-black/5 hover:bg-black/10 text-gray-900"
            }`}
          >
            <Upload size={18} className="mr-2" /> Import
          </button>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-black/5 hover:bg-black/10 text-gray-900"
            }`}
          >
            <Table size={18} className="mr-2" /> Export
          </button>
          <button
            onClick={handleResetTemplate}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-black/5 hover:bg-black/10 text-gray-900"
            }`}
          >
            <FilePlus size={18} className="mr-2" /> Reset
          </button>
          <button
            onClick={() => setIsAgentModalOpen(true)}
            className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 font-bold shadow-lg shadow-red-600/30"
          >
            <Sparkles size={18} className="mr-2 fill-white" /> AI Agent
          </button>
        </div>
      </div>

      <Card
        theme={theme}
        glassOpacity={glassOpacity}
        className="overflow-hidden p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-white/5" : "bg-black/5"
                } border-b ${
                  theme === "dark" ? "border-white/10" : "border-black/10"
                } text-xs uppercase tracking-wider ${subTextClass}`}
              >
                <th className="p-5 font-bold w-32">Status</th>
                <th className="p-5 font-bold">Date / Time</th>
                <th className="p-5 font-bold">Platform</th>
                <th className="p-5 font-bold w-72">Creative Copy</th>
                <th className="p-5 font-bold">Strategy</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === "dark" ? "divide-white/5" : "divide-black/5"
              }`}
            >
              {contentData.map((item) => (
                <tr
                  key={item.id}
                  className={`${
                    theme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"
                  } transition-colors group`}
                >
                  <td className="p-5 align-top">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "status", e.target.value)
                      }
                      className={`text-xs font-bold rounded-full px-3 py-1.5 outline-none border-none cursor-pointer appearance-none ${
                        STATUSES.find((s) => s.id === item.status)?.color ||
                        "bg-neutral-700"
                      } text-white shadow-sm`}
                    >
                      {STATUSES.map((s) => (
                        <option
                          key={s.id}
                          value={s.id}
                          className="bg-neutral-800 text-white"
                        >
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-5 align-top">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "date", e.target.value)
                      }
                      className={`${inputClass} text-sm mb-2`}
                    />
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "time", e.target.value)
                      }
                      className={`${inputClass} text-xs text-gray-500`}
                    />
                  </td>
                  <td className="p-5 align-top">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400">
                        {PLATFORMS.find((p) => p.id === item.platform)?.icon}
                      </span>
                      <select
                        value={item.platform}
                        onChange={(e) =>
                          handleUpdateRow(item.id, "platform", e.target.value)
                        }
                        className={`${inputClass} text-sm cursor-pointer font-medium`}
                      >
                        {PLATFORMS.map((p) => (
                          <option
                            key={p.id}
                            value={p.id}
                            className="bg-neutral-800 text-white"
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-5 align-top">
                    <input
                      type="text"
                      value={item.hook}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "hook", e.target.value)
                      }
                      placeholder="Write a hook..."
                      className={`${inputClass} font-bold text-sm mb-2`}
                    />
                    <textarea
                      value={item.caption}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "caption", e.target.value)
                      }
                      placeholder="Draft caption..."
                      rows={2}
                      className={`${inputClass} text-xs resize-none leading-relaxed opacity-80`}
                    />
                  </td>
                  <td className="p-5 align-top space-y-2">
                    <select
                      value={item.pillar}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "pillar", e.target.value)
                      }
                      className={`${inputClass} text-sm`}
                    >
                      <option value="">Select Pillar</option>
                      {PILLARS.map((p) => (
                        <option
                          key={p}
                          value={p}
                          className="bg-neutral-800 text-white"
                        >
                          {p}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.funnel}
                      onChange={(e) =>
                        handleUpdateRow(item.id, "funnel", e.target.value)
                      }
                      className={`${inputClass} text-xs`}
                    >
                      <option value="">Select Stage</option>
                      {FUNNELS.map((f) => (
                        <option
                          key={f}
                          value={f}
                          className="bg-neutral-800 text-white"
                        >
                          {f}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-5 text-right align-top">
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() =>
                        setContentData((prev) =>
                          prev.filter((r) => r.id !== item.id)
                        )
                      }
                    >
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAddRow}
            className={`w-full py-4 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center ${
              theme === "dark"
                ? "text-white/50 hover:text-white hover:bg-white/5"
                : "text-black/50 hover:text-black hover:bg-black/5"
            }`}
          >
            <Plus size={16} className="mr-2" /> Add Entry
          </button>
        </div>
      </Card>
    </div>
  );
};

interface LearnViewProps {
  theme: string;
  glassOpacity: number;
  handleStartScenario: (title: string) => void;
  activeScenario: string | null;
  scenarioData: ScenarioData | null;
  handleScenarioChoice: (
    choice: string,
    correct: string,
    explanation: string
  ) => void;
  scenarioLoading: boolean;
  scenarioFeedback: ScenarioFeedback | null;
  userXP: number;
  handleOpenCaseStudy: (study: string) => void;
}

const LearnView: React.FC<LearnViewProps> = ({
  theme,
  glassOpacity,
  handleStartScenario,
  activeScenario,
  scenarioData,
  handleScenarioChoice,
  scenarioLoading,
  scenarioFeedback,
  userXP,
  handleOpenCaseStudy,
}) => {
  const bgClass =
    theme === "dark"
      ? "bg-emerald-900/20 border-emerald-500/30 text-white"
      : "bg-emerald-50 border-emerald-200 text-emerald-900";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Gamification */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2
            className={`text-3xl font-bold mb-1 flex items-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <GraduationCap className="mr-3 text-emerald-500" size={32} />
            Social Media Academy
          </h2>
          <p
            className={theme === "dark" ? "text-neutral-400" : "text-gray-500"}
          >
            Master the art of digital marketing through simulation.
          </p>
        </div>
        <div
          className={`flex items-center px-5 py-3 rounded-xl border ${bgClass}`}
        >
          <Trophy
            className="text-yellow-400 mr-3"
            size={24}
            fill="currentColor"
          />
          <div>
            <p className="text-xs font-bold uppercase opacity-60">
              Career Level
            </p>
            <p className="text-xl font-bold leading-none">
              {userXP < 100
                ? "Marketing Intern"
                : userXP < 300
                ? "Social Manager"
                : "CMO"}
              <span className="ml-2 text-sm opacity-70">({userXP} XP)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Selector */}
        <div className="lg:col-span-1 space-y-4">
          <h3
            className={`font-bold uppercase text-sm tracking-wider mb-2 ${
              theme === "dark" ? "text-neutral-500" : "text-gray-500"
            }`}
          >
            Training Modules
          </h3>
          {LEARNING_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleStartScenario(mod.title)}
              className={`w-full p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${
                activeScenario === mod.title
                  ? "border-emerald-500 bg-emerald-500/10"
                  : theme === "dark"
                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                  : "bg-white border-gray-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg mr-3 ${
                      activeScenario === mod.title
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-500/20 text-neutral-500"
                    }`}
                  >
                    <mod.icon size={20} />
                  </div>
                  <div>
                    <h4
                      className={`font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {mod.title}
                    </h4>
                    <p className="text-xs opacity-60 mt-1">{mod.desc}</p>
                  </div>
                </div>
                <PlayCircle
                  size={16}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    activeScenario === mod.title
                      ? "text-emerald-500"
                      : "text-neutral-400"
                  }`}
                />
              </div>
            </button>
          ))}

          {/* Case Studies Card */}
          <div
            className={`mt-8 p-6 rounded-xl border ${
              theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`font-bold flex items-center mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <BookOpen className="mr-2 text-blue-400" size={18} />
              Case Studies
            </h3>
            <div className="space-y-3">
              {["Nike: Dream Crazy", "Spotify Wrapped", "Wendy's Twitter"].map(
                (study, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenCaseStudy(study)}
                    className={`w-full text-left p-3 rounded-lg text-sm cursor-pointer flex justify-between items-center transition-colors ${
                      theme === "dark"
                        ? "bg-black/20 hover:bg-white/10 text-neutral-300"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{study}</span>
                    <ChevronRight size={14} opacity={0.5} />
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Simulation Canvas */}
        <div className="lg:col-span-2">
          <Card
            theme={theme}
            glassOpacity={glassOpacity}
            className="h-full min-h-[500px] flex flex-col relative overflow-hidden"
          >
            {!activeScenario ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <Lightbulb
                  size={64}
                  className="mb-4 text-emerald-500"
                  strokeWidth={1}
                />
                <h3
                  className={`text-xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Select a Module to Begin
                </h3>
                <p className="max-w-xs mx-auto">
                  Choose a training scenario from the left to start your
                  simulation.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <Badge colorClass="bg-emerald-500/20 text-emerald-500">
                    Simulation Active
                  </Badge>
                  <span
                    className={`text-sm font-bold ${
                      theme === "dark" ? "text-neutral-400" : "text-gray-500"
                    }`}
                  >
                    {activeScenario}
                  </span>
                </div>

                {scenarioLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <RefreshCw
                      className="animate-spin text-emerald-500 mb-4"
                      size={48}
                    />
                    <p className="animate-pulse font-medium">
                      AI Mentor is generating scenario...
                    </p>
                  </div>
                ) : scenarioFeedback ? (
                  <div className="animate-in zoom-in-95 duration-300">
                    <div
                      className={`p-6 rounded-xl mb-6 border ${
                        scenarioFeedback.isCorrect
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          scenarioFeedback.isCorrect
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {scenarioFeedback.isCorrect
                          ? "Excellent Choice! +50 XP"
                          : "Not Quite Right"}
                      </h3>
                      <p
                        className={`leading-relaxed ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {scenarioFeedback.explanation}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartScenario(activeScenario)} // Restart or Next
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                    >
                      Next Scenario{" "}
                      <ChevronRight className="inline ml-1" size={18} />
                    </button>
                  </div>
                ) : scenarioData ? (
                  <div className="animate-in fade-in duration-500">
                    <p
                      className={`text-lg leading-relaxed mb-8 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {scenarioData.scenario}
                    </p>
                    <div className="space-y-4">
                      {scenarioData.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleScenarioChoice(
                              opt,
                              scenarioData.correctAnswer,
                              scenarioData.explanation
                            )
                          }
                          className={`w-full text-left p-5 rounded-xl border transition-all hover:translate-x-1 ${
                            theme === "dark"
                              ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500"
                              : "bg-gray-50 border-gray-200 hover:bg-white hover:border-emerald-500"
                          }`}
                        >
                          <span className="font-bold text-emerald-500 mr-3">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span
                            className={
                              theme === "dark"
                                ? "text-neutral-200"
                                : "text-gray-800"
                            }
                          >
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  glassOpacity: number;
  agentInput: AgentInput;
  setAgentInput: React.Dispatch<React.SetStateAction<AgentInput>>;
  agentOutput: AgentOutput | null;
  setAgentOutput: (output: AgentOutput | null) => void;
  handleGenerate: () => void;
  handleApprove: (option: "optionA" | "optionB") => void;
  isGenerating: boolean;
  agentError: string | null;
}

const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  theme,
  glassOpacity,
  agentInput,
  setAgentInput,
  agentOutput,
  setAgentOutput,
  handleGenerate,
  handleApprove,
  isGenerating,
  agentError,
}) => {
  if (!isOpen) return null;
  const bgClass =
    theme === "dark"
      ? "bg-neutral-900/90 text-white"
      : "bg-white/90 text-gray-900";
  const borderClass = theme === "dark" ? "border-white/10" : "border-black/10";
  const inputBgClass =
    theme === "dark"
      ? "bg-black/40 border-white/10 text-white"
      : "bg-white border-gray-300 text-black";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${bgClass} ${borderClass}`}
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div
          className={`p-6 border-b ${borderClass} flex justify-between items-center sticky top-0 z-10 ${
            theme === "dark" ? "bg-neutral-900/50" : "bg-white/50"
          } backdrop-blur-md`}
        >
          <h3 className="text-2xl font-bold flex items-center">
            <Sparkles className="mr-3 text-red-600 fill-red-600" /> Agentic
            Content Creator
          </h3>
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-8">
          {agentError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 flex items-center">
              <XCircle size={20} className="mr-2" /> {agentError}
            </div>
          )}
          {!agentOutput ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide opacity-60 mb-3">
                    Campaign / Topic
                  </label>
                  <input
                    type="text"
                    value={agentInput.topic}
                    onChange={(e) =>
                      setAgentInput((prev) => ({
                        ...prev,
                        topic: e.target.value,
                      }))
                    }
                    placeholder="e.g., Launching new Summer Collection"
                    className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500 transition-all ${inputBgClass}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide opacity-60 mb-3">
                    Content Pillar
                  </label>
                  <select
                    value={agentInput.pillar}
                    onChange={(e) =>
                      setAgentInput((prev) => ({
                        ...prev,
                        pillar: e.target.value,
                      }))
                    }
                    className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500 transition-all ${inputBgClass}`}
                  >
                    <option value="">Select Pillar...</option>
                    {PILLARS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide opacity-60 mb-3">
                  Platform
                </label>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        setAgentInput((prev) => ({ ...prev, platform: p.id }))
                      }
                      className={`flex items-center px-5 py-3 rounded-xl border transition-all ${
                        agentInput.platform === p.id
                          ? `bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20`
                          : `bg-transparent ${borderClass} opacity-60 hover:opacity-100`
                      }`}
                    >
                      <span className="mr-2">{p.icon}</span> {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !agentInput.topic}
                  className="flex items-center px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 font-bold text-lg shadow-xl shadow-red-600/30"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" /> Agent is
                      thinking...
                    </>
                  ) : (
                    <>
                      ✨ Generate Concepts{" "}
                      <ChevronRight className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <p className="text-lg opacity-80">
                  The Agent has generated two A/B variations.
                </p>
                <button
                  onClick={() => setAgentOutput(null)}
                  className="text-red-500 hover:underline font-medium"
                >
                  Create New
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`rounded-2xl p-6 border hover:border-blue-500 transition-colors ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge colorClass="bg-blue-500/20 text-blue-500">
                      Option A
                    </Badge>
                    <span className="text-xs opacity-50 font-mono">
                      DIRECT STRATEGY
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold opacity-50 block mb-1">
                        HOOK
                      </span>
                      <p className="text-lg font-bold">
                        {agentOutput.optionA.hook}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold opacity-50 block mb-1">
                        CAPTION
                      </span>
                      <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">
                        {agentOutput.optionA.caption}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove("optionA")}
                      className="w-full py-3 mt-4 bg-neutral-800 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center font-bold shadow-lg"
                    >
                      <CheckCircle2 className="mr-2" size={18} /> Approve Option
                      A
                    </button>
                  </div>
                </div>
                <div
                  className={`rounded-2xl p-6 border hover:border-purple-500 transition-colors ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge colorClass="bg-purple-500/20 text-purple-500">
                      Option B
                    </Badge>
                    <span className="text-xs opacity-50 font-mono">
                      CREATIVE STRATEGY
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold opacity-50 block mb-1">
                        HOOK
                      </span>
                      <p className="text-lg font-bold">
                        {agentOutput.optionB.hook}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold opacity-50 block mb-1">
                        CAPTION
                      </span>
                      <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">
                        {agentOutput.optionB.caption}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove("optionB")}
                      className="w-full py-3 mt-4 bg-neutral-800 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center font-bold shadow-lg"
                    >
                      <CheckCircle2 className="mr-2" size={18} /> Approve Option
                      B
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  title: string | null;
  content: CaseStudyData | null;
  isLoading: boolean;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  isOpen,
  onClose,
  theme,
  title,
  content,
  isLoading,
}) => {
  if (!isOpen) return null;
  const bgClass =
    theme === "dark"
      ? "bg-neutral-900/90 text-white"
      : "bg-white/90 text-gray-900";
  const borderClass = theme === "dark" ? "border-white/10" : "border-black/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl ${bgClass} ${borderClass}`}
        style={{ backdropFilter: "blur(20px)" }}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${borderClass} flex justify-between items-center sticky top-0 z-10 ${
            theme === "dark" ? "bg-neutral-900/50" : "bg-white/50"
          } backdrop-blur-md`}
        >
          <div>
            <h3 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-3 text-blue-500" />{" "}
              {title || "Case Study"}
            </h3>
            {content && content.tagline && (
              <p className="text-sm opacity-60 mt-1 italic">
                {content.tagline}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw
                className="animate-spin text-blue-500 mb-4"
                size={48}
              />
              <p className="animate-pulse font-medium">
                Analyzing Campaign Strategy...
              </p>
            </div>
          ) : content ? (
            <div className="space-y-8">
              {/* Section 1: The Why (Objective & Meaning) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <div className="flex items-center mb-3 text-blue-500">
                    <Target size={24} className="mr-2" />
                    <h4 className="font-bold text-lg">The Objective</h4>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-blue-100" : "text-blue-900"
                    }`}
                  >
                    {content.challenge}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-purple-500/10 border-purple-500/20"
                      : "bg-purple-50 border-purple-100"
                  }`}
                >
                  <div className="flex items-center mb-3 text-purple-500">
                    <Lightbulb size={24} className="mr-2" />
                    <h4 className="font-bold text-lg">The Meaning (Insight)</h4>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-purple-100" : "text-purple-900"
                    }`}
                  >
                    {content.insight}
                  </p>
                </div>
              </div>

              {/* Section 2: The How (Tactics) */}
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center border-b border-white/10 pb-2">
                  <Zap className="mr-2 text-yellow-500" size={20} /> Key Tactics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.tactics &&
                    content.tactics.map((tactic, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="font-bold text-lg text-yellow-500 mb-2">
                          0{i + 1}
                        </div>
                        <p className="text-sm opacity-80">{tactic}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Section 3: The Impact (Results) */}
              <div
                className={`p-6 rounded-xl border ${
                  theme === "dark"
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-green-50 border-green-100"
                }`}
              >
                <h4 className="text-lg font-bold mb-4 flex items-center text-green-500">
                  <TrendingUp className="mr-2" size={20} /> Impact & Results
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.results &&
                    content.results.map((res, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle2
                          className="mr-3 text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-sm">{res}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer: Lesson for Interns */}
              <div
                className={`mt-6 p-4 rounded-lg flex items-start ${
                  theme === "dark" ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <Rocket
                  className="mr-3 text-orange-500 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h5 className="font-bold text-sm text-orange-500 uppercase tracking-wide mb-1">
                    Lesson for Interns
                  </h5>
                  <p className="text-sm opacity-80 italic">
                    "{content.lesson}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center opacity-50">No content available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  bgImage: string | null;
  setBgImage: (img: string | null) => void;
  glassOpacity: number;
  setGlassOpacity: (opacity: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  bgImage,
  setBgImage,
  glassOpacity,
  setGlassOpacity,
}) => {
  if (!isOpen) return null;
  const modalBg =
    theme === "dark"
      ? "bg-neutral-900 text-white border-white/10"
      : "bg-white text-gray-900 border-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl border ${modalBg}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Settings className="mr-2" size={20} /> Settings
          </h3>
          <button onClick={onClose}>
            <XCircle size={24} className="opacity-50 hover:opacity-100" />
          </button>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold mb-3 opacity-70">
              Interface Theme
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center transition-all ${
                  theme === "dark"
                    ? "border-red-500 bg-red-500/10 text-red-500 shadow-inner"
                    : "border-transparent bg-neutral-100 text-gray-500"
                }`}
              >
                <Moon size={18} className="mr-2" /> Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-inner"
                    : "border-transparent bg-neutral-800 text-gray-500"
                }`}
              >
                <Sun size={18} className="mr-2" /> Light
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold opacity-70">
                Glass Opacity
              </label>
              <span className="text-xs font-mono opacity-50">
                {glassOpacity}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={glassOpacity}
              onChange={(e) => setGlassOpacity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs opacity-40 mt-1">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-3 opacity-70">
              Wallpaper
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                theme === "dark"
                  ? "border-neutral-700 hover:border-neutral-500 hover:bg-white/5"
                  : "border-gray-300 hover:border-gray-400 hover:bg-black/5"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setBgImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="bg-upload"
              />
              <label
                htmlFor="bg-upload"
                className="cursor-pointer flex flex-col items-center w-full h-full"
              >
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-sm opacity-70">Upload Custom Image</span>
              </label>
            </div>
            {bgImage && (
              <button
                onClick={() => setBgImage(null)}
                className="text-xs text-red-500 mt-3 hover:underline w-full text-center"
              >
                Remove Wallpaper
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  contentData: ContentItem[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  theme,
  contentData,
}) => {
  if (!isOpen) return null;

  // FIX 2: Use Object.keys().map() instead of Object.values() for better TS/Sandbox compatibility
  const triggerDownload = () => {
    const headers = Object.keys(contentData[0] || {}).join(",");
    const rows = contentData.map((row) =>
      Object.keys(row)
        .map((k) => (row as any)[k])
        .join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "content_calendar_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-900 border-neutral-800 text-white"
            : "bg-white border-gray-200 text-neutral-900"
        } border rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl`}
      >
        <div className="p-6 border-b border-neutral-800/50 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold flex items-center">
              <Table className="mr-2 text-green-500" /> Spreadsheet Preview
            </h3>
            <p className="text-sm opacity-60">
              Review your data before exporting to CSV.
            </p>
          </div>
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 hover:text-red-500"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-500/5">
          <div className="bg-white text-black border border-gray-300 shadow-sm text-xs font-mono overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  {Object.keys(contentData[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="p-2 border-r border-gray-300 font-bold text-left uppercase text-gray-600"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contentData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-blue-50"
                  >
                    {/* FIX 3: Replace Object.values with Object.keys map and explicit typing */}
                    {Object.keys(row)
                      .map((k) => (row as any)[k])
                      .map((val: any, vIdx: number) => (
                        <td
                          key={vIdx}
                          className="p-2 border-r border-gray-200 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                        >
                          {val}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6 border-t border-neutral-800/50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-500/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={triggerDownload}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg flex items-center"
          >
            <Download size={18} className="mr-2" /> Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className={`absolute top-12 right-0 w-80 p-4 rounded-xl shadow-2xl z-50 border ${
        theme === "dark"
          ? "bg-neutral-900 border-white/10 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
      <h4 className="font-bold mb-3">Notifications</h4>
      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-2 rounded hover:bg-gray-500/10 cursor-pointer">
          <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium">Report Ready</p>
            <p className="text-xs opacity-60">
              Your weekly analysis is complete.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-2 rounded hover:bg-gray-500/10 cursor-pointer">
          <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium">Post Published</p>
            <p className="text-xs opacity-60">
              LinkedIn post went live at 9:00 AM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function AgenticCommandCenter() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contentData, setContentData] =
    useState<ContentItem[]>(INITIAL_CONTENT);

  // Theme & Customization State
  const [theme, setTheme] = useState("dark");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [glassOpacity, setGlassOpacity] = useState(85);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Agent Modal State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentInput, setAgentInput] = useState<AgentInput>({
    topic: "",
    pillar: "",
    platform: "linkedin",
  });
  const [agentOutput, setAgentOutput] = useState<AgentOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  // Export/Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // AI Report & Ask State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [askQuery, setAskQuery] = useState("");
  const [askResponse, setAskResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  // Learning Module State
  const [userXP, setUserXP] = useState(0);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioFeedback, setScenarioFeedback] =
    useState<ScenarioFeedback | null>(null);

  // Case Study State
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(
    null
  );
  const [caseStudyContent, setCaseStudyContent] =
    useState<CaseStudyData | null>(null);
  const [isCaseStudyLoading, setIsCaseStudyLoading] = useState(false);

  // -- Handlers --

  const callGeminiForContent = async (
    topic: string,
    pillar: string,
    platform: string
  ) => {
    setIsGenerating(true);
    setAgentError(null);
    try {
      const systemPrompt = `You are an expert social media strategist. Generate A/B testing options for: Topic: ${topic}, Pillar: ${pillar}, Platform: ${platform}. Option A: Direct/Educational. Option B: Creative/Contrarian. Output valid JSON schema: { "optionA": { "hook": "", "caption": "", "rationale": "" }, "optionB": { ... } }`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      const data = await response.json();
      setAgentOutput(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (err) {
      setAgentError("Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const callGeminiForReport = async () => {
    setIsReportLoading(true);
    try {
      const contextData = {
        weeklyTrend: MOCK_PERFORMANCE_DATA,
        channelMix: CHANNEL_DATA,
        totalSpend: 12450,
      };
      const prompt = `Analyze this data for an Exec Summary: ${JSON.stringify(
        contextData
      )}. Return HTML (p, ul, li, strong) with efficiency summary, best channel, and recommendation.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      setAiReport(data.candidates[0].content.parts[0].text);
    } catch (err) {
      setAiReport("<p>Error generating report.</p>");
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleEmailShare = async () => {
    if (!aiReport) return;
    const stripHtml = (html: string) => {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    // Use Gemini to format as email
    const cleanText = stripHtml(aiReport);
    const prompt = `Rewrite the following executive summary into a professional, jargon-free email draft for a CMO. Subject line included. \n\nSummary:\n${cleanText}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      const emailBody = data.candidates[0].content.parts[0].text;

      // Open mailto
      const subject = "Weekly Social Media Performance Update";
      window.open(
        `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(emailBody)}`
      );
    } catch (e) {
      console.error("Email draft failed", e);
    }
  };

  const handleAskData = async () => {
    if (!askQuery) return;
    setIsAsking(true);
    try {
      const contextData = {
        weeklyTrend: MOCK_PERFORMANCE_DATA,
        channelMix: CHANNEL_DATA,
        totalSpend: 12450,
      };
      const prompt = `Answer this user query based on the social media data: "${askQuery}". Data: ${JSON.stringify(
        contextData
      )}. Keep it short and analytical.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      setAskResponse(data.candidates[0].content.parts[0].text);
    } catch (e) {
      setAskResponse("Sorry, I couldn't analyze the data right now.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleStartScenario = async (moduleTitle: string) => {
    setActiveScenario(moduleTitle);
    setScenarioData(null);
    setScenarioFeedback(null);
    setScenarioLoading(true);

    try {
      const prompt = `Generate a realistic social media management scenario for a junior manager learning about "${moduleTitle}". 
        Structure the response as valid JSON:
        {
            "scenario": "Detailed description of the situation...",
            "options": ["Option A description", "Option B description", "Option C description"],
            "correctAnswer": "Option A description", 
            "explanation": "Why this is the best choice..."
        }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      const data = await response.json();
      setScenarioData(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (e) {
      console.error(e);
    } finally {
      setScenarioLoading(false);
    }
  };

  const handleOpenCaseStudy = async (studyName: string) => {
    setSelectedCaseStudy(studyName);
    setCaseStudyContent(null);
    setIsCaseStudyLoading(true);

    try {
      const prompt = `Analyze the marketing campaign "${studyName}" for a social media academy. 
        Provide a response in strictly valid JSON format with these exact fields:
        {
           "tagline": "A catchy one-liner describing the core genius of the campaign",
           "challenge": "What was the core problem or objective they were trying to solve?",
           "insight": "What was the deep consumer or cultural insight that made it work? (The Meaning)",
           "tactics": ["Tactic 1", "Tactic 2", "Tactic 3"],
           "results": ["Result 1", "Result 2", "Result 3"],
           "lesson": "One specific, actionable lesson for a marketing intern."
        }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      const data = await response.json();
      setCaseStudyContent(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (e) {
      console.error(e);
      setCaseStudyContent(null);
    } finally {
      setIsCaseStudyLoading(false);
    }
  };

  const handleScenarioChoice = (
    choice: string,
    correct: string,
    explanation: string
  ) => {
    const isCorrect = choice === correct;
    if (isCorrect) setUserXP((prev) => prev + 50);
    setScenarioFeedback({ isCorrect, explanation });
  };

  const handleApprove = (optionType: "optionA" | "optionB") => {
    if (!agentOutput) return;
    const approved = agentOutput[optionType];
    const newPost: ContentItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      platform: agentInput.platform,
      format: "Post",
      pillar: agentInput.pillar,
      funnel: "Awareness",
      hook: approved.hook,
      caption: approved.caption,
      status: "drafting",
      owner: "AI Agent",
      ctr: "-",
      impressions: "-",
    };
    setContentData([newPost, ...contentData]);
    setIsAgentModalOpen(false);
    setAgentOutput(null);
    setAgentInput({ topic: "", pillar: "", platform: "linkedin" });
    setActiveTab("calendar");
  };

  const handleUpdateRow = (id: string, field: string, value: string) =>
    setContentData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  const handleAddRow = () =>
    setContentData([
      ...contentData,
      {
        id: `new-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        platform: "instagram",
        format: "Post",
        pillar: "Education",
        funnel: "Awareness",
        hook: "",
        caption: "",
        status: "idea",
        owner: "Me",
        ctr: "-",
        impressions: "-",
      },
    ]);
  const handleResetTemplate = () => {
    if (window.confirm("Clear calendar and start new?")) {
      setContentData([]);
      handleAddRow();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === "string") {
          const rows = text.split("\n").slice(1); // Skip header
          const newData = rows
            .map((row, idx) => {
              const cols = row.split(",");
              if (cols.length < 5) return null;
              return {
                id: `imported-${Date.now()}-${idx}`,
                status: cols[0] || "idea",
                date: cols[1] || new Date().toISOString().split("T")[0],
                time: cols[2] || "10:00",
                platform: cols[3] || "linkedin",
                hook: cols[4] || "",
                caption: cols[5] || "",
                pillar: cols[6] || "Education",
                funnel: cols[7] || "Awareness",
                ctr: "-",
                impressions: "-",
                owner: "Imported",
              } as ContentItem;
            })
            .filter((item): item is ContentItem => item !== null);
          setContentData([...contentData, ...newData]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden relative text-${
        theme === "dark" ? "white" : "gray-900"
      }`}
    >
      <div className="fixed inset-0 z-0">
        {bgImage ? (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        ) : (
          <div
            className={`w-full h-full ${
              theme === "dark" ? "bg-neutral-950" : "bg-gray-100"
            } transition-colors duration-500`}
          />
        )}
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        glassOpacity={glassOpacity}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header
          className="h-20 border-b border-white/5 flex items-center justify-between px-8 flex-shrink-0 transition-all"
          style={getGlassStyle(theme, glassOpacity)}
        >
          <h1 className="text-2xl font-bold capitalize tracking-tight">
            {activeTab}
          </h1>
          <div className="flex items-center space-x-6">
            <div
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                theme={theme}
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                JD
              </div>
              <div className="hidden lg:block leading-tight">
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-xs opacity-60">AVP Marketing</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "dashboard" && (
              <DashboardView
                theme={theme}
                glassOpacity={glassOpacity}
                callGeminiForReport={callGeminiForReport}
                aiReport={aiReport}
                isReportLoading={isReportLoading}
                handleEmailShare={handleEmailShare}
                askQuery={askQuery}
                setAskQuery={setAskQuery}
                handleAskData={handleAskData}
                isAsking={isAsking}
                askResponse={askResponse}
              />
            )}
            {activeTab === "calendar" && (
              <CalendarView
                theme={theme}
                glassOpacity={glassOpacity}
                contentData={contentData}
                handleUpdateRow={handleUpdateRow}
                handleAddRow={handleAddRow}
                setContentData={setContentData}
                setIsPreviewOpen={setIsPreviewOpen}
                handleResetTemplate={handleResetTemplate}
                setIsAgentModalOpen={setIsAgentModalOpen}
                handleImport={handleImport}
              />
            )}
            {activeTab === "tracker" && (
              <div className="flex items-center justify-center h-96 opacity-50">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Tracker Module</h3>
                  <p>Coming soon...</p>
                </div>
              </div>
            )}
            {activeTab === "learn" && (
              <LearnView
                theme={theme}
                glassOpacity={glassOpacity}
                handleStartScenario={handleStartScenario}
                activeScenario={activeScenario}
                scenarioData={scenarioData}
                handleScenarioChoice={handleScenarioChoice}
                scenarioLoading={scenarioLoading}
                scenarioFeedback={scenarioFeedback}
                userXP={userXP}
                handleOpenCaseStudy={handleOpenCaseStudy}
              />
            )}
          </div>
        </main>
      </div>

      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        theme={theme}
        glassOpacity={glassOpacity}
        agentInput={agentInput}
        setAgentInput={setAgentInput}
        agentOutput={agentOutput}
        setAgentOutput={setAgentOutput}
        handleGenerate={() =>
          callGeminiForContent(
            agentInput.topic,
            agentInput.pillar,
            agentInput.platform
          )
        }
        handleApprove={handleApprove}
        isGenerating={isGenerating}
        agentError={agentError}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        bgImage={bgImage}
        setBgImage={setBgImage}
        glassOpacity={glassOpacity}
        setGlassOpacity={setGlassOpacity}
      />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        theme={theme}
        contentData={contentData}
      />
      <CaseStudyModal
        isOpen={!!selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        theme={theme}
        title={selectedCaseStudy}
        content={caseStudyContent}
        isLoading={isCaseStudyLoading}
      />
    </div>
  );
}
