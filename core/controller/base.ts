import { Context, Status } from "../deps.ts";

export interface CommonParam {
  uid?: string;
}

export const setHttpSuccess = (ctx: Context, body?: unknown) => {
  ctx.response.body = { "success": true, "result": body };
  ctx.response.status = Status.OK;
};

export const setHttpBadRequest = (ctx: Context, message?: string) => {
  ctx.response.body = { "success": false, "message": message };
  ctx.response.status = Status.BadRequest;
};

export const setHttpNotFound = (ctx: Context) => {
  ctx.response.status = Status.NotFound;
};

export const setHttpInternalServerError = (ctx: Context) => {
  ctx.response.status = Status.InternalServerError;
};

export const getPostBody = async <T extends CommonParam>(ctx: Context): Promise<T | null> => {
  if (ctx.request.hasBody == false) {
    return null;
  }

  const body = ctx.request.body();
  if (body.type != "json") {
    return null;
  }
  const param = await body.value as T;
  return param;
};
