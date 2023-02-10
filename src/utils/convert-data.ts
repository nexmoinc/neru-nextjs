import _ from "lodash";

interface Stats {
  date: string;
  quota: number;
  used: number;
}

interface DataItem {
  api_key: string;
  stats: Array<Stats>;
}

interface Column {
  Header: string;
  accessor: string;
}

interface ColumnWrapper {
  Header: string;
  columns: Array<Column>;
  sticky?: "left" | "right";
}

interface TableStatsData {
  columns: Array<ColumnWrapper>;
  data: Record<string, string | number>;
}

interface TableData {
  columns: Array<ColumnWrapper>;
  data: Array<TableStatsData["data"]>;
}

const convertStats = ({ api_key, stats }: DataItem) =>
  stats.reduce(
    ({ columns, data }, { date, quota, used }) => ({
      columns: [
        ...columns,
        {
          Header: date,
          columns: [
            {
              Header: "Quota",
              accessor: `quota-${date}`,
            },
            {
              Header: "Used",
              accessor: `used-${date}`,
            },
          ],
        },
      ],
      data: { ...data, [`quota-${date}`]: quota, [`used-${date}`]: used },
    }),
    { columns: [], data: { api_key } } as TableStatsData
  );

const convertRecords = (records: Array<DataItem>) => records.map(convertStats);

export const convertData = (rawData: Array<DataItem>) =>
  convertRecords(rawData).reduce(
    ({ columns, data }, client) => ({
      columns: _.sortBy(_.unionBy(columns, client.columns, "Header"), [
        "Header",
      ]),
      data: [...data, client.data],
    }),
    {
      columns: [
        {
          Header: " ",
          sticky: "left",
          columns: [
            {
              Header: "Client",
              accessor: "api_key",
            },
          ],
        },
      ],
      data: [],
    } as TableData
  );
