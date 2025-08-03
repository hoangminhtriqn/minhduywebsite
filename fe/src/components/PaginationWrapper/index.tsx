import React from "react";
import CustomPagination from "../CustomPagination";

interface PaginationWrapperProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  pageSizeOptions?: string[];
  className?: string;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = ["12", "24", "48", "96"],
  className,
}) => {
  return (
    <CustomPagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      pageSizeOptions={pageSizeOptions}
      className={className}
    />
  );
};

export default PaginationWrapper;
