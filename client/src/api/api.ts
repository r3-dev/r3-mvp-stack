/* eslint-disable react-hooks/rules-of-hooks */
import {
  CollectionRecords,
  CollectionResponses,
  TypedPocketBase,
  Collections,
} from "@/types/pocketbase-types";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ListResult, RecordFullListOptions } from "pocketbase";

type MutationReturnType<R> = ReturnType<typeof useMutation<R>>;
type QueryReturnType<R> = ReturnType<typeof useQuery<R>>;

type ApiMethods<CR extends keyof CollectionResponses> = {
  // Create
  create: (
    body: CollectionRecords[CR]
  ) => MutationReturnType<CollectionResponses[CR]>;

  // Read
  getById: (id: string) => QueryReturnType<CollectionResponses[CR]>;
  find: (filter: string) => QueryReturnType<CollectionResponses[CR]>;
  getList: (
    page?: number,
    perPage?: number
  ) => QueryReturnType<ListResult<CollectionResponses[CR]>>;
  getFullList: (
    options?: RecordFullListOptions
  ) => QueryReturnType<CollectionResponses[CR][]>;

  // Update
  update: (
    id: string,
    params: CollectionRecords[CR]
  ) => MutationReturnType<CollectionResponses[CR]>;

  // Delete
  delete: (
    id: string,
    mutationOptions?: UseMutationOptions<boolean>
  ) => MutationReturnType<boolean>;
};

export type ApiClient = {
  [C in keyof CollectionResponses]: ApiMethods<C>;
} & {
  // admin: TypedPocketBase["admins"]
  // files: TypedPocketBase["files"]
};

const methodsBuilder = <C extends keyof CollectionResponses>(
  collection: C,
  pocketbase: TypedPocketBase
) => {
  const methods: ApiMethods<C> = {
    create: (body) =>
      useMutation({
        mutationFn: () => pocketbase.collection(collection).create(body),
        onSuccess: () => {
          // Invalidate and refetch
          // queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      }),
    getById: (id) =>
      useQuery({
        queryKey: [collection, id],
        queryFn: () => pocketbase.collection(collection).getOne(id),
      }),
    find: (filter) =>
      useQuery({
        queryKey: [collection, filter],
        queryFn: () =>
          pocketbase.collection(collection).getFirstListItem(filter),
      }),
    getList: (page?, perPage?) =>
      useQuery({
        queryKey: [collection, page, perPage],
        queryFn: () => pocketbase.collection(collection).getList(page, perPage),
      }),
    getFullList: (options?) =>
      useQuery({
        queryKey: [collection, options],
        queryFn: () => pocketbase.collection(collection).getFullList(options),
      }),
    update: (id, params) =>
      useMutation({
        mutationFn: () => pocketbase.collection(collection).update(id, params),
        onSuccess: () => {
          // Invalidate and refetch
          // queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      }),
    delete: (id, mutationOptions) =>
      useMutation({
        mutationFn: () => pocketbase.collection(collection).delete(id),
        ...mutationOptions,
      }),
  };

  return methods;
};

export const createApiClient = (pocketbase: TypedPocketBase) => {
  const apiClient: ApiClient = Object.values(Collections).reduce(
    (acc, collection) => {
      return {
        ...acc,
        [collection]: methodsBuilder(collection, pocketbase),
      };
    },
    {} as ApiClient
  );

  return apiClient;
};
