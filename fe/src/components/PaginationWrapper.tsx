import React from "react";
import CustomPagination from "./CustomPagination";

interface PaginationWrapperProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: string[];
  className?: string;
  totalText?: string;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal = true,
  pageSizeOptions = ["12", "24", "48", "96"],
  className,
  totalText,
}) => {
  const defaultShowTotal = (total: number, range: [number, number]) => {
    if (totalText) {
      return totalText
        .replace("{start}", range[0].toString())
        .replace("{end}", range[1].toString())
        .replace("{total}", total.toString());
    }
    return `${range[0]}-${range[1]} của ${total} mục`;
  };

  return (
    <CustomPagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      showQuickJumper={showQuickJumper}
      showTotal={showTotal ? defaultShowTotal : undefined}
      pageSizeOptions={pageSizeOptions}
      className={className}
    />
  );
};

export default PaginationWrapper;
