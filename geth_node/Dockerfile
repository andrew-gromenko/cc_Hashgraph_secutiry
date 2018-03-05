FROM ethereum/client-go
ENTRYPOINT [ "geth" ]
EXPOSE 8545 8585
WORKDIR /root/geth
COPY .adminrc /root/geth
COPY .passrc /root/geth
RUN geth account import --password .passrc .adminrc
COPY files/genesis.json /root/geth
RUN geth init genesis.json
CMD [ '--rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*"" --rpcport 8545 --networkid 1324231' ]

# FROM node:latest
# WORKDIR /root/script
# COPY package*.json ./
# RUN npm i
