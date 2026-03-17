/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			// ============================================
			// ESTIMATION STATION BRAND COLORS
			// ============================================

			// Primary: Station Navy (Trustworthy, Professional)
			colors: {
				brand: {
					50: '#EEF2FF',
					100: '#E0E7FF',
					200: '#C7D2FE',
					300: '#A5B4FC',
					400: '#818CF8',
					500: '#6366F1',
					600: '#4F46E5',
					700: '#4338CA',
					800: '#3730A3',
					900: '#312E81',
				},

				// Accent: Safety Orange (Friendly, Action-oriented)
				accent: {
					50: '#FFF7ED',
					100: '#FFEDD5',
					200: '#FED7AA',
					300: '#FDBA74',
					400: '#FB923C',
					500: '#F97316',
					600: '#EA580C',
					700: '#C2410C',
					800: '#9A3412',
					900: '#7C2D12',
				},

				// Primary: Station Navy (Main brand color)
				primary: {
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617',
				},

				// Semantic Colors
				success: {
					50: '#ECFDF5',
					100: '#D1FAE5',
					200: '#A7F3D0',
					300: '#6EE7B7',
					400: '#34D399',
					500: '#10B981',
					600: '#059669',
					700: '#047857',
					800: '#065F46',
					900: '#064E3B',
				},

				warning: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
				},

				error: {
					50: '#FEF2F2',
					100: '#FEE2E2',
					200: '#FECACA',
					300: '#FCA5A5',
					400: '#F87171',
					500: '#EF4444',
					600: '#DC2626',
					700: '#B91C1C',
					800: '#991B1B',
					900: '#7F1D1D',
				},

				// Surface Colors for Cards/Modals
				surface: {
					light: '#FFFFFF',
					dark: '#1E293B',
				},

				// Background Colors
				background: {
					light: '#F8FAFC',
					dark: '#0F172A',
				},

				// Border Colors
				border: {
					light: '#E2E8F0',
					dark: '#334155',
				},
			},

			// ============================================
			// TYPOGRAPHY SYSTEM
			// ============================================
			fontFamily: {
				sans: ['Manrope', 'system-ui', 'sans-serif'],
				display: ['Manrope', 'system-ui', 'sans-serif'],
			},

			fontSize: {
				// Display Sizes
				'display-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
				'display-2': ['3rem', { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.02em' }],
				'display-3': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],

				// Heading Sizes
				'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.01em' }],
				'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
				'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
				'h4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
				'h5': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
				'h6': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],

				// Body Sizes
				'body-xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'body': ['1rem', { lineHeight: '1.5rem' }],
				'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'body-xs': ['0.75rem', { lineHeight: '1rem' }],

				// UI/Label Sizes
				'label': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
				'label-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
				'button': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
				'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
			},

			// ============================================
			// SPACING SYSTEM
			// ============================================
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},

			// ============================================
			// BORDER RADIUS
			// ============================================
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
			},

			// ============================================
			// SHADOW SYSTEM
			// ============================================
			boxShadow: {
				// Subtle shadows for cards
				'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

				// Brand shadows
				'accent': '0 4px 14px 0 rgb(249 115 22 / 0.4)',
				'accent-lg': '0 10px 25px 0 rgb(249 115 22 / 0.5)',
				'brand': '0 4px 14px 0 rgb(99 102 241 / 0.4)',
				'brand-lg': '0 10px 25px 0 rgb(99 102 241 / 0.5)',
			},

			// ============================================
			// ANIMATIONS
			// ============================================
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(-10px)' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'bounce-subtle': 'bounce-subtle 2s infinite',
				'pulse-soft': 'pulse-soft 2s infinite',
				'spin-slow': 'spin-slow 3s linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
