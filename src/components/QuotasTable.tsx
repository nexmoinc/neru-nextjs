import Table from "react-bootstrap/Table";

import { useEffect, useState } from "react";
import {
  HeaderGroup,
  Row,
  TableInstance,
  usePagination,
  UsePaginationInstanceProps,
  useTable,
} from "react-table";
import styled from "styled-components";
import { useSticky } from "react-table-sticky";

interface EditableCellProps {
  value: number;
  row: { original: { api_key: string } };
  column: { parent: { id: string }; Header: string };
}

interface TableProps {
  columns: any;
  data: any;
  updateQuota: (APIKey: string, date: string, quota: number) => void;
}

export type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T>;

const Wrapper = styled.div`
  width: 100%;
  overflow: scroll;

  table {
    th,
    td {
      width: 10rem;

      input {
        border: 0;
        margin: 0;
        background: transparent;
      }
    }
  }

  [data-sticky-td] {
    position: sticky;
  }

  [data-sticky-last-left-td] {
    background-color: white;
    z-index: 100;
    box-shadow: 2px 0px 3px #ccc;
  }
`;

export const QuotasTable = ({ columns, data, updateQuota }: TableProps) => {
  const defaultColumn = {
    Cell: ({
      value: initialValue,
      row: { original },
      column: { parent, Header },
    }: EditableCellProps) => {
      const [value, setValue] = useState(initialValue);

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.currentTarget.value, 10) || 0);
      };

      const onBlur = () => {
        if (value !== initialValue) {
          updateQuota(original.api_key, parent.id, value);
        }
      };

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return Header === "Quota" ? (
        <input
          size={12}
          value={value ?? 0}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        value ?? "-"
      );
    },
  } as any; // TODO: no-no

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      usePagination,
      useSticky
    ) as TableInstanceWithHooks<any>;

  const renderHeaderGroup = (headerGroup: HeaderGroup) =>
    headerGroup.headers.map((column) => {
      const { key, ...restColumn } = column.getHeaderProps();
      return (
        <th key={key} {...restColumn} className="text-center">
          {column.render("Header")}
        </th>
      );
    });

  const renderHeaderGroups = (headerGroups: Array<HeaderGroup>) =>
    headerGroups.map((headerGroup) => {
      const { key, ...restHeaderGroupProps } =
        headerGroup.getHeaderGroupProps();

      return (
        <tr key={key} {...restHeaderGroupProps}>
          {renderHeaderGroup(headerGroup)}
        </tr>
      );
    });

  const renderRow = (row: Row) =>
    row.cells.map((cell) => {
      const { key, ...restCellProps } = cell.getCellProps();

      return (
        <td key={key} {...restCellProps}>
          {cell.render("Cell")}
        </td>
      );
    });

  const renderPage = (rows: Array<Row>) =>
    rows.map((row: Row) => {
      prepareRow(row);
      const { key, ...restRowProps } = row.getRowProps();

      return (
        <tr key={key} {...restRowProps}>
          {renderRow(row)}
        </tr>
      );
    });

  return (
    <Wrapper>
      <Table striped bordered hover size="sm" {...getTableProps()}>
        <thead>{renderHeaderGroups(headerGroups)}</thead>
        <tbody {...getTableBodyProps()}>{renderPage(page)}</tbody>
      </Table>
    </Wrapper>
  );
};
