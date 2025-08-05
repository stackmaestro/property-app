import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const testRouter = router({
  hello: publicProcedure
    .query(() => {
      return 'Hello world!';
    }),
});


export const appRouter = router({
  test: testRouter
});

export type AppRouter = typeof appRouter;
