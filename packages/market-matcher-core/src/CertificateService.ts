import { Demand, PurchasableCertificate } from '@energyweb/market';
import { Configuration, Unit } from '@energyweb/utils-general';
import * as Winston from 'winston';
import { TransactionReceipt } from 'web3-core';

export class CertificateService {
    constructor(private config: Configuration.Entity, private logger: Winston.Logger) {}

    public async executeMatching(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        demand: Demand.IDemand,
        fromAgreement: boolean
    ) {
        this.logger.verbose(
            `[Certificate #${certificate.id}] Executing matching with demand #${demand.id}`
        );

        const { value: requiredEnergy } = await demand.missingEnergyInCurrentPeriod();

        this.logger.verbose(
            `[Certificate #${certificate.id}] Missing energy from demand #${
                demand.id
            } is ${requiredEnergy / Unit.kWh}KWh`
        );

        this.logger.verbose(
            `[Certificate #${certificate.id}] Available energy: ${certificate.certificate.energy /
                Unit.kWh}KWh`
        );

        if (certificate.certificate.energy <= requiredEnergy) {
            return fromAgreement
                ? this.matchDemandFromAgreement(certificate, demand)
                : this.matchDemand(certificate, demand);
        }
        return this.splitAndMatchDemand(certificate, demand, requiredEnergy); // TODO: this does not support agreements
    }

    private async splitAndMatchDemand(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        demand: Demand.IDemand,
        requiredEnergy: number
    ) {
        this.logger.verbose(
            `[Certificate #${certificate.id}] Requesting split and match at ${requiredEnergy /
                Unit.kWh}kWh`
        );
        return this.match(certificate, demand, (entityId: string) =>
            demand.fillAt(entityId, requiredEnergy)
        );
    }

    private async matchDemand(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        demand: Demand.IDemand
    ) {
        return this.match(certificate, demand, demand.fill.bind(demand));
    }

    private async matchDemandFromAgreement(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        demand: Demand.IDemand
    ) {
        return this.match(certificate, demand, demand.fillAgreement.bind(demand));
    }

    private async match(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        demand: Demand.IDemand,
        match: (entityId: string) => Promise<TransactionReceipt>
    ) {
        if (
            (await this.isAlreadyTransferred(certificate, demand.demandOwner)) ||
            demand.status !== Demand.DemandStatus.ACTIVE
        ) {
            return false;
        }

        this.logger.verbose(
            `[Certificate #${certificate.id}] Transferring to demand #${demand.id} owned by ${demand.demandOwner} with account ${this.config.blockchainProperties.activeUser.address}`
        );

        try {
            const fillTx = await match(certificate.id);

            return fillTx.status;
        } catch (e) {
            this.logger.error(
                `[Certificate #${certificate.id}] Transferring failed with ${e.message} ${e.stack}`
            );
        }

        return false;
    }

    private async isAlreadyTransferred(
        certificate: PurchasableCertificate.IPurchasableCertificate,
        owner: string
    ) {
        const syncedCertificate = await certificate.sync();

        if (certificate.certificate.owner.toLowerCase() === owner.toLowerCase()) {
            this.logger.verbose(
                `[Certificate #${syncedCertificate.id}] Already transferred to request demand owner ${owner}`
            );
            return true;
        }

        return false;
    }
}
