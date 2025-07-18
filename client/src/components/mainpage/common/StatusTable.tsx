// 타입 정의
interface StatusTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: any) => React.ReactNode;
}

interface StatusTableProps {
  columns: StatusTableColumn[];
  data: any[];
  height?: string;
}

export const StatusTable = ({
  columns,
  data,
  height = 'h-52'
}: StatusTableProps) => {
  return (
    <div
      className={`${height} rounded border border-stroke-base-200 flex flex-col`}
    >
      {/* 고정 헤더 */}
      <table className="w-full table-fixed">
        <thead className="bg-fill-base-200">
          <tr className="h-10">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-3.5 py-2 text-text-base-500 text-sm font-semibold leading-tight w-1/${columns.length} ${
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* 스크롤 가능한 바디 */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full table-fixed">
          <tbody>
            {data.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <tr
                  key={item.id || index}
                  className={`h-10 border-b border-stroke-base-200 ${
                    isEven ? 'bg-fill-base-100' : 'bg-fill-alt-200'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3.5 py-2 text-text-base-400 text-sm leading-tight w-1/${columns.length} ${
                        column.align === 'center'
                          ? 'text-center'
                          : column.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                      } ${column.align === 'left' ? 'truncate' : ''}`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
