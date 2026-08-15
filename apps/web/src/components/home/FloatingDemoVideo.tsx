"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingDemoVideo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[60]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#2A854B] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#226b3c] transition-colors border border-emerald-700/50"
        >
          <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
            <Play size={16} className="fill-current ml-0.5" />
          </div>
          <span className="font-semibold text-sm pr-1">Watch Demo</span>
        </motion.button>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="bg-black w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl relative border border-white/10"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking video
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* YouTube Embed Placeholder - You can replace the src with your actual demo video URL */}
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="KisanSeva Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-cover"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
