import { motion } from 'framer-motion';
import { Activity, Dumbbell } from 'lucide-react';

interface MovementCardProps {
  title?: string;
  instruction: string;
  visualAid?: string;
  alternativeMove?: string;
  isStretch?: boolean;
  timeLeft?: number;
  energyColors: string;
}

export default function MovementCard({
  title,
  instruction,
  visualAid,
  alternativeMove,
  isStretch,
  timeLeft,
  energyColors
}: MovementCardProps) {
  // Split instruction into lines for better readability
  const instructionLines = instruction.split('\n').filter(line => line.trim());

  return (
    <div className={`space-y-6 rounded-3xl p-6 sm:p-8 ${
      isStretch 
        ? 'bg-gradient-to-br from-orange-50 to-red-50/30 border-2 border-orange-200/50' 
        : 'bg-white/60 backdrop-blur-md border border-gray-200/50'
    } shadow-xl`}>
      {/* Stretch badge */}
      {isStretch && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-lg">
            <Activity className="w-4 h-4" />
            <span>WARM-UP STRETCH</span>
          </div>
        </motion.div>
      )}

      {/* Visual aid - hero image at top */}
      {visualAid && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100/50 to-red-100/50 border-2 border-orange-200 shadow-2xl">
            <img
              src={visualAid}
              alt={title || 'Exercise demonstration'}
              className="w-full h-auto object-cover"
              data-testid="movement-visual-aid"
              onError={(e) => {
                console.log(`Image failed to load: ${visualAid}`);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              FORM GUIDE
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions - left-aligned with generous spacing */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {instructionLines.map((line, index) => (
          <p 
            key={index} 
            className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium"
          >
            {line}
          </p>
        ))}
      </motion.div>

      {/* Alternative move - low-impact option */}
      {alternativeMove && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50/80 border-l-4 border-blue-400 rounded-lg p-4"
        >
          <p className="text-sm text-blue-900">
            <span className="font-bold text-blue-700">💡 Low-Impact:</span> {alternativeMove}
          </p>
        </motion.div>
      )}

      {/* Timer - prominent display */}
      {timeLeft !== undefined && timeLeft > 0 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="flex flex-col items-center pt-4"
        >
          <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${energyColors} shadow-2xl ring-4 ring-orange-100 flex items-center justify-center`}>
            <span className="text-5xl font-bold text-white drop-shadow-2xl tabular-nums">
              {timeLeft}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600 font-semibold uppercase tracking-wider">
            seconds
          </p>
        </motion.div>
      )}

      {/* No visual aid fallback - animated icon */}
      {!visualAid && !isStretch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center py-4"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${energyColors} flex items-center justify-center shadow-xl`}
          >
            <Dumbbell className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
