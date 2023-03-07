FROM lukechannings/deno:v1.29.4

# The port that your application listens to.
EXPOSE 8088

WORKDIR /app
COPY ./run_dev.sh ./

WORKDIR /app/src

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY ./src ./

RUN echo 'async function handler(ctx) {}; export { handler };' > ./frontend/build/handler.js

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts
RUN deno cache update.ts

WORKDIR /app

#RUN ["run", "--allow-net", "main.ts"]
ENTRYPOINT ["sleep", "infinity"]