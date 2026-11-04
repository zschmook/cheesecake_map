FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node server.cjs ./
COPY --chown=node:node public ./public
RUN mkdir data && chown node:node data
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:8080/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.cjs"]
