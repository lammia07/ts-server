import DbConnection from '../../infrastructure/dbConnection';
import { Measurement } from '../../../typings/express';

const getMeasurementQuery = 'SELECT * FROM MeasurementData';
const findMeasurementByIdQuery = 'SELECT * FROM MeasurementData WHERE id = ?';
const insertMeasurementQuery = 'INSERT INTO MeasurementData SET ?';
const updateMeasurementQuery = 'UPDATE MeasurementData SET ? WHERE id = ?';
const deleteMeasurementQuery = 'DELETE FROM MeasurementData WHERE id = ?';

export function isMeasurement(
    o: any,
    checkId: boolean = true
): o is Measurement {
    const measure = o as Measurement;

    if (measure.humidity == undefined) return false;
    if (checkId && measure.id === undefined) return false;
    if (measure.measurementType == undefined) return false;
    if (measure.temperature == undefined) return false;
    if (measure.timestamp == undefined) return false;

    return true;
}

class MeasurementService {
    private dbConnection: DbConnection;
    constructor() {
        this.dbConnection = DbConnection.getInstance();
    }

    get = (): Promise<Measurement[]> => {
        return this.dbConnection.select(getMeasurementQuery, null);
    };

    find = async (id: number): Promise<Measurement | undefined> => {
        if (id === NaN) return undefined;

        const measurements = await this.dbConnection.select<
            Measurement | undefined
        >(findMeasurementByIdQuery, id);
        return measurements[0];
    };

    insert = async (
        measurement: Measurement
    ): Promise<Measurement | undefined> => {
        if (!isMeasurement(measurement, false)) return undefined;

        const newId = await this.dbConnection.insert(
            insertMeasurementQuery,
            measurement
        );
        return await this.find(newId);
    };

    update = async (
        id: number,
        measurement: Measurement
    ): Promise<Measurement | undefined> => {
        if (id === NaN) return undefined;
        if (!isMeasurement(measurement)) return undefined;

        const measurementWithoutID: any = measurement;
        delete measurementWithoutID.id;

        const result = await this.dbConnection.update(updateMeasurementQuery, [
            measurementWithoutID,
            id,
        ]);

        if (!result) return undefined;
        return await this.find(id);
    };

    delete = async (id: number): Promise<number | undefined> => {
        if (id === NaN) return undefined;

        const result = await this.dbConnection.delete(
            deleteMeasurementQuery,
            id
        );

        if (result) return id;
        return undefined;
    };
}

export default MeasurementService;
