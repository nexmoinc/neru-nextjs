import { UsePaginationOptions } from "react-table";

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UsePaginationOptions<D>,
      Record<string, any> {}

  export interface TableState<
    D extends Record<string, unknwon> = Record<string, unknonw>
  > extends UsePaginationState<D> {}

  export interface TableInstance<
    D extends Record<string, unknwon> = Record<string, unknonw>
  > extends UsePaginationInstanceProps<D> {}
}
