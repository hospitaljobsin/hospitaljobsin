/**
 * Centralized Animation Configurations
 *
 * This file contains all Framer Motion animation variants and configurations
 * used across the Enhanced Map Interface components.
 */

import type { Transition, Variants } from 'framer-motion';

// Common easing configurations
export const EASING = {
	spring: { type: 'spring', damping: 25, stiffness: 300 },
	smoothSpring: { type: 'spring', damping: 30, stiffness: 300 },
	easeOut: { duration: 0.2, ease: 'easeOut' },
	easeInOut: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
} as const;

// Sidebar slide animation for desktop
export const sidebarSlide: Variants = {
	initial: { width: 0, opacity: 0 },
	animate: { width: 320, opacity: 1 },
	exit: { width: 0, opacity: 0 }
};

export const sidebarTransition: Transition = EASING.spring;

// Modal animations
export const modalSlideUp: Variants = {
	initial: { y: '100%', opacity: 0 },
	animate: { y: 0, opacity: 1 },
	exit: { y: '100%', opacity: 0 }
};

export const modalTransition: Transition = EASING.smoothSpring;

// Backdrop fade animation
export const backdropFade: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 }
};

export const backdropTransition: Transition = { duration: 0.2 };

// Filter chips expansion animation
export const filterChipsExpand: Variants = {
	initial: { height: 0, opacity: 0 },
	animate: { height: 'auto', opacity: 1 },
	exit: { height: 0, opacity: 0 }
};

export const filterChipsTransition: Transition = EASING.spring;

// Fade in/out for search elements
export const fadeInUp: Variants = {
	initial: { y: 20, opacity: 0 },
	animate: { y: 0, opacity: 1 },
	exit: { y: 20, opacity: 0 }
};

export const fadeTransition: Transition = EASING.easeOut;

// Staggered children animation
export const staggerContainer: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.1
		}
	}
};

export const staggerItem: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 }
};

// Scale animation for buttons and interactive elements
export const scaleOnTap = {
	whileTap: { scale: 0.95 },
	transition: { type: 'spring', stiffness: 400, damping: 30 }
};

// Hover animations
export const hoverLift = {
	whileHover: { y: -2, transition: { duration: 0.2 } }
};

// Reduced motion variants - respect user's preference
export const createReducedMotionVariant = (variants: Variants): Variants => {
	const reducedVariants: Variants = {};

	Object.keys(variants).forEach(key => {
		if (key === 'initial' || key === 'animate' || key === 'exit') {
			reducedVariants[key] = {
				opacity: key === 'initial' ? 0 : 1,
				transition: { duration: 0.01 } // Minimal duration for reduced motion
			};
		} else {
			reducedVariants[key] = variants[key];
		}
	});

	return reducedVariants;
};

// Function to check for reduced motion preference (not a hook)
export const checkReducedMotion = () => {
	if (typeof window === 'undefined') return false;

	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation configuration based on reduced motion preference
export const getAnimationConfig = (variants: Variants, transition?: Transition, respectReducedMotion = true) => {
	if (respectReducedMotion && checkReducedMotion()) {
		return {
			variants: createReducedMotionVariant(variants),
			transition: { duration: 0.01 }
		};
	}

	return { variants, transition };
};

// Accessibility-friendly focus animations
export const focusRing: Variants = {
	focus: {
		boxShadow: '0 0 0 2px hsl(var(--nextui-primary))',
		transition: { duration: 0.1 }
	}
};

// Loading state animations
export const pulseAnimation: Variants = {
	animate: {
		opacity: [1, 0.5, 1],
		transition: {
			duration: 1.5,
			repeat: Number.POSITIVE_INFINITY,
			ease: 'easeInOut'
		}
	}
};
