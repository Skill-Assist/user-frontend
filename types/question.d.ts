import { Option } from "./option";

export type Question = {
  type: string;
  statement: string;
  options?: Option;
};
