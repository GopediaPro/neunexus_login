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
				colors: {
					background: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))',
					
					// 페이지 공통 색상
					'page-bg': 'var(--page-bg)',
					'page-card-bg': 'var(--page-card-bg)',
					'page-button-primary': 'var(--page-button-primary)',
					'page-button-primary-hover': 'var(--page-button-primary-hover)',
					'page-button-primary-loading': 'var(--page-button-primary-loading)',
					'page-error': 'var(--page-error)',
					'page-error-input-bg': 'var(--page-error-input-bg)',
					'page-input-bg': 'var(--page-input-bg)',
					'page-input-font': 'var(--page-input-font)',
					'page-input-border': 'var(--page-input-border)',
					'page-input-title': 'var(--page-input-title)',
					'page-button-font': 'var(--page-button-font)',
					'page-font-primary': 'var(--page-font-primary)',
					'page-font-secondary': 'var(--page-font-secondary)',

					'page-blue-400': 'var(--page-blue-400)',
					'page-blue-300': 'var(--page-blue-300)',
					'page-blue-200': 'var(--page-blue-200)',
					
					'gray-100': 'hsl(var(--gray-100))',
					'gray-200': 'hsl(var(--gray-200))',
					'gray-300': 'hsl(var(--gray-300))',
					'gray-400': 'hsl(var(--gray-400))',
					'gray-500': 'hsl(var(--gray-500))',

					// 메인페이지 전용 색상
					'page-sidebar-bg': 'var(--page-sidebar-bg)',
					'page-sidebar-menu-bg-default': 'var(--page-sidebar-menu-bg-default)',
					'page-sidebar-menu-bg-hover': 'var(--page-sidebar-menu-bg-hover)',
					'page-sidebar-menu-list-bg': 'var(--page-sidebar-menu-list-bg)',
					'page-feature-button-icon-default': 'var(--page-feature-button-icon-default)',
					'page-feature-button-icon-hover': 'var(--page-feature-button-icon-hover)',
					'page-font-tertiary': 'var(--page-font-tertiary)',
					'page-font-muted': 'var(--page-font-muted)',
					'page-button-border': 'var(--page-button-border)',
					'page-divider-border': 'var(--page-divider-border)',
					'page-toggle-on-bg': 'var(--page-toggle-on-bg)',
					'page-toggle-off-bg': 'var(--page-toggle-off-bg)',
					'page-input-bar-scroll-bg': 'var(--page-input-bar-scroll-bg)',

					'border-default': 'hsl(var(--border-default))',

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
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar')],
}

