import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FormatNumberOptions {
  type?: 'currency' | 'percent' | 'number'
  useComma?: boolean
  decimalScale?: number
  prefix?: string
  suffix?: string
  useEllipsis?: boolean
  maxLength?: number
}

/**
 * 숫자를 다양한 형태로 포맷팅합니다.
 * 
 * @param num - 포맷팅할 숫자
 * @param options - 포맷팅 옵션
 * 
 * @example
 * // 기본 천단위 콤마
 * formatNumber(1234567) // "1,234,567"
 * 
 * @example
 * // 통화 형식
 * formatNumber(1234567, { type: 'currency' }) // "₩1,234,567"
 * 
 * @example
 * // 퍼센트 형식
 * formatNumber(0.1234, { type: 'percent' }) // "12.34%"
 * 
 * @example
 * // 접두사/접미사 추가
 * formatNumber(1234, { prefix: '약 ', suffix: '개' }) // "약 1,234개"
 * 
 * @example
 * // 말줄임표 처리
 * formatNumber(123456789, { maxLength: 8 }) // "123,456..."
 * 
 * @example
 * // 소수점 자릿수 제어
 * formatNumber(1234.5678, { decimalScale: 2 }) // "1,234.57"
 */
export function formatNumber(
  num: number | string,
  options: FormatNumberOptions = {}
): string {
  const {
    type = 'number',
    useComma = true,
    decimalScale,
    prefix = '',
    suffix = '',
    useEllipsis = true,
    maxLength = 10
  } = options

  const numValue = Number(num)
  let result = ''

  switch (type) {
    case 'currency':
      result = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: decimalScale ?? 0,
        maximumFractionDigits: decimalScale ?? 0
      }).format(numValue)
      break
    case 'percent':
      result = new Intl.NumberFormat('ko-KR', {
        style: 'percent',
        minimumFractionDigits: decimalScale ?? 2,
        maximumFractionDigits: decimalScale ?? 2
      }).format(numValue / 100)
      break
    default:
      result = useComma 
        ? new Intl.NumberFormat('ko-KR', {
            minimumFractionDigits: decimalScale ?? 0,
            maximumFractionDigits: decimalScale ?? 0
          }).format(numValue)
        : String(numValue)
  }

  result = prefix + result + suffix

  if (useEllipsis && result.length > maxLength) {
    result = result.slice(0, maxLength) + '...'
  }

  return result
}