/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
		theme: {
			fontFamily: {
				sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
      	display: ['Pretendard', 'sans-serif'],
			},
			fontSize: {
				'h1': ['var(--text-h1-size)', { lineHeight: 'var(--text-h1-line-height)', fontWeight: 'var(--text-h1-weight)' }],
				'h2': ['var(--text-h2-size)', { lineHeight: 'var(--text-h2-line-height)', fontWeight: 'var(--text-h2-weight)', letterSpacing: 'var(--text-h2-letter-spacing)' }],
				'h3': ['var(--text-h3-size)', { lineHeight: 'var(--text-h3-line-height)', fontWeight: 'var(--text-h3-weight)' }],
				'h4': ['var(--text-h4-size)', { lineHeight: 'var(--text-h4-line-height)', fontWeight: 'var(--text-h4-weight)' }],
				'h5': ['var(--text-h5-size)', { lineHeight: 'var(--text-h5-line-height)', fontWeight: 'var(--text-h5-weight)' }],
				'h6': ['var(--text-h6-size)', { lineHeight: 'var(--text-h6-line-height)', fontWeight: 'var(--text-h6-weight)' }],
				'body-l': ['var(--text-body-l-size)', { lineHeight: 'var(--text-body-l-line-height)', fontWeight: 'var(--text-body-l-weight)' }],
				'body-s': ['var(--text-body-s-size)', { lineHeight: 'var(--text-body-s-line-height)', fontWeight: 'var(--text-body-s-weight)' }],
				'button': ['var(--text-button-size)', { lineHeight: 'var(--text-button-line-height)', fontWeight: 'var(--text-button-weight)' }],
				'caption': ['var(--text-caption-size)', { lineHeight: 'var(--text-caption-line-height)', fontWeight: 'var(--text-caption-weight)' }],
			},
			screens: {
				'xl': '1280px',
				'2xl': '1600px'
			},
			extend: {
				maxWidth: {
					'screen-xl': '1280px',
					'screen-2xl': '1600px'
				},
				width: {
					'sidebar-left': '184px',
					'sidebar-left-2xl': '240px',
					'sidebar-right': '288px',
					'sidebar-right-2xl': '320px',
					'screen-xl': '1280px',
					'screen-2xl': '1600px'
				},
				gridTemplateColumns: {
					'sidebar-layout': '184px 1fr',
					'sidebar-layout-2xl': '240px 1fr'
				},
				colors: {
					'fill-base-100': 'hsl(var(--fill-base-100))',
					'fill-base-200': 'hsl(var(--fill-base-200))',
					'fill-alt-100': 'hsl(var(--fill-alt-100))',
					'fill-alt-200': 'hsl(var(--fill-alt-200))',
					'fill-alt-300': 'hsl(var(--fill-alt-300, 0 0% 90%))',

					'icon-base-300': 'hsl(var(--icon-base-300))',
					'icon-base-400': 'hsl(var(--icon-base-400))',

					'stroke-base-100': 'hsl(var(--stroke-base-100))',
					'stroke-base-200': 'hsl(var(--stroke-base-200))',
					'stroke-base-300': 'hsl(var(--stroke-base-300))',

					'text-base-200': 'hsl(var(--text-base-200))',
					'text-base-300': 'hsl(var(--text-base-300))',
					'text-base-400': 'hsl(var(--text-base-400))',
					'text-base-500': 'hsl(var(--text-base-500))',
					'text-contrast-500': 'hsl(var(--text-contrast-500))',

					'primary-200': 'hsl(var(--primary-200))',
					'primary-300': 'hsl(var(--primary-300))',
					'primary-400': 'hsl(var(--primary-400))',
					'primary-500': 'hsl(var(--primary-500))',
					'primary-600': 'hsl(var(--primary-600))',
					'primary-100': 'hsl(var(--primary-100))',
					'primary-800': 'hsl(var(--primary-800, 213 74% 22%))',

					'error-100': 'hsl(var(--error-100))',
					'error-500': 'hsl(var(--error-500))',

					'accent-red-100': 'hsl(var(--accent-red-100))',
					'accent-red-500': 'hsl(var(--accent-red-500))',
					'accent-green-100': 'hsl(var(--accent-green-100))',
					'accent-green-500': 'hsl(var(--accent-green-500))',
					'accent-blue-100': 'hsl(var(--accent-blue-100))',
					'accent-yellow-400': 'hsl(var(--accent-yellow-400))',
					'accent-purple-400': 'hsl(var(--accent-purple-400))',
					'accent-purple-500': 'hsl(var(--accent-purple-500))',

					'background': 'hsl(var(--background))',
					'foreground': 'hsl(var(--foreground))',
					'card': 'hsl(var(--card))',
					'card-foreground': 'hsl(var(--card-foreground))',
					'popover': 'hsl(var(--popover))',
					'popover-foreground': 'hsl(var(--popover-foreground))',
					'primary': 'hsl(var(--primary-500))',
					'primary-foreground': 'hsl(var(--text-contrast-500))',
					'secondary': 'hsl(var(--primary-400))',
					'secondary-foreground': 'hsl(var(--text-contrast-500))',
					'muted': 'hsl(var(--muted))',
					'muted-foreground': 'hsl(var(--muted-foreground))',
					'accent': 'hsl(var(--accent))',
					'accent-foreground': 'hsl(var(--accent-foreground))',
					'destructive': 'hsl(var(--destructive))',
					'destructive-foreground': 'hsl(var(--destructive-foreground))',
					'border': 'hsl(var(--border))',
					'input': 'hsl(var(--input))',
					'ring': 'hsl(var(--ring))',
				}
			}
		},
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar')],
}

