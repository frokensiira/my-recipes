import React from "react";
import { motion } from "framer-motion";

const PageTitle = ({ children }) => {
    return (
        <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 2 }}
            className="page__title"
        >
            {children}
        </motion.h1>
    );
};

export default PageTitle;
