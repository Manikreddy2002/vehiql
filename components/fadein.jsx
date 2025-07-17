'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FadeInSection({ children, className = '', delay = 0 }) {
  const controls = useAnimation();
  const ref = useRef(null);

  const isInView = useInView(ref, {
    threshold: 0.3, 
    margin: '0px 0px -10% 0px', 
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          y: 40,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',       
            stiffness: 60,        
            damping: 18,          
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
