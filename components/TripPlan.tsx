import React, { useState } from 'react';
import { MapPin, Zap, Home, Navigation, BatteryCharging, Flag, CheckCircle, Clock, Milestone, Play, Timer, RotateCcw, ArrowLeft } from 'lucide-react';

interface Stop {
  id: number;
  type: string;
  title: string;
  location: string;
  address: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  textColor: string;
  coords?: string;
  query?: string;
  distanceFromPrev: string | null;
  timeFromPrev: string | null;
  durationMinutes: number;
}

interface TripPlanProps {
  onBack: () => void;
}

const TripPlan: React.FC<TripPlanProps> = ({ onBack }) => {
  const [visited, setVisited] = useState<number[]>([]);
  const [departures, setDepartures] = useState<Record<number, number>>({});

  const stops: Stop[] = [
    {
      id: 1,
      type: 'start',
      title: 'จุดเริ่มต้น',
      location: 'ตรอ.พิศาล ด่านขุนทด',
      address: 'ด่านขุนทด จ.นครราชสีมา',
      icon: Flag,
      color: 'bg-blue-600',
      activeColor: 'bg-blue-500',
      textColor: 'text-blue-400',
      coords: '15.207722, 101.757139',
      distanceFromPrev: null,
      timeFromPrev: null,
      durationMinutes: 0
    },
    {
      id: 2,
      type: 'charge',
      title: 'ชาร์จแบตฯ ครั้งที่ 1',
      location: 'PTT Station Khanu Woralaksaburi',
      address: 'ขาณุวรลักษบุรี จ.กำแพงเพชร',
      icon: Zap,
      color: 'bg-emerald-600',
      activeColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      query: 'PTT Station (Petrol+EV Hub) Khanu Woralaksaburi',
      distanceFromPrev: '304 km',
      timeFromPrev: '4 ชม. 25 น.',
      durationMinutes: 265
    },
    {
      id: 3,
      type: 'charge',
      title: 'ชาร์จแบตฯ ครั้งที่ 2',
      location: 'PT Station Baan Tak 1',
      address: 'อ.บ้านตาก จ.ตาก',
      icon: Zap,
      color: 'bg-emerald-600',
      activeColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      query: 'PT Station Baan Tak 1',
      distanceFromPrev: '139 km',
      timeFromPrev: '1 ชม. 55 น.',
      durationMinutes: 115
    },
    {
      id: 4,
      type: 'charge',
      title: 'ชาร์จแบตฯ ครั้งที่ 3',
      location: 'Old Chiangmai Cultural Center',
      address: 'อ.เมือง จ.เชียงใหม่',
      icon: Zap,
      color: 'bg-emerald-600',
      activeColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      query: 'Old Chiangmai Cultural Center',
      distanceFromPrev: '248 km',
      timeFromPrev: '3 ชม. 29 น.',
      durationMinutes: 209
    },
    {
      id: 5,
      type: 'destination',
      title: 'ที่พัก (ปลายทาง)',
      location: 'Baan 2 Dao Farmstay',
      address: 'อ.เชียงดาว จ.เชียงใหม่',
      icon: Home,
      color: 'bg-indigo-600',
      activeColor: 'bg-indigo-500',
      textColor: 'text-indigo-400',
      query: 'Baan 2 Dao Farmstay',
      distanceFromPrev: '77.9 km',
      timeFromPrev: '1 ชม. 37 น.',
      durationMinutes: 97
    }
  ];

  const toggleVisited = (id: number) => {
    if (visited.includes(id)) {
      setVisited(visited.filter(v => v !== id));
    } else {
      setVisited([...visited, id]);
    }
  };

  const handleDepart = (id: number) => {
    const now = new Date();
    setDepartures({
      ...departures,
      [id]: now.getTime()
    });
  };

  const calculateETA = (departureTime: number, durationMinutes: number) => {
    if (!departureTime) return null;
    const eta = new Date(departureTime + durationMinutes * 60000);
    return eta.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const handleNavigate = (stop: Stop) => {
    let url = '';
    if (stop.coords) {
      url = `https://www.google.com/maps/search/?api=1&query=${stop.coords}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query || stop.location)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 font-sans text-slate-200">
       <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-50 p-2.5 bg-slate-800/80 text-slate-200 rounded-full hover:bg-slate-700 border border-slate-700 backdrop-blur-sm transition-all shadow-lg"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="max-w-md mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden border-b border-slate-800 text-center">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10 text-white">
            <BatteryCharging size={140} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white tracking-tight">EV Trip Plan</h1>
            <p className="text-slate-400 text-sm mt-1">ด่านขุนทด ➔ เชียงดาว (768.9 km)</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3">
               <div className="flex items-center gap-2 text-xs bg-slate-800/50 border border-slate-700 w-fit px-3 py-1.5 rounded-full text-slate-300">
                <MapPin size={14} />
                <span>{visited.length}/{stops.length} จุดเช็คอิน</span>
              </div>
              
              <div className="w-full max-w-[200px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(visited.length / stops.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 relative">
          {/* Vertical Line - Centered */}
          <div className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-slate-800 border-l-2 border-dashed border-slate-700 transform -translate-x-1/2"></div>

          <div className="space-y-4 relative z-10">
            {stops.map((stop, index) => {
              const isVisited = visited.includes(stop.id);
              
              const prevStopId = index > 0 ? stops[index - 1].id : null;
              const departureTime = prevStopId ? departures[prevStopId] : null;
              const eta = departureTime ? calculateETA(departureTime, stop.durationMinutes) : null;

              return (
                <div key={stop.id} className="flex flex-col items-center w-full">
                  
                  {/* Distance/Time Badge - Centered on line - Hidden when visited */}
                  {index > 0 && !isVisited && (
                    <div className="flex justify-center items-center z-20 my-4">
                       <div className={`bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-lg transform hover:scale-110 transition-transform cursor-default z-30`}>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1 w-full justify-center">
                           <Milestone size={12} />
                           <span>{stop.distanceFromPrev}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                           <Clock size={12} />
                           <span>{stop.timeFromPrev}</span>
                         </div>
                       </div>
                    </div>
                  )}

                  {/* Icon - Centered */}
                  <div className={`relative z-20 mb-3 transition-all duration-300`}>
                    <button 
                      onClick={() => isVisited ? toggleVisited(stop.id) : null}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 
                        ${isVisited 
                          ? 'bg-emerald-600 border-emerald-900 text-white hover:scale-110 hover:bg-red-500 hover:border-red-800 cursor-pointer group' 
                          : `${stop.color} border-slate-900 text-white cursor-default`
                        }`}
                    >
                      {isVisited ? (
                        <>
                          <CheckCircle size={24} className="group-hover:hidden" />
                          <RotateCcw size={24} className="hidden group-hover:block" />
                        </>
                      ) : (
                        <stop.icon size={24} />
                      )}
                    </button>
                  </div>

                  {/* Collapsed Label (Only when visited) */}
                  {isVisited && (
                    <div className="mb-4">
                      <span className="text-xs text-slate-500 font-medium bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                        {stop.title} (ผ่านแล้ว)
                      </span>
                    </div>
                  )}

                  {/* Content Card - Only show if NOT visited */}
                  {!isVisited && (
                    <div className="w-full rounded-xl border bg-slate-800 border-slate-700 hover:border-slate-600 shadow-lg p-4 relative overflow-hidden">
                      {/* ETA Badge */}
                      {eta && (
                        <div className="absolute top-0 right-0 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 animate-pulse">
                          <Timer size={12} />
                          ถึง ~{eta} น.
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-opacity-20 ${stop.textColor} bg-opacity-10 border-current`}>
                          {stop.title}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-base leading-tight mb-1 text-center text-slate-100">
                        {stop.location}
                      </h3>
                      
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed font-light text-center">
                        {stop.address}
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleNavigate(stop)}
                          className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5 rounded-lg border bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border-slate-600 hover:border-slate-500 shadow-sm transition-all"
                        >
                          <Navigation size={14} />
                          นำทาง
                        </button>

                        <button
                          onClick={() => toggleVisited(stop.id)}
                          className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5 rounded-lg border bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 hover:border-emerald-400 shadow-sm transition-all"
                        >
                           <CheckCircle size={14} />
                           เช็คอิน
                        </button>

                        {index !== stops.length - 1 && (
                          <button 
                            onClick={() => handleDepart(stop.id)}
                            className={`flex-1 flex items-center justify-center gap-2 text-xs py-2.5 rounded-lg border transition-all
                              ${departures[stop.id] 
                                ? 'bg-indigo-900/30 text-indigo-300 border-indigo-900/50' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 hover:border-indigo-400 shadow-sm shadow-indigo-900/20'
                              }`}
                          >
                            <Play size={14} className={departures[stop.id] ? "" : "fill-current"} />
                            {departures[stop.id] 
                              ? `ออก ${new Date(departures[stop.id]).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}` 
                              : 'เดินทาง'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 text-center border-t border-slate-800">
          <p className="text-xs text-slate-500">เดินทางปลอดภัยครับ 🚗⚡</p>
        </div>
      </div>
    </div>
  );
};

export default TripPlan;