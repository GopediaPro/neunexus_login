export const adaptiveLineBreak = (text: string) => {
  // 한글 기준 4글자 이하면 한 줄로 표시
  if (text.length <= 4) {
    return text;
  }

  // 공백이 있는 경우 의미 단위로 나누기
  if (text.includes(' ')) {
    const words = text.split(' ');
    
    if (words.length === 2) {
      // 2개 단어: 각각 한 줄씩
      return words.join('\n');
    }
    
    if (words.length >= 3) {
      // 3개 이상: 의미있게 나누기
      const midPoint = Math.ceil(words.length / 2);
      const firstLine = words.slice(0, midPoint).join(' ');
      const secondLine = words.slice(midPoint).join(' ');
      return `${firstLine}\n${secondLine}`;
    }
  }

  // 공백이 없고 5글자 이상인 경우
  if (text.length >= 5) {
    // 특정 패턴으로 의미있게 나누기
    const patterns = [
      // "운송장출력" -> "운송장\n출력"
      /^(운송장|택배|배송)(.+)$/,
      // "ERP업로드" -> "ERP\n업로드"  
      /^([A-Z]+)(.+)$/,
      // "재고관리" -> "재고\n관리"
      /^(.{2,3})(.{2,})$/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[2]) {
        return `${match[1]}\n${match[2]}`;
      }
    }
    
    // 패턴에 안 맞으면 중간에서 나누기
    const mid = Math.ceil(text.length / 2);
    return `${text.slice(0, mid)}\n${text.slice(mid)}`;
  }

  return text;
};