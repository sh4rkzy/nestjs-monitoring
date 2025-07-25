FROM public.ecr.aws/docker/library/node:lts-alpine3.17 AS build
WORKDIR /tmp
COPY ["./code/package.json", "./"]
RUN npm install
COPY ["./code", "."]
RUN npm run build

FROM public.ecr.aws/docker/library/node:lts-alpine3.17 AS production
WORKDIR /app
COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/package.json ./
COPY --from=build /tmp/node_modules ./node_modules
CMD ["node", "dist/main"]