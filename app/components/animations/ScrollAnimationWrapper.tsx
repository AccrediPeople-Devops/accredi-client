"use client";

import React from "react";
import { useScrollAnimation, useBatchScrollAnimation, ScrollAnimationOptions } from "@/app/hooks/useScrollAnimation";

interface ScrollAnimationWrapperProps extends ScrollAnimationOptions {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ScrollAnimationWrapper({
  children,
  className = "",
  as = "div",
  ...animationOptions
}: ScrollAnimationWrapperProps) {
  const { ref, animationStyles } = useScrollAnimation(animationOptions);
  
  const Component = as as any;

  return (
    <Component
      ref={ref}
      className={className}
      style={animationStyles}
    >
      {children}
    </Component>
  );
}

// Enhanced specific animation components with modern settle animations
export function FadeIn({ children, className = "", delay = 0, duration = 800, easing = "spring" }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="fadeIn"
      delay={delay}
      duration={duration}
      easing={easing}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideUp({ children, className = "", delay = 0, duration = 800, easing = "spring" }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="slideUp"
      delay={delay}
      duration={duration}
      easing={easing}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideLeft({ children, className = "", delay = 0, duration = 800, easing = "spring" }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="slideLeft"
      delay={delay}
      duration={duration}
      easing={easing}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideRight({ children, className = "", delay = 0, duration = 800, easing = "spring" }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="slideRight"
      delay={delay}
      duration={duration}
      easing={easing}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function ScaleIn({ children, className = "", delay = 0, duration = 800, easing = "spring" }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="scaleIn"
      delay={delay}
      duration={duration}
      easing={easing}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

// New SettleIn animation - smooth, modern settle effect
export function SettleIn({ children, className = "", delay = 0, duration = 800, settleDistance = 20 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  settleDistance?: number;
}) {
  return (
    <ScrollAnimationWrapper
      animationType="settleIn"
      delay={delay}
      duration={duration}
      settleDistance={settleDistance}
      easing="spring"
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

// Enhanced staggered animation with better performance
interface StaggeredAnimationProps extends ScrollAnimationOptions {
  children: React.ReactNode[];
  stagger?: number;
  className?: string;
  itemClassName?: string;
  as?: keyof React.JSX.IntrinsicElements;
  performanceMode?: 'smooth' | 'performance';
}

export function StaggeredAnimation({
  children,
  stagger = 80,
  className = "",
  itemClassName = "",
  as = "div",
  performanceMode = "smooth",
  ...animationOptions
}: StaggeredAnimationProps) {
  const { containerRef, getItemStyles } = useBatchScrollAnimation(children.length, {
    stagger,
    performanceMode,
    ...animationOptions
  });

  const Component = as as any;

  return (
    <Component ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={itemClassName}
          style={getItemStyles(index)}
        >
          {child}
        </div>
      ))}
    </Component>
  );
}

// Enhanced hero animation with settle effect
export function AnimatedHero({ 
  children, 
  className = "",
  delay = 0,
  duration = 1200,
  easing = "spring"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  easing?: ScrollAnimationOptions['easing'];
}) {
  return (
    <ScrollAnimationWrapper
      animationType="settleIn"
      delay={delay}
      duration={duration}
      easing={easing}
      settleDistance={40}
      className={className}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

// Enhanced card animation with hover and settle effects
export function AnimatedCard({ 
  children, 
  className = "",
  delay = 0,
  duration = 700,
  hoverScale = true,
  settleDistance = 25
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hoverScale?: boolean;
  settleDistance?: number;
}) {
  const hoverClass = hoverScale ? "hover:scale-105 transition-transform duration-300" : "";
  
  return (
    <ScrollAnimationWrapper
      animationType="settleIn"
      delay={delay}
      duration={duration}
      easing="spring"
      settleDistance={settleDistance}
      className={`${className} ${hoverClass}`}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

// Performance-optimized animations for lists
export function PerformanceStaggered({
  children,
  className = "",
  itemClassName = "",
  stagger = 50,
  as = "div"
}: {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <StaggeredAnimation
      className={className}
      itemClassName={itemClassName}
      stagger={stagger}
      as={as}
      performanceMode="performance"
      animationType="fadeIn"
      duration={400}
      threshold={0.2}
    >
      {children}
    </StaggeredAnimation>
  );
}

// Smooth animations for premium experience
export function SmoothStaggered({
  children,
  className = "",
  itemClassName = "",
  stagger = 120,
  as = "div"
}: {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <StaggeredAnimation
      className={className}
      itemClassName={itemClassName}
      stagger={stagger}
      as={as}
      performanceMode="smooth"
      animationType="settleIn"
      duration={800}
      easing="spring"
      threshold={0.15}
    >
      {children}
    </StaggeredAnimation>
  );
}

// Content section animation that waits for images to load
export function ContentSection({
  children,
  className = "",
  waitForImages = true,
  ...animationOptions
}: {
  children: React.ReactNode;
  className?: string;
  waitForImages?: boolean;
} & ScrollAnimationOptions) {
  const [imagesLoaded, setImagesLoaded] = React.useState(!waitForImages);
  
  React.useEffect(() => {
    if (!waitForImages) return;
    
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;
    
    if (totalImages === 0) {
      setImagesLoaded(true);
      return;
    }
    
    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };
    
    images.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad); // Count errors as loaded
      }
    });
    
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [waitForImages]);
  
  if (!imagesLoaded) {
    return <div className={className} style={{ opacity: 0 }}>{children}</div>;
  }
  
  return (
    <ScrollAnimationWrapper
      animationType="settleIn"
      duration={800}
      easing="spring"
      className={className}
      {...animationOptions}
    >
      {children}
    </ScrollAnimationWrapper>
  );
} 