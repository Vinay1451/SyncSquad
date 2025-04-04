import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSafeHealthData } from "@/hooks/use-safe-context";
import { motion } from "framer-motion";

type TimeRange = "day" | "week" | "month";

export default function BloodSugarMonitor() {
  const { healthData } = useSafeHealthData();
  const [selectedRange, setSelectedRange] = useState<TimeRange>("day");
  const [animateChart, setAnimateChart] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Chart animation
  useEffect(() => {
    if (!animateChart) return;
    
    const intervalId = setInterval(() => {
      if (!svgRef.current) return;
      
      const points = svgRef.current.querySelectorAll('.glucose-point');
      const path = svgRef.current.querySelector('.glucose-line');
      const area = svgRef.current.querySelector('.glucose-area');
      
      // Get the current dataset based on selected range
      const currentData = selectedRange === "day" 
        ? healthData.glucoseReadings 
        : selectedRange === "week" 
          ? healthData.weeklyGlucoseReadings 
          : healthData.monthlyGlucoseReadings;
          
      // Base positions from the chart
      const basePositions = currentData.map((reading, index) => {
        // Map the glucose value to a y position (higher glucose = lower y value)
        // Map to a range between 200 (very low) and 30 (very high)
        const normalizedY = 200 - ((reading.value - 40) * 140) / 360;
        const x = (index * 500) / (currentData.length - 1);
        return { cx: x, cy: normalizedY };
      });
      
      // Update chart with small random variations
      let pathD = 'M';
      let areaD = 'M';
      
      basePositions.forEach((pos, i) => {
        // Add small random variation
        const variation = Math.random() * 4 - 2;
        const newY = pos.cy + variation;
        
        // Update point positions if available
        if (points[i]) {
          points[i].setAttribute('cy', newY.toString());
        }
        
        // Update path data
        if (i === 0) {
          pathD += `${pos.cx},${newY} `;
          areaD += `${pos.cx},${newY} `;
        } else {
          pathD += `L${pos.cx},${newY} `;
          areaD += `L${pos.cx},${newY} `;
        }
      });
      
      // Complete the area path
      areaD += 'L500,200 L0,200 Z';
      
      // Update paths
      if (path && area) {
        path.setAttribute('d', pathD);
        area.setAttribute('d', areaD);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [animateChart, healthData.glucoseReadings, healthData.weeklyGlucoseReadings, healthData.monthlyGlucoseReadings, selectedRange]);

  const renderTimeSelector = (range: TimeRange, label: string) => (
    <Button
      size="sm"
      variant={selectedRange === range ? "default" : "ghost"}
      onClick={() => setSelectedRange(range)}
      className={`px-3 py-1 rounded-full text-sm ${selectedRange === range ? "" : "hover:bg-primary/10"}`}
    >
      {label}
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Blood Sugar Trends</CardTitle>
            <div className="flex space-x-2">
              {renderTimeSelector("day", "Day")}
              {renderTimeSelector("week", "Week")}
              {renderTimeSelector("month", "Month")}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Trend Analysis Section */}
          <div className="bg-muted/30 p-3 rounded-lg mb-4 border border-border/30">
            <div className="text-sm font-medium mb-2">Trend Analysis - {selectedRange === "day" ? "Today" : selectedRange === "week" ? "This Week" : "This Month"}</div>
            
            {(() => {
              // Get current dataset based on selected range
              const currentData = selectedRange === "day" 
                ? healthData.glucoseReadings 
                : selectedRange === "week" 
                  ? healthData.weeklyGlucoseReadings 
                  : healthData.monthlyGlucoseReadings;
              
              // Calculate average
              const average = currentData.reduce((sum, reading) => sum + reading.value, 0) / currentData.length;
              
              // Determine if trending up, down, or stable
              const firstHalf = currentData.slice(0, Math.floor(currentData.length / 2));
              const secondHalf = currentData.slice(Math.floor(currentData.length / 2));
              
              const firstHalfAvg = firstHalf.reduce((sum, reading) => sum + reading.value, 0) / firstHalf.length;
              const secondHalfAvg = secondHalf.reduce((sum, reading) => sum + reading.value, 0) / secondHalf.length;
              
              const diff = secondHalfAvg - firstHalfAvg;
              const trendDirection = diff > 5 ? "up" : diff < -5 ? "down" : "stable";
              
              // Determine status based on average
              let status = "normal";
              let statusText = "Normal Range";
              let statusColor = "bg-green-500";
              
              if (average > 200) {
                status = "high";
                statusText = "High Risk";
                statusColor = "bg-red-500";
              } else if (average > 140) {
                status = "warning";
                statusText = "Warning";
                statusColor = "bg-yellow-500";
              } else if (average < 70) {
                status = "low";
                statusText = "Low";
                statusColor = "bg-red-500";
              }
              
              return (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{statusText}</span>
                      <span className="text-xs text-muted-foreground">Avg: {Math.round(average)} mg/dL</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {trendDirection === "up" && (
                      <div className="flex items-center text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-sm ml-1">Trending Up</span>
                      </div>
                    )}
                    
                    {trendDirection === "down" && (
                      <div className="flex items-center text-green-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                        </svg>
                        <span className="text-sm ml-1">Trending Down</span>
                      </div>
                    )}
                    
                    {trendDirection === "stable" && (
                      <div className="flex items-center text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                        <span className="text-sm ml-1">Stable</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        
          <div className="h-[200px] relative">
            <svg ref={svgRef} className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glucose-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Zone markers */}
              <rect className="fill-red-100 dark:fill-red-900/20" x="0" y="0" width="500" height="30" />
              <rect className="fill-yellow-100 dark:fill-yellow-900/20" x="0" y="30" width="500" height="30" />
              <rect className="fill-green-100 dark:fill-green-900/20" x="0" y="60" width="500" height="80" />
              <rect className="fill-yellow-100 dark:fill-yellow-900/20" x="0" y="140" width="500" height="30" />
              <rect className="fill-red-100 dark:fill-red-900/20" x="0" y="170" width="500" height="30" />
              
              {/* Data lines */}
              <path 
                className="glucose-line fill-none stroke-primary stroke-2" 
                d={`M${(selectedRange === "day" ? healthData.glucoseReadings : 
                      selectedRange === "week" ? healthData.weeklyGlucoseReadings : 
                      healthData.monthlyGlucoseReadings).map((reading, index, arr) => {
                  const x = (index * 500) / (arr.length - 1);
                  const y = 200 - ((reading.value - 40) * 140) / 360;
                  return `${index === 0 ? '' : 'L'}${x},${y}`;
                }).join(' ')}`}
              />
              
              <path 
                className="glucose-area fill-[url(#glucose-gradient)]" 
                d={`M${(selectedRange === "day" ? healthData.glucoseReadings : 
                      selectedRange === "week" ? healthData.weeklyGlucoseReadings : 
                      healthData.monthlyGlucoseReadings).map((reading, index, arr) => {
                  const x = (index * 500) / (arr.length - 1);
                  const y = 200 - ((reading.value - 40) * 140) / 360;
                  return `${index === 0 ? '' : 'L'}${x},${y}`;
                }).join(' ')} L500,200 L0,200 Z`}
              />
              
              {/* Data points */}
              {(selectedRange === "day" ? healthData.glucoseReadings : 
                selectedRange === "week" ? healthData.weeklyGlucoseReadings : 
                healthData.monthlyGlucoseReadings).map((reading, index, arr) => {
                const x = (index * 500) / (arr.length - 1);
                const y = 200 - ((reading.value - 40) * 140) / 360;
                return (
                  <circle 
                    key={index}
                    className="glucose-point fill-primary stroke-background stroke-2 cursor-pointer hover:r-[6px] transition-[r]"
                    cx={x}
                    cy={y}
                    r="4"
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="grid grid-cols-5 text-xs mt-2 text-muted-foreground">
            {(selectedRange === "day" ? 
              ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM"] : 
              selectedRange === "week" ? 
              ["Mon", "Tue", "Wed", "Thu", "Fri-Sun"] :
              ["Week 1", "Week 2", "Week 3", "Week 4", ""]).map((time, i) => (
              <div key={i} className={i === 4 ? "text-right" : ""}>{time}</div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">High Risk (&gt;200)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Warning (140-200)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Normal (70-140)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
