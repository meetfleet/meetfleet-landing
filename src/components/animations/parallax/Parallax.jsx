import { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const Parallax = ({ 
  children, 
  speed = 0.5, 
  direction = 'vertical', 
  className,
  ...props 
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -speed * 200]);
  const x = useTransform(scrollYProgress, [0, 1], [0, -speed * 200]);

  const motionProps = direction === 'horizontal' 
    ? { style: { x } } 
    : { style: { y } };

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`} {...props}>
      <motion.div {...motionProps}>
        {children}
      </motion.div>
    </div>
  );
};

export default Parallax;
