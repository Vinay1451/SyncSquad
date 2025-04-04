import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Watch as WatchIcon, FolderSync, Settings, Circle, Battery, 
  Smartphone, CheckCircle, Droplets, Heart, 
  Activity, ArrowLeft, ArrowRight, Gauge,
  Play, Pause, X, Link2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeHealthData, useSafeTheme } from "@/hooks/use-safe-context";

export default function WearableIntegration() {
  const { healthData } = useSafeHealthData();
  const { theme } = useSafeTheme();
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
  
  const handlePairDevice = () => {
    setSetupStep(3);
    
    // Simulate pairing completion
    setTimeout(() => {
      setSetupStep(4);
    }, 2000);
    
    setTimeout(() => {
      setIsConnected(true);
      setSetupStep(0);
    }, 3500);
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
      <div className="py-6">
        <div className="flex items-center mb-8 max-w-[300px] mx-auto">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`w-8 h-8 rounded-full ${
              theme === 'light'
                ? setupStep >= 1 
                  ? 'bg-primary shadow-md shadow-primary/20' 
                  : 'bg-slate-200'
                : setupStep >= 1 
                  ? 'bg-primary' 
                  : 'bg-muted'
            } flex items-center justify-center text-primary-foreground z-10`}
          >
            1
          </motion.div>
          <div className={`h-1 flex-1 ${
            theme === 'light'
              ? setupStep >= 2 
                ? 'bg-primary/50' 
                : 'bg-slate-200'
              : setupStep >= 2 
                ? 'bg-primary/50' 
                : 'bg-muted'
          } mx-2 transition-colors duration-300`} />
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`w-8 h-8 rounded-full ${
              theme === 'light'
                ? setupStep >= 2 
                  ? 'bg-primary shadow-md shadow-primary/20' 
                  : 'bg-slate-200'
                : setupStep >= 2 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
            } flex items-center justify-center z-10`}
          >
            2
          </motion.div>
          <div className={`h-1 flex-1 ${
            theme === 'light'
              ? setupStep >= 3 
                ? 'bg-primary/50' 
                : 'bg-slate-200'
              : setupStep >= 3 
                ? 'bg-primary/50' 
                : 'bg-muted'
          } mx-2 transition-colors duration-300`} />
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`w-8 h-8 rounded-full ${
              theme === 'light'
                ? setupStep >= 3 
                  ? 'bg-primary shadow-md shadow-primary/20' 
                  : 'bg-slate-200'
                : setupStep >= 3 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
            } flex items-center justify-center z-10`}
          >
            3
          </motion.div>
          <div className={`h-1 flex-1 ${
            theme === 'light'
              ? setupStep >= 4 
                ? 'bg-green-500/50' 
                : 'bg-slate-200'
              : setupStep >= 4 
                ? 'bg-green-500/50' 
                : 'bg-muted'
          } mx-2 transition-colors duration-300`} />
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`w-8 h-8 rounded-full ${
              theme === 'light'
                ? setupStep >= 4 
                  ? 'bg-green-500 shadow-md shadow-green-500/20' 
                  : 'bg-slate-200'
                : setupStep >= 4 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted'
            } flex items-center justify-center z-10`}
          >
            {setupStep >= 4 ? <CheckCircle className="h-5 w-5" /> : '4'}
          </motion.div>
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
              <motion.div 
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    `0 0 0 0 ${theme === 'light' ? 'rgba(59, 130, 246, 0)' : 'rgba(255, 255, 255, 0)'}`,
                    `0 0 0 10px ${theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
                    `0 0 0 0 ${theme === 'light' ? 'rgba(59, 130, 246, 0)' : 'rgba(255, 255, 255, 0)'}`
                  ]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                  boxShadow: { repeat: Infinity, duration: 1.5 }
                }}
                className={`w-20 h-20 rounded-full ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
                    : 'bg-primary/10'
                } flex items-center justify-center mx-auto mb-4`}
              >
                <Smartphone className={`h-8 w-8 ${theme === 'light' ? 'text-primary/80' : 'text-primary'}`} />
              </motion.div>
              <h3 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                Searching for devices...
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'} max-w-[250px] mx-auto mb-4`}>
                Make sure your device is turned on and Bluetooth is enabled
              </p>
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
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-20 h-20 rounded-full ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md'
                    : 'bg-primary/10'
                } flex items-center justify-center mx-auto mb-4`}
              >
                <WatchIcon className={`h-8 w-8 ${theme === 'light' ? 'text-primary/80' : 'text-primary'}`} />
              </motion.div>
              <h3 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                Device found!
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'} max-w-[250px] mx-auto mb-4`}>
                Samsung Galaxy Watch 5 Pro (BG-Monitor) detected
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSetupStep(0)}
                    className={theme === 'light' ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : ''}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    onClick={() => handlePairDevice()}
                    className={theme === 'light' ? 'shadow-sm shadow-primary/20' : ''}
                  >
                    Pair Device <WatchIcon className="h-3 w-3 ml-1" />
                  </Button>
                </motion.div>
              </div>
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
              <motion.div 
                className={`w-20 h-20 rounded-full ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md'
                    : 'bg-primary/10'
                } flex items-center justify-center mx-auto mb-4`}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.6, 1] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <FolderSync className={`h-8 w-8 ${theme === 'light' ? 'text-primary/80' : 'text-primary'}`} />
                </motion.div>
              </motion.div>
              <h3 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                Syncing data
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'} max-w-[250px] mx-auto mb-4`}>
                Updating health records and device settings
              </p>
              <div className={`w-full max-w-[250px] h-2 ${
                theme === 'light' ? 'bg-slate-200' : 'bg-muted'
              } rounded-full overflow-hidden mx-auto`}>
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
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0)',
                    '0 0 0 10px rgba(34, 197, 94, 0.2)',
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  repeatDelay: 0.5
                }}
                className={`w-20 h-20 rounded-full ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-md'
                    : 'bg-green-500/10'
                } flex items-center justify-center mx-auto mb-4`}
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>
              <h3 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                Setup complete!
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'} max-w-[250px] mx-auto mb-4`}>
                Your smartwatch is now connected and ready to use
              </p>
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
      whileHover={{ translateY: -5 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 ${
        theme === 'light' 
          ? 'shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-slate-50 border-slate-200/70' 
          : 'shadow-sm hover:shadow-md bg-card'
      }`}>
        {/* Subtle decorative element for light mode */}
        {theme === 'light' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-primary"></div>
        )}
        
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <WatchIcon className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-primary' : 'text-primary/80'}`} />
              <CardTitle className={theme === 'light' ? 'text-slate-800' : ''}>Wearable Device</CardTitle>
            </div>
            <div className={`text-sm flex items-center font-medium ${
              isConnected 
                ? 'text-green-500' 
                : isConnecting 
                  ? 'text-amber-500' 
                  : theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'
            }`}>
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
              <motion.div 
                className={`w-24 h-24 rounded-full ${theme === 'light' 
                  ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md' 
                  : 'bg-primary/10'
                } flex items-center justify-center mx-auto mb-4`}
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 0 10px rgba(59, 130, 246, 0.1)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5 
                }}
              >
                <WatchIcon className={`h-10 w-10 ${theme === 'light' ? 'text-primary/80' : 'text-primary'}`} />
              </motion.div>
              <h3 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                No device connected
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'} mb-6 max-w-[250px] mx-auto`}>
                Connect your smartwatch to monitor your blood glucose and other health metrics in real-time
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleConnectWatch} 
                  className={`shadow-sm ${theme === 'light' ? 'shadow-primary/20' : ''}`}
                >
                  <WatchIcon className="h-4 w-4 mr-2" /> Connect Device
                </Button>
              </motion.div>
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
                    <div 
                      className={`h-full flex flex-col justify-between p-3 text-white transition-all duration-500 ${
                        theme === 'light' ? 'bg-gradient-to-b from-slate-800 to-black' : 'bg-black'
                      }`}
                    >
                      {/* Watch time always visible at top */}
                      <div className="text-center mb-2 relative z-10">
                        <div className="text-xl font-bold text-white">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-white/90">
                          {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      
                      {/* Animated background effect */}
                      <div className="absolute inset-0 opacity-20">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-[26px]"
                          animate={{ 
                            backgroundPosition: ['0% 0%', '100% 100%'],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            repeatType: 'reverse', 
                            duration: 15,
                            times: [0, 0.5, 1]
                          }}
                        />
                      </div>
                      
                      {/* Watch app screens with swipe animation */}
                      <div className="flex-1 relative overflow-hidden z-10">
                        <AnimatePresence initial={false} mode="popLayout">
                          <motion.div
                            key={activeScreen}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                          >
                            {/* Color class with explicit mapping and glow effect */}
                            <motion.div 
                              className={
                                watchScreens[activeScreen].color === "blue" 
                                  ? "text-blue-400 mb-1 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : 
                                watchScreens[activeScreen].color === "red" 
                                  ? "text-red-400 mb-1 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                watchScreens[activeScreen].color === "green" 
                                  ? "text-green-400 mb-1 filter drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                                "text-orange-400 mb-1 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                              }
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {watchScreens[activeScreen].icon}
                            </motion.div>
                            <div className="text-sm mb-1 font-medium text-white">{watchScreens[activeScreen].name}</div>
                            <div className="text-2xl font-bold mb-1 text-white">
                              {watchScreens[activeScreen].value}
                              <span className="text-xs font-normal ml-1 text-white/90">{watchScreens[activeScreen].unit}</span>
                            </div>
                            <div className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                              {watchScreens[activeScreen].details}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      
                      {/* Dots indicator */}
                      <div className="flex justify-center space-x-1 mt-2 mb-1 z-10">
                        {watchScreens.map((_, index) => (
                          <motion.div 
                            key={index} 
                            className={`w-1.5 h-1.5 rounded-full ${
                              index === activeScreen 
                                ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]' 
                                : 'bg-white/30'
                            }`}
                            animate={index === activeScreen ? { 
                              scale: [1, 1.2, 1],
                            } : {}}
                            transition={{ 
                              duration: 1.5, 
                              repeat: index === activeScreen ? Infinity : 0,
                              ease: "easeInOut" 
                            }}
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
                <motion.div 
                  className={`rounded-lg p-3 ${
                    theme === 'light' 
                      ? 'bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm' 
                      : 'bg-muted/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'}`}>
                    Last Reading
                  </div>
                  <div className="flex items-baseline">
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-slate-800' : ''}`}>
                      {healthData.lastReading.time}
                    </span>
                    <span className={`ml-1 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'}`}>
                      ({healthData.lastReading.timeAgo})
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={`rounded-lg p-3 ${
                    theme === 'light' 
                      ? 'bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm' 
                      : 'bg-muted/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-muted-foreground'}`}>
                    Battery
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-slate-800' : ''}`}>
                      {healthData.deviceBattery}%
                    </span>
                    <Battery className="ml-2 h-5 w-5 text-green-500" />
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={isAutoSwipe ? "default" : "outline"} 
                    size="sm" 
                    className={`rounded-full ${
                      theme === 'light' && isAutoSwipe 
                        ? 'shadow-md shadow-primary/20' 
                        : ''
                    }`}
                    onClick={toggleAutoSwipe}
                  >
                    {isAutoSwipe ? (
                      <><Pause className="h-3 w-3 mr-1" /> Stop Auto</> 
                    ) : (
                      <><Play className="h-3 w-3 mr-1" /> Auto Swipe</>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`rounded-full ${
                      theme === 'light' ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : ''
                    }`}
                  >
                    <FolderSync className={`h-3 w-3 mr-1 ${theme === 'light' ? 'text-primary' : ''}`} /> 
                    Sync Now
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={theme === 'light' ? "outline" : "ghost"} 
                    size="sm" 
                    className={`rounded-full ${
                      theme === 'light' ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : ''
                    }`}
                  >
                    <Settings className={`h-3 w-3 mr-1 ${theme === 'light' ? 'text-slate-500' : ''}`} /> 
                    Settings
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
