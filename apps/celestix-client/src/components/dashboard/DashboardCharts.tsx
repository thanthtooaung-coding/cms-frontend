import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const visitData = [
  { name: "Jan 01", teamA: 40, teamB: 24, teamC: 35 },
  { name: "Jan 05", teamA: 30, teamB: 13, teamC: 25 },
  { name: "Jan 10", teamA: 50, teamB: 35, teamC: 45 },
  { name: "Jan 15", teamA: 45, teamB: 30, teamC: 40 },
  { name: "Jan 20", teamA: 60, teamB: 45, teamC: 55 },
  { name: "Jan 25", teamA: 55, teamB: 40, teamC: 50 },
  { name: "Jan 30", teamA: 70, teamB: 55, teamC: 65 },
];

const pieData = [
  { name: "America", value: 37, color: "#10B981" },
  { name: "Asia", value: 34, color: "#3B82F6" },
  { name: "Europe", value: 23, color: "#F59E0B" },
  { name: "Africa", value: 6, color: "#EF4444" },
];

const conversionData = [
  { country: "India", value: 900 },
  { country: "USA", value: 800 },
  { country: "China", value: 700 },
  { country: "Canada", value: 600 },
  { country: "Australia", value: 500 },
  { country: "Germany", value: 400 },
  { country: "France", value: 350 },
  { country: "Netherlands", value: 300 },
  { country: "United States", value: 1200 },
  { country: "United Kingdom", value: 1000 },
];

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Website Visits Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Website Visits</h3>
          <p className="text-sm text-muted-foreground">(+43%) than last year</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Line type="monotone" dataKey="teamA" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="teamB" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="teamC" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Team A</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Team B</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Team C</span>
          </div>
        </div>
      </Card>

      {/* Current Visits Pie Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Current Visits</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversion Rates */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Conversion Rates</h3>
          <p className="text-sm text-muted-foreground">(+43%) than last year</p>
        </div>
        <div className="space-y-4">
          {conversionData.slice(0, 8).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground w-24">{item.country}</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(item.value / 1200) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground w-12 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Subject Radar */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Current Subject</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Radar Chart Background */}
              <polygon 
                points="100,20 170,50 170,150 100,180 30,150 30,50" 
                fill="none" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />
              <polygon 
                points="100,40 150,65 150,135 100,160 50,135 50,65" 
                fill="none" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />
              <polygon 
                points="100,60 130,80 130,120 100,140 70,120 70,80" 
                fill="none" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />
              
              {/* Data Visualization */}
              <polygon 
                points="100,30 160,60 140,130 80,150 40,120 60,70" 
                fill="hsl(var(--primary) / 0.3)" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
              />
              
              {/* Labels */}
              <text x="100" y="15" textAnchor="middle" className="fill-muted-foreground text-xs">English</text>
              <text x="175" y="55" textAnchor="middle" className="fill-muted-foreground text-xs">History</text>
              <text x="175" y="155" textAnchor="middle" className="fill-muted-foreground text-xs">Physics</text>
              <text x="100" y="195" textAnchor="middle" className="fill-muted-foreground text-xs">Geography</text>
              <text x="25" y="155" textAnchor="middle" className="fill-muted-foreground text-xs">Chinese</text>
              <text x="25" y="55" textAnchor="middle" className="fill-muted-foreground text-xs">Math</text>
            </svg>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Series 1</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Series 2</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Series 3</span>
          </div>
        </div>
      </Card>
    </div>
  );
};