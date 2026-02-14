import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center">
                    <img src={logo} alt="Kaizen Logo" className="w-full h-full object-contain" />
                </div>
                <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase">Kaizen</p>
            </motion.div>
        </div>
    );
}
