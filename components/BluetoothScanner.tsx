
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, BluetoothSearching, RefreshCcw, Wifi, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BluetoothScannerProps {
  onDeviceConnect: (device: string) => void;
}

const BluetoothScanner: React.FC<BluetoothScannerProps> = ({ onDeviceConnect }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  const startScan = async () => {
    setError(null);
    
    // Fix: Cast navigator to any to access the experimental bluetooth property and avoid TS error
    if (!(navigator as any).bluetooth) {
      setError("Web Bluetooth is not supported in this browser or context (requires HTTPS).");
      return;
    }

    setIsScanning(true);
    
    try {
      // The requestDevice call will trigger the native browser Bluetooth picker
      // Fix: Cast navigator to any to access the experimental bluetooth property and avoid TS error
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        // Optional: you can filter by services if your IoT kit has specific UUIDs
        // filters: [{ services: ['heart_rate'] }] 
      });

      if (device) {
        console.log('User selected device:', device.name || 'Unnamed Device');
        
        // Attempt to connect to the GATT server (optional but good for validation)
        // const server = await device.gatt?.connect();
        
        const deviceName = device.name || `Device (${device.id.slice(0, 5)}...)`;
        setConnectedDevice(deviceName);
        onDeviceConnect(deviceName);
        
        // Listen for disconnection
        device.addEventListener('gattserverdisconnected', () => {
          setConnectedDevice(null);
          onDeviceConnect('');
          setError("Device disconnected.");
        });
      }
    } catch (err: any) {
      console.error('Bluetooth Scan Error:', err);
      if (err.name === 'NotFoundError') {
        // User cancelled the dialog
        setError(null); 
      } else {
        setError(err.message || "Failed to access Bluetooth.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleDisconnect = () => {
    setConnectedDevice(null);
    onDeviceConnect('');
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] shadow-xl border border-white space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${isScanning ? 'bg-sky-500 animate-pulse' : 'bg-sky-100'} transition-colors`}>
            {isScanning ? <BluetoothSearching className="w-5 h-5 text-white" /> : <Bluetooth className="w-5 h-5 text-sky-600" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">IOT Connectivity</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Hardware Link</p>
          </div>
        </div>
        {!connectedDevice && (
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            onClick={startScan}
            disabled={isScanning}
            className="p-3 rounded-full bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"
          >
            <RefreshCcw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
          </motion.button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center"
            >
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-sky-500 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mt-4">Waiting for Device Selection...</p>
            </motion.div>
          )}

          {connectedDevice ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-emerald-50 border border-emerald-100 rounded-[1.8rem] flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-800">{connectedDevice}</p>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">GATT Stream Active</p>
                </div>
              </div>
              <button 
                onClick={handleDisconnect} 
                className="text-[9px] font-black text-emerald-700 hover:text-rose-600 uppercase tracking-widest transition-colors"
              >
                Disconnect
              </button>
            </motion.div>
          ) : !isScanning && (
            <div className="py-6 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                Click the sync icon to pair your ESP32 or IoT Kit.<br/>Requires a Bluetooth-enabled device.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BluetoothScanner;
