FROM lukechannings/deno:v1.31.0

# The port that your application listens to.
EXPOSE 1993

WORKDIR /app
COPY ./run_dev.sh ./

WORKDIR /app/src

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY ./src ./

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts
RUN deno cache update.ts

#RUN ["run", "--allow-net", "main.ts"]
ENTRYPOINT ["sleep", "infinity"]