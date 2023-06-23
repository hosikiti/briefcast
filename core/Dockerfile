FROM lukechannings/deno:v1.34.3

# The port that your application listens to.
EXPOSE 18088

WORKDIR /app
COPY ./ ./

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --reload main.ts
RUN deno cache --reload update.ts

ENTRYPOINT ["sleep", "infinity"]