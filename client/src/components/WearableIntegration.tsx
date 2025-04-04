import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WatchIcon, FolderSync, Settings, Circle, Battery } from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { motion } from "framer-motion";

export default function WearableIntegration() {
  const { healthData } = useHealthData();
  const [isConnected, setIsConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWatch = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Wearable Device</CardTitle>
            <div className="text-sm text-green-500 flex items-center">
              {isConnected ? (
                <>
                  <Circle className="h-2 w-2 mr-1 fill-green-500" /> Connected
                </>
              ) : isConnecting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Circle className="h-2 w-2 mr-1" />
                  </motion.div>
                  Connecting...
                </>
              ) : (
                <>
                  <Circle className="h-2 w-2 mr-1" /> Disconnected
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected && !isConnecting ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <WatchIcon className="h-8 w-8" />
              </div>
              <h3 className="font-medium mb-2">No device connected</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect your smartwatch to monitor your health in real-time</p>
              <Button onClick={handleConnectWatch}>
                Connect Device
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="relative aspect-[1/1.2] max-w-[180px] w-full">
                  <div className="absolute inset-0 rounded-[30px] overflow-hidden border-4 border-gray-800 bg-black shadow-lg">
                    <div className="absolute -inset-[5px] bg-gray-800 rounded-[35px] -z-10"></div>
                    <div className="h-full flex flex-col justify-between p-3 text-white">
                      {/* Watch time */}
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs opacity-70">
                          {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      
                      {/* Health metrics */}
                      <div className="grid grid-cols-2 gap-2 my-2">
                        <div className="bg-blue-900 bg-opacity-30 rounded-lg p-2 text-center">
                          <div className="text-xs opacity-70">Glucose</div>
                          <div className="text-lg font-bold">{healthData.currentGlucose}</div>
                          <div className="text-[10px] opacity-70">mg/dL</div>
                        </div>
                        <div className="bg-red-900 bg-opacity-30 rounded-lg p-2 text-center">
                          <div className="text-xs opacity-70">Heart</div>
                          <div className="text-lg font-bold">{healthData.heartRate}</div>
                          <div className="text-[10px] opacity-70">BPM</div>
                        </div>
                      </div>
                      
                      {/* Activity rings */}
                      <div className="mt-2">
                        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{width: `${healthData.activityProgress}%`}}
                          ></div>
                        </div>
                        <div className="text-center text-xs mt-1">
                          <span className="opacity-70">Steps: {healthData.steps.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Last Reading</div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">{healthData.lastReading.time}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({healthData.lastReading.timeAgo})</span>
                  </div>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Battery</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">{healthData.deviceBattery}%</span>
                    <Battery className="ml-2 h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="rounded-full mr-2">
                  <FolderSync className="h-3 w-3 mr-1" /> Sync Now
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Settings className="h-3 w-3 mr-1" /> Settings
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
