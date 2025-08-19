import { OpthionBar } from '@/components/ui/OpthionBar'

export const OrderMenue = () => {
  return (
    <div className="px-6 py-4 bg-fill-base-100">
      <OpthionBar>
        {/* 첫 번째 줄: 3개 세션을 가로로 배치 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 기본정보 세션 */}
          <OpthionBar.Section title="기본정보" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="고객번호" labelWidth={50}>
                  <OpthionBar.Input 
                    placeholder="고객번호 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
                <OpthionBar.Field label="고객명" labelWidth={40}>
                  <OpthionBar.Input 
                    placeholder="고객명 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="주문번호" labelWidth={50}>
                  <OpthionBar.Input 
                    placeholder="주문번호 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
                <OpthionBar.Field label="배송지" labelWidth={40}>
                  <select className="w-full text-[10px] h-5 bg-black text-white border-none appearance-none px-1 focus:outline-none">
                    <option value="all" className="bg-black text-white">전체</option>
                    <option value="seoul" className="bg-black text-white">서울</option>
                    <option value="gyeonggi" className="bg-black text-white">경기</option>
                    <option value="incheon" className="bg-black text-white">인천</option>
                  </select>
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>

          {/* 일자정보 세션 */}
          <OpthionBar.Section title="일자정보" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="주문일자" labelWidth={50}>
                  <OpthionBar.Input 
                    type="date" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="배송일자" labelWidth={50}>
                  <OpthionBar.Input 
                    type="date" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>

          {/* 상태/검색 세션 */}
          <OpthionBar.Section title="상태/검색" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="상태" labelWidth={30}>
                  <select className="w-full text-[10px] h-5 bg-black text-white border-none appearance-none px-1 focus:outline-none">
                    <option value="all" className="bg-black text-white">전체</option>
                    <option value="confirmed" className="bg-black text-white">주문확인</option>
                    <option value="preparing" className="bg-black text-white">배송준비</option>
                    <option value="shipping" className="bg-black text-white">배송중</option>
                    <option value="delivered" className="bg-black text-white">배송완료</option>
                  </select>
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={1} gap={1}>
                <OpthionBar.Field label="검색" labelWidth={30}>
                  <div className="flex items-center gap-1 w-full">
                    <OpthionBar.Input 
                      placeholder="고객명 입력" 
                      className="w-full flex-1 text-[10px] h-5 px-1 border-none bg-transparent"
                    />
                    <OpthionBar.Button 
                      size="tabSm" 
                      className="text-[10px] h-5 px-2 bg-primary-400 text-white hover:bg-primary-500 flex-shrink-0"
                      style={{ borderRadius: '0' }}
                    >
                      검색
                    </OpthionBar.Button>
                  </div>
                </OpthionBar.Field>
           
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>
        </div>

        <OpthionBar.Divider />

        {/* 두 번째 줄: 2개 세션을 가로로 배치 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 상품정보 세션 */}
          <OpthionBar.Section title="상품정보" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="상품코드" labelWidth={50}>
                  <OpthionBar.Input 
                    placeholder="상품코드 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
                <OpthionBar.Field label="상품명" labelWidth={40}>
                  <OpthionBar.Input 
                    placeholder="상품명 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="카테고리" labelWidth={50}>
                  <select className="w-full text-[10px] h-5 bg-black text-white border-none appearance-none px-1 focus:outline-none">
                    <option value="all" className="bg-black text-white">전체</option>
                    <option value="electronics" className="bg-black text-white">전자제품</option>
                    <option value="clothing" className="bg-black text-white">의류</option>
                    <option value="books" className="bg-black text-white">도서</option>
                    <option value="lifestyle" className="bg-black text-white">생활용품</option>
                  </select>
                </OpthionBar.Field>
                <OpthionBar.Field label="브랜드" labelWidth={40}>
                  <select className="w-full text-[10px] h-5 bg-black text-white border-none appearance-none px-1 focus:outline-none">
                    <option value="all" className="bg-black text-white">전체</option>
                    <option value="samsung" className="bg-black text-white">삼성</option>
                    <option value="lg" className="bg-black text-white">LG</option>
                    <option value="apple" className="bg-black text-white">애플</option>
                  </select>
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="가격범위" labelWidth={50}>
                  <div className="flex items-center gap-1">
                    <OpthionBar.Input 
                      placeholder="최소" 
                      className="text-[10px] h-5 px-1 border-none bg-transparent flex-1"
                    />
                    <span className="text-[10px] text-text-base-400">~</span>
                    <OpthionBar.Input 
                      placeholder="최대" 
                      className="text-[10px] h-5 px-1 border-none bg-transparent flex-1"
                    />
                  </div>
                </OpthionBar.Field>
                <OpthionBar.Field label="초기화" labelWidth={40}>
                  <OpthionBar.Button 
                    size="tabSm" 
                    variant="outline" 
                    className="text-[10px] h-5 px-2 border-stroke-base-200 hover:bg-fill-alt-100"
                  >
                    초기화
                  </OpthionBar.Button>
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>

          {/* 배송정보 세션 */}
          <OpthionBar.Section title="배송정보" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="배송업체" labelWidth={50}>
                  <select className="w-full text-[10px] h-5 bg-black text-white border-none appearance-none px-1 focus:outline-none">
                    <option value="all" className="bg-black text-white">전체</option>
                    <option value="cj" className="bg-black text-white">CJ대한통운</option>
                    <option value="hanjin" className="bg-black text-white">한진택배</option>
                    <option value="lotte" className="bg-black text-white">로젠택배</option>
                  </select>
                </OpthionBar.Field>
                <OpthionBar.Field label="송장번호" labelWidth={50}>
                  <OpthionBar.Input 
                    placeholder="송장번호 입력" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="배송상태" labelWidth={50} selected>
                  <span>배송완료</span>
                </OpthionBar.Field>
                <OpthionBar.Field label="수취인" labelWidth={40}>
                  <OpthionBar.Input 
                    placeholder="수취인명" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={2} gap={2}>
                <OpthionBar.Field label="연락처" labelWidth={40}>
                  <OpthionBar.Input 
                    placeholder="연락처" 
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
                <OpthionBar.Field label="적용" labelWidth={30}>
                  <OpthionBar.Button 
                    size="tabSm" 
                    className="text-[10px] h-5 px-2 bg-success-400 text-white hover:bg-success-500"
                  >
                    적용
                  </OpthionBar.Button>
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>
        </div>
      </OpthionBar>
    </div>
  )
}