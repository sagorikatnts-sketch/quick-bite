import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  X, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  RefreshCw, 
  Sparkles,
  Sliders,
  Barcode,
  QrCode,
  Flame,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types';

export const FoodScannerModal: React.FC = () => {
  const { 
    isScannerOpen, 
    setIsScannerOpen, 
    getFoodByCode, 
    addToCart, 
    setSelectedFoodForModal,
    foodItems 
  } = useApp();

  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{ code: string; item: FoodItem | null } | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef(false);

  // Play pleasant sound on successful scan
  const playScanBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // AudioContext unavailable or blocked by autoplay
    }
  };

  const handleCodeFound = (codeText: string) => {
    playScanBeep();
    const item = getFoodByCode(codeText);
    setScannedResult({
      code: codeText,
      item: item || null
    });
    stopCamera();
  };

  const startCamera = async (cameraIdToUse?: string) => {
    setCameraError(null);
    setScannedResult(null);

    try {
      // Stop existing if any
      await stopCamera();

      // Enumerate cameras if not already done
      let devices: { id: string; label: string }[] = cameras;
      if (devices.length === 0) {
        try {
          const videoDevices = await Html5Qrcode.getCameras();
          if (videoDevices && videoDevices.length > 0) {
            devices = videoDevices;
            setCameras(videoDevices);
          }
        } catch {
          // Camera listing might fail if permission not yet granted
        }
      }

      const readerElement = document.getElementById('food-barcode-reader');
      if (!readerElement) return;

      const html5QrCode = new Html5Qrcode('food-barcode-reader');
      html5QrCodeRef.current = html5QrCode;

      const cameraConfig = cameraIdToUse || selectedCameraId || { facingMode: 'environment' };

      const qrConfig = {
        fps: 15,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const edgeSize = Math.floor(minEdge * 0.72);
          return { width: edgeSize, height: edgeSize };
        },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        cameraConfig,
        qrConfig,
        (decodedText) => {
          handleCodeFound(decodedText);
        },
        () => {
          // Frame scan error / no code in frame; normal polling
        }
      );

      setScanning(true);
    } catch (err: unknown) {
      console.error('Failed to start camera:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission')) {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser or try the manual code input below.');
      } else if (errMsg.includes('NotFoundError') || errMsg.includes('device')) {
        setCameraError('No camera found on this device. You can test instantly using the manual code input or sample items below.');
      } else {
        setCameraError('Could not initialize camera. Please try the manual code input below.');
      }
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (isStoppingRef.current) return;
    if (html5QrCodeRef.current) {
      try {
        isStoppingRef.current = true;
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping camera:', e);
      } finally {
        html5QrCodeRef.current = null;
        isStoppingRef.current = false;
        setScanning(false);
      }
    }
  };

  // Launch camera when modal opens
  useEffect(() => {
    if (isScannerOpen) {
      setScannedResult(null);
      setCameraError(null);
      setManualCode('');
      // Small timeout to ensure DOM container mounted
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isScannerOpen]);

  const handleManualSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeFound(manualCode.trim());
  };

  const handleQuickTest = (code: string) => {
    setManualCode(code);
    handleCodeFound(code);
  };

  const handleClose = () => {
    stopCamera();
    setIsScannerOpen(false);
    setScannedResult(null);
  };

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Food Barcode & QR Scanner</h2>
              <p className="text-xs text-stone-400">Point your camera at any food code or enter below</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Result Card Preview */}
          {scannedResult ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              {scannedResult.item ? (
                <div className="border-2 border-emerald-500/40 bg-emerald-50/50 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <img 
                      src={scannedResult.item.imageUrl} 
                      alt={scannedResult.item.name} 
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border ${
                          scannedResult.item.isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-rose-600 bg-rose-50'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${scannedResult.item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Matched Code: {scannedResult.code}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-stone-900 truncate">{scannedResult.item.name}</h3>
                      <p className="text-xs text-stone-500 font-medium">{scannedResult.item.restaurantName} · {scannedResult.item.preparationTime}</p>
                      
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {scannedResult.item.description}
                      </p>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xl font-extrabold text-stone-950">₹{scannedResult.item.price}</span>
                        {scannedResult.item.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">₹{scannedResult.item.originalPrice}</span>
                        )}
                        <span className="text-xs font-semibold text-emerald-700 ml-auto">
                          {scannedResult.item.isAvailable ? '✓ In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for matched item */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-emerald-200/60">
                    <button
                      onClick={() => {
                        addToCart(scannedResult.item!);
                        handleClose();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart Now
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedFoodForModal(scannedResult.item);
                        handleClose();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-stone-500" />
                      Customize Options
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setScannedResult(null);
                      startCamera();
                    }}
                    className="w-full mt-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Scan another food item
                  </button>
                </div>
              ) : (
                <div className="border border-amber-200 bg-amber-50/70 rounded-xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Food Item Not Recognized</h3>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                      No dish in the catalog matches code <strong className="font-mono text-stone-900">"{scannedResult.code}"</strong>.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        setScannedResult(null);
                        startCamera();
                      }}
                      className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Try Scanning Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Camera Viewfinder & Container */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex flex-col items-center justify-center min-h-[280px]">
                {/* HTML5 QR Container */}
                <div 
                  id="food-barcode-reader" 
                  className="w-full max-w-sm overflow-hidden"
                  style={{ minHeight: '260px' }}
                />

                {/* Laser scan line overlay when active */}
                {scanning && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-56 h-56 border-2 border-dashed border-amber-400/80 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
                      
                      {/* Scanning animated red/orange laser */}
                      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b] animate-bounce duration-1000 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="mt-3 text-[11px] font-medium text-stone-300 tracking-wide bg-stone-900/80 px-2.5 py-1 rounded-full border border-stone-700">
                      Align Barcode or QR inside square
                    </span>
                  </div>
                )}

                {/* Camera Error / Not detected state */}
                {cameraError && (
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-stone-900/95 text-stone-300 z-10">
                    <Camera className="w-10 h-10 text-stone-500 mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">Camera Standby</p>
                    <p className="text-xs text-stone-400 max-w-xs mb-4 leading-relaxed">{cameraError}</p>
                    <button
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Camera Access
                    </button>
                  </div>
                )}
              </div>

              {/* Camera Switcher Controls if multiple */}
              {cameras.length > 1 && (
                <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                  <span>Multiple cameras detected</span>
                  <button
                    onClick={() => {
                      const next = cameras.find(c => c.id !== selectedCameraId) || cameras[0];
                      setSelectedCameraId(next.id);
                      startCamera(next.id);
                    }}
                    className="flex items-center gap-1 text-amber-600 font-semibold hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Switch Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manual Code Input Fallback */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
              Or Enter Item Code Manually
            </label>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. FOOD-BIRYANI-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all uppercase"
                />
                {manualCode && (
                  <button
                    type="button"
                    onClick={() => setManualCode('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                Find Item
              </button>
            </form>
          </div>

          {/* Quick Click Demo Barcodes (Crucial for immediate browser testing without physical codes) */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Sample Codes:
              </span>
              <span className="text-[11px] text-stone-400">Click to test instant match</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTest('FOOD-BIRYANI-001')}
                className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-amber-400 rounded-lg text-xs font-mono text-stone-800 hover:text-amber-700 shadow-2xs transition-all cursor-pointer text-left"
              >
                🍗 <span className="font-semibold">FOOD-BIRYANI-001</span> (₹220)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('FOOD-PIZZA-002')}
                className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-amber-400 rounded-lg text-xs font-mono text-stone-800 hover:text-amber-700 shadow-2xs transition-all cursor-pointer text-left"
              >
                🍕 <span className="font-semibold">FOOD-PIZZA-002</span> (₹299)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('FOOD-BURGER-003')}
                className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-amber-400 rounded-lg text-xs font-mono text-stone-800 hover:text-amber-700 shadow-2xs transition-all cursor-pointer text-left"
              >
                🍔 <span className="font-semibold">FOOD-BURGER-003</span> (₹180)
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Audio cue plays on successful scan</span>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
