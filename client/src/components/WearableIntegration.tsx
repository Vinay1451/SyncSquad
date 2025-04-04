import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  WatchIcon, FolderSync, Settings, Circle, Battery, 
  Smartphone, CheckCircle, Droplets, Heart, 
  Activity, ArrowLeft, ArrowRight, Gauge,
  Play, Pause
} from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WearableIntegration() {
  const { healthData } = useHealthData();
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);
  
  // Define the watch screens (equivalent to watch faces/apps)
  const watchScreens = [
    { 
      name: "Blood Sugar", 
      color: "blue", 
      icon: <Droplets className="h-6 w-6 mb-1" />,
      value: healthData.currentGlucose,
      unit: "mg/dL",
      trend: "stable",
      details: "Last meal: 2h ago"
    },
    { 
      name: "Heart Rate", 
      color: "red", 
      icon: <Heart className="h-6 w-6 mb-1" />,
      value: healthData.heartRate,
      unit: "BPM",
      trend: "normal",
      details: "Resting: 68 BPM"
    },
    { 
      name: "Oxygen", 
      color: "green", 
      icon: <Gauge className="h-6 w-6 mb-1" />,
      value: healthData.spO2,
      unit: "%",
      trend: "good",
      details: "Normal range"
    },
    { 
      name: "Activity", 
      color: "orange", 
      icon: <Activity className="h-6 w-6 mb-1" />,
      value: healthData.steps,
      unit: "steps",
      trend: "active",
      details: `${healthData.activityMinutes} active min`
    }
  ];
  
  // Update time every second
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Auto-swipe functionality
  const [isAutoSwipe, setIsAutoSwipe] = useState(false);
  
  useEffect(() => {
    let autoSwipeTimer: NodeJS.Timeout | null = null;
    
    if (isConnected && isAutoSwipe) {
      autoSwipeTimer = setInterval(() => {
        handleNextScreen();
      }, 3000); // Change screen every 3 seconds
    }
    
    return () => {
      if (autoSwipeTimer) clearInterval(autoSwipeTimer);
    };
  }, [isConnected, isAutoSwipe, activeScreen]);
  
  // Swipe functionality
  const handleNextScreen = () => {
    setActiveScreen((prev) => (prev === watchScreens.length - 1 ? 0 : prev + 1));
  };
  
  const handlePrevScreen = () => {
    setActiveScreen((prev) => (prev === 0 ? watchScreens.length - 1 : prev - 1));
  };
  
  const toggleAutoSwipe = () => {
    setIsAutoSwipe(prev => !prev);
  };

  const handleConnectWatch = () => {
    setIsConnecting(true);
    setSetupStep(1);
    
    // Simulate connection process - progress through steps
    const stepTimers = [
      setTimeout(() => setSetupStep(2), 1000),
      setTimeout(() => setSetupStep(3), 2000),
      setTimeout(() => {
        setSetupStep(4);
        setIsConnecting(false);
      }, 3000),
      setTimeout(() => {
        setIsConnected(true);
        setSetupStep(0);
      }, 4000)
    ];
    
    return () => stepTimers.forEach(timer => clearTimeout(timer));
  };

  const renderConnectionSteps = () => {
    return (
      <div className="py-4">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            1
          </div>
          <div className="h-1 flex-1 bg-muted mx-2" />
          <div className={`w-8 h-8 rounded-full ${setupStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'} flex items-center justify-center`}>
            2
          </div>
          <div className="h-1 flex-1 bg-muted mx-2" />
          <div className={`w-8 h-8 rounded-full ${setupStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'} flex items-center justify-center`}>
            3
          </div>
          <div className="h-1 flex-1 bg-muted mx-2" />
          <div className={`w-8 h-8 rounded-full ${setupStep >= 4 ? 'bg-green-500 text-white' : 'bg-muted'} flex items-center justify-center`}>
            {setupStep >= 4 ? <CheckCircle className="h-5 w-5" /> : '4'}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {setupStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Smartphone className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Searching for devices...</h3>
              <p className="text-sm text-muted-foreground mb-4">Make sure your device is turned on and nearby</p>
            </motion.div>
          )}
          
          {setupStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <WatchIcon className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Device found!</h3>
              <p className="text-sm text-muted-foreground mb-4">Smartwatch (BG-Monitor Pro) detected</p>
            </motion.div>
          )}
          
          {setupStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <FolderSync className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Syncing data</h3>
              <p className="text-sm text-muted-foreground mb-4">Updating health records and device settings</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          )}
          
          {setupStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Setup complete!</h3>
              <p className="text-sm text-muted-foreground mb-4">Your smartwatch is now connected and ready to use</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
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
            <div className={`text-sm flex items-center ${isConnected ? 'text-green-500' : isConnecting ? 'text-amber-500' : 'text-muted-foreground'}`}>
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
          {!isConnected && !isConnecting && setupStep === 0 ? (
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
          ) : isConnecting || (!isConnected && setupStep > 0) ? (
            renderConnectionSteps()
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-6">
                {/* Samsung Watch UI */}
                <div className="relative aspect-[1/1.2] max-w-[180px] w-full mb-3">
                  <div className="absolute inset-0 rounded-[30px] overflow-hidden border-4 border-gray-800 bg-black shadow-lg">
                    <div className="absolute -inset-[5px] bg-gray-800 rounded-[35px] -z-10"></div>
                    
                    {/* Watch Content */}
                    <div className="h-full flex flex-col justify-between p-3 text-white">
                      {/* Watch time always visible at top */}
                      <div className="text-center mb-2">
                        <div className="text-xl font-bold">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs opacity-70">
                          {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      
                      {/* Watch app screens with swipe animation */}
                      <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence initial={false} mode="popLayout">
                          <motion.div
                            key={activeScreen}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                          >
                            {/* Color class with explicit mapping */}
                            <div 
                              className={
                                watchScreens[activeScreen].color === "blue" ? "text-blue-500 mb-1" : 
                                watchScreens[activeScreen].color === "red" ? "text-red-500 mb-1" :
                                watchScreens[activeScreen].color === "green" ? "text-green-500 mb-1" :
                                "text-orange-500 mb-1"
                              }
                            >
                              {watchScreens[activeScreen].icon}
                            </div>
                            <div className="text-sm mb-1">{watchScreens[activeScreen].name}</div>
                            <div className="text-2xl font-bold mb-1">
                              {watchScreens[activeScreen].value}
                              <span className="text-xs font-normal ml-1">{watchScreens[activeScreen].unit}</span>
                            </div>
                            <div className="text-xs opacity-70">{watchScreens[activeScreen].details}</div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      
                      {/* Dots indicator */}
                      <div className="flex justify-center space-x-1 mt-2 mb-1">
                        {watchScreens.map((_, index) => (
                          <div 
                            key={index} 
                            className={`w-1.5 h-1.5 rounded-full ${index === activeScreen ? 'bg-white' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation buttons */}
                <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePrevScreen}
                    className="p-1 h-auto flex items-center hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Swipe Left
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleNextScreen}
                    className="p-1 h-auto flex items-center hover:text-primary"
                  >
                    Swipe Right <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
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
                <Button 
                  variant={isAutoSwipe ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full mr-2"
                  onClick={toggleAutoSwipe}
                >
                  {isAutoSwipe ? (
                    <><Pause className="h-3 w-3 mr-1" /> Stop Auto</> 
                  ) : (
                    <><Play className="h-3 w-3 mr-1" /> Auto Swipe</>
                  )}
                </Button>
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
