import { RuleEngineToolbar } from './RuleEngineToolbar'; // ✅ 경로 맞게 수정 필요할 수도 있음

export const ProductLayout = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품/주문 관리 시스템" />
            <RuleEngineToolbar /> {/* ✅ 여기 추가 */}
            <ProductToolbar />
            <div className="flex-1 p-4">
              <ProductGrid />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-fill-base-100">
          <HeaderManagement title="상품/주문 관리 시스템" />
          <RuleEngineToolbar /> {/* ✅ 여기 추가 */}
          <ProductToolbar />
          <div className="flex-1 p-4 pl-6">
            <ProductGrid />
          </div>
        </div>
      )}
    </div>
  );
};
