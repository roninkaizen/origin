import * as Winston from 'winston';
import Web3 from 'web3';
import { IOffChainDataClient, IConfigurationClient } from "@energyweb/origin-backend-client"


export interface Entity<TMarketLogic = any, TDeviceLogic = any, TCertificateLogic = any, TUserLogic = any> {
    blockchainProperties: BlockchainProperties<TMarketLogic, TDeviceLogic, TCertificateLogic, TUserLogic>;
    offChainDataSource?: OffChainDataSource;
    logger: Winston.Logger;
}

export interface OffChainDataSource {
    baseUrl: string;
    client: IOffChainDataClient;
    configurationClient: IConfigurationClient;
}
export interface BlockchainProperties<TMarketLogic = any, TDeviceLogic = any, TCertificateLogic = any, TUserLogic = any> {
    web3: Web3;
    marketLogicInstance?: TMarketLogic;
    deviceLogicInstance?: TDeviceLogic;
    certificateLogicInstance?: TCertificateLogic;
    userLogicInstance?: TUserLogic;
    activeUser?: EthAccount;
    privateKey?: string;
}

export interface EthAccount {
    address: string;
    privateKey?: string;
}
