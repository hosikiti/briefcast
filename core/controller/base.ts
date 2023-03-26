import { Context, jose, Status } from "../deps.ts";

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

  // const uid = await getFirebaseUIDFromContext(ctx);
  // if (uid == null) {
  //   return null;
  // }
  // param.uid = uid;

  return param;
};

// validate jwt sent from the client and returns uid(user id)
const getFirebaseUIDFromContext = async (ctx: Context): Promise<string | null> => {
  // extract token from request header
  const authValue = ctx.request.headers.get("Authorization");
  if (!authValue || authValue?.startsWith("Bearer ") == false) {
    return null;
  }
  const jwt = authValue.replace("Bearer ", "");

  // get a valid public key
  const header = await jose.decodeProtectedHeader(jwt);
  if (header.kid == null) {
    return null;
  }

  const resp = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
  );
  const fbProjectId = Deno.env.get("PUBLIC_FIREBASE_PROJECT_ID");
  const publicKeys = await resp.json();
  const publicKey = publicKeys[header.kid] as string | null;
  if (publicKey == null) {
    return null;
  }

  // verify jwt
  try {
    const key = await jose.importX509(publicKey, "RS256");
    const result = await jose.jwtVerify(jwt, key, {
      algorithms: ["RS256"],
      audience: fbProjectId,
      issuer: `https://securetoken.google.com/${fbProjectId}`,
    });
    if (result.payload.sub == null || result.payload.sub.length == 0) {
      return null;
    }
    // payload.sub is a uid
    return result.payload.sub;
  } catch (e) {
    console.warn("jwt verify error: ", e);
  }
  return null;
};
