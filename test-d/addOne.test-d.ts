import { expectAssignable, expectError, expectType } from "tsd";

declare function addOne(a: number | null): number;

expectType<(a: number) => number>(addOne);
expectError(addOne(null));
expectError(addOne(undefined));

interface Todo {
  title: string;
  description: string;
}

// declare const partial: Partial<Todo>;
//
// expectType<{ title?: string; description?: string }>(partial);
// expectType<{ title: undefined | string; description: undefined | string }>(
//   partial
// );

interface StateMachine<S extends string> {
  state: s;
  [K in S]: `onEnter${K}`;
  [K in S]: `onLeave${K}`;
}

declare function createMachine<S extends string>(state: S);

type PartialPrefix<T, P> = {
  [P in `${P}${keyof T}`]?: T[P];
};

type XXX = PartialPrefix<{ title: string }, "foo" | "bar">;
