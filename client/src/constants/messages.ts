export const TOAST_MESSAGES = {
  FILE_ADDED: (count: number) => `${count}개 파일이 추가되었습니다.`,
  FILE_REMOVED: '파일이 삭제되었습니다.',
  FILE_DUPLICATE: (name: string) => `${name}은 이미 추가된 파일입니다.`,
  FILE_SIZE_ERROR: (name: string) => `${name}: 파일 크기가 50MB를 초과합니다.`,
  FILE_TYPE_ERROR: (name: string) => `${name}: 지원되지 않는 파일 형식입니다.`,
  ALL_SELECTED: (count: number) => `전체 ${count}개 파일이 선택되었습니다.`,
  ALL_DESELECTED: '전체 선택이 해제되었습니다.',
  NO_FILES_TO_UPLOAD: '업로드할 파일이 없습니다.',
  FORM_NAME_REQUIRED: 'Form Name을 선택해주세요.',
  TEMPLATE_REQUIRED: '템플릿을 선택해주세요.',
  DATE_RANGE_ERROR: '시작 날짜는 종료 날짜보다 이전이어야 합니다.',
  UPLOAD_SUCCESS: (count: number) => `${count}개 파일 처리가 완료되었습니다.`,
  UPLOAD_ERROR: '업로드 중 오류가 발생했습니다.',
  COPY_SUCCESS: '링크가 복사되었습니다.',
  COPY_ERROR: '복사에 실패했습니다.'
} as const;

export const ERROR_MESSAGES = {
  EXCEL_TO_DB: {
    TITLE: 'Excel to DB 처리 실패',
    MESSAGE: (error: string) => `파일 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error}\n\n다시 시도해주세요.`
  },
  SMILE_MACRO: {
    TITLE: 'Smile Macro 처리 실패',
    MESSAGE: (error: string) => `파일 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error}\n\n다시 시도해주세요.`
  },
  EXCEL_UPLOAD: {
    TITLE: '매크로 실행 실패',
    MESSAGE: (error: string) => `엑셀 매크로 실행에 실패했습니다.\n\n오류 내용: ${error}\n\n다시 시도해주세요.`
  }
} as const;

export const SUCCESS_MESSAGES = {
  EXCEL_TO_DB: {
    TITLE: 'Excel to DB 처리 완료',
    MESSAGE: (data: {
      processedCount: number;
      insertedCount: number;
      updatedCount: number;
      failedCount: number;
    }) => `총 처리된 레코드: ${data.processedCount}건\n삽입: ${data.insertedCount}건 | 업데이트: ${data.updatedCount}건 | 실패: ${data.failedCount}건\n\n처리 시간: ${new Date().toLocaleString('ko-KR')}`
  },
  SMILE_MACRO: {
    TITLE: 'Smile Macro 처리 완료',
    MESSAGE: (data: {
      batchId: string;
      processedCount: number;
      aFileUrl: string;
      gFileUrl: string;
    }) => `배치 ID: ${data.batchId}\n처리된 건수: ${data.processedCount}건\n처리 시간: ${new Date().toLocaleString('ko-KR')}\n\nA파일: ${data.aFileUrl}\nG파일: ${data.gFileUrl}`
  },
  EXCEL_UPLOAD: {
    TITLE: '매크로 실행 완료',
    MESSAGE: (fileName: string) => `엑셀 매크로가 성공적으로 실행되었습니다.\n\n파일명: ${fileName}\n실행 시간: ${new Date().toLocaleString('ko-KR')}`
  }
} as const;