import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const LoadingOverlay = ({ open, progress, text, success }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center text-center relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {success === true ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <CheckCircleIcon className="w-24 h-24 text-green-500" />
                            </motion.div>
                        ) : success === false ? (
                            <motion.div
                                key="error"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <XCircleIcon className="w-24 h-24 text-red-500" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="loading"
                                className="relative w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Custom Spinner */}
                                <motion.span
                                    className="block w-24 h-24 border-4 border-gray-200 border-t-blue-600 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.h3
                    key={text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-gray-800 dark:text-white mb-2"
                >
                    {success === true ? "¡Éxito!" : success === false ? "Error" : "Procesando"}
                </motion.h3>

                <motion.p
                    key={`desc-${text}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 dark:text-gray-400 text-sm"
                >
                    {text}
                </motion.p>

                {/* Progress Bar (Only when loading) */}
                {success === null && (
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-6 overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default LoadingOverlay;
