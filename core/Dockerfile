FROM lukechannings/deno:v1.29.4

# The port that your application listens to.
EXPOSE 8088

WORKDIR /app
COPY ./ ./

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts
RUN deno cache update.ts

ENTRYPOINT ["sleep", "infinity"]