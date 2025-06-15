/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
		theme: {
			fontFamily: {
				sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
      	display: ['Pretendard', 'sans-serif'],
			},
			fontWeight: {
				thin: '100',
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
			extend: {
				borderRadius: {
					lg: 'var(--radius)',
					md: 'calc(var(--radius) - 2px)',
					sm: 'calc(var(--radius) - 4px)'
				},
				colors: {
					background: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))',
					
					'web-background': 'hsl(var(--web-background))',
					'web-primary': 'hsl(var(--web-primary))',
					'web-secondary': 'hsl(var(--web-secondary))',
					'web-accent': 'hsl(var(--web-accent))',
					'web-focus': 'hsl(var(--web-focus))',
					
					'border-default': 'hsl(var(--border-default))',
					'border-icon': 'hsl(var(--border-icon))',
					'border-subtle': 'hsl(var(--border-subtle))',
					'border-error': 'hsl(var(--border-error))',
					
					'input-background': 'hsl(var(--input-background))',
					'input-font': 'hsl(var(--input-font))',
					'background-error': 'hsl(var(--background-error))',
					
					'font-white': 'hsl(var(--font-white))',
					'font-black': 'hsl(var(--font-black))',
					'font-primary': 'hsl(var(--font-primary))',
					'font-secondary': 'hsl(var(--font-secondary))',
					'font-tertiary': 'hsl(var(--font-tertiary))',
					'font-muted': 'hsl(var(--font-muted))',
					
					'gray-100': 'hsl(var(--gray-100))',
					'gray-200': 'hsl(var(--gray-200))',
					'gray-300': 'hsl(var(--gray-300))',
					'gray-400': 'hsl(var(--gray-400))',
					'gray-500': 'hsl(var(--gray-500))',

					'disabled-background': 'hsl(var(--disabled-background))',
					'disabled-text': 'hsl(var(--disabled-text))',
					'disabled-border': 'hsl(var(--disabled-border))',
					'disabled-placeholder': 'hsl(var(--disabled-placeholder))',

					'web-error': 'hsl(var(--web-error))',

					primary: 'hsl(var(--web-primary))',
					secondary: 'hsl(var(--web-secondary))',

					card: {
						DEFAULT: 'hsl(var(--card))',
						foreground: 'hsl(var(--card-foreground))'
					},
					popover: {
						DEFAULT: 'hsl(var(--popover))',
						foreground: 'hsl(var(--popover-foreground))'
					},
					muted: {
						DEFAULT: 'hsl(var(--muted))',
						foreground: 'hsl(var(--muted-foreground))'
					},
					accent: {
						DEFAULT: 'hsl(var(--accent))',
						foreground: 'hsl(var(--accent-foreground))'
					},
					destructive: {
						DEFAULT: 'hsl(var(--destructive))',
						foreground: 'hsl(var(--destructive-foreground))'
					},
					border: 'hsl(var(--border))',
					input: 'hsl(var(--input))',
					ring: 'hsl(var(--ring))',
					chart: {
						'1': 'hsl(var(--chart-1))',
						'2': 'hsl(var(--chart-2))',
						'3': 'hsl(var(--chart-3))',
						'4': 'hsl(var(--chart-4))',
						'5': 'hsl(var(--chart-5))'
					}
				}
			}
		},
  plugins: [require("tailwindcss-animate")],
}

